import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@argenit.com" },
    update: {},
    create: {
      email: "admin@argenit.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  // Create sample products
  const products = [
    {
      slug: "metascan",
      order: 1,
      tr: { name: "MetaScan", description: "Otomatik metafaz tarama sistemi. Yüksek hızlı ve hassas metafaz tespiti ile sitogenetik laboratuvarlarının verimliliğini artırır.", features: "Yüksek hızlı tarama\nOtomatik metafaz tespiti\nKullanıcı dostu arayüz\nEntegrasyon desteği" },
      en: { name: "MetaScan", description: "Automatic metaphase scanning system. Increases cytogenetics laboratory efficiency with high-speed and precise metaphase detection.", features: "High-speed scanning\nAutomatic metaphase detection\nUser-friendly interface\nIntegration support" },
    },
    {
      slug: "cytovision",
      order: 2,
      tr: { name: "CytoVision", description: "Dijital karyotipleme ve analiz yazılımı. Kromozom görüntülerini otomatik olarak sınıflandırır ve karyotip oluşturur.", features: "Otomatik karyotipleme\nKromozom sınıflandırma\nRaporlama sistemi\nVeritabanı yönetimi" },
      en: { name: "CytoVision", description: "Digital karyotyping and analysis software. Automatically classifies chromosome images and creates karyotypes.", features: "Automatic karyotyping\nChromosome classification\nReporting system\nDatabase management" },
    },
    {
      slug: "easyscan",
      order: 3,
      tr: { name: "EasyScan", description: "Yüksek çözünürlüklü dijital slayt tarayıcı. Hızlı tarama, yüksek kalite görüntüleme ve kolay kullanım.", features: "Yüksek çözünürlük\nHızlı tarama\n20x ve 40x büyütme\nOtomatik odaklama" },
      en: { name: "EasyScan", description: "High-resolution digital slide scanner. Fast scanning, high quality imaging and easy operation.", features: "High resolution\nFast scanning\n20x and 40x magnification\nAuto-focus" },
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        order: p.order,
        translations: {
          create: [
            { locale: "tr", name: p.tr.name, description: p.tr.description, features: p.tr.features },
            { locale: "en", name: p.en.name, description: p.en.description, features: p.en.features },
          ],
        },
      },
    });
  }

  // Create sample applications
  const applications = [
    {
      slug: "cytogenetics",
      order: 1,
      tr: { name: "Sitogenetik", description: "Kromozom analizi, karyotipleme ve sitogenetik laboratuvar otomasyonu çözümleri." },
      en: { name: "Cytogenetics", description: "Chromosome analysis, karyotyping and cytogenetics laboratory automation solutions." },
    },
    {
      slug: "digital-pathology",
      order: 2,
      tr: { name: "Dijital Patoloji", description: "Yüksek çözünürlüklü dijital slayt tarama, görüntüleme ve analiz sistemleri." },
      en: { name: "Digital Pathology", description: "High-resolution digital slide scanning, imaging and analysis systems." },
    },
    {
      slug: "fish-analysis",
      order: 3,
      tr: { name: "FISH Analizi", description: "Floresan in situ hibridizasyon analiz sistemleri ve probları." },
      en: { name: "FISH Analysis", description: "Fluorescence in situ hybridization analysis systems and probes." },
    },
  ];

  for (const a of applications) {
    await prisma.application.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        order: a.order,
        translations: {
          create: [
            { locale: "tr", name: a.tr.name, description: a.tr.description },
            { locale: "en", name: a.en.name, description: a.en.description },
          ],
        },
      },
    });
  }

  // Create completed projects
  const completedProjects = [
    {
      titleTr: "Görüntü İşleme Tabanlı Genetik Tanılama Ve Analiz Sistemleri Geliştirilmesi",
      titleEn: "Development of Image Processing Based Genetic Diagnosis and Analysis Systems",
      sourceTr: "TÜBİTAK 1507 – 2010",
      sourceEn: "TUBITAK 1507 – 2010",
      order: 1,
    },
    {
      titleTr: "Otomatik Metafaz Tarayıcı Kromozom Analiz Sistemi Geliştirilmesi",
      titleEn: "Development of Automatic Metaphase Scanner Chromosome Analysis System",
      sourceTr: "TÜBİTAK 1507 – 2013",
      sourceEn: "TUBITAK 1507 – 2013",
      order: 2,
    },
    {
      titleTr: "Dijital Slayt Tarama Ve Uzak Erişimli Patolojik Görüntü Analiz & Arşivleme Sistemi",
      titleEn: "Digital Slide Scanning and Remote Access Pathological Image Analysis & Archiving System",
      sourceTr: "TÜBİTAK 1511 – 2015",
      sourceEn: "TUBITAK 1511 – 2015",
      order: 3,
    },
    {
      titleTr: "Multispektral Mikroskopik Görüntüleme İle Moleküler Patoloji Ve Genetik Tanıya Yardımcı Tam Otomatik Fluorescence In Situ Hybridization (FISH) Tarama Ve Analiz Sistemi",
      titleEn: "Fully Automatic Fluorescence In Situ Hybridization (FISH) Scanning and Analysis System for Molecular Pathology and Genetic Diagnosis Using Multispectral Microscopic Imaging",
      sourceTr: "TÜBİTAK 1511 – 2018",
      sourceEn: "TUBITAK 1511 – 2018",
      order: 4,
    },
    {
      titleTr: "Akciğer Ve Meme Kanserlerinde İmmünoterapi Uygunluğunun Tümör Dokusunda Tanısına Yönelik Sekans Bazlı PDL1/2 DNA Floresan İn Situ Hibridizasyon (FISH) Probu İle Proba Özgü Analiz Sistemi Geliştirilmesi",
      titleEn: "Development of Sequence-Based PDL1/2 DNA Fluorescence In Situ Hybridization (FISH) Probe and Probe-Specific Analysis System for Immunotherapy Eligibility Diagnosis in Lung and Breast Cancer Tumor Tissue",
      sourceTr: "TÜBİTAK 1501 – 2020",
      sourceEn: "TUBITAK 1501 – 2020",
      order: 5,
    },
    {
      titleTr: "Histopatolojik Görüntü Madenciliği İle Yapay Zeka Tabanlı Dijital İkinci-Görüş Ve Tanıya Yardımcı Karar Destek Sistemi",
      titleEn: "AI-Based Digital Second Opinion and Diagnostic Decision Support System Using Histopathological Image Mining",
      sourceTr: "TÜBİTAK 1511 – 2022",
      sourceEn: "TUBITAK 1511 – 2022",
      order: 6,
    },
  ];

  for (const cp of completedProjects) {
    const existing = await prisma.completedProject.findFirst({
      where: { sourceTr: cp.sourceTr },
    });
    if (!existing) {
      await prisma.completedProject.create({ data: cp });
    }
  }

  console.log("Seed completed!");
  console.log("Admin login: admin@argenit.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
