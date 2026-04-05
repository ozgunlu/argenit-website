import Image from "next/image";
import ScrollReveal from "@/components/home/ScrollReveal";
import AboutSidebar from "@/components/about/AboutSidebar";

const members = [
  {
    name: "Cengiz Kaan Sakkaf",
    titleTr: "Yönetim Kurulu Başkanı",
    titleEn: "Chairman of the Board",
    role: "CEO",
    image: "/images/board/cengiz-kaan-sakkaf.jpg",
    bioTr: "Argenit'in kurucu ortağı ve CEO'su olarak şirketin stratejik yönünü belirlemekte, biyomedikal görüntüleme teknolojilerinde 20+ yıllık deneyimini Argenit'in büyümesine katkı sağlamaktadır.",
    bioEn: "As the co-founder and CEO of Argenit, he defines the company's strategic direction, contributing over 20 years of experience in biomedical imaging technologies to Argenit's growth.",
  },
  {
    name: "Burak Buyrukbilen",
    titleTr: "Yönetim Kurulu Üyesi",
    titleEn: "Board Member",
    role: "CFO",
    image: "/images/board/burak-buyrukbilen.jpg",
    bioTr: "Finansal strateji ve kurumsal yönetim alanında uzman olan Burak Buyrukbilen, Argenit'in sürdürülebilir büyümesini ve finansal sağlığını yönetmektedir.",
    bioEn: "An expert in financial strategy and corporate governance, Burak Buyrukbilen manages Argenit's sustainable growth and financial health.",
  },
  {
    name: "Dr. Abdulkerim Çapar",
    titleTr: "Yönetim Kurulu Üyesi",
    titleEn: "Board Member",
    role: "CTO",
    image: "/images/board/dr-abdulkerim-capar.jpg",
    bioTr: "Yapay zeka ve görüntü işleme alanındaki akademik birikimini teknoloji geliştirme süreçlerine yansıtan Dr. Çapar, Argenit'in ArGe faaliyetlerine liderlik etmektedir.",
    bioEn: "Bringing his academic expertise in artificial intelligence and image processing to the technology development processes, Dr. Capar leads Argenit's R&D activities.",
  },
];

const pageText = {
  tr: {
    subtitle: "Hakkımızda",
    title: "Yönetim Kurulu",
    description: "Argenit'in vizyonunu ve stratejik yönelimini belirleyen liderlik kadrosu.",
  },
  en: {
    subtitle: "About Us",
    title: "Board of Directors",
    description: "The leadership team that defines Argenit's vision and strategic direction.",
  },
};

export default async function BoardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = pageText[locale as "tr" | "en"] || pageText.tr;

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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {members.map((member, i) => (
                  <ScrollReveal key={member.name} delay={i * 0.1}>
                    <div className="group">
                      <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-xl">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                      <div className="mt-5">
                        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-slate-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {locale === "en" ? member.titleEn : member.titleTr}
                        </p>
                        <p className="font-[family-name:var(--font-heading)] text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold mt-2">
                          {member.role}
                        </p>
                        <p className="text-sm text-slate-500 leading-relaxed mt-3">
                          {locale === "en" ? member.bioEn : member.bioTr}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <AboutSidebar currentPath="/about/board" />
          </div>
        </div>
      </section>
    </>
  );
}
