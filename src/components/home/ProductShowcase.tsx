"use client";

import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

const panels = [
  { titleKey: "home.showcase1Title", descKey: "home.showcase1Desc", num: "01" },
  { titleKey: "home.showcase2Title", descKey: "home.showcase2Desc", num: "02" },
  { titleKey: "home.showcase3Title", descKey: "home.showcase3Desc", num: "03" },
  { titleKey: "home.showcase4Title", descKey: "home.showcase4Desc", num: "04" },
];

export default function ProductShowcase() {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-36 bg-[#050a18] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:32px_32px]" />
      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="mb-16 lg:mb-24 transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400/70 mb-4">
            {t("home.showcaseTitle1")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            {t("home.showcaseTitle2")}
          </h2>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-blue-500 to-cyan-500" />
        </div>

        {/* Items */}
        <div className="space-y-0">
          {panels.map((panel, i) => (
            <div
              key={i}
              className="group relative transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${200 + i * 150}ms`,
              }}
            >
              {/* Top border line */}
              <div className="h-px bg-white/[0.06] group-hover:bg-white/[0.12] transition-colors duration-500" />

              <div className="relative py-8 sm:py-10 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 lg:gap-12">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

                {/* Number */}
                <span className="relative font-mono text-sm text-white/20 group-hover:text-cyan-400/50 transition-colors duration-500 shrink-0 pt-1">
                  {panel.num}
                </span>

                {/* Title */}
                <h3 className="relative font-[family-name:var(--font-heading)] text-xl sm:text-2xl lg:text-3xl font-bold text-white/80 group-hover:text-white transition-colors duration-500 leading-tight sm:w-1/2 lg:w-5/12 shrink-0">
                  {t(panel.titleKey)}
                </h3>

                {/* Description */}
                <p className="relative text-sm sm:text-base text-white/30 group-hover:text-white/50 transition-colors duration-500 leading-relaxed sm:flex-1">
                  {t(panel.descKey)}
                </p>

                {/* Arrow indicator */}
                <div className="hidden lg:flex items-center shrink-0 pt-2">
                  <svg
                    className="w-5 h-5 text-white/10 group-hover:text-cyan-400/60 group-hover:translate-x-1 transition-all duration-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          {/* Bottom border */}
          <div className="h-px bg-white/[0.06]" />
        </div>
      </div>
    </section>
  );
}
