import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Phone,
  Mail,
  Box,
} from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import { AlternateSlugSetter } from "@/components/product/AlternateSlugProvider";

async function getProductByLocaleSlug(slug: string, locale: string) {
  // Find product via its locale-specific translation slug
  return prisma.product.findFirst({
    where: {
      translations: { some: { slug, locale } },
    },
    include: {
      translations: true,
      category: { include: { translations: true } },
      images: { orderBy: { order: "asc" } },
      models: { include: { translations: true }, orderBy: { order: "asc" } },
      catalogs: { orderBy: { order: "asc" } },
    },
  });
}

// Hreflang metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductByLocaleSlug(slug, locale);
  if (!product) return {};

  const tr = product.translations.find((t) => t.locale === locale) || product.translations[0];
  const trSlug = product.translations.find((t) => t.locale === "tr")?.slug;
  const enSlug = product.translations.find((t) => t.locale === "en")?.slug;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://argenit.com.tr";

  return {
    title: tr?.name,
    description: tr?.shortDescription || tr?.description?.slice(0, 160),
    alternates: {
      canonical: locale === "tr"
        ? `${baseUrl}/urunler/${trSlug}`
        : `${baseUrl}/en/products/${enSlug}`,
      languages: {
        ...(trSlug && { "tr": `${baseUrl}/urunler/${trSlug}` }),
        ...(enSlug && { "en": `${baseUrl}/en/products/${enSlug}` }),
        "x-default": `${baseUrl}/urunler/${trSlug || slug}`,
      },
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations();

  const product = await getProductByLocaleSlug(slug, locale);
  if (!product || !product.isActive) return notFound();

  const tr = product.translations.find((t) => t.locale === locale) ||
    product.translations[0];
  if (!tr) return notFound();

  const categoryName =
    product.category?.translations.find((t) => t.locale === locale)?.name ||
    product.category?.translations[0]?.name;

  const features = tr.features
    ? tr.features.split("\n").filter((f) => f.trim())
    : [];

  const models = product.models.map((m) => {
    const mt = m.translations.find((t) => t.locale === locale) || m.translations[0];
    return { name: mt?.name || "", description: mt?.description || "" };
  });

  // Related products from same category
  let relatedProducts: { slug: string; name: string; description: string }[] = [];
  if (product.categoryId) {
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      include: { translations: { where: { locale } } },
      orderBy: { order: "asc" },
      take: 3,
    });
    relatedProducts = related.map((r) => ({
      slug: r.translations[0]?.slug || r.slug,
      name: r.translations[0]?.name || r.slug,
      description: r.translations[0]?.shortDescription || r.translations[0]?.description || "",
    }));
  }

  // Sidebar: same category products
  let sidebarProducts: { slug: string; name: string }[] = [];
  if (product.categoryId) {
    const siblings = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      include: { translations: { where: { locale } } },
      orderBy: { order: "asc" },
    });
    sidebarProducts = siblings.map((s) => ({
      slug: s.translations[0]?.slug || s.slug,
      name: s.translations[0]?.name || s.slug,
    }));
  }

  const images = product.images.map((img) => ({
    url: img.url,
    alt: (locale === "tr" ? img.altTr : img.altEn) || img.altTr || tr.name,
    isMain: img.isMain,
  }));

  // Build locale → slug map for language switcher
  const alternateSlugs: Record<string, string> = {};
  for (const t2 of product.translations) {
    if (t2.slug) alternateSlugs[t2.locale] = t2.slug;
  }

  return (
    <>
      <AlternateSlugSetter slugs={alternateSlugs} />
      {/* ── Hero / Breadcrumb ── */}
      <section className="relative pt-24 pb-6 lg:pt-28 lg:pb-8 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:32px_32px]" />
        <div className="relative mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              {t("common.home")}
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors">
              {t("common.products")}
            </Link>
            <span>/</span>
            <span className="text-slate-600">{tr.name}</span>
          </nav>

          {categoryName && (
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary-50 text-primary mb-4">
              {categoryName}
            </span>
          )}

          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
            {tr.name}
          </h1>

          {tr.shortDescription && (
            <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
              {tr.shortDescription}
            </p>
          )}

          <div className="w-12 h-[2px] bg-slate-400 mt-5" />
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="pt-4 pb-10 lg:pt-6 lg:pb-14 bg-white">
        <div className="mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* ── Left: Content ── */}
            <div className="lg:col-span-2 space-y-12">
              {images.length > 0 && <ProductGallery images={images} />}

              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                  {t("products.about")}
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {tr.description}
                </p>
              </div>

              {features.length > 0 && (
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                    {t("products.features")}
                  </h2>
                  <ul className="space-y-3">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="text-primary" />
                        </div>
                        <span className="text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {models.length > 0 && (
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                    {t("products.models")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {models.map((model, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-sm transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                          <Box size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{model.name}</h3>
                          <p className="text-sm text-slate-500">{model.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.catalogs.length > 0 && (
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                    {t("products.catalogs")}
                  </h2>
                  <div className="space-y-3">
                    {product.catalogs.map((catalog) => (
                      <a
                        key={catalog.id}
                        href={catalog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 group-hover:text-primary transition-colors truncate">
                            {catalog.title}
                          </p>
                          {catalog.fileSize && (
                            <p className="text-xs text-slate-400">{catalog.fileSize}</p>
                          )}
                        </div>
                        <Download size={18} className="text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Sidebar ── */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
                <h4 className="font-semibold mb-2">{t("products.requestDemo")}</h4>
                <p className="text-sm text-white/70 mb-5 leading-relaxed">
                  {tr.name}{" "}
                  {locale === "tr"
                    ? "hakkinda demo ve fiyat bilgisi icin bize ulasin."
                    : "- contact us for demo and pricing information."}
                </p>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  {t("common.contact")}
                  <ArrowRight size={16} />
                </Link>
              </div>

              {sidebarProducts.length > 0 && (
                <div className="rounded-2xl border border-slate-200 p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {categoryName}{" "}
                    {locale === "tr" ? "Urunleri" : "Products"}
                  </h4>
                  <nav className="space-y-2">
                    {sidebarProducts.map((sp) => (
                      <Link
                        key={sp.slug}
                        href={{ pathname: "/products/[slug]", params: { slug: sp.slug } }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <Box size={16} className="text-slate-400 shrink-0" />
                        {sp.name}
                      </Link>
                    ))}
                    <Link
                      href="/products"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary font-medium hover:bg-primary-50 transition-colors mt-2 border-t border-slate-100 pt-4"
                    >
                      {t("products.allProducts")}
                      <ArrowRight size={14} />
                    </Link>
                  </nav>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 p-6">
                <h4 className="font-semibold text-slate-900 mb-4">
                  {t("products.contactUs")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="tel:+902122851644" className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary transition-colors">
                      <Phone size={16} className="text-slate-400" />
                      +90 212 285 16 44
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@argenit.com.tr" className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary transition-colors">
                      <Mail size={16} className="text-slate-400" />
                      info@argenit.com.tr
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-slate-100 bg-slate-50/50">
          <div className="mx-auto px-5 sm:px-8 lg:px-[6.5%]">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900 mb-8">
              {t("products.relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={{ pathname: "/products/[slug]", params: { slug: rp.slug } }}
                  className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <Box size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors mb-1">
                      {rp.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{rp.description}</p>
                  </div>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-primary transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
