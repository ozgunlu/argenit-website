"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Microscope, MonitorCheck, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   SHAPE GENERATORS
   ═══════════════════════════════════════════════════════════ */

function generateDNA(count: number): Float32Array {
  const p = new Float32Array(count * 3);
  const turns = 2.5, height = 12, helixR = 1.6, tubeR = 0.14, grooveOffset = 0.42;
  const backboneA = Math.floor(count * 0.35);
  const backboneB = Math.floor(count * 0.35);
  let idx = 0;
  const writeBackbone = (n: number, phaseOffset: number) => {
    for (let i = 0; i < n && idx < count; i++) {
      const t = i / n;
      const angle = t * Math.PI * 2 * turns + phaseOffset;
      const y = (t - 0.5) * height;
      const nx = Math.cos(angle), nz = Math.sin(angle);
      const tx = -Math.sin(angle), tz = Math.cos(angle);
      const r = tubeR * Math.sqrt(Math.random()) * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const offR = Math.cos(theta) * r, offT = Math.sin(theta) * r;
      const bump = (Math.sin(t * turns * 10 * Math.PI * 2) * 0.5 + 0.5) * 0.06;
      p[idx * 3] = nx * (helixR + offR + bump) + tx * offT;
      p[idx * 3 + 1] = y + (Math.random() - 0.5) * 0.03;
      p[idx * 3 + 2] = nz * (helixR + offR + bump) + tz * offT;
      idx++;
    }
  };
  writeBackbone(backboneA, 0);
  writeBackbone(backboneB, Math.PI + grooveOffset);
  const pairsCount = Math.floor(turns * 10);
  const perPair = Math.floor((count - backboneA - backboneB) / pairsCount);
  for (let bp = 0; bp < pairsCount && idx < count; bp++) {
    const t = (bp + 0.5) / pairsCount;
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;
    const ax = Math.cos(angle) * helixR, az = Math.sin(angle) * helixR;
    const bAngle = angle + Math.PI + grooveOffset;
    const bx = Math.cos(bAngle) * helixR, bz = Math.sin(bAngle) * helixR;
    const pairBulge = bp % 2 === 0 ? 0.08 : 0.05;
    const n = Math.min(perPair, count - idx);
    for (let j = 0; j < n; j++) {
      const lerp = j / n;
      const midBulge = Math.sin(lerp * Math.PI) * pairBulge;
      const rx = ax + (bx - ax) * lerp, rz = az + (bz - az) * lerp;
      const rLen = Math.sqrt(rx * rx + rz * rz) || 1;
      p[idx * 3] = rx + (rx / rLen) * midBulge + (Math.random() - 0.5) * 0.03;
      p[idx * 3 + 1] = y + (Math.random() - 0.5) * 0.04;
      p[idx * 3 + 2] = rz + (rz / rLen) * midBulge + (Math.random() - 0.5) * 0.03;
      idx++;
    }
  }
  while (idx < count) {
    const t = Math.random();
    const strand = Math.random() > 0.5 ? 0 : Math.PI + grooveOffset;
    const angle = t * Math.PI * 2 * turns + strand;
    const r2 = tubeR * Math.sqrt(Math.random()) * 0.6;
    const th = Math.random() * Math.PI * 2;
    p[idx * 3] = Math.cos(angle) * (helixR + r2 * Math.cos(th));
    p[idx * 3 + 1] = (t - 0.5) * height;
    p[idx * 3 + 2] = Math.sin(angle) * (helixR + r2 * Math.cos(th));
    idx++;
  }
  return p;
}

function generateChromosomes(count: number): Float32Array {
  const result = new Float32Array(count * 3);
  const chromosomes = 46, perChromo = Math.floor(count / chromosomes);
  let idx = 0;
  for (let c = 0; c < chromosomes && idx < count; c++) {
    const pair = Math.floor(c / 2), side = c % 2;
    const col = pair % 8, row = Math.floor(pair / 8);
    const cx = (col - 3.5) * 1.2 + side * 0.5;
    const cy = (1.5 - row) * 2.0;
    const sizeScale = 1.0 - (pair / 23) * 0.35;
    const n = Math.min(perChromo, count - idx);
    for (let j = 0; j < n; j++) {
      const t = (j / n) * 2 - 1, arm = 0.07 * sizeScale;
      const xOffset = (j % 2 === 0 ? 1 : -1) * t * 0.12 * sizeScale;
      result[idx * 3] = cx + xOffset + (Math.random() - 0.5) * arm;
      result[idx * 3 + 1] = cy + t * 0.4 * sizeScale + (Math.random() - 0.5) * arm * 0.5;
      result[idx * 3 + 2] = (Math.random() - 0.5) * 0.05;
      idx++;
    }
  }
  while (idx < count) {
    const src = Math.floor(Math.random() * idx);
    result[idx * 3] = result[src * 3] + (Math.random() - 0.5) * 0.2;
    result[idx * 3 + 1] = result[src * 3 + 1] + (Math.random() - 0.5) * 0.2;
    result[idx * 3 + 2] = (Math.random() - 0.5) * 0.05;
    idx++;
  }
  return result;
}

