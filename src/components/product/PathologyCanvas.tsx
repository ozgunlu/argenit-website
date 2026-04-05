"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

/* ── Position generators ── */

/** Target A: Glass slide with H&E tissue blob */
function generateSlide(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const slideW = 10, slideH = 5.5;
  const tissueW = 6, tissueH = 3.5;

  // 10% particles for slide border region
  const borderCount = Math.floor(count * 0.1);

  for (let i = 0; i < count; i++) {
    if (i < borderCount) {
      // Sparse particles along slide edges + label area
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (edge === 0) { x = -slideW / 2 + Math.random() * slideW; y = -slideH / 2; }
      else if (edge === 1) { x = -slideW / 2 + Math.random() * slideW; y = slideH / 2; }
      else if (edge === 2) { x = -slideW / 2; y = -slideH / 2 + Math.random() * slideH; }
      else { x = slideW / 2; y = -slideH / 2 + Math.random() * slideH; }
      pos[i * 3] = x + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    } else {
      // Organic tissue blob: elliptical with irregular edges
      const angle = Math.random() * Math.PI * 2;
      const rBase = Math.random();
      // Organic edge variation
      const edgeNoise = 0.85 + 0.15 * Math.sin(angle * 3.7 + 1.2) * Math.cos(angle * 2.3 + 0.8);
      const r = Math.pow(rBase, 0.6) * edgeNoise;
      pos[i * 3] = Math.cos(angle) * r * (tissueW / 2) + 0.3;
      pos[i * 3 + 1] = Math.sin(angle) * r * (tissueH / 2);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
  }
  return pos;
}

/** Target B: Zoomed cell nuclei clusters */
function generateCells(count: number): { pos: Float32Array; centers: { x: number; y: number; r: number }[] } {
  const pos = new Float32Array(count * 3);
  const centers: { x: number; y: number; r: number }[] = [];
  const cellCount = 22;
  for (let c = 0; c < cellCount; c++) {
    centers.push({
      x: (Math.random() - 0.5) * 7,
      y: (Math.random() - 0.5) * 5,
      r: 0.3 + Math.random() * 0.5,
    });
  }

  for (let i = 0; i < count; i++) {
    const cell = centers[Math.floor(Math.random() * cellCount)];
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.5) * cell.r;
    const isNucleus = Math.random() < 0.6;
    const spread = isNucleus ? 0.5 : 1.2;
    pos[i * 3] = cell.x + Math.cos(angle) * dist * spread;
    pos[i * 3 + 1] = cell.y + Math.sin(angle) * dist * spread;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  return { pos, centers };
}

/** Target C: Digital report — text lines + bar chart */
function generateReport(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const lineCount = 8;
  const barCount = 5;
  const textParticles = Math.floor(count * 0.55);
  const barParticles = Math.floor(count * 0.25);
  // rest = header/accent

  let idx = 0;

  // Header bar (thick top line)
  const headerN = Math.floor(count * 0.08);
  for (let i = 0; i < headerN && idx < count; i++) {
    pos[idx * 3] = -3.5 + (i / headerN) * 7;
    pos[idx * 3 + 1] = 3.2 + (Math.random() - 0.5) * 0.15;
    pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.05;
    idx++;
  }

  // Divider line
  const divN = Math.floor(count * 0.03);
  for (let i = 0; i < divN && idx < count; i++) {
    pos[idx * 3] = -3.5 + (i / divN) * 7;
    pos[idx * 3 + 1] = 2.7 + (Math.random() - 0.5) * 0.04;
    pos[idx * 3 + 2] = 0;
    idx++;
  }

  // Text lines (left side)
  const perLine = Math.floor(textParticles / lineCount);
  for (let line = 0; line < lineCount && idx < count; line++) {
    const y = 2.2 - line * 0.55;
    const lineW = 3.0 + Math.random() * 1.5; // varying line lengths
    for (let j = 0; j < perLine && idx < count; j++) {
      pos[idx * 3] = -3.5 + (j / perLine) * lineW + (Math.random() - 0.5) * 0.06;
      pos[idx * 3 + 1] = y + (Math.random() - 0.5) * 0.08;
      pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.03;
      idx++;
    }
  }

  // Bar chart (right-bottom area)
  const perBar = Math.floor(barParticles / barCount);
  for (let b = 0; b < barCount && idx < count; b++) {
    const bx = 1.8 + b * 0.8;
    const bh = 0.8 + Math.random() * 2.0; // bar heights vary
    for (let j = 0; j < perBar && idx < count; j++) {
      const t = j / perBar;
      pos[idx * 3] = bx + (Math.random() - 0.5) * 0.35;
      pos[idx * 3 + 1] = -2.0 + t * bh + (Math.random() - 0.5) * 0.06;
      pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.03;
      idx++;
    }
  }

  // Fill remaining with scattered accent dots
  while (idx < count) {
    pos[idx * 3] = (Math.random() - 0.5) * 8;
    pos[idx * 3 + 1] = (Math.random() - 0.5) * 7;
    pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.05;
    idx++;
  }

  return pos;
}

/** Color palette for each target */
function generateColors(count: number): {
  slideCol: Float32Array;
  cellCol: Float32Array;
  reportCol: Float32Array;
} {
  const slideCol = new Float32Array(count * 3);
  const cellCol = new Float32Array(count * 3);
  const reportCol = new Float32Array(count * 3);

  const purple = new THREE.Color("#702963");
  const pink = new THREE.Color("#FF69B4");
  const darkViolet = new THREE.Color("#5B2C6F");
  const lightPink = new THREE.Color("#F5B7B1");
  const cyan = new THREE.Color("#14b8d6");
  const teal = new THREE.Color("#0d9488");

  for (let i = 0; i < count; i++) {
    // Slide: H&E palette
    const isNuc = Math.random() < 0.45;
    const sc = isNuc
      ? purple.clone().lerp(darkViolet, Math.random())
      : pink.clone().lerp(lightPink, Math.random());
    slideCol[i * 3] = sc.r;
    slideCol[i * 3 + 1] = sc.g;
    slideCol[i * 3 + 2] = sc.b;

    // Cells: similar but more vivid
    const cc = isNuc
      ? new THREE.Color("#702963").lerp(new THREE.Color("#9b59b6"), Math.random())
      : new THREE.Color("#FF69B4").lerp(new THREE.Color("#f8c8dc"), Math.random());
    cellCol[i * 3] = cc.r;
    cellCol[i * 3 + 1] = cc.g;
    cellCol[i * 3 + 2] = cc.b;

    // Report: cyan/teal tech palette
    const rc = Math.random() < 0.3
      ? cyan.clone().lerp(teal, Math.random())
      : new THREE.Color("#67e8f9").lerp(new THREE.Color("#a5f3fc"), Math.random());
    reportCol[i * 3] = rc.r;
    reportCol[i * 3 + 1] = rc.g;
    reportCol[i * 3 + 2] = rc.b;
  }

  return { slideCol, cellCol, reportCol };
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
 * Pathology WebGL: Slide → Cell Detail (AI detection) → Report
 * 3-phase, 12s cycle with morph transitions + overlays.
 */
export default function PathologyCanvas() {
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
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const pr = Math.min(window.devicePixelRatio, 2);

    // ── Glass slide frame (white outline + barcode label) ──
    const slideW = 10, slideH = 5.5;
    const ol = slideW / 2, ot = slideH / 2;

    // Slide outline
    const outlineGeo = new THREE.BufferGeometry();
    const corners = new Float32Array([
      -ol, -ot, 0, ol, -ot, 0,
      ol, -ot, 0, ol, ot, 0,
      ol, ot, 0, -ol, ot, 0,
      -ol, ot, 0, -ol, -ot, 0,
    ]);
    outlineGeo.setAttribute("position", new THREE.BufferAttribute(corners, 3));
    const outlineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const slideOutline = new THREE.LineSegments(outlineGeo, outlineMat);
    scene.add(slideOutline);

    // Frosted label / barcode area (left side of slide)
    const labelW = 2.2;
    const labelGeo = new THREE.BufferGeometry();
    const labelCorners = new Float32Array([
      -ol, -ot, 0.01, -ol + labelW, -ot, 0.01,
      -ol + labelW, -ot, 0.01, -ol + labelW, ot, 0.01,
      -ol + labelW, ot, 0.01, -ol, ot, 0.01,
    ]);
    labelGeo.setAttribute("position", new THREE.BufferAttribute(labelCorners, 3));
    const labelMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    });
    const slideLabel = new THREE.LineSegments(labelGeo, labelMat);
    scene.add(slideLabel);

    // QR code pattern inside label area
    const barcodeGeo = new THREE.BufferGeometry();
    const qrLines: number[] = [];
    const gridSize = 7; // 7x7 grid
    const qrSize = Math.min(labelW - 0.5, (ot - 0.3) * 2) * 0.75;
    const cellSize = qrSize / gridSize;
    const qrLeft = -ol + (labelW - qrSize) / 2;
    const qrBot = -ot + 0.3; // align to bottom of slide
    const z = 0.02;

    // QR-like pattern: 3 finder squares at corners + random data
    const qrFill = [
      1,1,1,0,0,1,1,
      1,0,1,0,1,0,1,
      1,1,1,0,1,1,1,
      0,0,0,1,0,0,0,
      1,0,1,0,1,1,0,
      0,1,0,1,0,1,0,
      1,1,0,0,1,0,1,
    ];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!qrFill[row * gridSize + col]) continue;
        const x0 = qrLeft + col * cellSize;
        const y0 = qrBot + (gridSize - 1 - row) * cellSize;
        const x1 = x0 + cellSize;
        const y1 = y0 + cellSize;
        // Draw cell as 4 line segments (square)
        qrLines.push(
          x0, y0, z, x1, y0, z,
          x1, y0, z, x1, y1, z,
          x1, y1, z, x0, y1, z,
          x0, y1, z, x0, y0, z,
        );
      }
    }
    barcodeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(qrLines), 3));
    const barcodeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });
    const barcode = new THREE.LineSegments(barcodeGeo, barcodeMat);
    scene.add(barcode);

    const count = 12000;

    // Generate three morph targets
    const slidePos = generateSlide(count);
    const { pos: cellPos, centers: cellCenters } = generateCells(count);
    // Pick 5 cells for AI detection boxes
    const aiCells = cellCenters.slice(0, 5);
    const aiLabels = ["MALIGNANT 94%", "BENIGN 87%", "ATYPICAL 72%", "BENIGN 91%", "MALIGNANT 88%"];
    const reportPos = generateReport(count);
    const { slideCol, cellCol, reportCol } = generateColors(count);

    const randoms = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("aSlide", new THREE.BufferAttribute(slidePos, 3));
    geo.setAttribute("aCells", new THREE.BufferAttribute(cellPos, 3));
    geo.setAttribute("aReport", new THREE.BufferAttribute(reportPos, 3));
    geo.setAttribute("aSlideCol", new THREE.BufferAttribute(slideCol, 3));
    geo.setAttribute("aCellCol", new THREE.BufferAttribute(cellCol, 3));
    geo.setAttribute("aReportCol", new THREE.BufferAttribute(reportCol, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph1: { value: 0 }, // slide → cells
        uMorph2: { value: 0 }, // cells → report
        uScanY: { value: 10 },
        uScanActive: { value: 0 },
        uPR: { value: pr },
      },
      vertexShader: /* glsl */ `
        ${noiseGLSL}
        attribute vec3 aSlide;
        attribute vec3 aCells;
        attribute vec3 aReport;
        attribute vec3 aSlideCol;
        attribute vec3 aCellCol;
        attribute vec3 aReportCol;
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
          float n = fbm(aSlide * 0.4 + t * 0.03 + 30.0);

          // Slide position with organic drift
          vec3 slideP = aSlide;
          slideP.x += sin(t * 0.15 + aSlide.y * 0.5) * 0.05;
          slideP.y += cos(t * 0.12 + aSlide.x * 0.4) * 0.05;

          // Cell position with breathing
          vec3 cellP = aCells;
          cellP.x += sin(t * 0.3 + aCells.y * 0.8) * 0.03;
          cellP.y += cos(t * 0.25 + aCells.x * 0.6) * 0.03;

          // Report position (static, subtle float)
          vec3 reportP = aReport;
          reportP.y += sin(t * 0.2 + aRandom * 6.0) * 0.015;

          // Two-stage morph
          vec3 pos = mix(slideP, cellP, uMorph1);
          pos = mix(pos, reportP, uMorph2);

          // Micro-movement
          pos += vec3(
            sin(t * 0.5 + aRandom * 12.0) * 0.02,
            cos(t * 0.4 + aRandom * 8.0) * 0.02,
            0.0
          );

          // Colors — two-stage blend
          vec3 col = mix(aSlideCol, aCellCol, uMorph1);
          col = mix(col, aReportCol, uMorph2);

          // Scan glow during analysis phase
          vScanGlow = exp(-pow((aCells.y - uScanY) * 2.5, 2.0)) * uScanActive * (1.0 - uMorph2);

          // Brighten scanned cells
          float scanned = smoothstep(uScanY + 0.2, uScanY - 0.1, aCells.y) * uScanActive * (1.0 - uMorph2);
          col += vec3(0.05, 0.15, 0.2) * scanned;

          vColor = col;
          vAlpha = 1.0;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * uPR * (14.0 / -mv.z);
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
          vec3 col = vColor + vec3(0.1, 0.7, 0.9) * vScanGlow * 0.5;
          gl_FragColor = vec4(col, glow * vAlpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Scan line (horizontal, for cell analysis) ──
    const scanGeo = new THREE.BufferGeometry();
    const scanVerts = new Float32Array([-5, 0, 0.1, 5, 0, 0.1]);
    scanGeo.setAttribute("position", new THREE.BufferAttribute(scanVerts, 3));
    const scanMat = new THREE.LineBasicMaterial({
      color: 0x14b8d6,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const scanLine = new THREE.Line(scanGeo, scanMat);
    scene.add(scanLine);

    // ── Animation ──
    // 5 phases: slide→cells, scan+AI dwell, cells→report, report dwell, report→slide
    let t0 = -1; // set on first frame
    const phases = [5, 6, 4, 4, 5]; // durations in seconds
    const totalCycle = phases.reduce((a, b) => a + b, 0); // 24s
    const camZSlide = 20;
    const camZCells = 8;
    const camZReport = 14;
    const cellFieldTop = 2.5;
    const cellFieldBot = -2.5;

    const smoothstep = (x: number) => x * x * (3 - 2 * x);

    // Overlay elements
    const boxEls = overlay.querySelectorAll("[data-aibox]") as NodeListOf<HTMLElement>;
    const reportEl = overlay.querySelector("[data-report]") as HTMLElement;

    // Get phase index and progress from elapsed time
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

      let morph1 = 0, morph2 = 0;
      let targetCamZ = camZSlide;
      let scanActive = 0, scanY = cellFieldTop + 2;
      let showAI = false, showReport = false;

      if (phase === 0) {
        // Slide → Cells (zoom in)
        const trans = ease((phaseT - 0.1) / 0.8);
        morph1 = trans;
        morph2 = 0;
        targetCamZ = camZSlide + (camZCells - camZSlide) * trans;
      } else if (phase === 1) {
        // Cells dwell: scan + AI detection boxes
        morph1 = 1;
        morph2 = 0;
        targetCamZ = camZCells;

        // Scan line sweeps top to bottom during first 60%
        if (phaseT < 0.6) {
          scanActive = 1;
          const scanProgress = phaseT / 0.6;
          scanY = cellFieldTop - scanProgress * (cellFieldTop - cellFieldBot);
          if (scanProgress > 0.35) showAI = true;
        } else {
          // Dwell with AI boxes visible
          scanActive = 0;
          showAI = true;
        }
      } else if (phase === 2) {
        // Cells → Report
        const trans = ease((phaseT - 0.1) / 0.8);
        morph1 = 1;
        morph2 = trans;
        targetCamZ = camZCells + (camZReport - camZCells) * trans;
      } else if (phase === 3) {
        // Report dwell
        morph1 = 1;
        morph2 = 1;
        targetCamZ = camZReport;
        showReport = true;
      } else {
        // Report → Slide
        const trans = ease((phaseT - 0.1) / 0.8);
        morph1 = 1 - trans;
        morph2 = 1 - trans;
        targetCamZ = camZReport + (camZSlide - camZReport) * trans;
      }

      mat.uniforms.uTime.value = elapsed;
      mat.uniforms.uMorph1.value = morph1;
      mat.uniforms.uMorph2.value = morph2;
      mat.uniforms.uScanY.value = scanY;
      mat.uniforms.uScanActive.value = scanActive;

      // Slide frame visibility (fade out as we zoom into cells)
      const slideOpacity = Math.max(0, 1 - morph1 * 2.5);
      outlineMat.opacity = 0.35 * slideOpacity;
      labelMat.opacity = 0.15 * slideOpacity;
      barcodeMat.opacity = 0.2 * slideOpacity;

      // Scan line
      scanLine.position.y = scanY;
      scanLineMat.opacity = scanActive * 0.6;

      // AI detection boxes — project 3D cell centers to screen
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      boxEls.forEach((el, idx) => {
        if (idx >= aiCells.length) return;
        el.style.opacity = showAI ? "1" : "0";
        const blink = Math.sin(elapsed * 3 + parseFloat(el.dataset.phase || "0")) > 0;
        el.style.borderColor = blink
          ? "rgba(20, 184, 214, 0.7)"
          : "rgba(20, 184, 214, 0.25)";

        // Project cell center to screen coordinates
        const cell = aiCells[idx];
        const v = new THREE.Vector3(cell.x, cell.y, 0);
        v.project(camera);
        const sx = (v.x * 0.5 + 0.5) * cw;
        const sy = (-v.y * 0.5 + 0.5) * ch;
        const boxSize = Math.max(20, cell.r * 80);
        el.style.left = `${sx - boxSize / 2}px`;
        el.style.top = `${sy - boxSize / 2}px`;
        el.style.width = `${boxSize}px`;
        el.style.height = `${boxSize}px`;
      });

      // Report overlay
      if (reportEl) {
        reportEl.style.opacity = showReport || morph2 > 0.8 ? "1" : "0";
      }

      // Camera
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      const parallax = 1.0 - morph1 * 0.3;
      camera.position.x += (mouseRef.current.x * 1.2 * parallax - camera.position.x) * 0.012;
      camera.position.y += (mouseRef.current.y * 0.8 * parallax - camera.position.y) * 0.012;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    // Fix: reference scanLineMat correctly
    const scanLineMat = scanMat;
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
      [geo, mat, scanGeo, scanMat, outlineGeo, outlineMat, labelGeo, labelMat, barcodeGeo, barcodeMat].forEach(
        (d) => d.dispose(),
      );
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, [handleMouseMove]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" />
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none">
        {/* AI Detection Bounding Boxes — positioned dynamically via 3D projection */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            data-aibox
            data-phase={[0, 1.5, 3.0, 2.2, 0.8][i]}
            className="absolute transition-opacity duration-500"
            style={{
              opacity: 0,
              border: "1px solid rgba(20, 184, 214, 0.5)",
              borderRadius: "2px",
              boxShadow: "0 0 8px rgba(20, 184, 214, 0.15)",
            }}
          >
            <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-cyan-400/80" />
            <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 border-t border-r border-cyan-400/80" />
            <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 border-b border-l border-cyan-400/80" />
            <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-cyan-400/80" />
            <span
              className="absolute -top-4 left-0 text-[7px] font-mono text-cyan-400/80 tracking-wider whitespace-nowrap"
              style={{ textShadow: "0 0 6px rgba(20,184,214,0.4)" }}
            >
              {["MALIGNANT 94%", "BENIGN 87%", "ATYPICAL 72%", "BENIGN 91%", "MALIGNANT 88%"][i]}
            </span>
          </div>
        ))}

        {/* Report overlay label */}
        <div
          data-report
          className="absolute left-1/2 top-1/2 transition-opacity duration-700"
          style={{ opacity: 0, transform: "translate(-50%, -50%) translate(-50px, -60px)" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_6px_rgba(20,184,214,0.6)]" />
            <span
              className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.15em] text-cyan-300/90 uppercase"
              style={{ textShadow: "0 0 8px rgba(20,184,214,0.4)" }}
            >
              Pathology Report
            </span>
          </div>
          <div className="ml-3 flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <div className="w-[20px] h-[2px] bg-gradient-to-r from-cyan-400/50 to-transparent" />
              <span className="text-[7px] text-cyan-500/50 tracking-wider font-mono">AI-ASSISTED</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[14px] h-[2px] bg-gradient-to-r from-pink-400/40 to-transparent" />
              <span className="text-[7px] text-pink-400/40 tracking-wider font-mono">3 REGIONS FLAGGED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
