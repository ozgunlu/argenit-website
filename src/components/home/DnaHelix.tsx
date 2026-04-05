"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

export default function DnaHelix() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── DNA Double Helix ──
    const helixParticleCount = 600;
    const helixGeometry = new THREE.BufferGeometry();
    const helixPositions = new Float32Array(helixParticleCount * 3);
    const helixColors = new Float32Array(helixParticleCount * 3);
    const helixSizes = new Float32Array(helixParticleCount);

    const primaryColor = new THREE.Color("#3b82f6");
    const accentColor = new THREE.Color("#06b6d4");
    const whiteColor = new THREE.Color("#ffffff");

    for (let i = 0; i < helixParticleCount; i++) {
      const t = (i / helixParticleCount) * Math.PI * 8;
      const y = (i / helixParticleCount - 0.5) * 40;
      const radius = 5;

      const isSecondStrand = i % 2 === 1;
      const offset = isSecondStrand ? Math.PI : 0;

      helixPositions[i * 3] = Math.cos(t + offset) * radius;
      helixPositions[i * 3 + 1] = y;
      helixPositions[i * 3 + 2] = Math.sin(t + offset) * radius;

      // Color gradient along the helix
      const mix = i / helixParticleCount;
      const color = primaryColor.clone().lerp(accentColor, mix);
      helixColors[i * 3] = color.r;
      helixColors[i * 3 + 1] = color.g;
      helixColors[i * 3 + 2] = color.b;

      helixSizes[i] = isSecondStrand ? 2.5 : 3.0;
    }

    helixGeometry.setAttribute("position", new THREE.BufferAttribute(helixPositions, 3));
    helixGeometry.setAttribute("color", new THREE.BufferAttribute(helixColors, 3));
    helixGeometry.setAttribute("size", new THREE.BufferAttribute(helixSizes, 1));

    // Particle shader material
    const helixMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec3 pos = position;
          float wave = sin(pos.y * 0.3 + uTime * 0.8) * 0.5;
          pos.x += wave;
          pos.z += wave;
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (30.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
          vAlpha = smoothstep(20.0, 0.0, abs(pos.y));
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - 0.5);
          if (dist > 0.5) discard;
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);
          gl_FragColor = vec4(vColor, glow * vAlpha * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const helixPoints = new THREE.Points(helixGeometry, helixMaterial);
    helixPoints.rotation.z = 0.3;
    scene.add(helixPoints);

    // ── Bridge connections between strands ──
    const bridgeCount = 60;
    const bridgeGeometry = new THREE.BufferGeometry();
    const bridgePositions = new Float32Array(bridgeCount * 6); // 2 points per line
    const bridgeColors = new Float32Array(bridgeCount * 6);

    for (let i = 0; i < bridgeCount; i++) {
      const t = (i / bridgeCount) * Math.PI * 8;
      const y = (i / bridgeCount - 0.5) * 40;
      const radius = 5;

      bridgePositions[i * 6] = Math.cos(t) * radius;
      bridgePositions[i * 6 + 1] = y;
      bridgePositions[i * 6 + 2] = Math.sin(t) * radius;
      bridgePositions[i * 6 + 3] = Math.cos(t + Math.PI) * radius;
      bridgePositions[i * 6 + 4] = y;
      bridgePositions[i * 6 + 5] = Math.sin(t + Math.PI) * radius;

      const mix = i / bridgeCount;
      const c = whiteColor.clone();
      bridgeColors[i * 6] = c.r;
      bridgeColors[i * 6 + 1] = c.g;
      bridgeColors[i * 6 + 2] = c.b;
      bridgeColors[i * 6 + 3] = c.r;
      bridgeColors[i * 6 + 4] = c.g;
      bridgeColors[i * 6 + 5] = c.b;
    }

    bridgeGeometry.setAttribute("position", new THREE.BufferAttribute(bridgePositions, 3));
    bridgeGeometry.setAttribute("color", new THREE.BufferAttribute(bridgeColors, 3));

    const bridgeMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const bridges = new THREE.LineSegments(bridgeGeometry, bridgeMaterial);
    bridges.rotation.z = 0.3;
    scene.add(bridges);

    // ── Floating ambient particles ──
    const ambientCount = 400;
    const ambientGeometry = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientColors = new Float32Array(ambientCount * 3);
    const ambientSizes = new Float32Array(ambientCount);

    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 80;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;

      const c = Math.random() > 0.5 ? primaryColor.clone() : accentColor.clone();
      ambientColors[i * 3] = c.r;
      ambientColors[i * 3 + 1] = c.g;
      ambientColors[i * 3 + 2] = c.b;

      ambientSizes[i] = Math.random() * 1.5 + 0.5;
    }

    ambientGeometry.setAttribute("position", new THREE.BufferAttribute(ambientPositions, 3));
    ambientGeometry.setAttribute("color", new THREE.BufferAttribute(ambientColors, 3));
    ambientGeometry.setAttribute("size", new THREE.BufferAttribute(ambientSizes, 1));

    const ambientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(uTime * 0.3 + position.x * 0.1) * 1.5;
          pos.x += cos(uTime * 0.2 + position.z * 0.1) * 1.0;
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (20.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
          vAlpha = 0.6;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - 0.5);
          if (dist > 0.5) discard;
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 2.0);
          gl_FragColor = vec4(vColor, glow * vAlpha * 0.4);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ambientPoints = new THREE.Points(ambientGeometry, ambientMaterial);
    scene.add(ambientPoints);

    // ── Animation loop ──
    const startTime = performance.now();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      // Update uniforms
      helixMaterial.uniforms.uTime.value = elapsed;
      ambientMaterial.uniforms.uTime.value = elapsed;

      // Rotate helix slowly
      helixPoints.rotation.y = elapsed * 0.15;
      bridges.rotation.y = elapsed * 0.15;

      // Mouse interaction - subtle camera movement
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Mouse listener
    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      helixGeometry.dispose();
      helixMaterial.dispose();
      bridgeGeometry.dispose();
      bridgeMaterial.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
