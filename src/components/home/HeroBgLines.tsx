"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const LINE_COUNT = 20;
const SEGMENT_COUNT = 800;
const RESOLUTION = 3;
const GUTTER = 5;
const WAVE_HEIGHT = 15;
const WAVE_STRENGTH = 0.08;
const WAVE_ROTATION = (10 * Math.PI) / 180;
const WAVE_SPEED = 0.02;

export default function HeroBgLines() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup — matching sample-2
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      1,
      3000
    );
    camera.position.set(0, 0, 0);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);

    // Create line groups — matching sample-2 structure
    const world = new THREE.Group();
    const worldLine1 = new THREE.Group();
    const worldLine2 = new THREE.Group();
    world.add(worldLine1);
    world.add(worldLine2);
    scene.add(world);

    // Line data
    interface LineData {
      geometry: THREE.BufferGeometry;
      line: THREE.Line;
      randomWave: number;
      randomWave2: number;
      index: number;
      myWaveH: number;
    }

    const lines: LineData[] = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      const positions = new Float32Array(SEGMENT_COUNT * 3);
      const colors = new Float32Array(SEGMENT_COUNT * 3);

      for (let j = 0; j < SEGMENT_COUNT; j++) {
        colors[j * 3] = 0.6;
        colors[j * 3 + 1] = 0.6;
        colors[j * 3 + 2] = 0.6;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        opacity: 1,
        linewidth: 1,
      });

      const line = new THREE.Line(geometry, material);
      line.rotation.z = WAVE_ROTATION;

      if (i < 10) {
        worldLine1.add(line);
      } else {
        worldLine2.add(line);
      }

      lines.push({
        geometry,
        line,
        randomWave: Math.floor(Math.random() * Math.PI * 100) / 100,
        randomWave2: Math.random() * Math.PI,
        index: i,
        myWaveH: 0,
      });
    }

    // Animation loop — wave mode from sample-2
    const animate = () => {
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        l.randomWave += WAVE_SPEED;
        l.myWaveH += 0.05 * (WAVE_HEIGHT - l.myWaveH);

        const t = l.index * GUTTER - (LINE_COUNT - 1) * GUTTER * 0.5;
        const e = -RESOLUTION * SEGMENT_COUNT * 0.5;

        const posAttr = l.geometry.getAttribute("position") as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;

        for (let j = 0; j < SEGMENT_COUNT; j++) {
          const wave =
            Math.sin(l.randomWave + j * WAVE_STRENGTH) *
            Math.cos(l.randomWave + l.randomWave2);

          const desZ = t;
          const desY = wave * l.myWaveH;
          const desX = j * RESOLUTION + e;

          const idx = j * 3;
          pos[idx] += 0.08 * (desX - pos[idx]);
          pos[idx + 1] += 0.08 * (desY - pos[idx + 1]);
          pos[idx + 2] += 0.08 * (desZ - pos[idx + 2]);
        }

        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ pointerEvents: "none" }}
    />
  );
}
