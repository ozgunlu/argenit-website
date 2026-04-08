"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Network / data-flow canvas animation ── */
function NetworkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0,
      h = 0;
    let raf = 0;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      type: "instrument" | "workstation" | "database";
      pulsePhase: number;
      pulseSpeed: number;
    }

    interface Particle {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
      size: number;
    }

    const nodes: Node[] = [];
    const particles: Particle[] = [];
    const connections: [number, number][] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const populate = () => {
      nodes.length = 0;
      particles.length = 0;
      connections.length = 0;

      const count = Math.max(12, Math.floor((w * h) / 40000));
      const types: ("instrument" | "workstation" | "database")[] = [
        "instrument",
        "workstation",
        "database",
      ];

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: 40 + Math.random() * (w - 80),
          y: 40 + Math.random() * (h - 80),
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: 3 + Math.random() * 4,
          type: types[Math.floor(Math.random() * types.length)],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }

      // Build connections between nearby nodes
      const maxDist = Math.min(w, h) * 0.35;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist && Math.random() < 0.4) {
            connections.push([i, j]);
          }
        }
      }

      // Spawn flowing particles on connections
      for (let c = 0; c < connections.length; c++) {
        if (Math.random() < 0.6) {
          particles.push({
            fromIdx: connections[c][0],
            toIdx: connections[c][1],
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.004,
            size: 1.5 + Math.random() * 1.5,
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Update node positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulsePhase += n.pulseSpeed;
        if (n.x < 20 || n.x > w - 20) n.vx *= -1;
        if (n.y < 20 || n.y > h - 20) n.vy *= -1;
      }

      // Draw connections
      for (const [i, j] of connections) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(w, h) * 0.35;
        const alpha = Math.max(0, 1 - dist / maxDist) * 0.12;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw particles flowing along connections
      for (const p of particles) {
        const a = nodes[p.fromIdx];
        const b = nodes[p.toIdx];
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          // Reverse direction
          const tmp = p.fromIdx;
          p.fromIdx = p.toIdx;
          p.toIdx = tmp;
        }
        const x = a.x + (b.x - a.x) * p.progress;
        const y = a.y + (b.y - a.y) * p.progress;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${0.5 + Math.sin(p.progress * Math.PI) * 0.4})`;
        ctx.fill();
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = Math.sin(n.pulsePhase) * 0.3 + 0.7;

        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${0.04 * pulse})`;
        ctx.fill();

        // Node body
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        if (n.type === "instrument") {
          ctx.fillStyle = `rgba(245, 158, 11, ${0.3 * pulse})`;
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 * pulse})`;
        } else if (n.type === "workstation") {
          ctx.fillStyle = `rgba(251, 146, 60, ${0.3 * pulse})`;
          ctx.strokeStyle = `rgba(251, 146, 60, ${0.4 * pulse})`;
        } else {
          ctx.fillStyle = `rgba(250, 204, 21, ${0.25 * pulse})`;
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.35 * pulse})`;
        }

        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }

      raf = requestAnimationFrame(animate);
    };

    resize();
    populate();
    animate();

    const handleResize = () => {
      resize();
      populate();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function LisHero() {
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
    <section className="relative min-h-[90vh] flex items-center bg-[#0a0804] overflow-hidden">
      {/* Background layers */}
      <NetworkField />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0804] via-[#0a0804]/40 to-[#0a0804]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0804] via-transparent to-[#0a0804]/80" />

      {/* Accent glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-orange-500/6 rounded-full blur-[120px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:48px_48px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 lg:py-40 w-full">
        <div className="max-w-3xl">
          {/* Label */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/20 bg-amber-500/10 backdrop-blur-md text-xs font-semibold text-amber-300 tracking-wide uppercase mb-8"
            style={reveal(0)}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            {t("lis.heroLabel")}
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[4.2rem] font-bold text-white tracking-tight leading-[1.25] mb-6">
            <span className="block" style={reveal(0.1)}>
              {t("lis.heroTitle1")}
            </span>
            <span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400"
              style={reveal(0.2)}
            >
              {t("lis.heroTitle2")}
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mb-10"
            style={reveal(0.3)}
          >
            {t("lis.heroDesc")}
          </p>

          {/* CTA */}
          <div style={reveal(0.4)}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:-translate-y-0.5"
            >
              {t("lis.heroButton")}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6"
          style={reveal(0.5)}
        >
          {[
            { value: "12+", label: t("lis.statsModules") },
            { value: "99.9%", label: t("lis.statsUptime") },
            { value: "HL7/DICOM", label: t("lis.statsIntegrations") },
            { value: "\u221E", label: t("lis.statsUsers") },
          ].map((stat, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative px-5 py-6 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] transition-colors duration-500">
                <div className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
