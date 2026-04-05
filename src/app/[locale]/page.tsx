import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import HeroExperience from "@/components/home/HeroExperience";
import ApplicationsSlider, { type SlideData } from "@/components/home/ApplicationsSlider";
import ScrollReveal from "@/components/home/ScrollReveal";
import MagneticButton from "@/components/home/MagneticButton";
import ServicesGallery from "@/components/home/ServicesGallery";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();

  // Fetch products marked for homepage display
  const homeProducts = await prisma.product.findMany({
    where: { isActive: true, showOnHome: true, homeImage: { not: null } },
    include: {
      translations: { where: { locale } },
    },
    orderBy: { order: "asc" },
  });

  const homeSlides: SlideData[] = homeProducts
    .filter((p) => p.homeImage && p.translations[0])
    .map((p) => {
      const tr = p.translations[0];
      const name = tr.name;
      // Split name into headline lines (max 2 words per line)
      const words = name.split(" ");
      const mid = Math.ceil(words.length / 2);
      const headlines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")].filter(Boolean);
      return {
        controlTitle: name,
        headlines,
        description: tr.shortDescription || tr.description.slice(0, 200),
        image: p.homeImage!,
        imageAlt: name,
        href: `/products/${tr.slug || p.slug}`,
      };
    });

  return (
    <>
      {/* ══════════ IMMERSIVE HERO EXPERIENCE ══════════ */}
      <HeroExperience />

      {/* ══════════ TRANSITION STRIP ══════════ */}
      <section className="py-14 lg:py-16 bg-[#f1f1f1]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="hidden sm:block w-12 h-px bg-slate-300 shrink-0" />
          <ScrollReveal>
            <p className="font-[family-name:var(--font-heading)] text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-400 font-semibold text-center sm:text-left">
              {t("home.transitionStrip")}
            </p>
          </ScrollReveal>
          <div className="hidden sm:block w-12 h-px bg-slate-300 shrink-0" />
        </div>
      </section>

      {/* ══════════ CORE AREAS — Applications Slider ══════════ */}
      <ApplicationsSlider slides={homeSlides} />

      {/* ══════════ MANIFESTO / VISION BLOCK ══════════ */}
      <section className="py-28 lg:py-36 bg-[#f1f1f1]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <ScrollReveal>
            <p className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.15] tracking-tight">
              {t("home.manifestoLine1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {t("home.manifestoAccent1")}
              </span>
              ,<br className="hidden sm:block" />
              {t("home.manifestoLine2")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                {t("home.manifestoAccent2")}
              </span>
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-8 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t("home.manifestoDesc")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════ SERVICES GALLERY — Horizontal Scroll ══════════ */}
      <ServicesGallery />

      {/* ══════════ CTA — Final ══════════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(219,234,254,0.5),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/40 to-cyan-100/40 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-xl mx-auto">
              {t("home.ctaSubtitle")}
            </p>
            <MagneticButton>
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(6,182,212,0.3)] hover:-translate-y-1"
              >
                <span className="relative z-10">{t("home.ctaButton")}</span>
                <ArrowRight
                  size={20}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
