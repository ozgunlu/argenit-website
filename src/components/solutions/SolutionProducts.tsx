import { prisma } from "@/lib/db";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

interface SolutionProductsProps {
  categorySlugs: string[];
  accentColor?: "blue" | "emerald" | "purple" | "amber";
}

const colorMap = {
  blue: {
    bg: "bg-[#050a18]",
    glow1: "bg-blue-600/5",
    glow2: "bg-cyan-500/5",
    dot: "bg-blue-400/40",
    badge: "text-blue-400 bg-blue-500/10 border-blue-400/20",
    name: "group-hover:text-blue-400",
    arrow: "group-hover:text-blue-400",
    border: "hover:border-blue-400/20",
    image: "bg-blue-500/10",
  },
  emerald: {
    bg: "bg-[#030812]",
    glow1: "bg-emerald-600/5",
    glow2: "bg-teal-500/5",
    dot: "bg-emerald-400/40",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-400/20",
    name: "group-hover:text-emerald-400",
    arrow: "group-hover:text-emerald-400",
    border: "hover:border-emerald-400/20",
    image: "bg-emerald-500/10",
  },
  purple: {
    bg: "bg-[#080514]",
    glow1: "bg-purple-600/5",
    glow2: "bg-violet-500/5",
    dot: "bg-purple-400/40",
    badge: "text-purple-400 bg-purple-500/10 border-purple-400/20",
    name: "group-hover:text-purple-400",
    arrow: "group-hover:text-purple-400",
    border: "hover:border-purple-400/20",
    image: "bg-purple-500/10",
  },
  amber: {
    bg: "bg-[#0a0804]",
    glow1: "bg-amber-600/5",
    glow2: "bg-orange-500/5",
    dot: "bg-amber-400/40",
    badge: "text-amber-400 bg-amber-500/10 border-amber-400/20",
    name: "group-hover:text-amber-400",
    arrow: "group-hover:text-amber-400",
    border: "hover:border-amber-400/20",
    image: "bg-amber-500/10",
  },
};

export default async function SolutionProducts({
  categorySlugs,
  accentColor = "blue",
}: SolutionProductsProps) {
  const locale = await getLocale();
  const t = await getTranslations();
  const c = colorMap[accentColor];

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: { in: categorySlugs } },
    },
    include: {
      translations: { where: { locale } },
      images: { where: { isMain: true }, take: 1 },
      category: { include: { translations: { where: { locale } } } },
    },
    orderBy: { order: "asc" },
  });

  if (products.length === 0) return null;

  return (
    <section className={`relative py-20 lg:py-28 ${c.bg} overflow-hidden`}>
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:32px_32px]" />
      <div className={`absolute top-1/2 left-1/4 w-[400px] h-[400px] ${c.glow1} rounded-full blur-[150px]`} />
      <div className={`absolute bottom-0 right-1/4 w-[300px] h-[300px] ${c.glow2} rounded-full blur-[120px]`} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/30 mb-4">
            {t("solutions.relatedProductsLabel")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {t("solutions.relatedProductsTitle")}
          </h2>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const tr = product.translations[0];
            const mainImage = product.images[0];
            const catName = product.category?.translations[0]?.name;
            if (!tr) return null;

            return (
              <Link
                key={product.id}
                href={{ pathname: "/products/[slug]", params: { slug: tr.slug || product.slug } }}
                className={`group relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm ${c.border} transition-all duration-500 overflow-hidden`}
              >
                {/* Image */}
                <div className={`relative aspect-[16/10] ${c.image} overflow-hidden`}>
                  {mainImage ? (
                    <img
                      src={mainImage.url}
                      alt={tr.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-white/10">
                        {tr.name}
                      </span>
                    </div>
                  )}
                  {/* Category badge */}
                  {catName && (
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md ${c.badge}`}>
                      {catName}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <h3 className={`font-[family-name:var(--font-heading)] text-base font-bold text-white mb-2 ${c.name} transition-colors duration-300`}>
                    {tr.name}
                  </h3>
                  {tr.shortDescription && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {tr.shortDescription}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 pb-4 flex items-center justify-between">
                  <span className="text-xs text-white/30 font-mono">{t("common.learnMore")}</span>
                  <ArrowRight size={14} className={`text-white/20 ${c.arrow} transition-colors duration-300`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
