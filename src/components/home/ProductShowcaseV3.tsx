"use client";

import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

/**
 * V3 — Full-width alternating rows
 * Large typography, each item takes full width with alternating alignment.
 * Clean, editorial-style with accent line + stagger reveal.
 */

const panels = [
  { titleKey: "home.showcase1Title", descKey: "home.showcase1Desc", num: "01" },
  { titleKey: "home.showcase2Title", descKey: "home.showcase2Desc", num: "02" },
  { titleKey: "home.showcase3Title", descKey: "home.showcase3Desc", num: "03" },
  { titleKey: "home.showcase4Title", descKey: "home.showcase4Desc", num: "04" },
];

export default function ProductShowcaseV3() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-28 lg:py-36 bg-white overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(219,234,254,0.3),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header — left aligned */}
        <div
          className="mb-20 lg:mb-28 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-500/60 mb-4">
            {t("home.showcaseTitle1")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-slate-900 leading-[1.05] max-w-2xl">
            {t("home.showcaseTitle2")}
          </h2>
        </div>

        {/* Items — alternating layout */}
        <div className="space-y-16 lg:space-y-0">
          {panels.map((panel, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className="transition-all duration-700 lg:flex lg:items-start lg:gap-16"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : `translateX(${isEven ? "-40px" : "40px"})`,
                  transitionDelay: `${300 + i * 150}ms`,
                }}
              >
                {/* Number side */}
                <div className={`lg:w-1/2 ${isEven ? "" : "lg:order-2"} mb-4 lg:mb-0 lg:py-12`}>
                  <div className={`flex items-start gap-6 ${isEven ? "" : "lg:justify-end"}`}>
                    <span className="font-[family-name:var(--font-heading)] text-[5rem] sm:text-[7rem] lg:text-[9rem] font-bold leading-none text-slate-100 select-none">
                      {panel.num}
                    </span>
                  </div>
                </div>

                {/* Content side */}
                <div className={`lg:w-1/2 ${isEven ? "" : "lg:order-1"} lg:py-12`}>
                  <div className={`relative ${isEven ? "lg:pl-12" : "lg:pr-12"}`}>
                    {/* Accent line */}
                    <div className={`absolute top-0 ${isEven ? "left-0" : "right-0"} w-px h-full bg-gradient-to-b from-blue-500 via-cyan-500 to-transparent hidden lg:block`} />

                    <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                      {t(panel.titleKey)}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg">
                      {t(panel.descKey)}
                    </p>
                  </div>
                </div>

                {/* Divider between items */}
                {i < panels.length - 1 && (
                  <div className="hidden lg:block absolute left-0 right-0">
                    <div className="max-w-7xl mx-auto px-8">
                      <div className="h-px bg-slate-100" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