function generateTissue(count: number): Float32Array {
  const p = new Float32Array(count * 3);
  const w = 12, h = 8;

  // Seed cell centers — irregular grid with jitter for organic feel
  const cellCenters: { x: number; y: number; r: number; density: number }[] = [];
  for (let gx = -6; gx <= 6; gx += 0.8) {
    for (let gy = -4; gy <= 4; gy += 0.7) {
      cellCenters.push({
        x: gx + (Math.random() - 0.5) * 0.5,
        y: gy + (Math.random() - 0.5) * 0.45,
        r: 0.18 + Math.random() * 0.18,
        density: 0.4 + Math.random() * 0.6,
      });
    }
  }

  // Dense regions — particles cluster more tightly
  const denseZones = [
    { cx: -3, cy: -1.5, rx: 2.5, ry: 1.8 },
    { cx: 2.5, cy: 1.5, rx: 2.0, ry: 2.2 },
    { cx: -1, cy: 2.5, rx: 1.8, ry: 1.2 },
    { cx: 4, cy: -2, rx: 1.5, ry: 1.5 },
  ];

  for (let i = 0; i < count; i++) {
    // Pick a random cell center weighted by density
    const cell = cellCenters[Math.floor(Math.random() * cellCenters.length)];

    // Check if in a dense zone — tighter clustering
    let inDense = 0;
    for (const z of denseZones) {
      const dx = (cell.x - z.cx) / z.rx, dy = (cell.y - z.cy) / z.ry;
      const d2 = dx * dx + dy * dy;
      if (d2 < 1) inDense = Math.max(inDense, 1 - d2);
    }

    const tightness = 0.6 + inDense * 0.35; // denser zones = tighter clusters
    const r = cell.r * (1 - tightness * 0.5) * Math.sqrt(Math.random());
    const angle = Math.random() * Math.PI * 2;

    let x = cell.x + Math.cos(angle) * r;
    let y = cell.y + Math.sin(angle) * r;

    // Slight wavy distortion for organic texture
    x += Math.sin(y * 2.5 + cell.x) * 0.06;
    y += Math.cos(x * 2.5 + cell.y) * 0.06;

    // Clamp to slide area
    x = Math.max(-w / 2, Math.min(w / 2, x));
    y = Math.max(-h / 2, Math.min(h / 2, y));

    p[i * 3] = x;
    p[i * 3 + 1] = y;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
  }
  return p;
}

function generateNucleus(count: number): Float32Array {
  const p = new Float32Array(count * 3);
  const nuclei = [
    { cx: -3.2, cy: 0, r: 2.2 },
    { cx: 3.2, cy: 0, r: 2.0 },
  ];
  const half = Math.floor(count / 2);
  for (let i = 0; i < count; i++) {
    const nuc = i < half ? nuclei[0] : nuclei[1];
    let x, y, z;
    do { x = Math.random() * 2 - 1; y = Math.random() * 2 - 1; z = Math.random() * 2 - 1; } while (x * x + y * y + z * z > 1.0);
    const squeeze = 0.85 + Math.random() * 0.15;
    p[i * 3] = nuc.cx + x * nuc.r * squeeze;
    p[i * 3 + 1] = nuc.cy + y * nuc.r * squeeze;
    p[i * 3 + 2] = z * nuc.r * squeeze;
  }
  return p;
}

/* ═══════════════════════════════════════════════════════════
   GLSL SHADERS
   ═══════════════════════════════════════════════════════════ */

