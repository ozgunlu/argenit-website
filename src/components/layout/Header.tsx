"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, ChevronDown } from "lucide-react";

const aboutSubItems = [
  { href: "/about" as const, labelTr: "Firma Profili", labelEn: "Company Profile" },
  { href: "/about/board" as const, labelTr: "Yönetim Kurulu", labelEn: "Board of Directors" },
  { href: "/about/experts" as const, labelTr: "Uzman Kadromuz", labelEn: "Our Expert Team" },
  { href: "/about/consultants" as const, labelTr: "Danışman Kadromuz", labelEn: "Our Consultants" },
  { href: "/about/projects" as const, labelTr: "Tamamlanmış Projeler", labelEn: "Completed Projects" },
  { href: "/about/quality" as const, labelTr: "Kalite Politikamız", labelEn: "Quality Policy" },
  { href: "/about/privacy" as const, labelTr: "Kişisel Verilerin Korunması", labelEn: "Personal Data Protection" },
  { href: "/about/kvkk-form" as const, labelTr: "KVKK Başvuru Formu", labelEn: "PDPL Application Form" },
  { href: "/about/info-security" as const, labelTr: "Bilgi Güvenliği ve Kişisel Veri Politikası", labelEn: "Information Security & Data Policy" },
];

export default function Header() {
  const t = useTranslations("common");
  const locale = useLocale() as "tr" | "en";
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cleanupRef = useRef<(() => void) | null>(null);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide header when slider is in view
  useEffect(() => {
    // Reset when navigating away from home
    setHeaderHidden(false);

    // Small delay to let DOM render after client-side navigation
    const timer = setTimeout(() => {
      const slider = document.getElementById("services-gallery");
      if (!slider) return;
      const observer = new IntersectionObserver(
        ([entry]) => setHeaderHidden(entry.isIntersecting),
        { threshold: 0.15 }
      );
      observer.observe(slider);
      // Store cleanup
      cleanupRef.current = () => observer.disconnect();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileAboutOpen(false);
  }, []);

  const handleAboutEnter = () => {
    clearTimeout(aboutTimeout.current);
    setAboutOpen(true);
  };

  const handleAboutLeave = () => {
    aboutTimeout.current = setTimeout(() => setAboutOpen(false), 150);
  };

  const navItems = [
    { href: "/" as const, label: t("home"), hasDropdown: false },
    { href: "/about" as const, label: t("about"), hasDropdown: true },
    { href: "/products" as const, label: t("products"), hasDropdown: false },
    { href: "/contact" as const, label: t("contact"), hasDropdown: false },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          headerHidden
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/90 backdrop-blur-xl border-b border-slate-100"
        }`}
      >
        <div className="px-5 sm:px-8 lg:px-[6.5%]">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo */}
            <Link href="/" className="relative flex items-center shrink-0">
              <Image
                src="/argenit-logo.png"
                alt="Argenit"
                width={140}
                height={26}
                className="h-[22px] lg:h-[26px] w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center">
              {navItems.map((item, i) => (
                <div key={item.href} className="flex items-center">
                  {i > 0 && (
                    <span className="w-px h-3 bg-slate-200 mx-1" />
                  )}

                  {item.hasDropdown ? (
                    /* About with dropdown */
                    <div
                      ref={aboutRef}
                      className="relative"
                      onMouseEnter={handleAboutEnter}
                      onMouseLeave={handleAboutLeave}
                    >
                      <button
                        className={`relative flex items-center gap-1 px-4 py-2 font-[family-name:var(--font-heading)] text-[11px] uppercase font-semibold tracking-[0.15em] transition-colors duration-200 ${
                          isActive(item.href)
                            ? "text-slate-900"
                            : "text-slate-400 hover:text-slate-700"
                        }`}
                        onClick={() => setAboutOpen(!aboutOpen)}
                      >
                        {item.label}
                        <ChevronDown
                          size={12}
                          strokeWidth={2}
                          className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}
                        />
                        {isActive(item.href) && (
                          <span className="absolute bottom-1 left-4 right-4 h-px bg-slate-900" />
                        )}
                      </button>

                      {/* Dropdown */}
                      <div
                        className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                          aboutOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-1 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] py-2 min-w-[280px]">
                          {aboutSubItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setAboutOpen(false)}
                              className={`block px-5 py-2.5 font-[family-name:var(--font-heading)] text-[11px] font-medium tracking-[0.05em] transition-colors duration-150 ${
                                pathname === sub.href
                                  ? "text-slate-900 bg-slate-50"
                                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                              }`}
                            >
                              {locale === "en" ? sub.labelEn : sub.labelTr}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Regular nav item */
                    <Link
                      href={item.href}
                      className={`relative px-4 py-2 font-[family-name:var(--font-heading)] text-[11px] uppercase font-semibold tracking-[0.15em] transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-slate-900"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <span className="absolute bottom-1 left-4 right-4 h-px bg-slate-900" />
                      )}
                    </Link>
                  )}
                </div>
              ))}

              {/* Separator + Language */}
              <span className="w-px h-3 bg-slate-200 mx-3" />
              <LanguageSwitcher variant="light" />
            </nav>

            {/* Mobile toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav — full-screen editorial overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl" onClick={closeMobile} />

        <nav className="relative flex flex-col justify-center items-center h-full gap-1 overflow-y-auto py-20">
          {navItems.map((item, i) => (
            <div key={item.href} className="flex flex-col items-center">
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className={`flex items-center gap-1.5 font-[family-name:var(--font-heading)] text-[13px] uppercase font-semibold tracking-[0.2em] px-6 py-3 transition-all duration-300 ${
                      isActive(item.href)
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-900"
                    }`}
                    style={{
                      transitionDelay: mobileOpen ? `${i * 50 + 100}ms` : "0ms",
                      transform: mobileOpen ? "translateY(0)" : "translateY(12px)",
                      opacity: mobileOpen ? 1 : 0,
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Mobile sub-items */}
                  <div
                    className={`flex flex-col items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      mobileAboutOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {aboutSubItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={closeMobile}
                        className={`font-[family-name:var(--font-heading)] text-[11px] font-medium tracking-[0.05em] px-6 py-2 transition-colors duration-200 ${
                          pathname === sub.href
                            ? "text-slate-900"
                            : "text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        {locale === "en" ? sub.labelEn : sub.labelTr}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={closeMobile}
                  className={`font-[family-name:var(--font-heading)] text-[13px] uppercase font-semibold tracking-[0.2em] px-6 py-3 transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-900"
                  }`}
                  style={{
                    transitionDelay: mobileOpen ? `${i * 50 + 100}ms` : "0ms",
                    transform: mobileOpen ? "translateY(0)" : "translateY(12px)",
                    opacity: mobileOpen ? 1 : 0,
                  }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div
            className="mt-4 pt-4 border-t border-slate-200"
            style={{
              transitionDelay: mobileOpen ? `${navItems.length * 50 + 100}ms` : "0ms",
              opacity: mobileOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <LanguageSwitcher variant="light" />
          </div>
        </nav>
      </div>
    </>
  );
}
