import ScrollReveal from "@/components/home/ScrollReveal";
import AboutSidebar from "@/components/about/AboutSidebar";

const pageText = {
  tr: {
    subtitle: "Hakkımızda",
    title: "Bilgi Güvenliği ve Kişisel Veri Politikası",
    description: "Bilgi Güvenliği ve Kişisel Veri Yönetim Sistemi kapsamında politikamız.",
    intro:
      "Bilgi Güvenliği ve Kişisel Veri Yönetim Sistemi\u2019nin ana teması Argenit Hizmetlerinde; insan, alt yapı, yazılım, donanım, müşteri bilgileri, kuruluş bilgileri, üçüncü şahıslara ait bilgiler ve finansal kaynaklar içerisinde bilgi güvenliği yönetiminin sağlandığını göstermek, risk yönetimini güvence altına almak ve fırsata dönüştürmek, bilgi güvenliği yönetimi süreç performansını ölçmek ve bilgi güvenliği ile ilgili konularda üçüncü taraflarla olan ilişkilerin düzenlenmesini sağlamaktır.",
    policyPurpose: "Bu doğrultuda Bilgi Güvenliği ve Kişisel Veri Politikamızın amacı:",
    threeElements: [
      { title: "Gizlilik", desc: "Önem taşıyan bilgilere yetkisiz erişimlerin önlenmesi" },
      { title: "Bütünlük", desc: "Bilginin doğruluk ve bütünlüğünün sağlandığının gösterilmesi" },
      { title: "Erişebilirlik", desc: "Yetkisi olanların gerektiği hallerde bilgiye ulaşılabilirliğinin gösterilmesi" },
    ],
    policyItems: [
      "İçeriden veya dışarıdan, bilerek ya da bilmeyerek meydana gelebilecek her türlü tehdide karşı Argenit'in bilgi varlıklarını korumak, bilgiye erişebilirliği iş prosesleriyle gerektiği şekilde sağlamak, yasal mevzuat gereksinimlerini karşılamak, sürekli iyileştirmeye yönelik çalışmalar yapmak,",
      "Yürütülen tüm faaliyetlerde Bilgi Güvenliği Yönetim Sisteminin üç temel öğesinin sürekliliğini sağlamak:",
      "Risk kabul kriterlerini ve riskleri belirlemek, kontrolleri geliştirmek ve uygulamak,",
      "Bilgi Güvenliği, Kişisel Veri Yönetim Sistemi kapsamı dâhilindeki bilgi ve kişisel verilerin gizlilik, bütünlük ve erişilebilirlik kayıpları ile ilgili risklerin tespit edilmesi için bilgi güvenliği, kişisel veri ve risk değerlendirme sürecinin uygulanmasını sağlamak, risk sahiplerini belirlemek,",
      "Bilgi Güvenliği ve Kişisel Veri Yönetim Sistemi kapsamı dâhilindeki bilgi ve kişisel verilerin gizlilik, bütünlük, erişilebilirlik etkilerini değerlendirmeye yönelik bir çerçeveyi tanımlamak,",
      "Hizmet verilen kapsam bağlamında teknolojik beklentileri gözden geçirerek riskleri sürekli takip etmek,",
      "Tabi olduğu ulusal veya sektörel düzenlemelerden, yasal ve ilgili mevzuat gereklerini yerine getirmekten, anlaşmalardan doğan yükümlülüklerini karşılamaktan, iç ve dış paydaşlara yönelik kurumsal sorumluluklarından kaynaklanan bilgi ve veri güvenliği ile iş sürekliliği gereksinimlerini sağlamak,",
      "Hizmet sürekliliğine yönelik bilgi güvenliği ve kişisel veri tehditlerinin etkisini azaltmak ve sürekliliğe katkıda bulunmak,",
      "Hizmet sürekliliğine yönelik iş sürekliliği tehditlerinin etkisini azaltmak ve sürekliliğe katkıda bulunmak,",
      "Gerçekleşebilecek bilgi güvenliği ve kişisel veri ihlal olaylarına hızla müdahale edebilecek ve olayın etkisini minimize edecek yetkinliğe sahip olmak,",
      "Maliyet etkin bir kontrol altyapısı ile bilgi güvenliği seviyesini zaman içinde korumak ve iyileştirmek,",
      "Kurum itibarını geliştirmek, bilgi güvenliği ve kişisel veri temelli olumsuz etkilerden korumak,",
      "Kişisel Verileri Koruma Kanunu ve Kişisel Verilerin Yönetim Sistemi uygulamaları dahilinde kuruluşumuz bünyesinde bulunan Kişisel Veri Envanteri ile belirlenmiş olan veri kategorileri kapsamında tutulan kişisel ve özel nitelikli kişisel verilerin tutulması, muhafazası, imha edilmesi, anonimleştirilmesi süreçlerindeki teknik ve idari tedbirlerin belirlenmesi ile kişisel veri sahiplerine karşı yasal ve standartlara tabi uygulamaları yönetmek,",
      "Kişisel veri ihlali olması durumunda tanımlanan yasalara uygun olarak en kısa sürede ilgili makam ve merciler ile kişisel veri sahiplerinin bilgilendirilmesini sağlamak,",
      "Kişisel verilerin alınması, muhafazası, imha edilmesi ve anonimleştirilmesi süreçlerinde yasa ve standartlar kapsamında belirlenmiş olan gerekli gizlilik önlemlerinin alınmasını sağlamak,",
      "Kişisel Verileri Koruma Kanunu kapsamında Aydınlatma Metni yükümlülüğünün yerine getirilmesini sağlamak,",
      "Kişisel Verileri Koruma Kanunu kapsamında kanunlarca tanımlanan hallerde ilgili kişisel veri sahiplerinden Açık Rıza Beyanları alınmasını sağlamak,",
      "Argenit Yönetimi, alt yüklenicilerimiz ve müşteri ile tedarikçilerimiz başta olmak üzere kuruluşumuz ile arasında sözleşme bulunan tüm üçüncü taraflarımız ile imzalanan sözleşme hükümlerine uyulmasını sağlamak,",
      "Argenit ziyaret, teknik destek, hizmet ve ürün teslimi ile hizmetin gerçekleştirilmesi kapsamlarında gelebilecek olan tüm kişisel veri sahiplerinin 6698 No'lu Kanun 11. maddesi ile tanımlanmış hakları kapsamında ilgili kişi hakları olarak Argenit web sitesi üzerinden ilgili taraflara beyan edildiği üzere hizmet sunulmasını sağlamak.",
    ],
    closing:
      "Argenit bilgi güvenliği ve kişisel verilerin yönetim sistemi uygulamaları kapsamında gizlilik açısından farklı seviyelerde hassasiyete sahip bilgiler hakkında kurumsal farkındalığı artırmak, farklı hassasiyet seviyelerine sahip bilgiler için uygulanması önerilen mantıksal, fiziksel ve idari kontrolleri belirlemek ve uygulamak; taşınabilir ortamlarda bulunan verilerin koruma, saklama, imha etme ve anonimleştirme kurallarını tanımlamak amaçlı bilgi ve veri güvenliği sınıflandırma kılavuzu oluşturulmuştur.",
    commitment:
      "Argenit Yönetimi, Bilgi Güvenliği ve Kişisel Veri ile ilgili uygulamaların gerçekleşmesini, gözden geçirilmesini ve sürekli iyileştirilmesini taahhüt eder.",
  },
  en: {
    subtitle: "About Us",
    title: "Information Security & Personal Data Policy",
    description: "Our policy within the scope of the Information Security and Personal Data Management System.",
    intro:
      "The main theme of the Information Security and Personal Data Management System in Argenit Services is to demonstrate that information security management is ensured within human resources, infrastructure, software, hardware, customer information, organizational information, third-party information and financial resources; to secure risk management and turn it into opportunity; to measure the process performance of information security management; and to regulate relationships with third parties on information security matters.",
    policyPurpose: "In this direction, the purpose of our Information Security and Personal Data Policy is:",
    threeElements: [
      { title: "Confidentiality", desc: "Prevention of unauthorized access to critical information" },
      { title: "Integrity", desc: "Demonstrating that the accuracy and completeness of information is ensured" },
      { title: "Availability", desc: "Demonstrating that authorized persons can access information when needed" },
    ],
    policyItems: [
      "To protect Argenit's information assets against all kinds of threats that may arise internally or externally, knowingly or unknowingly; to ensure accessibility to information as required by business processes; to meet legal regulatory requirements; and to carry out continuous improvement efforts,",
      "To ensure the continuity of the three fundamental elements of the Information Security Management System in all activities carried out:",
      "To define risk acceptance criteria and risks, develop and implement controls,",
      "To ensure the implementation of the information security, personal data and risk assessment process for identifying risks related to confidentiality, integrity and availability losses of information and personal data within the scope of the Information Security and Personal Data Management System; to identify risk owners,",
      "To define a framework for assessing the confidentiality, integrity and availability impacts of information and personal data within the scope of the Information Security and Personal Data Management System,",
      "To continuously monitor risks by reviewing technological expectations within the context of the service scope,",
      "To ensure information and data security and business continuity requirements arising from national or sectoral regulations, legal and relevant legislative requirements, obligations arising from agreements, and corporate responsibilities towards internal and external stakeholders,",
      "To reduce the impact of information security and personal data threats on service continuity and contribute to continuity,",
      "To reduce the impact of business continuity threats on service continuity and contribute to continuity,",
      "To have the competence to respond quickly to potential information security and personal data breach incidents and to minimize the impact of such incidents,",
      "To maintain and improve the level of information security over time with a cost-effective control infrastructure,",
      "To enhance corporate reputation and protect against negative impacts based on information security and personal data,",
      "To manage technical and administrative measures in the processes of retention, preservation, destruction, and anonymization of personal and special categories of personal data held within the scope of data categories determined by the Personal Data Inventory within our organization, within the applications of the Personal Data Protection Law and the Personal Data Management System, and to manage legal and standards-based applications for personal data subjects,",
      "To ensure that relevant authorities and personal data subjects are notified as soon as possible in accordance with the defined laws in the event of a personal data breach,",
      "To ensure that the necessary confidentiality measures determined within the scope of laws and standards are taken in the processes of obtaining, preserving, destroying and anonymizing personal data,",
      "To ensure the fulfillment of the Disclosure Text obligation within the scope of the Personal Data Protection Law,",
      "To ensure that Explicit Consent Declarations are obtained from the relevant personal data subjects in cases defined by law within the scope of the Personal Data Protection Law,",
      "To ensure compliance with the contract terms signed with all third parties that have a contract with our organization, primarily Argenit Management, our subcontractors, customers and suppliers,",
      "To ensure that services are provided as declared to the relevant parties through the Argenit website, within the scope of the rights of the data subjects as defined in Article 11 of Law No. 6698, for all personal data subjects who may come within the scope of Argenit visits, technical support, service and product delivery and service execution.",
    ],
    closing:
      "Within the scope of Argenit's information security and personal data management system practices, an information and data security classification guide has been established to increase corporate awareness about information with different levels of sensitivity in terms of confidentiality, to determine and implement the logical, physical and administrative controls recommended for information with different sensitivity levels; and to define the rules for protection, storage, destruction and anonymization of data on portable media.",
    commitment:
      "Argenit Management commits to the implementation, review and continuous improvement of practices related to Information Security and Personal Data.",
  },
};

