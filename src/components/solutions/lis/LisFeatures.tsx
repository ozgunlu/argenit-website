"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import {
  ScanBarcode,
  Route,
  BarChart3,
  Plug,
  FileSignature,
  ShieldCheck,
} from "lucide-react";

export default function LisFeatures() {
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
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const features = [
    {
      icon: ScanBarcode,
      title: t("lis.feature1Title"),
      desc: t("lis.feature1Desc"),
    },
    {
      icon: Route,
      title: t("lis.feature2Title"),
      desc: t("lis.feature2Desc"),
    },
    {
      icon: BarChart3,
      title: t("lis.feature3Title"),
      desc: t("lis.feature3Desc"),
    },
    {
      icon: Plug,
      title: t("lis.feature4Title"),
      desc: t("lis.feature4Desc"),
    },
    {
      icon: FileSignature,
      title: t("lis.feature5Title"),
      desc: t("lis.feature5Desc"),
    },
    {
      icon: ShieldCheck,
      title: t("lis.feature6Title"),
      desc: t("lis.feature6Desc"),
    },
  ];

  return (
    <section ref={ref} className="relative py-28 lg:py-36 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(254,243,199,0.2),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-20 transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(30px)",
          }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-500/60 mb-4">
            {t("lis.featuresLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            {t("lis.featuresTitle")}
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative transition-all duration-700"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(30px)",
                  transitionDelay: `${200 + i * 100}ms`,
                }}
              >
                <div className="relative h-full p-7 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-500">
                  {/* Hover gradient top */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Number */}
                  <span className="absolute top-5 right-6 font-mono text-[4rem] font-bold text-slate-50 leading-none select-none group-hover:text-amber-50 transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="relative w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center mb-5 transition-colors duration-500">
                    <Icon
                      size={20}
                      className="text-slate-400 group-hover:text-amber-500 transition-colors duration-500"
                    />
                  </div>

                  {/* Text */}
                  <h3 className="relative font-[family-name:var(--font-heading)] text-base font-bold text-slate-900 mb-2.5 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="relative text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
