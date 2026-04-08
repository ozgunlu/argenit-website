"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Tissue cell grid animation (canvas) ── */
function TissueCellGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;
    let raf = 0;
    let time = 0;

    // Cell grid parameters
    const cellSize = 38;
    const cells: {
      x: number; y: number;
      phase: number; highlighted: boolean;
      pulseSpeed: number;
    }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const populate = () => {
      cells.length = 0;
      const cols = Math.ceil(w / cellSize) + 2;
      const rows = Math.ceil(h / cellSize) + 2;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Offset every other row for hex-like pattern
          const offsetX = row % 2 === 0 ? 0 : cellSize * 0.5;
          cells.push({
            x: col * cellSize + offsetX,
            y: row * cellSize * 0.87,
            phase: Math.random() * Math.PI * 2,
            highlighted: Math.random() < 0.03, // ~3% cells are AI-detected
            pulseSpeed: 0.5 + Math.random() * 1.5,
          });
        }
      }
    };

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, w, h);

      // Draw grid lines (faint pathology-style)
      ctx.strokeStyle = "rgba(168, 85, 247, 0.03)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += cellSize * 0.87) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw cells
      for (const cell of cells) {
        const pulse = Math.sin(time * cell.pulseSpeed + cell.phase);
        const shift = pulse * 1.2;

        if (cell.highlighted) {
          // AI-detected cell: purple glow
          const glowIntensity = 0.15 + pulse * 0.1;
          const radius = 10 + pulse * 2;

          // Glow
          const grad = ctx.createRadialGradient(
            cell.x + shift, cell.y + shift, 0,
            cell.x + shift, cell.y + shift, radius * 2
          );
          grad.addColorStop(0, `rgba(168, 85, 247, ${glowIntensity})`);
          grad.addColorStop(0.5, `rgba(139, 92, 246, ${glowIntensity * 0.4})`);
          grad.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cell.x + shift, cell.y + shift, radius * 2, 0, Math.PI * 2);
          ctx.fill();

          // Cell body
          ctx.fillStyle = `rgba(168, 85, 247, ${0.2 + pulse * 0.1})`;
          ctx.beginPath();
          ctx.arc(cell.x + shift, cell.y + shift, radius * 0.6, 0, Math.PI * 2);
          ctx.fill();

          // Detection ring
          ctx.strokeStyle = `rgba(192, 132, 252, ${0.3 + pulse * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cell.x + shift, cell.y + shift, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Normal tissue cell: subtle hexagonal shape
          const alpha = 0.025 + pulse * 0.01;
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.beginPath();
          const r = cellSize * 0.22;
          for (let a = 0; a < 6; a++) {
            const angle = (Math.PI / 3) * a - Math.PI / 6;
            const px = cell.x + shift + r * Math.cos(angle);
            const py = cell.y + shift + r * Math.sin(angle);
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(animate);
    };

    resize();
    populate();
    animate();

    const handleResize = () => { resize(); populate(); };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function EasyPathHero() {
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
    <section className="relative min-h-[90vh] flex items-center bg-[#080514] overflow-hidden">
      {/* Background layers */}
      <TissueCellGrid />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080514] via-[#080514]/40 to-[#080514]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080514] via-transparent to-[#080514]/80" />

      {/* Accent glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-[120px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:48px_48px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 lg:py-40 w-full">
        <div className="max-w-3xl">
          {/* Label */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-500/10 backdrop-blur-md text-xs font-semibold text-purple-300 tracking-wide uppercase mb-8"
            style={reveal(0)}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400" />
            </span>
            {t("easypath.heroLabel")}
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[4.2rem] font-bold text-white tracking-tight leading-[1.25] mb-6">
            <span className="block" style={reveal(0.1)}>
              {t("easypath.heroTitle1")}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400" style={reveal(0.2)}>
              {t("easypath.heroTitle2")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mb-10" style={reveal(0.3)}>
            {t("easypath.heroDesc")}
          </p>

          {/* CTA */}
          <div style={reveal(0.4)}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-0.5"
            >
              {t("easypath.heroButton")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6" style={reveal(0.5)}>
          {[
            { value: "1000+", label: t("easypath.statsSlides") },
            { value: "0.25\u00b5m", label: t("easypath.statsResolution") },
            { value: "40+", label: t("easypath.statsAI") },
            { value: "<60s", label: t("easypath.statsSpeed") },
          ].map((stat, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
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
