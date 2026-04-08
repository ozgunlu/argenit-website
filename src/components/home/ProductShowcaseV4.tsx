"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * V4 — Horizontal scroll cards (full-width)
 * Large cards scroll horizontally, each with a colored accent bar on top.
 * Dark theme, immersive, snap-scroll on mobile.
 */

const panels = [
  { titleKey: "home.showcase1Title", descKey: "home.showcase1Desc", num: "01", accentFrom: "from-blue-500", accentTo: "to-blue-600", href: "/solutions/akas" as const },
  { titleKey: "home.showcase2Title", descKey: "home.showcase2Desc", num: "02", accentFrom: "from-cyan-500", accentTo: "to-teal-500", href: "/solutions/easyfish" as const },
  { titleKey: "home.showcase3Title", descKey: "home.showcase3Desc", num: "03", accentFrom: "from-indigo-500", accentTo: "to-blue-500", href: "/solutions/easypath" as const },
  { titleKey: "home.showcase4Title", descKey: "home.showcase4Desc", num: "04", accentFrom: "from-slate-400", accentTo: "to-slate-500", href: "/solutions/lis" as const },
];

export default function ProductShowcaseV4() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
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
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:40px_40px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[150px]" />

      {/* Header */}
      <div
        className="relative max-w-7xl mx-auto px-5 sm:px-8 mb-14 lg:mb-20 transition-all duration-1000"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/60 mb-4">
              {t("home.showcaseTitle1")}
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              {t("home.showcaseTitle2")}
            </h2>
          </div>
          {/* Scroll hint */}
          <p className="font-mono text-xs text-white/20 tracking-wider hidden lg:block">
            SCROLL →
          </p>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="relative flex gap-5 overflow-x-auto snap-x snap-mandatory px-5 sm:px-8 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {panels.map((panel, i) => (
          <Link
            key={i}
            href={panel.href}
            className="group snap-start shrink-0 w-[85vw] sm:w-[60vw] lg:w-[380px] transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(60px)",
              transitionDelay: `${300 + i * 120}ms`,
            }}
          >
            <div className="relative h-full rounded-xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-500">
              {/* Top accent bar */}
              <div className={`h-1 bg-gradient-to-r ${panel.accentFrom} ${panel.accentTo} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="p-8 sm:p-10">
                {/* Number */}
                <span className="font-mono text-5xl font-bold text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500 block mb-8">
                  {panel.num}
                </span>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-white/80 group-hover:text-white leading-tight mb-4 transition-colors duration-500">
                  {t(panel.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/30 group-hover:text-white/50 leading-relaxed transition-colors duration-500 mb-6">
                  {t(panel.descKey)}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-xs font-semibold text-white/20 group-hover:text-cyan-400/70 transition-colors duration-500">
                  <span>{t("common.learnMore")}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        ))}
        {/* Spacer for scroll end */}
        <div className="shrink-0 w-5 sm:w-8 lg:w-1" />
      </div>
    </section>
  );
}
