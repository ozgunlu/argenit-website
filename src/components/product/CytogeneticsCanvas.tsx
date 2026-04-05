"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

/* ── Shape generators ── */

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

/**
 * Single chromosome: two parallel chromatids like )( shape,
 * joined at centromere, slight outward curve, rounded tips.
 */
function generateSingleChromosome(count: number): Float32Array {
  const result = new Float32Array(count * 3);
  const pArm = 1.8;          // short arm (top)
  const qArm = 3.2;          // long arm (bottom)
  const sep = 0.5;            // chromatid separation at widest
  const armW = 0.35;          // arm thickness
  const curve = 0.25;         // outward bow amount

  for (let i = 0; i < count; i++) {
    const raw = (i / count) * 2 - 1; // -1 to 1
    // Asymmetric: positive = p arm (short), negative = q arm (long)
    const y = raw > 0 ? raw * pArm : raw * qArm;
    const t = raw;

    // Which chromatid: left or right
    const side = i % 2 === 0 ? 1 : -1;

    // Centromere pinch: chromatids come together at center
    const centro = Math.exp(-(t * t) / 0.06);
    const separation = sep * (1.0 - centro * 0.85);

    // Outward bow: )( shape — each chromatid curves away from center
    const bow = side * curve * (t * t);

    // Blunt rounded tips (telomeres)
    const tipPow = t < 0 ? 8 : 6; // q arm (bottom) even blunter
    const tipRound = 1.0 - Math.pow(Math.abs(t), tipPow);
    const w = armW * tipRound;

    // Fill cross-section
    const rx = (Math.random() - 0.5) * w;
    const ry = (Math.random() - 0.5) * w * 0.4;

    result[i * 3]     = side * separation + bow + rx;
    result[i * 3 + 1] = y + ry;
    result[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
  }
  return result;
}

/* ── Simplex noise GLSL ── */
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

/**
 * DNA → 46 chromosomes → zoom into single chromosome with scan-line + banding + UI overlay.
 */
export default function CytogeneticsCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 500);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const pr = Math.min(window.devicePixelRatio, 2);
    const count = 18000;

    const dnaPositions = generateDNA(count);
    const chromoPositions = generateChromosomes(count);
    const singlePositions = generateSingleChromosome(count);

    const randoms = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("aDNA", new THREE.BufferAttribute(dnaPositions, 3));
    geo.setAttribute("aChromo", new THREE.BufferAttribute(chromoPositions, 3));
    geo.setAttribute("aSingle", new THREE.BufferAttribute(singlePositions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph1: { value: 0 },
        uMorph2: { value: 0 },
        uScanY: { value: 10 },     // scan line Y position (off-screen initially)
        uScanActive: { value: 0 },  // 0 or 1: is scan happening
        uPR: { value: pr },
      },
      vertexShader: /* glsl */ `
        ${noiseGLSL}
        attribute vec3 aDNA;
        attribute vec3 aChromo;
        attribute vec3 aSingle;
        attribute float aRandom;
        attribute float aSize;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vScanGlow;
        uniform float uTime;
        uniform float uMorph1;
        uniform float uMorph2;
        uniform float uScanY;
        uniform float uScanActive;
        uniform float uPR;

        void main() {
          float t = uTime;
          float n = fbm(aDNA * 0.3 + t * 0.05 + 50.0);

          // Phase 1: DNA (rotating helix)
          vec3 dnaP = aDNA;
          float rotAngle = t * 0.25;
          dnaP = vec3(
            dnaP.x * cos(rotAngle) - dnaP.z * sin(rotAngle),
            dnaP.y,
            dnaP.x * sin(rotAngle) + dnaP.z * cos(rotAngle)
          );
          dnaP += n * 0.06;

          // Phase 2: 46 Chromosomes
          vec3 chromoP = aChromo;

          // Phase 3: Single chromosome (scaled-up version of karyotype chr #0)
          vec3 singleP = aSingle;

          // Two-stage morph
          vec3 pos = mix(dnaP, chromoP, uMorph1);
          pos = mix(pos, singleP, uMorph2);

          // Micro-movement
          pos += vec3(
            sin(t + aRandom * 20.0) * 0.03,
            cos(t * 0.7 + aRandom * 15.0) * 0.03,
            sin(t * 0.5 + aRandom * 10.0) * 0.03
          );

          // ── Colors ──
          vec3 cDNA = mix(
            vec3(0.10, 0.30, 1.0),
            vec3(0.0, 0.80, 0.90),
            sin(aDNA.y * 0.7) * 0.5 + 0.5
          );
          cDNA += vec3(0.2, 0.5, 0.3) * (n * 0.3 + 0.1);

          vec3 cChromo = mix(
            vec3(0.1, 0.85, 0.5),
            vec3(0.25, 0.55, 1.0),
            aRandom
          );

          // Single chromosome: base color
          vec3 cSingle = mix(
            vec3(0.1, 0.85, 0.5),
            vec3(0.25, 0.55, 1.0),
            aRandom
          );

          // G-Banding: dark/light alternating bands revealed by scan line
          float bandPattern = step(0.5, fract(aSingle.y * 1.8 + 0.3));
          vec3 darkBand = vec3(0.06, 0.20, 0.55);
          vec3 lightBand = vec3(0.20, 0.75, 0.95);
          vec3 bandedColor = mix(darkBand, lightBand, bandPattern);

          // Blend banding in only where scan has passed (aSingle.y > uScanY) and scan is active
          float scanned = smoothstep(uScanY + 0.15, uScanY - 0.05, aSingle.y) * uScanActive * uMorph2;
          cSingle = mix(cSingle, bandedColor, scanned);

          // Scan line glow on particles near the line
          vScanGlow = exp(-pow((aSingle.y - uScanY) * 3.0, 2.0)) * uScanActive * uMorph2;

          vColor = mix(cDNA, cChromo, uMorph1);
          vColor = mix(vColor, cSingle, uMorph2);
          vAlpha = 1.0;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          float sizeBoost = 1.0 + uMorph2 * 0.3;
          gl_PointSize = aSize * uPR * (12.0 / -mv.z) * sizeBoost;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vScanGlow;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float glow = exp(-d * d * 8.0);
          // Scan line adds bright cyan glow
          vec3 col = vColor + vec3(0.1, 0.8, 1.0) * vScanGlow * 0.6;
          gl_FragColor = vec4(col, glow * vAlpha * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Scan line (Three.js line object) ──
    const scanLineGeo = new THREE.BufferGeometry();
    const scanLineVerts = new Float32Array([-2.5, 0, 0.2, 2.5, 0, 0.2]);
    scanLineGeo.setAttribute("position", new THREE.BufferAttribute(scanLineVerts, 3));
    const scanLineMat = new THREE.LineBasicMaterial({
      color: 0x14b8d6,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const scanLine = new THREE.Line(scanLineGeo, scanLineMat);
    scene.add(scanLine);

    // ── 5-Phase Animation ──
    // 0: DNA→Chromo  1: Chromo→Single+scan  2: Single dwell (UI visible)  3: Single→DNA  4: DNA dwell
    let t0 = -1; // set on first frame
    const phases = [4, 4, 2, 3, 4, 4, 3]; // durations in seconds
    const totalCycle = phases.reduce((a, b) => a + b, 0); // 20s
    const camZDNA = 18;
    const camZChromo = 18;
    const camZSingle = 10;

    // Single chromosome bounds for scan
    const chromoTop = 1.8;
    const chromoBot = -3.2;

    const smoothstep = (x: number) => x * x * (3 - 2 * x);

    // Overlay elements
    const boxEl = overlay.querySelector("[data-box]") as HTMLElement;
    const labelEl = overlay.querySelector("[data-label]") as HTMLElement;

    const getPhase = (t: number) => {
      let rem = t % totalCycle;
      for (let i = 0; i < phases.length; i++) {
        if (rem < phases[i]) return { phase: i, phaseT: rem / phases[i] };
        rem -= phases[i];
      }
      return { phase: 0, phaseT: 0 };
    };

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      if (t0 < 0) t0 = now;
      const elapsed = (now - t0) / 1000;
      const { phase, phaseT } = getPhase(elapsed);

      const ease = (t: number) => smoothstep(Math.max(0, Math.min(1, t)));

      let morph1 = 0;
      let morph2 = 0;
      let targetCamZ = camZDNA;
      let scanActive = 0;
      let scanY = chromoTop + 1;
      let showUI = false;

      if (phase === 0) {
        // DNA → Chromosomes
        const trans = ease((phaseT - 0.1) / 0.8);
        morph1 = trans;
        morph2 = 0;
        targetCamZ = camZDNA + (camZChromo - camZDNA) * trans;
      } else if (phase === 1) {
        // Chromosomes → Single (morph + zoom only, no scan yet)
        const trans = ease((phaseT - 0.1) / 0.8);
        morph1 = 1;
        morph2 = trans;
        targetCamZ = camZChromo + (camZSingle - camZChromo) * trans;
      } else if (phase === 2) {
        // Single chromosome dwell — just sit and show banding, no scan
        morph1 = 1;
        morph2 = 1;
        targetCamZ = camZSingle;
      } else if (phase === 3) {
        // Scan line sweeps over chromosome
        morph1 = 1;
        morph2 = 1;
        targetCamZ = camZSingle;
        scanActive = 1;
        scanY = chromoTop - phaseT * (chromoTop - chromoBot);
        if (phaseT > 0.5) showUI = true;
      } else if (phase === 4) {
        // Scan complete dwell — UI visible, just sit
        morph1 = 1;
        morph2 = 1;
        targetCamZ = camZSingle;
        scanActive = 1;
        scanY = chromoBot - 1;
        showUI = true;
      } else if (phase === 5) {
        // Single → DNA
        const trans = ease((phaseT - 0.1) / 0.8);
        morph1 = 1 - trans;
        morph2 = 1 - trans;
        targetCamZ = camZSingle + (camZDNA - camZSingle) * trans;
      } else {
        // DNA dwell
        morph1 = 0;
        morph2 = 0;
        targetCamZ = camZDNA;
      }

      mat.uniforms.uTime.value = elapsed;
      mat.uniforms.uMorph1.value = morph1;
      mat.uniforms.uMorph2.value = morph2;
      mat.uniforms.uScanY.value = scanY;
      mat.uniforms.uScanActive.value = scanActive;

      // Scan line visual
      scanLine.position.y = scanY;
      scanLineMat.opacity = scanActive * 0.7;

      // Bounding box + label overlay
      if (boxEl && labelEl) {
        const uiOpacity = showUI ? 1 : 0;
        boxEl.style.opacity = String(uiOpacity);
        labelEl.style.opacity = String(uiOpacity);
        // Blink the label cursor
        const blink = Math.sin(elapsed * 4) > 0;
        const cursorEl = labelEl.querySelector("[data-cursor]") as HTMLElement;
        if (cursorEl) cursorEl.style.opacity = blink ? "1" : "0";
      }

      // Smooth camera zoom
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      // Mouse parallax
      const parallaxScale = 1.0 - morph2 * 0.5;
      camera.position.x += (mouseRef.current.x * 1.5 * parallaxScale - camera.position.x) * 0.015;
      camera.position.y += (mouseRef.current.y * 1.0 * parallaxScale - camera.position.y) * 0.015;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      scanLineGeo.dispose();
      scanLineMat.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, [handleMouseMove]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" />
      {/* UI Overlay: bounding box + label */}
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Bounding box */}
        <div
          data-box
          className="absolute transition-opacity duration-500"
          style={{
            opacity: 0,
            width: "90px",
            height: "140px",
            border: "1px solid rgba(20, 184, 214, 0.4)",
            borderRadius: "3px",
            boxShadow: "0 0 12px rgba(20, 184, 214, 0.15), inset 0 0 12px rgba(20, 184, 214, 0.05)",
          }}
        >
          {/* Corner brackets */}
          <div className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t-2 border-l-2 border-cyan-400/70" />
          <div className="absolute -top-[2px] -right-[2px] w-2 h-2 border-t-2 border-r-2 border-cyan-400/70" />
          <div className="absolute -bottom-[2px] -left-[2px] w-2 h-2 border-b-2 border-l-2 border-cyan-400/70" />
          <div className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b-2 border-r-2 border-cyan-400/70" />
        </div>
        {/* Label */}
        <div
          data-label
          className="absolute transition-opacity duration-500"
          style={{
            opacity: 0,
            transform: "translate(58px, -70px)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_6px_rgba(20,184,214,0.6)]" />
            <span
              className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.15em] text-cyan-300/90 uppercase"
              style={{ textShadow: "0 0 8px rgba(20,184,214,0.4)" }}
            >
              Chr 7 — 46,XY
              <span data-cursor className="inline-block w-[1px] h-[10px] bg-cyan-400/80 ml-1 align-middle" />
            </span>
          </div>
          <div className="mt-1 ml-3 flex items-center gap-1">
            <div className="w-[28px] h-[2px] bg-gradient-to-r from-cyan-400/50 to-transparent" />
            <span className="text-[7px] text-cyan-500/50 tracking-wider font-mono">IDENTIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
