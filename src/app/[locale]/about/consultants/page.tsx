import ScrollReveal from "@/components/home/ScrollReveal";
import AboutSidebar from "@/components/about/AboutSidebar";
import TeamGrid from "@/components/about/TeamGrid";
import { prisma } from "@/lib/db";

const pageText = {
  tr: {
    subtitle: "Hakkımızda",
    title: "Danışman Kadromuz",
    description: "Projelerimize akademik ve sektörel bilgi birikimi ile katkı sağlayan danışmanlarımız.",
  },
  en: {
    subtitle: "About Us",
    title: "Our Consultants",
    description: "Our consultants who contribute to our projects with their academic and industry expertise.",
  },
};

export default async function ConsultantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = pageText[locale as "tr" | "en"] || pageText.tr;
  const members = await prisma.teamMember.findMany({
    where: { type: "consultant", isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-24 pb-6 lg:pt-28 lg:pb-8 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:32px_32px]" />
        <div className="relative mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <ScrollReveal>
            <p className="font-[family-name:var(--font-heading)] text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-4">
              {t.subtitle}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              {t.title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
              {t.description}
            </p>
          </ScrollReveal>
          <div className="w-12 h-[2px] bg-slate-400 mt-5" />
        </div>
      </section>

      {/* ── Content + Sidebar ── */}
      <section className="pt-4 pb-10 lg:pt-6 lg:pb-14 bg-white">
        <div className="mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="flex-1 min-w-0">
              <TeamGrid members={members} locale={locale} />
            </div>
            <AboutSidebar currentPath="/about/consultants" />
          </div>
        </div>
      </section>
    </>
  );
}
