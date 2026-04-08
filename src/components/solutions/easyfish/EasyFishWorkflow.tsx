"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { Scan, CircleDot, Target, BarChart3 } from "lucide-react";

export default function EasyFishWorkflow() {
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
      icon: Scan,
      num: "01",
      title: t("easyfish.workflowStep1Title"),
      desc: t("easyfish.workflowStep1Desc"),
      visual: (
        /* Fluorescence scanning — multi-channel filter wheel */
        <div className="relative w-full h-full bg-[#030812] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)]" />
          {/* Slide area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[55%] rounded-lg border border-emerald-500/15 bg-emerald-500/3">
            {/* Filter channels indicator */}
            <div className="absolute -top-8 left-0 flex gap-2">
              {[
                { name: "DAPI", color: "#3040aa", active: true },
                { name: "FITC", color: "#00ff22", active: false },
                { name: "TxRed", color: "#ff1640", active: false },
              ].map((ch, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-mono ${ch.active ? "bg-black/60 border border-white/10" : "opacity-40"}`}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: ch.color, boxShadow: ch.active ? `0 0 6px ${ch.color}` : "none" }} />
                  <span className="text-white/60">{ch.name}</span>
                </div>
              ))}
            </div>
            {/* Scanning beam */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 h-full w-[3px] bg-gradient-to-b from-transparent via-emerald-400/80 to-transparent"
                style={{ animation: "fishScan 3.5s ease-in-out infinite" }}
              />
            </div>
            {/* Fluorescent nuclei hints */}
            {[
              { top: "25%", left: "30%", r: 14 },
              { top: "55%", left: "55%", r: 12 },
              { top: "35%", left: "75%", r: 16 },
              { top: "70%", left: "25%", r: 11 },
              { top: "50%", left: "45%", r: 13 },
            ].map((n, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: n.top, left: n.left,
                  width: n.r * 2, height: n.r * 2,
                  background: "radial-gradient(circle, rgba(30,50,160,0.25) 0%, transparent 70%)",
                  animation: `pulse 3s ease-in-out ${i * 0.5}s infinite`,
                }}
              >
                {/* Green signal */}
                <div className="absolute rounded-full" style={{ width: 4, height: 4, top: "30%", left: "40%", background: "#00ff22", boxShadow: "0 0 6px #00ff22", animation: `pulse 2s ease-in-out ${i * 0.3}s infinite` }} />
                {/* Red signal */}
                <div className="absolute rounded-full" style={{ width: 3, height: 3, top: "60%", left: "65%", background: "#ff1640", boxShadow: "0 0 5px #ff1640", animation: `pulse 2.5s ease-in-out ${i * 0.4}s infinite` }} />
              </div>
            ))}
          </div>
          <style>{`
            @keyframes fishScan {
              0%, 100% { left: 0%; }
              50% { left: calc(100% - 3px); }
            }
          `}</style>
        </div>
      ),
    },
    {
      icon: CircleDot,
      num: "02",
      title: t("easyfish.workflowStep2Title"),
      desc: t("easyfish.workflowStep2Desc"),
      visual: (
        /* Nucleus segmentation — DAPI channel with detected contours */
        <div className="relative w-full h-full bg-[#030812] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,50,160,0.08),transparent_70%)]" />
          {/* Segmented nuclei */}
          {[
            { cx: "30%", cy: "35%", w: 52, h: 44, ok: true },
            { cx: "60%", cy: "45%", w: 48, h: 50, ok: true },
            { cx: "45%", cy: "70%", w: 56, h: 42, ok: true },
            { cx: "75%", cy: "30%", w: 38, h: 40, ok: true },
            { cx: "20%", cy: "60%", w: 44, h: 48, ok: false },
          ].map((n, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                left: n.cx, top: n.cy,
                width: n.w, height: n.h,
                transform: "translate(-50%, -50%)",
                animation: `fadeInUp 0.5s ease ${i * 0.15}s both`,
              }}
            >
              {/* Nucleus body */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(30, 45, 140, 0.35) 0%, rgba(20, 30, 100, 0.15) 70%)",
                  border: `1.5px solid ${n.ok ? "rgba(100, 180, 255, 0.3)" : "rgba(255, 100, 100, 0.3)"}`,
                }}
              />
              {/* Segmentation contour animation */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <ellipse
                  cx="50" cy="50" rx="45" ry="45"
                  fill="none"
                  stroke={n.ok ? "rgba(100, 220, 255, 0.5)" : "rgba(255, 100, 100, 0.4)"}
                  strokeWidth="1.5"
                  strokeDasharray="8 4"
                  style={{ animation: `dashRotate 4s linear infinite` }}
                />
              </svg>
              {/* Label */}
              <span className={`relative text-[8px] font-mono ${n.ok ? "text-cyan-400/70" : "text-red-400/60"}`}>
                {n.ok ? `N${i + 1}` : "Skip"}
              </span>
            </div>
          ))}
          {/* Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400/70">4 / 5 nuclei accepted</span>
          </div>
          <style>{`
            @keyframes dashRotate {
              to { stroke-dashoffset: -48; }
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translate(-50%, -50%) translateY(12px); }
              to { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
            }
          `}</style>
        </div>
      ),
    },
    {
      icon: Target,
      num: "03",
      title: t("easyfish.workflowStep3Title"),
      desc: t("easyfish.workflowStep3Desc"),
      visual: (
        /* Signal detection — zoomed nucleus with counted spots */
        <div className="relative w-full h-full bg-[#030812] rounded-xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,30,100,0.12),transparent_70%)]" />
          {/* Large nucleus */}
          <div className="relative w-[200px] h-[180px]">
            {/* DAPI body */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(30, 45, 140, 0.4) 0%, rgba(15, 25, 80, 0.15) 70%)" }}
            />
            {/* FITC signals with labels */}
            {[
              { x: 55, y: 45, id: "G1" },
              { x: 130, y: 70, id: "G2" },
            ].map((s, i) => (
              <div key={`g${i}`} className="absolute" style={{ left: s.x, top: s.y }}>
                <div
                  className="w-[10px] h-[10px] rounded-full"
                  style={{
                    background: "#00ff22",
                    boxShadow: "0 0 12px #00ff22, 0 0 24px rgba(0,255,34,0.3)",
                    animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
                {/* Ring */}
                <div className="absolute -inset-2 rounded-full border border-emerald-400/30 animate-ping" style={{ animationDuration: "3s" }} />
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-emerald-400/80">{s.id}</span>
              </div>
            ))}
            {/* Texas Red signals */}
            {[
              { x: 90, y: 110, id: "R1" },
              { x: 140, y: 130, id: "R2" },
            ].map((s, i) => (
              <div key={`r${i}`} className="absolute" style={{ left: s.x, top: s.y }}>
                <div
                  className="w-[10px] h-[10px] rounded-full"
                  style={{
                    background: "#ff1640",
                    boxShadow: "0 0 12px #ff1640, 0 0 24px rgba(255,22,64,0.3)",
                    animation: `pulse 2.2s ease-in-out ${i * 0.4}s infinite`,
                  }}
                />
                <div className="absolute -inset-2 rounded-full border border-rose-400/30 animate-ping" style={{ animationDuration: "3.5s" }} />
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-rose-400/80">{s.id}</span>
              </div>
            ))}
          </div>
          {/* Score card */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between px-4 py-2.5 rounded-lg bg-black/50 backdrop-blur border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "#00ff22", boxShadow: "0 0 4px #00ff22" }} />
              <span className="text-[10px] font-mono text-emerald-300/70">FITC: 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "#ff1640", boxShadow: "0 0 4px #ff1640" }} />
              <span className="text-[10px] font-mono text-rose-300/70">TxRed: 2</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">Ratio: 1.0</span>
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      num: "04",
      title: t("easyfish.workflowStep4Title"),
      desc: t("easyfish.workflowStep4Desc"),
      visual: (
        /* Ratio analysis & report */
        <div className="relative w-full h-full bg-[#030812] rounded-xl overflow-hidden p-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)]" />
          <div className="relative h-full flex flex-col gap-3 justify-center">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-emerald-400/60" />
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">FISH Report — HER2</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10">Final</span>
            </div>

            {/* Results table */}
            {[
              { label: "Probe", value: "HER2/CEP17" },
              { label: "Nuclei Scored", value: "60 / 60" },
              { label: "Avg. HER2 Signals", value: "2.15" },
              { label: "Avg. CEP17 Signals", value: "2.05" },
              { label: "HER2/CEP17 Ratio", value: "1.05", highlight: true },
              { label: "Result", value: "Negative", status: "normal" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 border-b border-white/[0.04]"
                style={{ animation: `fadeIn 0.4s ease ${i * 0.08}s both` }}
              >
                <span className="text-[10px] font-mono text-white/30">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${row.highlight ? "text-emerald-300 font-bold" : "text-white/60"}`}>{row.value}</span>
                  {row.status === "normal" && (
                    <span className="text-[8px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10">Negative</span>
                  )}
                </div>
              </div>
            ))}

            {/* ASCO/CAP guideline bar */}
            <div className="mt-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-white/25">ASCO/CAP Classification</span>
              </div>
              {/* Ratio scale */}
              <div className="relative h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-500/30" style={{ width: "35%" }} />
                <div className="absolute top-0 h-full w-[2px] bg-white/40 rounded" style={{ left: "18%" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] font-mono text-emerald-400/50">Negative &lt;1.8</span>
                <span className="text-[8px] font-mono text-amber-400/40">Equivocal 1.8-2.2</span>
                <span className="text-[8px] font-mono text-rose-400/40">Positive &gt;2.2</span>
              </div>
            </div>

            {/* Sign */}
            <div className="flex justify-end mt-1">
              <div className="px-3 py-1 rounded bg-emerald-500/15 border border-emerald-500/20">
                <span className="text-[9px] font-mono text-emerald-400">ASCO/CAP Compliant</span>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      ),
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-36 bg-[#030812] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:32px_32px]" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/4 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-rose-500/3 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-20 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/60 mb-4">
            {t("easyfish.workflowLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {t("easyfish.workflowTitle")}
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
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      isActive ? "bg-emerald-500/20" : "bg-white/[0.03]"
                    }`}>
                      <Icon size={20} className={`transition-colors duration-500 ${isActive ? "text-emerald-400" : "text-white/20"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`font-mono text-xs transition-colors duration-500 ${isActive ? "text-emerald-400/70" : "text-white/15"}`}>
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
                  {isActive && (
                    <div className="mt-4 ml-15 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
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
      `}</style>
    </section>
  );
}
