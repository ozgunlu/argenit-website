"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { ScanLine, BrainCircuit, Link2 } from "lucide-react";

export default function EasyPathOverview() {
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

  const highlights = [
    {
      icon: ScanLine,
      title: t("easypath.overviewHighlight1"),
      desc: t("easypath.overviewHighlight1Desc"),
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: BrainCircuit,
      title: t("easypath.overviewHighlight2"),
      desc: t("easypath.overviewHighlight2Desc"),
      gradient: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: Link2,
      title: t("easypath.overviewHighlight3"),
      desc: t("easypath.overviewHighlight3Desc"),
      gradient: "from-fuchsia-500 to-pink-500",
    },
  ];

  return (
    <section ref={ref} className="relative py-28 lg:py-36 bg-white overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(233,213,255,0.3),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="max-w-3xl mb-16 lg:mb-20 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-purple-500/60 mb-4">
            {t("easypath.overviewLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            {t("easypath.overviewTitle")}
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
            {t("easypath.overviewDesc")}
          </p>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative transition-all duration-700"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(40px)",
                  transitionDelay: `${300 + i * 150}ms`,
                }}
              >
                <div className="relative h-full p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-500">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>

                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
