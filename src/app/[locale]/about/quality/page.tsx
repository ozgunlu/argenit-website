import ScrollReveal from "@/components/home/ScrollReveal";
import AboutSidebar from "@/components/about/AboutSidebar";

const pageText = {
  tr: {
    subtitle: "Hakkımızda",
    title: "Kalite Politikamız",
    description: "Çevre, iş sağlığı ve güvenliği ile kalite yönetim sistemimizin temel ilkeleri.",
    policies: [
      "Argenit olarak tüm faaliyetlerimiz ile ekolojik dengeye zarar vermeyeceğimizi,",
      "İlgili tarafların çevre bilincinin geliştirilmesi için çalışmalarda bulunacağımızı,",
      "Atıkların kaynağından en aza indirilmesi, mümkün olduğunda yeniden kullanılması ve geri dönüştürülmesi, değerlendirilemeyen atıkların uygun yöntemlerle bertaraf edilmesini sağlayacağımızı,",
      "Enerji, hammadde ve doğal kaynakların verimli kullanılmasını sağlayacağımızı,",
      "Yönetim sistemimizi sürekli geliştireceğimizi ve iyileştireceğimizi,",
      "Çalışanlarımızın ve faaliyetlerimizden etkilenecek insanların sağlığına gelebilecek olumsuz etkileri önlemek, kendimizin ve diğer şahısların mülkiyetine gelebilecek kaza, hasar ve tehlikeleri daha başlangıç aşamasında kontrol etmek için gerekli her türlü korumayı sağlayacağımızı,",
      "Bu doğrultuda çalışanlarımızın çevre ve iş sağlığı güvenliği bilincini geliştirerek, ÇİSK yönetim sistemi anlayışını yaşam felsefesi haline getireceğimizi,",
      "İş sağlığı ve güvenliği ile ilgili tehlikeleri de aynı hassasiyetle izleyeceğimizi, bunları en aza indirmek için gerekli çabayı göstereceğimizi,",
      "Yasal yükümlülüklerimize, yürürlükteki Çevre ve İSG mevzuatlarına ve üyesi olduğumuz kuruluşların şartlarına uyacağımızı,",
      "İlgili tarafların çevre ve İSG bilincinin geliştirilmesi için çalışmalarda bulunacağımızı,",
      "Sürekli gelişme felsefesini ve sistemlerini tüm süreçlerde Yönetim Sistemi'ne uygun hale getireceğimizi ve etkinliğini sürekli iyileştireceğimizi, tüm personele özümseteceğimizi ve bu doğrultuda pazar payını, karlılığını, rekabet gücünü arttıracağımızı,",
      "Sektördeki teknolojik yenilikleri dünyayla eş zamanlı olarak takip ederek, yönetim kadromuz ve eğitimli çağdaş personelimizle, müşterilerimizin ihtiyaç ve beklentilerini yönetim sistemi şartlarına uygun olarak karşılayacağımızı taahhüt ederiz.",
    ],
  },
  en: {
    subtitle: "About Us",
    title: "Quality Policy",
    description: "The fundamental principles of our environmental, occupational health and safety, and quality management system.",
    policies: [
      "As Argenit, we commit that all our activities will not harm the ecological balance,",
      "We will conduct studies to develop environmental awareness among relevant stakeholders,",
      "We will ensure that waste is minimized at source, reused and recycled wherever possible, and that non-recoverable waste is disposed of through appropriate methods,",
      "We will ensure the efficient use of energy, raw materials and natural resources,",
      "We will continuously develop and improve our management system,",
      "We will provide all necessary protection to prevent adverse effects on the health of our employees and people affected by our activities, and to control accidents, damages and hazards that may occur to our own and third-party property at the earliest stage,",
      "In this direction, we will develop the environmental and occupational health and safety awareness of our employees and make the EHS management system approach a philosophy of life,",
      "We will monitor occupational health and safety hazards with the same sensitivity and make the necessary effort to minimize them,",
      "We will comply with our legal obligations, the applicable environmental and OHS legislation, and the requirements of the organizations of which we are members,",
      "We will conduct studies to develop environmental and OHS awareness among relevant stakeholders,",
      "We will align the philosophy and systems of continuous improvement with the Management System in all processes, continuously improve its effectiveness, instill it in all personnel, and accordingly increase market share, profitability, and competitiveness,",
      "We pledge that by following technological innovations in the industry simultaneously with the world, together with our management team and educated modern staff, we will meet the needs and expectations of our customers in accordance with the management system requirements.",
    ],
  },
};

export default async function QualityPolicyPage({
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
            <div className="flex-1 min-w-0">
              <div className="space-y-4">
                {t.policies.map((item, i) => {
                  const isLast = i === t.policies.length - 1;
                  return (
                    <ScrollReveal key={i} delay={i * 0.04}>
                      <div className="flex gap-4">
                        <div className="shrink-0 mt-2">
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                        <p
                          className={`text-base sm:text-lg leading-relaxed ${
                            isLast
                              ? "text-slate-900 font-medium"
                              : "text-slate-600"
                          }`}
                        >
                          {item}
                        </p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
            <AboutSidebar currentPath="/about/quality" />
          </div>
        </div>
      </section>
    </>
  );
}
