"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface SlideData {
  controlTitle: string;
  headlines: string[];
  description: string;
  image: string;
  imageAlt: string;
  href?: string;
}

interface Props {
  slides: SlideData[];
}

export default function ApplicationsSlider({ slides }: Props) {
  if (slides.length === 0) return null;
  const t = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentRef = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const AUTOPLAY_DELAY = 8000;

  /* ── Get line elements from a slide ── */
  const getSlideLines = useCallback((el: HTMLDivElement | null) => {
    if (!el) return { headLines: [] as Element[], descLines: [] as Element[], btn: null as Element | null };
    return {
      headLines: Array.from(el.querySelectorAll(".headline-line")),
      descLines: Array.from(el.querySelectorAll(".desc-line")),
      btn: el.querySelector(".slide-btn"),
    };
  }, []);

  /* ── Kill running animations and reset all slides ── */
  const killAndReset = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    // Kill all tweens on slide elements
    slideRefs.current.forEach((el) => {
      if (!el) return;
      gsap.killTweensOf(el);
      const parts = getSlideLines(el);
      gsap.killTweensOf([...parts.headLines, ...parts.descLines]);
      if (parts.btn) gsap.killTweensOf(parts.btn);
    });
    if (titleBarRef.current) gsap.killTweensOf(titleBarRef.current);
    if (imageRef.current) gsap.killTweensOf(imageRef.current);
  }, [getSlideLines]);

  /* ── Go to slide ── */
  const goTo = useCallback(
    (index: number) => {
      const prev = currentRef.current;
      if (index === prev) return;

      // Kill everything in-flight
      killAndReset();

      // Immediately settle old slide to hidden
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === prev) {
          gsap.set(el, { autoAlpha: 0 });
          const p = getSlideLines(el);
          gsap.set([...p.headLines, ...p.descLines], { clearProps: "all" });
          if (p.btn) gsap.set(p.btn, { clearProps: "all" });
        } else if (i !== index) {
          gsap.set(el, { autoAlpha: 0 });
        }
      });

      const newSlide = slideRefs.current[index];
      const newParts = getSlideLines(newSlide);

      // Set incoming slide initial state
      if (newSlide) {
        gsap.set(newSlide, { autoAlpha: 1, yPercent: 6 });
        gsap.set([...newParts.headLines, ...newParts.descLines], {
          opacity: 0, yPercent: 30, z: -120, rotateX: 10, filter: "blur(18px)",
        });
        if (newParts.btn) gsap.set(newParts.btn, { opacity: 0, yPercent: 35, filter: "blur(18px)" });
      }

      // Title bar crossfade
      const titleEl = titleBarRef.current;
      if (titleEl) {
        gsap.set(titleEl, { autoAlpha: 0, yPercent: 40 });
        titleEl.textContent = slides[index].controlTitle;
      }

      // Image crossfade
      const img = imageRef.current;
      if (img) {
        gsap.set(img, { autoAlpha: 0 });
        img.src = slides[index].image;
        img.alt = slides[index].imageAlt;
      }

      // Build animate-in timeline
      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Title bar fade in
      if (titleEl) {
        tl.to(titleEl, { autoAlpha: 1, yPercent: 0, duration: 0.32, ease: "power3.inOut" }, 0);
      }

      // Image fade in
      if (img) {
        tl.to(img, { autoAlpha: 1, duration: 0.34, ease: "power3.out" }, 0);
      }

      // Slide container fade in
      if (newSlide) {
        tl.to(newSlide, { autoAlpha: 1, yPercent: 0, duration: 0.32, ease: "power3.out" }, 0.12);
      }

      // Lines staggered in
      tl.to(
        [...newParts.headLines, ...newParts.descLines],
        {
          opacity: 1, yPercent: 0, z: 0, rotateX: 0, filter: "blur(0px)",
          stagger: 0.06, duration: 0.48, ease: "power3.out",
        },
        0.16
      );

      // Button in
      if (newParts.btn) {
        tl.to(newParts.btn, { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 0.34, ease: "power3.out" }, 0.22);
      }

      currentRef.current = index;
      setActiveIndex(index);
    },
    [killAndReset, getSlideLines]
  );

  const goNext = useCallback(() => {
    goTo((currentRef.current + 1) % slides.length);
  }, [goTo]);

  const goPrev = useCallback(() => {
    goTo((currentRef.current - 1 + slides.length) % slides.length);
  }, [goTo]);

  /* ── Autoplay ── */
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) { clearInterval(autoplayRef.current); autoplayRef.current = null; }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      goTo((currentRef.current + 1) % slides.length);
    }, AUTOPLAY_DELAY);
  }, [stopAutoplay, goTo]);

  const resetAutoplay = useCallback(() => {
    stopAutoplay();
    startAutoplay();
  }, [stopAutoplay, startAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  /* ── Init first slide ── */
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
    });
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:40px_40px]" />

      <div className="relative mx-auto px-5 sm:px-8">
        {/* Section headline — matching sample.html .middle_headline + .h2.spec.sided */}
        <div className="text-center mx-auto mb-[42px]">
          <h2 className="font-[family-name:var(--font-heading)] text-[2.5em] sm:text-[3.5em] lg:text-[3.9em] font-bold leading-[1] tracking-tight text-slate-900">
            <span className="block">{t("home.sliderTitle1")}</span>
            <span className="block">{t("home.sliderTitle2")}</span>
          </h2>
        </div>

        <div ref={sliderRef} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* ── Left: Text content ── */}
          <div className="lg:w-1/2">
            {/* Controls bar — matching sample.html */}
            <div className="inline-flex items-center justify-between gap-8 bg-[#e6e6e6] rounded-lg p-1.5 mb-[12em] w-[24em] max-w-full">
              <button
                onClick={() => { goPrev(); resetAutoplay(); }}
                className="w-9 h-9 shrink-0 rounded-lg bg-[#d9d9d9] flex items-center justify-center text-slate-600 hover:bg-[#c7c7c7] transition-all duration-[450ms] cursor-pointer"
                aria-label="Önceki"
              >
                <ChevronLeft size={16} />
              </button>

              <div
                ref={titleBarRef}
                className="text-[0.9em] font-medium text-slate-800 text-center"
              >
                {slides[0].controlTitle}
              </div>

              <button
                onClick={() => { goNext(); resetAutoplay(); }}
                className="w-9 h-9 shrink-0 rounded-lg bg-[#d9d9d9] flex items-center justify-center text-slate-600 hover:bg-[#c7c7c7] transition-all duration-[450ms] cursor-pointer"
                aria-label="Sonraki"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Slide contents */}
            <div className="relative min-h-[280px] sm:min-h-[260px]" style={{ perspective: "1200px" }}>
              {slides.map((slide, i) => (
                <div
                  key={i}
                  ref={(el) => { slideRefs.current[i] = el; }}
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                >
                  <div className="flex flex-col justify-center h-full">
                    <div className="mb-6 max-w-[46ch]">
                      {slide.headlines.map((line, j) => (
                        <div
                          key={j}
                          className="headline-line font-[family-name:var(--font-heading)] text-[2.3em] font-medium text-slate-900 leading-[1.1] tracking-[-0.01em]"
                          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", willChange: "opacity, transform, filter" }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>

                    <div className="mb-8 max-w-[36ch] mt-4">
                      {slide.description.split(". ").map((sentence, j, arr) => (
                        <div
                          key={j}
                          className="desc-line text-slate-500 leading-relaxed"
                          style={{ willChange: "opacity, transform, filter" }}
                        >
                          {sentence}{j < arr.length - 1 ? "." : ""}
                        </div>
                      ))}
                    </div>

                    <div className="slide-btn mt-7" style={{ willChange: "opacity, transform, filter" }}>
                      <Link
                        href={(slide.href || "/products") as "/products"}
                        className="group inline-flex flex-col border-2 border-black bg-black text-white rounded-[4px] px-3 pt-3 pb-2 text-[0.9em] transition-all duration-[450ms] hover:border-[#6d6d6d] overflow-hidden"
                      >
                        <span className="mb-3 mr-[12em]">{t("common.learnMore")}</span>
                        <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Thumbnails (vertical) + Main image ── */}
          <div className="lg:w-1/2 flex gap-3">
            {/* Vertical thumbnails */}
            <div className="hidden lg:flex flex-col gap-2 shrink-0">
              {slides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i); resetAutoplay(); }}
                  className={`relative w-[72px] h-[80px] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                    activeIndex === i
                      ? "ring-2 ring-blue-500 ring-offset-1 opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.controlTitle}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 h-[729px] rounded-2xl overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={slides[0].image}
                alt={slides[0].imageAlt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ willChange: "opacity" }}
              />
            </div>

            {/* Mobile thumbnails — horizontal */}
            <div className="lg:hidden absolute -bottom-2 left-0 right-0 flex gap-2 justify-center">
              {slides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i); resetAutoplay(); }}
                  className={`relative w-14 h-10 rounded-md overflow-hidden transition-all duration-300 cursor-pointer ${
                    activeIndex === i
                      ? "ring-2 ring-blue-500 ring-offset-1 opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.controlTitle}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
