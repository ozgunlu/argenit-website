"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import { ArrowRight, ArrowLeft, Microscope, ScanLine } from "lucide-react";
import ScrollReveal from "@/components/home/ScrollReveal";

const CytogeneticsCanvas = dynamic(() => import("./CytogeneticsCanvas"), {
  ssr: false,
});
const PathologyCanvas = dynamic(() => import("./PathologyCanvas"), {
  ssr: false,
});

interface Product {
  slug: string;
  name: string;
  desc: string;
  imageUrl: string | null;
}

interface CategoryData {
  slug: string;
  name: string;
  description: string;
  products: Product[];
}

const categoryMeta = {
  sitogenetik: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    gradient: "from-[#0a1628] to-[#0c1f3d]",
    accent: "blue",
    tagClass: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  },
  patoloji: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    gradient: "from-[#140a28] to-[#1a0c3d]",
    accent: "violet",
    tagClass: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  },
} as const;

export default function ProductCategorySelector({
  categories,
  locale,
  texts,
}: {
  categories: CategoryData[];
  locale: string;
  texts: {
    explore: string;
    backToCategories: string;
    viewProduct: string;
    productsCount: string;
  };
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const selectedCat = categories.find((c) => c.slug === selected);
  const meta =
    categoryMeta[(selected as keyof typeof categoryMeta) || "sitogenetik"];

  // Scroll to product grid when selected
  useEffect(() => {
    if (selected && gridRef.current) {
      setTimeout(() => {
        const el = gridRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const headerH = 96;
        window.scrollTo({ top: top - headerH, behavior: "smooth" });
      }, 100);
    }
  }, [selected]);

  return (
    <>
      {/* ── Category Cards ── */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${
          selected ? "md:gap-4" : "md:gap-6"
        }`}
      >
        {categories.map((cat, i) => {
          const slug = cat.slug as keyof typeof categoryMeta;
          const m = categoryMeta[slug] || categoryMeta.sitogenetik;
          const isSelected = selected === cat.slug;
          const isOther = selected && !isSelected;

          return (
            <ScrollReveal key={cat.slug} delay={i * 0.1}>
              <button
                onClick={() => setSelected(isSelected ? null : cat.slug)}
                className={`group relative w-full overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer text-left ${
                  isOther
                    ? "opacity-40 scale-[0.97] hover:opacity-70"
                    : isSelected
                      ? "ring-2 ring-white/20"
                      : ""
                }`}
                style={{
                  height: selected ? (isSelected ? "280px" : "200px") : "340px",
                  transition:
                    "height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s, transform 0.4s",
                }}
              >
                {/* Dark gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${m.gradient}`}
                />

                {/* WebGL Canvas */}
                <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-700">
                  {slug === "sitogenetik" ? (
                    <CytogeneticsCanvas />
                  ) : (
                    <PathologyCanvas />
                  )}
                </div>

                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center backdrop-blur-sm`}
                    >
                      {slug === "sitogenetik" ? (
                        <Microscope size={20} className={m.iconColor} />
                      ) : (
                        <ScanLine size={20} className={m.iconColor} />
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${m.tagClass}`}
                    >
                      {cat.products.length} {texts.productsCount}
                    </span>
                  </div>

                  <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                    {cat.name}
                  </h2>

                  <p
                    className={`text-sm text-white/50 leading-relaxed max-w-md transition-all duration-300 ${
                      isOther
                        ? "opacity-0 max-h-0"
                        : "opacity-100 max-h-20"
                    }`}
                  >
                    {cat.description}
                  </p>

                  <div
                    className={`flex items-center gap-2 mt-4 text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? "text-white/80"
                        : "text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    <span>
                      {isSelected
                        ? texts.backToCategories
                        : texts.explore}
                    </span>
                    <ArrowRight
                      size={14}
                      className={`transition-transform duration-300 ${
                        isSelected ? "rotate-90" : "group-hover:translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </button>
            </ScrollReveal>
          );
        })}
      </div>

      {/* ── Product Grid (appears when category selected) ── */}
      {selectedCat && (
        <div ref={gridRef} className="mt-10">
          {/* Back button */}
          <button
            onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={14} />
            {texts.backToCategories}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCat.products.map((product, i) => (
              <ScrollReveal key={product.slug} delay={i * 0.06}>
                <Link
                  href={{
                    pathname: "/products/[slug]",
                    params: { slug: product.slug },
                  }}
                  className="group block bg-white rounded-lg border border-slate-200/80 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center px-6">
                        <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-200 tracking-tight text-center select-none">
                          {product.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-[family-name:var(--font-heading)] text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 shrink-0 ml-3" />
                    </div>
                    <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2">
                      {product.desc}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
