import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight, Phone } from "lucide-react";
import EasyPathHero from "@/components/solutions/easypath/EasyPathHero";
import EasyPathOverview from "@/components/solutions/easypath/EasyPathOverview";
import EasyPathWorkflow from "@/components/solutions/easypath/EasyPathWorkflow";
import EasyPathFeatures from "@/components/solutions/easypath/EasyPathFeatures";
import SolutionProducts from "@/components/solutions/SolutionProducts";

export default async function EasyPathPage() {
  const t = await getTranslations();

  return (
    <>
      <EasyPathHero />
      <EasyPathOverview />
      <EasyPathWorkflow />
      <EasyPathFeatures />

      <SolutionProducts categorySlugs={["patoloji"]} accentColor="purple" />

      {/* ── CTA ── */}
      <section className="relative py-28 lg:py-36 bg-[#080514] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-600/5 blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:32px_32px]" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            {t("easypath.ctaTitle")}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("easypath.ctaDesc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-0.5"
            >
              {t("easypath.ctaButton")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:+902122851644"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-sm"
            >
              <Phone size={15} />
              {t("easypath.ctaContact")} +90 212 285 16 44
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
