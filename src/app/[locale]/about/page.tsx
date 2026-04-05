import ScrollReveal from "@/components/home/ScrollReveal";
import AboutSidebar from "@/components/about/AboutSidebar";

const timeline = {
  tr: [
    { year: "1999", text: "Bilgisayarlı otomatik mikroskop görüntüleme sistemleri tasarımına başlandı." },
    { year: "2005", text: "Sitogenetik alanında Kromozom Analiz Sistemleri pazara sunuldu." },
    { year: "2012", text: "FISH Analiz Sistemleri ve DNA FISH prob çözümleri ürün portföyüne eklendi." },
    { year: "2018", text: "Dijital Patoloji alanına girildi; EasyScan lam tarayıcı serisi geliştirildi." },
    { year: "2022", text: "İTÜ Teknokent'e taşınıldı; yapay zeka karar destek sistemleri hayata geçirildi." },
    { year: "2025", text: "Uluslararası pazarlarda genişleme; biyomedikal görüntülemede ulusal lider konumu." },
  ],
  en: [
    { year: "1999", text: "Design of computerized automatic microscope imaging systems was initiated." },
    { year: "2005", text: "Chromosome Analysis Systems in the field of cytogenetics were launched." },
    { year: "2012", text: "FISH Analysis Systems and DNA FISH probe solutions were added to the product portfolio." },
    { year: "2018", text: "Entered the Digital Pathology field; EasyScan slide scanner series was developed." },
    { year: "2022", text: "Relocated to ITU Technopark; AI-based decision support systems were implemented." },
    { year: "2025", text: "International market expansion; national leader position in biomedical imaging." },
  ],
};

const pageText = {
  tr: {
    subtitle: "Hakkımızda",
    title: "Firma Profili",
    description: "1999'dan beri biyomedikal görüntüleme teknolojilerinde Türkiye'nin öncü ArGe markası.",
    historyTitle: "Tarihçemiz",
    paragraphs: [
      "ARGENIT gelişmiş biyomedikal görüntüleme sistemleri ile hekimlerin en iyi tanıyı en hızlı koymasına yardımcı olmayı hedefler. Klinik ve araştırma toplulukları için yüksek kalitede klinik değer ve kullanıcı deneyimi sağlayan, laboratuvar ihtiyaçlarına göre uyarlanmış yeni tanı çözümleri geliştirir.",
      "ARGENIT'in ürettiği dijital sistemler, günümüzde laboratuvarların katlanarak artan sayıda teşhislerini ve taleplerini ölçeklendirmek ve kolaylaştırmak için ihtiyaç duyduğu gerekli araçları sağlar.",
      "ARGENİT, Sitogenetik alanında Kromozom Analiz Sistemleri, FISH Analiz Sistemleri ve FISH prob çözümleri ile, Dijital Patoloji için HE, IHC ve FISH Analizi için kapsamlı çözümler sunan biyomedikal görüntülemede ulusal üretici olmanın ve dünya lideri olma yolunda ilerleyen bir ArGe yatırım markasıdır.",
      "ARGENIT'in sunduğu yüksek teknoloji; Patoloji, Sitogenetik ve Araştırma laboratuvarlarına metafaz taramadan yüksek çözünürlüklü Tam Slayt Görüntülemeye (WSI), nicel analiz sistemlerinden raporlama ve LIS bağlantısına kadar uçtan uca çözümler sunar.",
      "1999'dan beri ARGENIT, bilgisayarlı otomatik mikroskop görüntüleme için sistemler tasarlamakta ve üretmektedir. En başından beri son kullanıcıyla olan yakın iletişim ARGENİT felsefesinin önemli bir parçası olmuştur. Yirmi yılı aşkın süredeki başarı hikayeleri, bu altyapı üzerine kurulan doğru stratejilerle sektöründeki en yüksek kullanıcı memnuniyetini sağladı.",
    ],
  },
  en: {
    subtitle: "About Us",
    title: "Company Profile",
    description: "Turkey's pioneering R&D brand in biomedical imaging technologies since 1999.",
    historyTitle: "Our History",
    paragraphs: [
      "ARGENIT aims to help physicians make the best diagnosis as quickly as possible with advanced biomedical imaging systems. It develops new diagnostic solutions tailored to laboratory needs, providing high-quality clinical value and user experience for clinical and research communities.",
      "The digital systems produced by ARGENIT provide the essential tools that laboratories need today to scale and streamline their exponentially growing number of diagnoses and demands.",
      "ARGENIT is an R&D investment brand that offers comprehensive solutions for Chromosome Analysis Systems, FISH Analysis Systems and FISH probe solutions in the field of Cytogenetics, and HE, IHC and FISH Analysis for Digital Pathology — a national manufacturer in biomedical imaging advancing toward becoming a world leader.",
      "The high technology offered by ARGENIT provides end-to-end solutions for Pathology, Cytogenetics, and Research laboratories — from metaphase scanning to high-resolution Whole Slide Imaging (WSI), from quantitative analysis systems to reporting and LIS connectivity.",
      "Since 1999, ARGENIT has been designing and manufacturing systems for computerized automatic microscope imaging. From the very beginning, close communication with end users has been an essential part of the ARGENIT philosophy. Over two decades of success stories, built on this foundation with the right strategies, have achieved the highest user satisfaction in the industry.",
    ],
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = pageText[locale as "tr" | "en"] || pageText.tr;
  const tl = timeline[locale as "tr" | "en"] || timeline.tr;

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
              <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                {t.paragraphs.map((p, i) => (
                  <ScrollReveal key={i} delay={i * 0.06}>
                    <p>{p}</p>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            <AboutSidebar currentPath="/about" />
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 lg:py-28 bg-[#f1f1f1]">
        <div className="mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-16">
              {t.historyTitle}
            </h2>
          </ScrollReveal>

          <div className="relative max-w-3xl">
            <div className="absolute left-[109px] sm:left-[133px] top-0 bottom-0 w-px bg-slate-300" />
            <div className="space-y-12">
              {tl.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 0.08}>
                  <div className="flex gap-6 sm:gap-8 items-start">
                    <div className="shrink-0 w-[80px] sm:w-[96px] text-right">
                      <span className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold text-slate-900">
                        {item.year}
                      </span>
                    </div>
                    <div className="relative shrink-0 mt-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-[#f1f1f1]" />
                    </div>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-0.5">
                      {item.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
