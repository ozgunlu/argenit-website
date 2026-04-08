"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Floating chromosome pairs (pure CSS/canvas hybrid) ── */
function ChromosomeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let raf = 0;

    // Chromosome-like shape particles
    const chromosomes: {
      x: number; y: number; vx: number; vy: number;
      rotation: number; rotSpeed: number;
      size: number; hue: number; alpha: number;
      type: "x" | "rod" | "dot";
    }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const populate = () => {
      chromosomes.length = 0;
      const count = Math.floor((w * h) / 12000);
      for (let i = 0; i < count; i++) {
        const types: ("x" | "rod" | "dot")[] = ["x", "rod", "dot"];
        chromosomes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.003,
          size: 4 + Math.random() * 10,
          hue: 190 + Math.random() * 40, // blue-cyan range
          alpha: 0.05 + Math.random() * 0.12,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }
    };

    const drawChromosome = (c: typeof chromosomes[0]) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.globalAlpha = c.alpha;

      const color = `hsl(${c.hue}, 70%, 65%)`;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      if (c.type === "x") {
        // X-shaped chromosome
        const s = c.size;
        ctx.beginPath();
        ctx.moveTo(-s * 0.3, -s);
        ctx.quadraticCurveTo(0, -s * 0.15, s * 0.3, -s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.3, s);
        ctx.quadraticCurveTo(0, s * 0.15, s * 0.3, s);
        ctx.stroke();
        // Centromere dot
        ctx.beginPath();
        ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.type === "rod") {
        // Rod/acrocentric chromosome
        const s = c.size;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -s, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Small dot/telomere
        ctx.beginPath();
        ctx.arc(0, 0, c.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (const c of chromosomes) {
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotSpeed;

        if (c.x < -20) c.x = w + 20;
        if (c.x > w + 20) c.x = -20;
        if (c.y < -20) c.y = h + 20;
        if (c.y > h + 20) c.y = -20;

        drawChromosome(c);
      }

      raf = requestAnimationFrame(animate);
    };

    resize();
    populate();
    animate();

    window.addEventListener("resize", () => { resize(); populate(); });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function AkasHero() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const reveal = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#050a18] overflow-hidden">
      {/* Background layers */}
      <ChromosomeField />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a18] via-[#050a18]/40 to-[#050a18]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050a18] via-transparent to-[#050a18]/80" />

      {/* Accent glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-500/6 rounded-full blur-[120px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:48px_48px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 lg:py-40 w-full">
        <div className="max-w-3xl">
          {/* Label */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 backdrop-blur-md text-xs font-semibold text-blue-300 tracking-wide uppercase mb-8"
            style={reveal(0)}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
            </span>
            {t("akas.heroLabel")}
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[4.2rem] font-bold text-white tracking-tight leading-[1.25] mb-6">
            <span className="block" style={reveal(0.1)}>
              {t("akas.heroTitle1")}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400" style={reveal(0.2)}>
              {t("akas.heroTitle2")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mb-10" style={reveal(0.3)}>
            {t("akas.heroDesc")}
          </p>

          {/* CTA */}
          <div style={reveal(0.4)}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:-translate-y-0.5"
            >
              {t("akas.heroButton")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6" style={reveal(0.5)}>
          {[
            { value: "200+", label: t("akas.statsSlides") },
            { value: "99.2%", label: t("akas.statsAccuracy") },
            { value: "50+", label: t("akas.statsCells") },
            { value: "<3 min", label: t("akas.statsTime") },
          ].map((stat, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative px-5 py-6 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] transition-colors duration-500">
                <div className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