export default async function InfoSecurityPage({
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
            <div className="flex-1 min-w-0 space-y-8">
              {/* Intro */}
              <ScrollReveal>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {t.intro}
                </p>
              </ScrollReveal>

              {/* Policy purpose */}
              <ScrollReveal delay={0.06}>
                <p className="text-base sm:text-lg text-slate-900 font-semibold">
                  {t.policyPurpose}
                </p>
              </ScrollReveal>

              {/* Three elements callout */}
              <ScrollReveal delay={0.1}>
                <div className="grid sm:grid-cols-3 gap-4">
                  {t.threeElements.map((el) => (
                    <div
                      key={el.title}
                      className="bg-slate-50 rounded-xl border border-slate-100 p-5"
                    >
                      <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                        {el.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {el.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Policy items */}
              <div className="space-y-3">
                {t.policyItems.map((item, i) => (
                  <ScrollReveal key={i} delay={0.08 + i * 0.02}>
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      </div>
                      <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Closing paragraph */}
              <ScrollReveal delay={0.5}>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {t.closing}
                </p>
              </ScrollReveal>

              {/* Commitment */}
              <ScrollReveal delay={0.54}>
                <p className="text-base sm:text-lg text-slate-900 font-semibold leading-relaxed">
                  {t.commitment}
                </p>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <AboutSidebar currentPath="/about/info-security" />
          </div>
        </div>
      </section>
    </>
  );
}
