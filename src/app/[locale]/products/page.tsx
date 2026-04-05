import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import ScrollReveal from "@/components/home/ScrollReveal";
import ProductCategorySelector from "@/components/product/ProductCategorySelector";

const categoryDescriptions: Record<string, Record<string, string>> = {
  sitogenetik: {
    tr: "Otomatik metafaz tarama, dijital karyotipleme ve FISH analiz sistemleri ile genetik tanıda yüksek hassasiyet ve hız.",
    en: "High precision and speed in genetic diagnostics with automated metaphase scanning, digital karyotyping and FISH analysis systems.",
  },
  patoloji: {
    tr: "Yüksek çözünürlüklü whole-slide tarama, yapay zeka destekli doku analizi ve dijital patoloji iş akışları.",
    en: "High-resolution whole-slide scanning, AI-powered tissue analysis and digital pathology workflows.",
  },
};

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("products");

  const categories = await prisma.productCategory.findMany({
    where: { isActive: true },
    include: {
      translations: { where: { locale } },
      products: {
        where: { isActive: true },
        include: {
          translations: { where: { locale } },
          images: { where: { isMain: true }, take: 1 },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  const categoryData = categories.map((cat) => ({
    slug: cat.slug,
    name: cat.translations[0]?.name || cat.slug,
    description:
      categoryDescriptions[cat.slug]?.[locale] ||
      categoryDescriptions[cat.slug]?.tr ||
      "",
    products: cat.products.map((p) => {
      const tr = p.translations[0];
      return {
        slug: tr?.slug || p.slug,
        name: tr?.name || p.slug,
        desc: tr?.shortDescription || tr?.description || "",
        imageUrl: p.images[0]?.url || null,
      };
    }),
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-6 lg:pt-28 lg:pb-8 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:32px_32px]" />
        <div className="relative mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <ScrollReveal>
            <p className="font-[family-name:var(--font-heading)] text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-4">
              {t("title")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              {t("subtitle")}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
              {t("heroDesc")}
            </p>
          </ScrollReveal>
          <div className="w-12 h-[2px] bg-slate-400 mt-5" />
        </div>
      </section>

      {/* Category Selector + Product Grid */}
      <section className="pt-4 pb-16 lg:pt-6 lg:pb-24 bg-white">
        <div className="mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <ProductCategorySelector
            categories={categoryData}
            locale={locale}
            texts={{
              explore: t("explore"),
              backToCategories: t("backToCategories"),
              viewProduct: t("viewProduct"),
              productsCount: t("productsCount"),
            }}
          />
        </div>
      </section>
    </>
  );
}