const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+10.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float v=0.;float a=.5;for(int i=0;i<4;i++){v+=a*snoise(p);p*=2.;a*=.5;}return v;}
`;

// Phase order: DNA(0) → Chromosomes(1) → Tissue/Pathology(2) → FISH(3)
const particleVert = /* glsl */ `
${noiseGLSL}
attribute vec3 aDNA;
attribute vec3 aChromo;
attribute vec3 aTissue;
attribute vec3 aNucleus;
attribute float aSize;
attribute float aRandom;

uniform float uTime;
uniform float uPhase; // 0→1 DNA→Chromo, 1→2 Chromo→Tissue, 2→3 Tissue→FISH
uniform float uPixelRatio;

varying vec3 vColor;
varying float vAlpha;

void main(){
  float t = uTime;

  float toChromo = smoothstep(0.0, 1.0, uPhase);
  float toTissue = smoothstep(1.0, 2.0, uPhase);
  float toFish   = smoothstep(2.0, 3.0, uPhase);

  float n1 = fbm(aDNA * 0.3 + t * 0.04);
  float n2 = fbm(aDNA * 0.3 + t * 0.05 + 50.0);

  // ── DNA (rotating helix) ──
  vec3 dnaP = aDNA;
  float rotAngle = t * 0.25;
  dnaP = vec3(
    dnaP.x * cos(rotAngle) - dnaP.z * sin(rotAngle),
    dnaP.y,
    dnaP.x * sin(rotAngle) + dnaP.z * cos(rotAngle)
  );
  dnaP += n2 * 0.06;

  // ── Chromosomes ──
  vec3 chromoP = aChromo;

  // ── Tissue (pathology slide) ──
  vec3 tissueP = aTissue;
  float scanX = mod(t * 2.0, 16.0) - 8.0;
  float scanGlow = smoothstep(0.5, 0.0, abs(aTissue.x - scanX)) * toTissue * (1.0 - toFish);

  // ── Nucleus (FISH) ──
  vec3 nucP = aNucleus;
  float nucRot = t * 0.08;
  nucP = vec3(
    nucP.x * cos(nucRot) - nucP.z * sin(nucRot),
    nucP.y,
    nucP.x * sin(nucRot) + nucP.z * cos(nucRot)
  );

  // Blend positions
  vec3 pos = mix(dnaP, chromoP, toChromo);
  pos = mix(pos, tissueP, toTissue);
  pos = mix(pos, nucP, toFish);

  // Micro-movement
  float microAmp = 0.03 * (1.0 - toFish * 0.5);
  pos += vec3(
    sin(t + aRandom * 20.0) * microAmp,
    cos(t * 0.7 + aRandom * 15.0) * microAmp,
    sin(t * 0.5 + aRandom * 10.0) * microAmp
  );

  // ═══ COLORS ═══

  // DNA: bioluminescent blue-cyan
  vec3 cDNA = mix(
    vec3(0.10, 0.30, 1.0),
    vec3(0.0, 0.80, 0.90),
    sin(aDNA.y * 0.7) * 0.5 + 0.5
  );
  cDNA += vec3(0.2, 0.5, 0.3) * (n2 * 0.3 + 0.1);

  // Chromosomes: cytogenetics green-blue
  vec3 cChromo = mix(
    vec3(0.1, 0.85, 0.5),
    vec3(0.25, 0.55, 1.0),
    aRandom
  );

  // Tissue: H&E stain
  float tissue = fbm(aTissue * 0.5 + 10.0);
  vec3 cTissue = mix(
    vec3(0.70, 0.22, 0.50),
    vec3(0.35, 0.15, 0.55),
    tissue * 0.5 + 0.5
  );
  cTissue += vec3(0.0, 0.7, 1.0) * scanGlow * 0.7;

  vec3 preColor = mix(cDNA, cChromo, toChromo);
  preColor = mix(preColor, cTissue, toTissue);
  preColor += vec3(0.0, 0.6, 1.0) * scanGlow;

  // ═══ FISH PHASE ═══
  vec3 lFitc1 = vec3(-3.9,  0.6,  0.3);
  vec3 lFitc2 = vec3(-2.5, -0.5, -0.2);
  vec3 lTxR1  = vec3(-3.7, -0.7,  0.4);
  vec3 lTxR2  = vec3(-2.7,  0.8, -0.3);
  vec3 rFitc1 = vec3( 3.8,  0.5,  0.2);
  vec3 rFitc2 = vec3( 2.6, -0.6, -0.3);
  vec3 rTxR1  = vec3( 3.4, -0.5,  0.4);

  float probeR = 0.55;
  vec3 np = aNucleus;

  float dLF1 = 1.0 - smoothstep(0.0, probeR, length(np - lFitc1));
  float dLF2 = 1.0 - smoothstep(0.0, probeR, length(np - lFitc2));
  float dLR1 = 1.0 - smoothstep(0.0, probeR, length(np - lTxR1));
  float dLR2 = 1.0 - smoothstep(0.0, probeR, length(np - lTxR2));
  float dRF1 = 1.0 - smoothstep(0.0, probeR, length(np - rFitc1));
  float dRF2 = 1.0 - smoothstep(0.0, probeR, length(np - rFitc2));
  float dRR1 = 1.0 - smoothstep(0.0, probeR, length(np - rTxR1));

  float isFITC  = max(max(dLF1, dLF2), max(dRF1, dRF2));
  float isTxRed = max(max(dLR1, dLR2), dRR1);
  float isProbe = max(isFITC, isTxRed);

  vec3 dapiBlue = vec3(0.04, 0.06, 0.28);
  vec3 dapiMid  = vec3(0.07, 0.12, 0.45);
  vec3 fitcColor = vec3(0.1, 1.0, 0.15);
  vec3 txRedColor = vec3(1.0, 0.05, 0.15);

  float pulse = sin(t * 2.0 + aRandom * 6.28) * 0.15 + 0.85;
  vec3 probeColor = fitcColor * isFITC + txRedColor * isTxRed;
  probeColor *= pulse;

  float nucNoise = fbm(aNucleus * 0.8 + 5.0);
  vec3 chromatin = mix(dapiBlue, dapiMid, nucNoise * 0.5 + 0.5);

  float inLeft = step(0.0, -(np.x));
  vec3 nucCentre = mix(vec3(3.2, 0.0, 0.0), vec3(-3.2, 0.0, 0.0), inLeft);
  float nucRadius = mix(2.0, 2.2, inLeft);
  float edgeDist = length(np - nucCentre) / nucRadius;
  float edgeFade = smoothstep(1.0, 0.3, edgeDist);
  chromatin *= (0.5 + edgeFade * 0.7);

  vec3 fishColor = mix(chromatin, probeColor, clamp(isProbe, 0.0, 1.0));
  float inAnyNucleus = smoothstep(1.05, 0.95, edgeDist);
  fishColor = mix(vec3(0.005, 0.005, 0.015), fishColor, inAnyNucleus);

  vColor = mix(preColor, fishColor, toFish);

  // ═══ SIZE ═══
  float probeSize = 1.0 + isProbe * 2.5;
  float fishSizeBoost = mix(0.8, probeSize, clamp(isProbe, 0.0, 1.0)) * toFish + (1.0 - toFish);
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  float basePx = aSize * uPixelRatio * (16.0 / -mvPos.z);
  gl_PointSize = max(basePx * fishSizeBoost * (1.0 + n1 * 0.12), 1.0);
  gl_Position = projectionMatrix * mvPos;

  float baseAlpha = 0.85 + n1 * 0.15;
  float fishAlpha = mix(0.5, 1.0, clamp(isProbe, 0.0, 1.0)) * inAnyNucleus;
  vAlpha = mix(baseAlpha, fishAlpha, toFish);
}
`;

const particleFrag = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if(d > 0.5) discard;
  float core  = exp(-d * d * 25.0);
  float mid   = exp(-d * d * 8.0);
  float outer = exp(-d * d * 3.0);
  float brightness = core * 0.7 + mid * 0.4 + outer * 0.12;
  vec3 col = vColor * (0.65 + brightness * 0.55);
  col += vec3(0.9, 0.95, 1.0) * core * 0.2;
  float alpha = brightness * vAlpha;
  gl_FragColor = vec4(col, alpha);
}
`;

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

