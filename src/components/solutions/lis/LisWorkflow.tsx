"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { ScanBarcode, FlaskConical, Eye, FileSignature } from "lucide-react";

export default function LisWorkflow() {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, startAutoplay]);

  const steps = [
    {
      icon: ScanBarcode,
      num: "01",
      title: t("lis.workflowStep1Title"),
      desc: t("lis.workflowStep1Desc"),
      color: "amber",
      visual: (
        /* Sample registration / barcode scanning animation */
        <div className="relative w-full h-full bg-[#0d0a04] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(245,158,11,0.06)_1px,transparent_0)] bg-[size:20px_20px]" />
          {/* Form mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[65%]">
            {/* Form fields */}
            <div className="space-y-3 mb-4">
              {[
                { label: "Patient ID", width: "60%" },
                { label: "Sample Type", width: "45%" },
                { label: "Priority", width: "30%" },
              ].map((field, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{ animation: `lisSlideIn 0.6s ease ${i * 0.15}s both` }}
                >
                  <span className="text-[9px] font-mono text-amber-400/40 w-16 shrink-0">
                    {field.label}
                  </span>
                  <div className="flex-1 h-5 rounded bg-amber-500/8 border border-amber-400/10">
                    <div
                      className="h-full rounded bg-amber-400/15"
                      style={{ width: field.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Barcode */}
            <div className="mt-6 flex items-center justify-center gap-[2px]">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-amber-400/50 rounded-sm"
                  style={{
                    width: Math.random() > 0.5 ? "2px" : "1px",
                    height: `${20 + Math.random() * 12}px`,
                    animation: `lisFadeIn 0.3s ease ${0.5 + i * 0.02}s both`,
                  }}
                />
              ))}
            </div>
            {/* Scanning line */}
            <div
              className="absolute bottom-4 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70"
              style={{ animation: "lisScanVertical 2.5s ease-in-out infinite" }}
            />
          </div>
          <style>{`
            @keyframes lisSlideIn {
              from { opacity: 0; transform: translateX(-12px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes lisFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes lisScanVertical {
              0%, 100% { transform: translateY(0); opacity: 0.4; }
              50% { transform: translateY(-30px); opacity: 0.8; }
            }
          `}</style>
        </div>
      ),
    },
    {
      icon: FlaskConical,
      num: "02",
      title: t("lis.workflowStep2Title"),
      desc: t("lis.workflowStep2Desc"),
      color: "orange",
      visual: (
        /* Flowchart with branching paths */
        <div className="relative w-full h-full bg-[#0d0a04] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.06),transparent_70%)]" />
          {/* Central flowchart */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Entry node */}
            <div
              className="absolute top-[15%] left-1/2 -translate-x-1/2 w-20 h-8 rounded-lg border border-orange-400/30 bg-orange-500/10 flex items-center justify-center"
              style={{ animation: "lisPulseNode 3s ease-in-out infinite" }}
            >
              <span className="text-[8px] font-mono text-orange-400">SAMPLE</span>
            </div>
            {/* Vertical line from entry */}
            <div className="absolute top-[23%] left-1/2 -translate-x-1/2 w-[1px] h-[10%] bg-gradient-to-b from-orange-400/40 to-orange-400/20" />
            {/* Decision diamond */}
            <div
              className="absolute top-[33%] left-1/2 -translate-x-1/2 w-12 h-12 border border-orange-400/30 bg-orange-500/10 flex items-center justify-center"
              style={{ transform: "translateX(-50%) rotate(45deg)", animation: "lisPulseNode 3s ease-in-out infinite 0.5s" }}
            >
              <span
                className="text-[7px] font-mono text-orange-300"
                style={{ transform: "rotate(-45deg)" }}
              >
                TYPE?
              </span>
            </div>
            {/* Branch lines */}
            <div className="absolute top-[42%] left-[25%] w-[25%] h-[1px] bg-gradient-to-r from-transparent to-orange-400/30" />
            <div className="absolute top-[42%] right-[25%] w-[25%] h-[1px] bg-gradient-to-l from-transparent to-orange-400/30" />
            <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-[1px] h-[12%] bg-gradient-to-b from-orange-400/30 to-amber-400/20" />
            {/* Left branch: Histology */}
            <div
              className="absolute top-[41%] left-[15%] w-16 h-7 rounded border border-amber-400/25 bg-amber-500/8 flex items-center justify-center"
              style={{ animation: "lisPulseNode 3s ease-in-out infinite 1s" }}
            >
              <span className="text-[7px] font-mono text-amber-400">HISTO</span>
            </div>
            {/* Right branch: Cytology */}
            <div
              className="absolute top-[41%] right-[15%] w-16 h-7 rounded border border-orange-400/25 bg-orange-500/8 flex items-center justify-center"
              style={{ animation: "lisPulseNode 3s ease-in-out infinite 1.5s" }}
            >
              <span className="text-[7px] font-mono text-orange-400">CYTO</span>
            </div>
            {/* Center branch: Molecular */}
            <div
              className="absolute top-[54%] left-1/2 -translate-x-1/2 w-16 h-7 rounded border border-yellow-400/25 bg-yellow-500/8 flex items-center justify-center"
              style={{ animation: "lisPulseNode 3s ease-in-out infinite 2s" }}
            >
              <span className="text-[7px] font-mono text-yellow-400">MOL</span>
            </div>
            {/* Converge lines */}
            <div className="absolute top-[48%] left-[23%] w-[1px] h-[20%] bg-gradient-to-b from-amber-400/20 to-amber-400/10" />
            <div className="absolute top-[48%] right-[23%] w-[1px] h-[20%] bg-gradient-to-b from-orange-400/20 to-orange-400/10" />
            <div className="absolute top-[61%] left-1/2 -translate-x-1/2 w-[1px] h-[10%] bg-gradient-to-b from-yellow-400/20 to-yellow-400/10" />
            {/* Final output */}
            <div
              className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-20 h-8 rounded-lg border border-amber-400/30 bg-amber-500/15 flex items-center justify-center"
              style={{ animation: "lisPulseNode 3s ease-in-out infinite 2.5s" }}
            >
              <span className="text-[8px] font-mono text-amber-400">REPORT</span>
            </div>
            {/* Flowing particles on branches */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-orange-400/60"
                style={{
                  top: `${20 + i * 15}%`,
                  left: "50%",
                  animation: `lisFlowDown 3s ease-in-out infinite ${i * 0.8}s`,
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes lisPulseNode {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
            @keyframes lisFlowDown {
              0% { transform: translateY(0) translateX(-50%); opacity: 0; }
              20% { opacity: 0.8; }
              80% { opacity: 0.8; }
              100% { transform: translateY(120px) translateX(-50%); opacity: 0; }
            }
          `}</style>
        </div>
      ),
    },
    {
      icon: Eye,
      num: "03",
      title: t("lis.workflowStep3Title"),
      desc: t("lis.workflowStep3Desc"),
      color: "yellow",
      visual: (
        /* Data merging from multiple sources */
        <div className="relative w-full h-full bg-[#0d0a04] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.06),transparent_70%)]" />
          {/* Source nodes around the edges */}
          {[
            { label: "Analyzer 1", top: "12%", left: "15%", delay: 0 },
            { label: "Analyzer 2", top: "12%", right: "15%", delay: 0.3 },
            { label: "Scanner", top: "45%", left: "8%", delay: 0.6 },
            { label: "Manual", top: "45%", right: "8%", delay: 0.9 },
            { label: "External", top: "78%", left: "15%", delay: 1.2 },
            { label: "Archive", top: "78%", right: "15%", delay: 1.5 },
          ].map((src, i) => (
            <div
              key={i}
              className="absolute px-2.5 py-1.5 rounded border border-amber-400/20 bg-amber-500/8"
              style={{
                top: src.top,
                left: src.left,
                right: src.right,
                animation: `lisPulseNode 3s ease-in-out infinite ${src.delay}s`,
              }}
            >
              <span className="text-[7px] font-mono text-amber-400/70">
                {src.label}
              </span>
            </div>
          ))}
          {/* Central merge node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="w-16 h-16 rounded-full border-2 border-amber-400/30 bg-amber-500/10 flex items-center justify-center"
              style={{ animation: "lisCentralPulse 2s ease-in-out infinite" }}
            >
              <Eye size={20} className="text-amber-400" />
            </div>
            {/* Orbiting ring */}
            <div
              className="absolute -inset-4 rounded-full border border-dashed border-amber-400/15"
              style={{ animation: "lisSpin 12s linear infinite" }}
            />
            <div
              className="absolute -inset-8 rounded-full border border-dashed border-orange-400/10"
              style={{ animation: "lisSpin 20s linear infinite reverse" }}
            />
          </div>
          {/* Flowing data lines toward center */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const startX = 50 + Math.cos(angle) * 42;
            const startY = 50 + Math.sin(angle) * 42;
            return (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-yellow-400/70"
                style={{
                  left: `${startX}%`,
                  top: `${startY}%`,
                  animation: `lisConverge${i} 2.5s ease-in-out infinite ${i * 0.4}s`,
                }}
              />
            );
          })}
          {/* Status badge */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur border border-white/5">
            <span className="text-[10px] font-mono text-amber-400">
              Merging: 6 sources
            </span>
          </div>
          <style>{`
            @keyframes lisCentralPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.2); }
              50% { box-shadow: 0 0 30px 10px rgba(245,158,11,0.1); }
            }
            @keyframes lisSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes lisConverge0 { 0% { transform: translate(0,0); opacity:0; } 50% { opacity:0.8; } 100% { transform: translate(${50-8}px, ${50-12}px); opacity:0; } }
            @keyframes lisConverge1 { 0% { transform: translate(0,0); opacity:0; } 50% { opacity:0.8; } 100% { transform: translate(-${50-8}px, ${50-12}px); opacity:0; } }
            @keyframes lisConverge2 { 0% { transform: translate(0,0); opacity:0; } 50% { opacity:0.8; } 100% { transform: translate(${50-8}px, 0); opacity:0; } }
            @keyframes lisConverge3 { 0% { transform: translate(0,0); opacity:0; } 50% { opacity:0.8; } 100% { transform: translate(-${50-8}px, 0); opacity:0; } }
            @keyframes lisConverge4 { 0% { transform: translate(0,0); opacity:0; } 50% { opacity:0.8; } 100% { transform: translate(${50-8}px, -${50-12}px); opacity:0; } }
            @keyframes lisConverge5 { 0% { transform: translate(0,0); opacity:0; } 50% { opacity:0.8; } 100% { transform: translate(-${50-8}px, -${50-12}px); opacity:0; } }
          `}</style>
        </div>
      ),
    },
    {
      icon: FileSignature,
      num: "04",
      title: t("lis.workflowStep4Title"),
      desc: t("lis.workflowStep4Desc"),
      color: "amber",
      visual: (
        /* Report distribution to multiple endpoints */
        <div className="relative w-full h-full bg-[#0d0a04] rounded-xl overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06),transparent_70%)]" />
          {/* Report mockup */}
          <div className="relative h-full flex flex-col gap-3 justify-center">
            {/* Central report */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center">
                <FileSignature size={12} className="text-amber-400" />
              </div>
              <div>
                <div className="h-2 w-24 rounded bg-white/10" />
                <div className="h-1.5 w-16 rounded bg-white/5 mt-1" />
              </div>
            </div>
            {/* Distribution targets */}
            {[
              { label: "Clinician Portal", status: "sent", time: "0.2s" },
              { label: "EMR/HIS System", status: "sent", time: "0.4s" },
              { label: "Patient App", status: "sent", time: "1.1s" },
              { label: "Referring Lab", status: "pending", time: "--" },
              { label: "Archive/PDF", status: "sent", time: "0.3s" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 border-b border-white/[0.04]"
                style={{ animation: `lisReportRow 0.4s ease ${i * 0.1}s both` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        row.status === "sent"
                          ? "rgba(245,158,11,0.7)"
                          : "rgba(255,255,255,0.2)",
                      animation:
                        row.status === "sent"
                          ? "lisDotPulse 2s ease-in-out infinite"
                          : "none",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                  <span className="text-[10px] font-mono text-white/40">
                    {row.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/25">
                    {row.time}
                  </span>
                  {row.status === "sent" ? (
                    <span className="text-[8px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10">
                      Sent
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-white/30 px-1.5 py-0.5 rounded bg-white/5">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
            {/* Progress summary */}
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[9px] font-mono text-white/20">
                4/5 delivered
              </span>
              <div className="px-3 py-1 rounded bg-amber-500/20 border border-amber-500/30">
                <span className="text-[9px] font-mono text-amber-400">
                  Digitally Signed
                </span>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes lisReportRow {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes lisDotPulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-36 bg-[#0a0804] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:32px_32px]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-20 transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(30px)",
          }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400/60 mb-4">
            {t("lis.workflowLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {t("lis.workflowTitle")}
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
                  onClick={() => {
                    setActiveStep(i);
                    startAutoplay();
                  }}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-amber-400/20 bg-white/[0.04]"
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
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500 ${
                        isActive ? "bg-amber-500/20" : "bg-white/[0.03]"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`transition-colors duration-500 ${
                          isActive ? "text-orange-400" : "text-white/20"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          className={`font-mono text-xs transition-colors duration-500 ${
                            isActive ? "text-orange-400/70" : "text-white/15"
                          }`}
                        >
                          {step.num}
                        </span>
                        <h3
                          className={`font-[family-name:var(--font-heading)] text-base font-bold transition-colors duration-500 ${
                            isActive ? "text-white" : "text-white/40"
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p
                        className={`text-sm leading-relaxed transition-all duration-500 ${
                          isActive
                            ? "text-slate-400 max-h-40 opacity-100"
                            : "text-white/20 max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {isActive && (
                    <div className="mt-4 ml-15 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ animation: "lisProgressBar 4s linear" }}
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
        @keyframes lisProgressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
