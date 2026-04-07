"use client";

import { useTranslations } from "next-intl";
import { useRef, useEffect, useState, useCallback } from "react";

/**
 * V5 — WebGL Particle Field + Interactive Cards
 * Floating particle mesh background rendered on <canvas>.
 * Cards overlay the particle field, hover triggers nearby particles to glow.
 */

const panels = [
  { titleKey: "home.showcase1Title", descKey: "home.showcase1Desc", num: "01" },
  { titleKey: "home.showcase2Title", descKey: "home.showcase2Desc", num: "02" },
  { titleKey: "home.showcase3Title", descKey: "home.showcase3Desc", num: "03" },
  { titleKey: "home.showcase4Title", descKey: "home.showcase4Desc", num: "04" },
];

// Simple particle system on canvas (no Three.js dependency)
function useParticleField(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; baseAlpha: number }[]>([]);
  const rafRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const count = Math.floor((rect.width * rect.height) / 4000);
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      baseAlpha: Math.random() * 0.3 + 0.05,
    }));
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    init();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
    };
    const onLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      const ps = particlesRef.current;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse proximity glow
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / (180 * dpr));
        const alpha = p.baseAlpha + proximity * 0.6;

        // Color: base is blue-white, proximity shifts to cyan
        const r = Math.round(100 + proximity * 50);
        const g = Math.round(160 + proximity * 80);
        const b = Math.round(220 + proximity * 35);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * dpr * (1 + proximity * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < ps.length; j++) {
          const p2 = ps[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          const maxDist = 80 * dpr;
          if (d < maxDist) {
            const lineAlpha = (1 - d / maxDist) * 0.08 * (1 + proximity * 3);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
            ctx.lineWidth = 0.5 * dpr;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => { init(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef, init]);
}

export default function ProductShowcaseV5() {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useParticleField(canvasRef);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-36 bg-[#050a18] overflow-hidden">
      {/* Particle canvas — full section background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "auto" }}
      />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a18]/60 via-transparent to-[#050a18]/60" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-24 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/60 mb-5">
            {t("home.showcaseTitle1")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            {t("home.showcaseTitle2")}
          </h2>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-blue-500 to-cyan-500" />
        </div>

        {/* 2×2 grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {panels.map((panel, i) => (
            <div
              key={i}
              className="group relative transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(40px)",
                transitionDelay: `${300 + i * 130}ms`,
              }}
            >
              <div className="relative rounded-xl p-8 sm:p-10 bg-white/[0.02] backdrop-blur-[2px] border border-white/[0.05] hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-500 h-full">
                {/* Hover glow */}
                <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

                <div className="flex items-start gap-5">
                  {/* Number ring */}
                  <div className="shrink-0 w-12 h-12 rounded-full border border-white/[0.08] group-hover:border-cyan-500/30 flex items-center justify-center transition-colors duration-500">
                    <span className="font-mono text-sm text-white/20 group-hover:text-cyan-400/70 transition-colors duration-500">
                      {panel.num}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold text-white/80 group-hover:text-white leading-tight mb-3 transition-colors duration-500">
                      {t(panel.titleKey)}
                    </h3>
                    <p className="text-sm text-white/25 group-hover:text-white/45 leading-relaxed transition-colors duration-500">
                      {t(panel.descKey)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