const SLIDE_COUNT = 3;

export default function ServicesGallery() {
  const t = useTranslations();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const bar1Ref = useRef<HTMLDivElement>(null);
  const bar2Ref = useRef<HTMLDivElement>(null);
  const bar3Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const ui1Ref = useRef<HTMLDivElement>(null);
  const ui2Ref = useRef<HTMLDivElement>(null);
  const ui3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;

    const init = async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (disposed) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const container = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!container || !wrapper) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      // ── Scene ──
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050a18);

      const camera = new THREE.PerspectiveCamera(50, w / h, 0.01, 1000);
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);

      // ── Lighting ──
      scene.add(new THREE.AmbientLight(0x334466, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 0.8);
      key.position.set(2, 8, 10);
      scene.add(key);

      // ── Post-processing ──
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.1, 0.3, 0.95);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      // ── Particles ──
      const COUNT = 60000;
      const dna = generateDNA(COUNT);
      const chromo = generateChromosomes(COUNT);
      const tissue = generateTissue(COUNT);
      const nucleus = generateNucleus(COUNT);

      const sizes = new Float32Array(COUNT);
      const randoms = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        sizes[i] = 1.5 + Math.random() * 2.5;
        randoms[i] = Math.random();
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(dna.slice(), 3));
      geo.setAttribute("aDNA", new THREE.BufferAttribute(dna, 3));
      geo.setAttribute("aChromo", new THREE.BufferAttribute(chromo, 3));
      geo.setAttribute("aTissue", new THREE.BufferAttribute(tissue, 3));
      geo.setAttribute("aNucleus", new THREE.BufferAttribute(nucleus, 3));
      geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

      const mat = new THREE.ShaderMaterial({
        vertexShader: particleVert,
        fragmentShader: particleFrag,
        uniforms: {
          uTime: { value: 0 },
          uPhase: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geo, mat);
      scene.add(particles);

      // ── Animation state ──
      const state = {
        phase: 0,
        bloomStr: 0.1,
        camZ: 10,
        slide1Opacity: 1,
        slide2Opacity: 0,
        slide3Opacity: 0,
        ui1Opacity: 0,
        ui2Opacity: 0,
        ui3Opacity: 0,
        bar1: 0,
        bar2: 0,
        bar3: 0,
      };

      // ── GSAP Timeline ──
      const tl = gsap.timeline();

      // SLIDE 1: DNA → Chromosomes (Sitogenetik)
      tl.to(state, { slide1Opacity: 1, ui1Opacity: 1, duration: 0.15, ease: "none" }, 0);
      tl.to(state, { phase: 1.0, bar1: 100, bloomStr: 0.15, duration: 1.0, ease: "none" }, 0);
      tl.to(state, { slide1Opacity: 0, ui1Opacity: 0, duration: 0.15, ease: "power2.in" }, 1.0);

      // SLIDE 2: Chromosomes → Tissue (Dijital Patoloji)
      tl.to(state, { slide2Opacity: 1, ui2Opacity: 1, duration: 0.15, ease: "none" }, 1.15);
      tl.to(state, { phase: 2.0, bar2: 100, bloomStr: 0.1, duration: 1.0, ease: "none" }, 1.15);
      tl.to(state, { slide2Opacity: 0, ui2Opacity: 0, duration: 0.15, ease: "power2.in" }, 2.15);

      // SLIDE 3: Tissue → FISH Nuclei
      tl.to(state, { slide3Opacity: 1, ui3Opacity: 1, duration: 0.15, ease: "none" }, 2.3);
      tl.to(state, { phase: 3.0, bar3: 100, bloomStr: 0.12, duration: 1.0, ease: "none" }, 2.3);
      tl.to(state, { slide3Opacity: 0.8, duration: 0.05 }, 3.3);

      // ── Auto-scroll state ──
      const totalTlDuration = 3.35;
      const slideEndProgresses = [1.0 / totalTlDuration, 2.15 / totalTlDuration, 3.3 / totalTlDuration];
      const DWELL = 5000;
      const AUTO_SPEED = 3.5; // px per frame
      let autoActive = false;
      let dwelling = false;
      let dwellTimer: ReturnType<typeof setTimeout> | null = null;
      let lastDwellProgress = -1;
      let userInteracting = false;
      let userInteractTimer: ReturnType<typeof setTimeout> | null = null;

      const onUserInteract = () => {
        userInteracting = true;
        if (userInteractTimer) clearTimeout(userInteractTimer);
        userInteractTimer = setTimeout(() => { userInteracting = false; }, 2000);
      };
      window.addEventListener("wheel", onUserInteract, { passive: true });
      window.addEventListener("touchmove", onUserInteract, { passive: true });

      // ── ScrollTrigger ──
      const stInstance = ScrollTrigger.create({
        animation: tl,
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onEnter: () => { autoActive = true; lastDwellProgress = -1; },
        onLeave: () => { autoActive = false; },
        onEnterBack: () => { autoActive = true; },
        onLeaveBack: () => { autoActive = false; },
      });

      // ── Render loop ──
      const clock = new THREE.Clock();
      let raf = 0;
      const animate = () => {
        if (disposed) return;
        raf = requestAnimationFrame(animate);

        mat.uniforms.uTime.value = clock.getElapsedTime();
        mat.uniforms.uPhase.value = state.phase;
        bloom.strength = state.bloomStr;
        camera.position.z = state.camZ;

        // Update DOM
        if (numberRef.current) {
          const slideNum = state.phase < 1 ? 1 : state.phase < 2 ? 2 : 3;
          numberRef.current.textContent = String(slideNum);
        }
        if (bar1Ref.current) bar1Ref.current.style.width = `${state.bar1}%`;
        if (bar2Ref.current) bar2Ref.current.style.width = `${state.bar2}%`;
        if (bar3Ref.current) bar3Ref.current.style.width = `${state.bar3}%`;

        // Text overlays
        if (text1Ref.current) text1Ref.current.style.opacity = String(state.slide1Opacity);
        if (text2Ref.current) text2Ref.current.style.opacity = String(state.slide2Opacity);
        if (text3Ref.current) text3Ref.current.style.opacity = String(state.slide3Opacity);

        // UI overlays
        if (ui1Ref.current) ui1Ref.current.style.opacity = String(state.ui1Opacity);
        if (ui2Ref.current) ui2Ref.current.style.opacity = String(state.ui2Opacity);
        if (ui3Ref.current) ui3Ref.current.style.opacity = String(state.ui3Opacity);

        // Auto-scroll
        if (autoActive && !dwelling && !userInteracting) {
          const prog = stInstance.progress;
          if (prog < 0.995) {
            let shouldDwell = false;
            for (const end of slideEndProgresses) {
              if (prog >= end - 0.008 && prog <= end + 0.008 && Math.abs(lastDwellProgress - end) > 0.02) {
                shouldDwell = true;
                lastDwellProgress = end;
                break;
              }
            }
            if (shouldDwell) {
              dwelling = true;
              dwellTimer = setTimeout(() => { dwelling = false; }, DWELL);
            } else {
              window.scrollBy(0, AUTO_SPEED);
            }
          }
        }

        composer.render();
      };
      animate();

      // ── Resize ──
      const onResize = () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
        composer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize);

      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("wheel", onUserInteract);
        window.removeEventListener("touchmove", onUserInteract);
        if (dwellTimer) clearTimeout(dwellTimer);
        if (userInteractTimer) clearTimeout(userInteractTimer);
        renderer.dispose();
        geo.dispose();
        mat.dispose();
        ScrollTrigger.getAll().forEach((st: { kill: () => void }) => {
          if (st.kill) st.kill();
        });
      };
    };

    const cleanup = init();
    return () => {
      disposed = true;
      cleanup.then((fn) => fn?.());
    };
  }, []);

  return (
    <section
      id="services-gallery"
      ref={wrapperRef}
      className="relative bg-[#050a18]"
      style={{ height: `${SLIDE_COUNT * 150}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Three.js canvas */}
        <div ref={canvasRef} className="absolute inset-0 z-0" />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#050a18]/80 via-[#050a18]/30 to-[#050a18]/80 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050a18]/50 via-transparent to-[#050a18]/60 pointer-events-none" />

        {/* ── Number circle (top-left) ── */}
        <div className="absolute top-8 left-8 z-20">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
            <div ref={numberRef} className="text-sm font-mono text-white/80">1</div>
          </div>
        </div>

        {/* ── Slide 1 Text: Sitogenetik ── */}
        <div
          ref={text1Ref}
          className="absolute inset-0 z-10 flex items-center pointer-events-none"
          style={{ opacity: 1 }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full pointer-events-auto">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 backdrop-blur-md text-xs font-semibold text-blue-300 tracking-wide uppercase mb-6">
                <Microscope size={14} />
                {t("home.cytoLabel")}
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                {t("home.cytoTitle")}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                {t("home.cytoDesc")}
              </p>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {t("common.learnMore")}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Slide 1 UI: Karyotype panels ── */}
        <div ref={ui1Ref} className="absolute inset-0 z-[6] pointer-events-none" style={{ opacity: 0 }}>
          {/* Metaphase finder */}
          <div className="absolute top-20 left-6">
            <div className="rounded-lg bg-black/50 backdrop-blur-sm border border-white/5 overflow-hidden w-52">
              <div className="px-3 py-1.5 border-b border-white/5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Metaphase Finder</span>
              </div>
              <div className="px-3 py-2 space-y-1.5">
                <div className="flex justify-between"><span className="text-[10px] font-mono text-white/30">Slide</span><span className="text-[10px] font-mono text-white/60">CG-2024-312</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-mono text-white/30">Cells Found</span><span className="text-[10px] font-mono text-cyan-300/70">28 / 30</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-mono text-white/30">Band Res.</span><span className="text-[10px] font-mono text-white/60">400-550 bands</span></div>
              </div>
            </div>
          </div>
          {/* Karyotype result */}
          <div className="absolute top-20 right-6 w-56">
            <div className="rounded-lg bg-black/50 backdrop-blur-sm border border-white/5 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Karyotype</span>
                <span className="text-[9px] font-mono text-cyan-400/60 px-1.5 py-0.5 rounded bg-cyan-400/10">Auto-classified</span>
              </div>
              <div className="px-3 py-2">
                <div className="text-sm font-mono text-cyan-200/80 tracking-wide mb-1.5">46,XX</div>
                {["1-3 (A)", "4-5 (B)", "6-12,X (C)", "13-15 (D)", "16-18 (E)", "19-20 (F)", "21-22 (G)"].map((pair) => (
                  <div key={pair} className="flex items-center justify-between py-0.5">
                    <span className="text-[10px] font-mono text-white/40">Group {pair}</span>
                    <span className="text-[9px] font-mono text-green-400/70">Normal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide 2 Text: Dijital Patoloji ── */}
        <div
          ref={text2Ref}
          className="absolute inset-0 z-10 flex items-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full pointer-events-auto">
            <div className="max-w-lg ml-auto text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/20 bg-teal-500/10 backdrop-blur-md text-xs font-semibold text-teal-300 tracking-wide uppercase mb-6">
                <MonitorCheck size={14} />
                {t("home.pathoLabel")}
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                {t("home.pathoTitle")}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                {t("home.pathoDesc")}
              </p>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
              >
                {t("common.learnMore")}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Slide 2 UI: Pathology panels ── */}
        <div ref={ui2Ref} className="absolute inset-0 z-[6] pointer-events-none" style={{ opacity: 0 }}>
          {/* WSI scan bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center gap-4">
            <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #14b8a6, #06b6d4)", animation: "wsiScanBar 3s ease-in-out infinite" }} />
            </div>
            <span className="text-[10px] font-mono text-teal-400/70 whitespace-nowrap">Scanning 40×</span>
          </div>
          {/* Slide info */}
          <div className="absolute top-14 left-6">
            <div className="rounded-lg bg-black/50 backdrop-blur-sm border border-white/5 overflow-hidden w-52">
              <div className="px-3 py-1.5 border-b border-white/5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Slide Info</span>
              </div>
              <div className="px-3 py-2 space-y-1.5">
                <div className="flex justify-between"><span className="text-[10px] font-mono text-white/30">Patient</span><span className="text-[10px] font-mono text-white/60">ID-2024-0847</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-mono text-white/30">Stain</span><span className="text-[10px] font-mono text-teal-300/70">H&E</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-mono text-white/30">Tissue</span><span className="text-[10px] font-mono text-white/60">Breast Core Bx</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-mono text-white/30">Resolution</span><span className="text-[10px] font-mono text-white/60">0.25 µm/px</span></div>
              </div>
            </div>
          </div>
          {/* AI annotations */}
          <div className="absolute top-14 right-6 w-56">
            <div className="rounded-lg bg-black/50 backdrop-blur-sm border border-white/5 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">AI Annotations</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-teal-400/60">Active</span>
                </div>
              </div>
              {[
                { type: "Invasive Ductal", confidence: "94%", color: "#f97316" },
                { type: "DCIS", confidence: "87%", color: "#eab308" },
                { type: "Stroma", confidence: "98%", color: "#22d3ee" },
                { type: "Necrosis", confidence: "91%", color: "#ef4444" },
              ].map((row) => (
                <div key={row.type} className="px-3 py-1.5 flex items-center justify-between border-b border-white/[0.03] last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-sm" style={{ background: row.color }} />
                    <span className="text-[10px] font-mono text-white/60">{row.type}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{row.confidence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide 3 Text: FISH ── */}
        <div
          ref={text3Ref}
          className="absolute inset-0 z-10 flex items-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full pointer-events-auto">
            <div className="max-w-lg ml-auto text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-md text-xs font-semibold text-emerald-300 tracking-wide uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                FISH Analysis
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                {t("home.fishTitle")}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                {t("home.fishDesc")}
              </p>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {t("common.learnMore")}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Slide 3 UI: FISH panels ── */}
        <div ref={ui3Ref} className="absolute inset-0 z-[6] pointer-events-none" style={{ opacity: 0 }}>
          {/* Filter channels */}
          <div className="absolute top-6 left-6 flex flex-col gap-1.5">
            {[
              { name: "DAPI", nm: "461 nm", color: "#3040aa" },
              { name: "FITC", nm: "519 nm", color: "#00ff22" },
              { name: "Texas Red", nm: "615 nm", color: "#ff1640" },
            ].map((ch) => (
              <div key={ch.name} className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-black/50 backdrop-blur-sm border border-white/5">
                <div className="w-2 h-2 rounded-full" style={{ background: ch.color, boxShadow: `0 0 6px ${ch.color}` }} />
                <span className="text-[10px] font-mono text-white/60 tracking-wide">{ch.name}</span>
                <span className="text-[8px] font-mono text-white/25 ml-auto">{ch.nm}</span>
              </div>
            ))}
          </div>
          {/* Signal count */}
          <div className="absolute top-6 right-6 w-60">
            <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-white/[0.06] overflow-hidden">
              <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Signal Count</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-blue-400/60">Counting</span>
                </div>
              </div>
              {/* Nucleus 1 — Normal */}
              <div className="px-3 py-2 border-b border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-white/50">Nucleus 1</span>
                  <span className="text-[9px] font-mono text-green-400 px-1.5 py-0.5 rounded bg-green-400/10">Normal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff22", boxShadow: "0 0 4px #00ff22" }} />
                    <span className="text-[10px] font-mono text-green-300/70">FITC: 2</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff1640", boxShadow: "0 0 4px #ff1640" }} />
                    <span className="text-[10px] font-mono text-red-300/70">TxRed: 2</span>
                  </div>
                </div>
              </div>
              {/* Nucleus 2 — Abnormal */}
              <div className="px-3 py-2 border-b border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-white/50">Nucleus 2</span>
                  <span className="text-[9px] font-mono text-red-400 px-1.5 py-0.5 rounded bg-red-400/10">Abnormal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff22", boxShadow: "0 0 4px #00ff22" }} />
                    <span className="text-[10px] font-mono text-green-300/70">FITC: 2</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff1640", boxShadow: "0 0 4px #ff1640" }} />
                    <span className="text-[10px] font-mono text-red-300/70">TxRed: 1</span>
                  </div>
                  <span className="text-[8px] font-mono text-red-400/50 ml-auto">1 signal lost</span>
                </div>
              </div>
              <div className="px-3 py-2 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/35">Result</span>
                  <span className="text-[10px] font-mono text-red-300/80">Deletion Detected (1/2)</span>
                </div>
              </div>
            </div>
          </div>
          {/* Status bar */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.06] bg-black/50 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">FISH</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className="text-[10px] font-mono text-blue-300/50">100× Oil Immersion</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className="text-[10px] font-mono text-white/30">2 nuclei scored</span>
          </div>
        </div>

        {/* ── Progress bars (bottom) ── */}
        <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center gap-3">
          <div className="flex-1 h-[2px] rounded-full bg-white/10 overflow-hidden">
            <div ref={bar1Ref} className="h-full rounded-full bg-white/70 transition-none" style={{ width: "0%" }} />
          </div>
          <div className="flex-1 h-[2px] rounded-full bg-white/10 overflow-hidden">
            <div ref={bar2Ref} className="h-full rounded-full bg-white/70 transition-none" style={{ width: "0%" }} />
          </div>
          <div className="flex-1 h-[2px] rounded-full bg-white/10 overflow-hidden">
            <div ref={bar3Ref} className="h-full rounded-full bg-white/70 transition-none" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes wsiScanBar {
          0% { width: 0%; }
          50% { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
