"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { ScanSearch, Microscope, Cpu, FileCheck } from "lucide-react";

export default function AkasWorkflow() {
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
      title: t("akas.workflowStep1Title"),
      desc: t("akas.workflowStep1Desc"),
      color: "blue",
      visual: (
        // Animated slide scanning visualization
        <div className="relative w-full h-full bg-[#0a1025] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.06)_1px,transparent_0)] bg-[size:20px_20px]" />
          {/* Slide shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] rounded-lg border border-blue-500/20 bg-blue-500/5">
            {/* Scanning line */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div
                className="absolute top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-80"
                style={{ animation: "scanLine 3s ease-in-out infinite" }}
              />
            </div>
            {/* Detected metaphases */}
            {[
              { top: "20%", left: "25%" },
              { top: "55%", left: "40%" },
              { top: "30%", left: "70%" },
              { top: "65%", left: "20%" },
              { top: "45%", left: "60%" },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full border border-cyan-400/50 animate-pulse"
                style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.4}s` }}
              >
                <div className="absolute inset-0.5 rounded-full bg-cyan-400/30" />
              </div>
            ))}
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
      icon: Microscope,
      num: "02",
      title: t("akas.workflowStep2Title"),
      desc: t("akas.workflowStep2Desc"),
      color: "cyan",
      visual: (
        // Metaphase detection visualization
        <div className="relative w-full h-full bg-[#0a1025] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)]" />
          {/* Metaphase cell */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Chromosome pairs scattered */}
            {Array.from({ length: 23 }).map((_, i) => {
              const angle = (i / 23) * Math.PI * 2;
              const r = 40 + Math.random() * 30;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              const rot = Math.random() * 180;
              return (
                <div
                  key={i}
                  className="absolute w-[3px] rounded-full bg-cyan-400/60"
                  style={{
                    height: `${8 + Math.random() * 10}px`,
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `rotate(${rot}deg)`,
                    animation: `pulse ${2 + Math.random()}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              );
            })}
            {/* Focus ring */}
            <div className="absolute -inset-20 rounded-full border border-cyan-500/20 animate-[ping_3s_ease-in-out_infinite]" />
            <div className="absolute -inset-12 rounded-full border border-cyan-500/30" />
          </div>
          {/* Quality score */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400">Quality: A+</span>
          </div>
        </div>
      ),
    },
    {
      icon: Cpu,
      num: "03",
      title: t("akas.workflowStep3Title"),
      desc: t("akas.workflowStep3Desc"),
      color: "teal",
      visual: (
        // Karyotype assembly visualization
        <div className="relative w-full h-full bg-[#0a1025] rounded-xl overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.06),transparent_70%)]" />
          {/* Karyotype grid */}
          <div className="relative h-full flex flex-col justify-center gap-2">
            {/* Group A-G representation */}
            {[
              { label: "A", count: 3, color: "teal" },
              { label: "B", count: 2, color: "teal" },
              { label: "C", count: 7, color: "cyan" },
              { label: "D", count: 3, color: "blue" },
              { label: "E", count: 3, color: "blue" },
              { label: "F", count: 2, color: "cyan" },
              { label: "G+Sex", count: 3, color: "teal" },
            ].map((group, gi) => (
              <div key={gi} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-white/20 w-8">{group.label}</span>
                <div className="flex gap-1">
                  {Array.from({ length: group.count }).map((_, ci) => (
                    <div key={ci} className="flex gap-[2px]">
                      <div
                        className={`w-[4px] rounded-sm bg-${group.color}-400/50`}
                        style={{
                          height: `${14 - gi}px`,
                          animation: `fadeInUp 0.5s ease ${(gi * group.count + ci) * 0.03}s both`,
                        }}
                      />
                      <div
                        className={`w-[4px] rounded-sm bg-${group.color}-400/35`}
                        style={{
                          height: `${14 - gi}px`,
                          animation: `fadeInUp 0.5s ease ${(gi * group.count + ci) * 0.03 + 0.02}s both`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Result badge */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
            <span className="text-[10px] font-mono text-teal-400">46,XX — Normal</span>
          </div>
        </div>
      ),
    },
    {
      icon: FileCheck,
      num: "04",
      title: t("akas.workflowStep4Title"),
      desc: t("akas.workflowStep4Desc"),
      color: "emerald",
      visual: (
        // Report visualization
        <div className="relative w-full h-full bg-[#0a1025] rounded-xl overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)]" />
          {/* Report mock */}
          <div className="relative h-full flex flex-col gap-3 justify-center">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                <FileCheck size={12} className="text-emerald-400" />
              </div>
              <div>
                <div className="h-2 w-24 rounded bg-white/10" />
                <div className="h-1.5 w-16 rounded bg-white/5 mt-1" />
              </div>
            </div>
            {/* Report lines */}
            {[
              { label: "Patient", value: "ID-2024-847", status: "" },
              { label: "Karyotype", value: "46,XX", status: "normal" },
              { label: "Cells Analyzed", value: "20/20", status: "" },
              { label: "Band Resolution", value: "450", status: "" },
              { label: "Abnormalities", value: "None", status: "normal" },
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
                    <span className="text-[8px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10">Normal</span>
                  )}
                </div>
              </div>
            ))}
            {/* Sign button */}
            <div className="mt-2 flex justify-end">
              <div className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">
                <span className="text-[9px] font-mono text-emerald-400">Digitally Signed</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-36 bg-[#050a18] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:32px_32px]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-20 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/60 mb-4">
            {t("akas.workflowLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {t("akas.workflowTitle")}
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
                      ? "border-white/[0.1] bg-white/[0.04]"
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
                      isActive ? "bg-blue-500/20" : "bg-white/[0.03]"
                    }`}>
                      <Icon size={20} className={`transition-colors duration-500 ${isActive ? "text-cyan-400" : "text-white/20"}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`font-mono text-xs transition-colors duration-500 ${isActive ? "text-cyan-400/70" : "text-white/15"}`}>
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
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
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
      `}</style>
    </section>
  );
}
