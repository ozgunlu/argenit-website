"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Fluorescence signal field — DAPI blue nuclei with FITC green & Texas Red dots ── */
function FluorescenceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let raf = 0;

    interface Nucleus {
      x: number; y: number;
      rx: number; ry: number;
      rotation: number;
      signals: { ox: number; oy: number; color: string; glow: string; pulseOffset: number }[];
      drift: number;
    }

    let nuclei: Nucleus[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const populate = () => {
      nuclei = [];
      const count = Math.floor((w * h) / 25000);
      for (let i = 0; i < count; i++) {
        const rx = 18 + Math.random() * 16;
        const ry = rx * (0.8 + Math.random() * 0.4);
        const signals: Nucleus["signals"] = [];

        // 2-4 FITC (green) signals
        const fitcCount = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < fitcCount; j++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * rx * 0.6;
          signals.push({
            ox: Math.cos(angle) * dist,
            oy: Math.sin(angle) * dist,
            color: "rgba(0, 255, 60, 0.9)",
            glow: "#00ff3c",
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }

        // 1-3 Texas Red signals
        const txCount = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < txCount; j++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * rx * 0.6;
          signals.push({
            ox: Math.cos(angle) * dist,
            oy: Math.sin(angle) * dist,
            color: "rgba(255, 30, 60, 0.9)",
            glow: "#ff1e3c",
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }

        nuclei.push({
          x: Math.random() * w,
          y: Math.random() * h,
          rx, ry,
          rotation: Math.random() * Math.PI,
          signals,
          drift: Math.random() * Math.PI * 2,
        });
      }
    };

    let time = 0;
    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, w, h);

      for (const nuc of nuclei) {
        const nx = nuc.x + Math.sin(time * 0.3 + nuc.drift) * 1.5;
        const ny = nuc.y + Math.cos(time * 0.2 + nuc.drift) * 1;

        // DAPI nucleus (blue ellipse)
        ctx.save();
        ctx.translate(nx, ny);
        ctx.rotate(nuc.rotation);

        // Outer glow
        const nucGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, nuc.rx * 1.3);
        nucGrad.addColorStop(0, "rgba(25, 40, 140, 0.15)");
        nucGrad.addColorStop(0.6, "rgba(20, 30, 100, 0.08)");
        nucGrad.addColorStop(1, "transparent");
        ctx.fillStyle = nucGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, nuc.rx * 1.3, nuc.ry * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nucleus body
        const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, nuc.rx);
        bodyGrad.addColorStop(0, "rgba(40, 60, 180, 0.18)");
        bodyGrad.addColorStop(0.5, "rgba(30, 45, 150, 0.12)");
        bodyGrad.addColorStop(1, "rgba(20, 30, 120, 0.04)");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, nuc.rx, nuc.ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = "rgba(60, 80, 200, 0.08)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Fluorescent signals
        for (const sig of nuc.signals) {
          const pulse = 0.7 + Math.sin(time * 2.5 + sig.pulseOffset) * 0.3;
          const r = 2.5 * pulse;

          // Outer glow
          ctx.shadowColor = sig.glow;
          ctx.shadowBlur = 12 * pulse;
          ctx.fillStyle = sig.color;
          ctx.beginPath();
          ctx.arc(sig.ox, sig.oy, r, 0, Math.PI * 2);
          ctx.fill();

          // Bright core
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.beginPath();
          ctx.arc(sig.ox, sig.oy, r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      raf = requestAnimationFrame(animate);
    };

    resize();
    populate();
    animate();

    const onResize = () => { resize(); populate(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function EasyFishHero() {
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
    <section className="relative min-h-[90vh] flex items-center bg-[#030812] overflow-hidden">
      {/* Background layers */}
      <FluorescenceField />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030812] via-[#030812]/30 to-[#030812]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030812] via-transparent to-[#030812]/80" />

      {/* Colored glows */}
      <div className="absolute top-1/3 left-[20%] w-[400px] h-[400px] bg-emerald-500/6 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-rose-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 lg:py-40 w-full">
        <div className="max-w-3xl">
          {/* Label */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-md text-xs font-semibold text-emerald-300 tracking-wide uppercase mb-8"
            style={reveal(0)}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {t("easyfish.heroLabel")}
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[4.2rem] font-bold text-white tracking-tight leading-[1.25] mb-6">
            <span className="block" style={reveal(0.1)}>
              {t("easyfish.heroTitle1")}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" style={reveal(0.2)}>
              {t("easyfish.heroTitle2")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mb-10" style={reveal(0.3)}>
            {t("easyfish.heroDesc")}
          </p>

          {/* CTA */}
          <div style={reveal(0.4)}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
            >
              {t("easyfish.heroButton")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6" style={reveal(0.5)}>
          {[
            { value: "20+", label: t("easyfish.statsProbes") },
            { value: "500+", label: t("easyfish.statsNuclei") },
            { value: "98.7%", label: t("easyfish.statsAccuracy") },
            { value: "Auto", label: t("easyfish.statsRatio") },
          ].map((stat, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
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
