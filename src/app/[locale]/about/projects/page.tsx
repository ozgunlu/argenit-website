import { prisma } from "@/lib/db";
import ScrollReveal from "@/components/home/ScrollReveal";
import AboutSidebar from "@/components/about/AboutSidebar";

const pageText = {
  tr: {
    subtitle: "Hakkımızda",
    title: "Tamamlanmış Projeler",
    description:
      "TÜBİTAK destekli ArGe projelerimiz ile biyomedikal görüntüleme alanında yenilikçi çözümler geliştiriyoruz.",
    empty: "Henüz proje bilgisi eklenmemiş.",
  },
  en: {
    subtitle: "About Us",
    title: "Completed Projects",
    description:
      "We develop innovative solutions in biomedical imaging through our TUBITAK-supported R&D projects.",
    empty: "No projects added yet.",
  },
};

export default async function CompletedProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = pageText[locale as "tr" | "en"] || pageText.tr;

  const projects = await prisma.completedProject.findMany({
    where: { isActive: true },
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
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {projects.length === 0 ? (
                <p className="text-slate-500">{t.empty}</p>
              ) : (
                <div className="space-y-6">
                  {projects.map((project, i) => {
                    const title =
                      locale === "en"
                        ? project.titleEn || project.titleTr
                        : project.titleTr;
                    const source =
                      locale === "en"
                        ? project.sourceEn || project.sourceTr
                        : project.sourceTr;
                    return (
                      <ScrollReveal key={project.id} delay={i * 0.06}>
                        <div className="group relative bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="flex items-start gap-5">
                            {/* Number badge */}
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-2">
                                {title}
                              </h3>
                              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                {source}
                              </span>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <AboutSidebar currentPath="/about/projects" />
          </div>
        </div>
      </section>
    </>
  );
}
