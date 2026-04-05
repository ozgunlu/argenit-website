"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface SlideItem {
  labelKey: string;
  height: string;
  image?: string;
  video?: string;
}

const slides: SlideItem[] = [
  {
    labelKey: "home.heroLabel1",
    video: "/cytogenetics.mp4",
    height: "h-[320px] sm:h-[400px] lg:h-[46vh]",
  },
  {
    labelKey: "home.heroLabel2",
    video: "/digital-pathology.mp4",
    height: "h-[270px] sm:h-[340px] lg:h-[38vh]",
  },
  {
    labelKey: "home.heroLabel3",
    video: "/fish.mp4",
    height: "h-[370px] sm:h-[460px] lg:h-[54vh]",
  },
  {
    labelKey: "home.heroLabel4",
    video: "/karyotyping.mp4",
    height: "h-[420px] sm:h-[520px] lg:h-[62vh]",
  },
];

export default function HeroExperience() {
  const t = useTranslations();
  return (
    <section className="relative h-screen bg-white overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:32px_32px]" />

      {/* ── Lines with labels at top — starts at 150px ── */}
      <div className="absolute top-[120px] left-0 right-0 bottom-0 flex justify-center gap-[2px] sm:gap-1 pointer-events-none">
        {slides.map((slide, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="font-[family-name:var(--font-heading)] text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-[0.15em] mb-2 shrink-0">
              {t(slide.labelKey)}
            </span>
            <div className="w-px flex-1 bg-slate-200" />
          </div>
        ))}
      </div>

      {/* ── Images — absolute, pinned to bottom, full width ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-1 sm:gap-2 lg:gap-3 px-1 sm:px-2 lg:px-3">
        {slides.map((slide, i) => (
          <div key={i} className="flex-1">
            <div className={`relative w-full ${slide.height} overflow-hidden`}>
              {slide.video ? (
                <video
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={slide.image!}
                  alt={t(slide.labelKey)}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Text — left aligned, on top ── */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-[6.5%] pt-24 sm:pt-26 lg:pt-28">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
          <span className="text-slate-900/80">{t("home.heroTitle")}</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600/80 to-cyan-500/80">{t("home.heroTitleAccent")}</span>
        </h1>
        <p className="mt-6 text-sm sm:text-base text-slate-500 leading-relaxed max-w-md">
          {t("home.heroSubtitle")}
        </p>
      </div>
    </section>
  );
}
