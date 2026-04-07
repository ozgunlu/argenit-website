"use client";

import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

/**
 * V2 — Bento Grid
 * Asymmetric grid: first item spans 2 columns, rest fill remaining space.
 * Full-width, dark bg, frosted glass cards with gradient borders.
 */

const panels = [
  { titleKey: "home.showcase1Title", descKey: "home.showcase1Desc", num: "01", span: "sm:col-span-2 sm:row-span-2" },
  { titleKey: "home.showcase2Title", descKey: "home.showcase2Desc", num: "02", span: "" },
  { titleKey: "home.showcase3Title", descKey: "home.showcase3Desc", num: "03", span: "" },
  { titleKey: "home.showcase4Title", descKey: "home.showcase4Desc", num: "04", span: "sm:col-span-2" },
];

export default function ProductShowcaseV2() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-28 lg:py-36 bg-[#050a18] overflow-hidden">
      {/* Mesh gradient bg */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-20 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/60 mb-5">
            {t("home.showcaseTitle1")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            {t("home.showcaseTitle2")}
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[minmax(200px,auto)]">
          {panels.map((panel, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-700 ${panel.span}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(40px) scale(0.97)",
                transitionDelay: `${200 + i * 120}ms`,
              }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-px">
                <div className="w-full h-full rounded-2xl bg-[#0a1025]" />
              </div>

              {/* Hover gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-px opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-full h-full rounded-2xl bg-[#0a1025]" />
              </div>

              {/* Content */}
              <div className="relative p-6 sm:p-8 h-full flex flex-col justify-between z-10">
                {/* Top row: number + decorative dots */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-white/20 group-hover:text-cyan-400/50 transition-colors duration-500">
                    {panel.num}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-400/60 transition-colors" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400/50 transition-colors" />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold text-white/80 group-hover:text-white leading-tight mb-3 transition-colors duration-500">
                    {t(panel.titleKey)}
                  </h3>
                  <p className="text-sm text-white/25 group-hover:text-white/45 leading-relaxed transition-colors duration-500">
                    {t(panel.descKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
