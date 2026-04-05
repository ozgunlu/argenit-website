"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1500;

/* ── GLSL simplex noise (Ashima Arts) + FBM ── */
const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+10.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float fbm(vec3 p){
  float v=0.;float a=.5;
  for(int i=0;i<4;i++){v+=a*snoise(p);p*=2.;a*=.5;}
  return v;
}
`;

export default function MorphField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  const handleScroll = useCallback(() => {
    scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.set(4, 0, 22);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* ── Main morphing particles (Fibonacci sphere) ── */
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 6 + (Math.random() - 0.5) * 1.5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = Math.random() * 2.0 + 1.0;
      phases[i] = Math.random();
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        ${noiseGLSL}
        attribute float aSize;
        attribute float aPhase;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uScroll;
        uniform float uPixelRatio;

        void main(){
          vec3 base = position;
          float t = uTime * 0.12;
          float sc = uScroll;

          float n1 = fbm(base * 0.25 + t * 0.5);
          float n2 = fbm(base * 0.3 - t * 0.3 + 50.0);

          /* ─ State 1 · Organic breathing sphere ─ */
          vec3 s1 = base * (1.0 + n1 * 0.35);
          s1 += vec3(
            sin(t * 1.2 + aPhase * 6.28) * 0.4,
            cos(t + aPhase * 6.28) * 0.4,
            sin(t * 0.8 + aPhase * 12.56) * 0.4
          );

          /* ─ State 2 · Converging disc / lens focus ─ */
          float angle = atan(base.z, base.x);
          float baseR = length(base.xz);
          vec3 s2 = vec3(
            cos(angle + t * 0.3 + n1) * baseR * 1.8,
            base.y * 0.12 + n2 * 1.2 + sin(angle * 3.0 + t) * 0.5,
            sin(angle + t * 0.3 + n1) * baseR * 1.8
          );

          /* ─ State 3 · Streaming horizontal flow ─ */
          vec3 s3 = vec3(
            base.x * 3.5 + sin(aPhase * 6.28 + t * 2.0) * 2.0 + n1 * 3.0,
            n2 * 1.5 + sin(base.x * 0.5 + t) * 0.8,
            base.z * 0.3 + n2 * 2.0
          );

          /* ─ Blend ─ */
          float t1 = smoothstep(0.0, 0.5, sc);
          float t2 = smoothstep(0.35, 0.85, sc);
          vec3 p = mix(mix(s1, s2, t1), s3, t2);

          /* ─ Color ─ */
          float cm = n1 * 0.5 + 0.5 + sc * 0.3;
          vec3 c1 = vec3(0.23, 0.51, 0.96);   // blue
          vec3 c2 = vec3(0.02, 0.71, 0.83);   // cyan
          vec3 c3 = vec3(0.13, 0.83, 0.65);   // teal
          vColor = mix(c1, mix(c2, c3, t2), cm);

          /* ─ Alpha ─ */
          float dist = length(p);
          vAlpha = smoothstep(30.0, 3.0, dist) * (0.6 + n1 * 0.4);

          vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * uPixelRatio * (22.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          float glow = 1.0 - smoothstep(0.0, 0.5, d);
          glow = pow(glow, 1.8);
          gl_FragColor = vec4(vColor, glow * vAlpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ── Ambient dust (subtle depth) ── */
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSz = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 60;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 15;
      dustSz[i] = Math.random() * 1.2 + 0.3;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("aSize", new THREE.BufferAttribute(dustSz, 1));

    const dustMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        varying float vAlpha;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;
        void main(){
          vec3 p = position;
          p.y += sin(uTime * 0.2 + position.x * 0.1) * 1.5;
          p.x += cos(uTime * 0.15 + position.z * 0.1) * 1.0;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * uPixelRatio * (15.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = 0.3;
          vColor = vec3(0.15, 0.55, 0.85);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        varying vec3 vColor;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          float glow = 1.0 - smoothstep(0.0, 0.5, d);
          glow = pow(glow, 2.0);
          gl_FragColor = vec4(vColor, glow * vAlpha * 0.3);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* ── Animation loop ── */
    const t0 = performance.now();
    let smoothScroll = 0;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = (performance.now() - t0) / 1000;

      // Smooth lerp toward target scroll
      smoothScroll += (scrollRef.current - smoothScroll) * 0.04;

      mat.uniforms.uTime.value = elapsed;
      mat.uniforms.uScroll.value = smoothScroll;
      dustMat.uniforms.uTime.value = elapsed;

      // Subtle mouse parallax on camera
      camera.position.x += (mouseRef.current.x * 2 + 4 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    /* ── Events ── */
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
