"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { ScanSearch, Brain, Ruler, FileCheck } from "lucide-react";

export default function EasyPathWorkflow() {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-advance steps
  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
  }, []);

  useEffect(() => {
    if (visible) startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [visible, startAutoplay]);

  const steps = [
    {
      icon: ScanSearch,
      num: "01",
      title: t("easypath.workflowStep1Title"),
      desc: t("easypath.workflowStep1Desc"),
      color: "purple",
      visual: (
        // Slide being scanned with a moving line
        <div className="relative w-full h-full bg-[#0c0520] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(168,85,247,0.06)_1px,transparent_0)] bg-[size:20px_20px]" />
          {/* Glass slide shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[55%] rounded-lg border border-purple-500/20 bg-purple-500/5">
            {/* Tissue sample area */}
            <div className="absolute top-[15%] left-[10%] w-[80%] h-[70%] rounded border border-purple-400/10 bg-purple-400/5">
              {/* Tissue regions */}
              <div className="absolute top-[10%] left-[15%] w-[35%] h-[40%] rounded-full bg-purple-300/8 border border-purple-400/10" />
              <div className="absolute top-[30%] left-[50%] w-[40%] h-[50%] rounded-full bg-violet-300/8 border border-violet-400/10" />
              <div className="absolute top-[55%] left-[10%] w-[30%] h-[35%] rounded-full bg-fuchsia-300/6 border border-fuchsia-400/10" />
            </div>
            {/* Scanning line */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div
                className="absolute top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-80"
                style={{ animation: "scanLine 3s ease-in-out infinite" }}
              />
            </div>
          </div>
          {/* Resolution indicator */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur border border-white/5">
            <span className="text-[10px] font-mono text-purple-400">40x Scanning...</span>
          </div>
          {/* Progress */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                style={{ animation: "progressBar 4s linear infinite" }}
              />
            </div>
            <span className="text-[9px] font-mono text-white/30 mt-1 block">Digitizing whole slide...</span>
          </div>
          <style>{`
            @keyframes scanLine {
              0%, 100% { left: 0%; }
              50% { left: 100%; }
            }
          `}</style>
        </div>
      ),
    },
    {
      icon: Brain,
      num: "02",
      title: t("easypath.workflowStep2Title"),
      desc: t("easypath.workflowStep2Desc"),
      color: "violet",
      visual: (
        // Tissue regions being highlighted with bounding boxes
        <div className="relative w-full h-full bg-[#0c0520] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />
          {/* Tissue background */}
          <div className="absolute top-[10%] left-[8%] w-[84%] h-[80%] rounded-lg bg-purple-900/10">
            {/* AI bounding boxes appearing */}
            {[
              { top: "10%", left: "8%", w: "35%", h: "30%", label: "Tumor", confidence: "97.3%", delay: "0s" },
              { top: "15%", left: "55%", w: "38%", h: "35%", label: "Stroma", confidence: "94.1%", delay: "0.5s" },
              { top: "52%", left: "12%", w: "40%", h: "38%", label: "Necrosis", confidence: "91.8%", delay: "1s" },
              { top: "58%", left: "58%", w: "32%", h: "30%", label: "Normal", confidence: "99.2%", delay: "1.5s" },
            ].map((box, i) => (
              <div
                key={i}
                className="absolute border-2 rounded"
                style={{
                  top: box.top,
                  left: box.left,
                  width: box.w,
                  height: box.h,
                  borderColor: i === 0 ? "rgba(239,68,68,0.5)" : i === 1 ? "rgba(168,85,247,0.5)" : i === 2 ? "rgba(251,191,36,0.5)" : "rgba(34,197,94,0.5)",
                  animation: `fadeInUp 0.6s ease ${box.delay} both`,
                }}
              >
                {/* Label */}
                <div
                  className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[8px] font-mono"
                  style={{
                    backgroundColor: i === 0 ? "rgba(239,68,68,0.2)" : i === 1 ? "rgba(168,85,247,0.2)" : i === 2 ? "rgba(251,191,36,0.2)" : "rgba(34,197,94,0.2)",
                    color: i === 0 ? "rgb(252,165,165)" : i === 1 ? "rgb(196,181,253)" : i === 2 ? "rgb(253,224,71)" : "rgb(134,239,172)",
                  }}
                >
                  {box.label} {box.confidence}
                </div>
              </div>
            ))}
          </div>
          {/* AI processing indicator */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur border border-white/5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono text-violet-400">AI Analyzing...</span>
          </div>
        </div>
      ),
    },
    {
      icon: Ruler,
      num: "03",
      title: t("easypath.workflowStep3Title"),
      desc: t("easypath.workflowStep3Desc"),
      color: "fuchsia",
      visual: (
        // Annotated pathology view with measurements
        <div className="relative w-full h-full bg-[#0c0520] rounded-xl overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.06),transparent_70%)]" />
          {/* Annotated tissue view */}
          <div className="relative h-full flex items-center justify-center">
            {/* Central tissue region */}
            <div className="relative w-[70%] h-[70%] rounded-lg border border-fuchsia-500/15 bg-fuchsia-500/5">
              {/* Annotation polygon (simulated with bordered shape) */}
              <div
                className="absolute top-[15%] left-[20%] w-[55%] h-[50%] border-2 border-dashed border-fuchsia-400/50 rounded-lg"
                style={{ animation: "fadeInUp 0.5s ease 0.2s both" }}
              >
                <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-[8px] font-mono text-fuchsia-300">
                  Region of Interest
                </div>
              </div>
              {/* Measurement line horizontal */}
              <div
                className="absolute top-[72%] left-[15%] w-[65%] flex items-center"
                style={{ animation: "fadeInUp 0.5s ease 0.6s both" }}
              >
                <div className="flex-1 h-[1px] bg-violet-400/60" />
                <span className="px-2 text-[9px] font-mono text-violet-300 whitespace-nowrap">2.4 mm</span>
                <div className="flex-1 h-[1px] bg-violet-400/60" />
              </div>
              {/* Measurement line vertical */}
              <div
                className="absolute top-[10%] left-[82%] h-[55%] flex flex-col items-center"
                style={{ animation: "fadeInUp 0.5s ease 0.9s both" }}
              >
                <div className="flex-1 w-[1px] bg-violet-400/60" />
                <span className="py-1 text-[9px] font-mono text-violet-300 whitespace-nowrap" style={{ writingMode: "vertical-rl" }}>1.8 mm</span>
                <div className="flex-1 w-[1px] bg-violet-400/60" />
              </div>
              {/* Pin markers */}
              {[
                { top: "25%", left: "35%", color: "fuchsia" },
                { top: "40%", left: "55%", color: "purple" },
                { top: "50%", left: "30%", color: "violet" },
              ].map((pin, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    top: pin.top,
                    left: pin.left,
                    borderColor: pin.color === "fuchsia" ? "rgba(217,70,239,0.7)" : pin.color === "purple" ? "rgba(168,85,247,0.7)" : "rgba(139,92,246,0.7)",
                    backgroundColor: pin.color === "fuchsia" ? "rgba(217,70,239,0.3)" : pin.color === "purple" ? "rgba(168,85,247,0.3)" : "rgba(139,92,246,0.3)",
                    animation: `fadeInUp 0.4s ease ${0.3 + i * 0.2}s both`,
                  }}
                />
              ))}
            </div>
          </div>
          {/* Tool indicator */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur border border-white/5">
            <span className="text-[10px] font-mono text-fuchsia-400">Annotation Mode</span>
          </div>
        </div>
      ),
    },
    {
      icon: FileCheck,
      num: "04",
      title: t("easypath.workflowStep4Title"),
      desc: t("easypath.workflowStep4Desc"),
      color: "pink",
      visual: (
        // Report mockup
        <div className="relative w-full h-full bg-[#0c0520] rounded-xl overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06),transparent_70%)]" />
          {/* Report mock */}
          <div className="relative h-full flex flex-col gap-3 justify-center">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                <FileCheck size={12} className="text-purple-400" />
              </div>
              <div>
                <div className="h-2 w-24 rounded bg-white/10" />
                <div className="h-1.5 w-16 rounded bg-white/5 mt-1" />
              </div>
            </div>
            {/* Report lines */}
            {[
              { label: "Case ID", value: "PATH-2024-1247", status: "" },
              { label: "Tissue Type", value: "Breast Biopsy", status: "" },
              { label: "Diagnosis", value: "Benign", status: "normal" },
              { label: "Slides Scanned", value: "12/12", status: "" },
              { label: "AI Confidence", value: "96.8%", status: "normal" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 border-b border-white/[0.04]"
                style={{ animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}
              >
                <span className="text-[10px] font-mono text-white/30">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/60">{row.value}</span>
                  {row.status === "normal" && (
                    <span className="text-[8px] font-mono text-purple-400 px-1.5 py-0.5 rounded bg-purple-400/10">Verified</span>
                  )}
                </div>
              </div>
            ))}
            {/* Sign button */}
            <div className="mt-2 flex justify-end">
              <div className="px-3 py-1 rounded bg-purple-500/20 border border-purple-500/30">
                <span className="text-[9px] font-mono text-purple-400">Archived & Signed</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-36 bg-[#080514] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:32px_32px]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-20 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-400/60 mb-4">
            {t("easypath.workflowLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {t("easypath.workflowTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Step list */}
          <div className="space-y-2">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;
              return (
                <button
                  key={i}
                  onClick={() => { setActiveStep(i); startAutoplay(); }}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-purple-400/20 bg-white/[0.04]"
                      : "border-transparent hover:border-white/[0.05] hover:bg-white/[0.02]"
                  }`}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateX(-30px)",
                    transition: `all 0.7s ease ${200 + i * 100}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Number + icon */}
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      isActive ? "bg-purple-500/20" : "bg-white/[0.03]"
                    }`}>
                      <Icon size={20} className={`transition-colors duration-500 ${isActive ? "text-violet-400" : "text-white/20"}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`font-mono text-xs transition-colors duration-500 ${isActive ? "text-violet-400/70" : "text-white/15"}`}>
                          {step.num}
                        </span>
                        <h3 className={`font-[family-name:var(--font-heading)] text-base font-bold transition-colors duration-500 ${
                          isActive ? "text-white" : "text-white/40"
                        }`}>
                          {step.title}
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed transition-all duration-500 ${
                        isActive ? "text-slate-400 max-h-40 opacity-100" : "text-white/20 max-h-0 opacity-0 overflow-hidden"
                      }`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {isActive && (
                    <div className="mt-4 ml-15 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                        style={{ animation: "progressBar 4s linear" }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Visual */}
          <div
            className="relative lg:sticky lg:top-28 h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-white/[0.06]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(30px)",
              transition: "all 0.7s ease 400ms",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-all duration-700"
                style={{
                  opacity: activeStep === i ? 1 : 0,
                  transform: activeStep === i ? "scale(1)" : "scale(0.95)",
                  pointerEvents: activeStep === i ? "auto" : "none",
                }}
              >
                {step.visual}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0%, 100% { left: 0%; }
          50% { left: 100%; }
        }
      `}</style>
    </section>
  );
}
