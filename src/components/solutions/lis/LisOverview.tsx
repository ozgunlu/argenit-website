"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { Network, Shield, Zap } from "lucide-react";

export default function LisOverview() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const highlights = [
    {
      icon: Network,
      title: t("lis.overviewHighlight1"),
      desc: t("lis.overviewHighlight1Desc"),
      gradient: "from-amber-500 to-amber-600",
    },
    {
      icon: Shield,
      title: t("lis.overviewHighlight2"),
      desc: t("lis.overviewHighlight2Desc"),
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: t("lis.overviewHighlight3"),
      desc: t("lis.overviewHighlight3Desc"),
      gradient: "from-yellow-500 to-amber-500",
    },
  ];

  return (
    <section ref={ref} className="relative py-28 lg:py-36 bg-white overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(254,243,199,0.3),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="max-w-3xl mb-16 lg:mb-20 transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(30px)",
          }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-500/60 mb-4">
            {t("lis.overviewLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            {t("lis.overviewTitle")}
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
            {t("lis.overviewDesc")}
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
                <div className="relative h-full p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-500">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>

                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Bottom accent */}
                  <div
                    className={`absolute bottom-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
