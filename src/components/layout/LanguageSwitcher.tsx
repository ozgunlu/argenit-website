"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales } from "@/i18n/config";
import { useAlternateSlugs } from "@/components/product/AlternateSlugProvider";

const localeLabels: Record<string, string> = { tr: "TR", en: "EN" };

export default function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const alternateSlugs = useAlternateSlugs();

  const isDark = variant === "dark";

  function handleSwitch(targetLocale: "tr" | "en") {
    const altSlug = alternateSlugs[targetLocale];
    // On product detail pages, pathname is like /products/some-slug
    const productMatch = pathname.match(/^\/products\/(.+)$/);
    if (altSlug && productMatch) {
      router.replace(
        { pathname: "/products/[slug]", params: { slug: altSlug } } as any,
        { locale: targetLocale },
      );
    } else if (productMatch) {
      // Product page but no alternate slug — keep current slug
      router.replace(
        { pathname: "/products/[slug]", params: { slug: productMatch[1] } } as any,
        { locale: targetLocale },
      );
    } else {
      router.replace(pathname as "/", { locale: targetLocale });
    }
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc, i) => (
        <div key={loc} className="flex items-center gap-1">
          {i > 0 && (
            <span className={`w-px h-2.5 ${isDark ? "bg-white/20" : "bg-slate-200"}`} />
          )}
          <button
            onClick={() => handleSwitch(loc as "tr" | "en")}
            className={`px-2 py-1 cursor-pointer font-[family-name:var(--font-heading)] text-[11px] font-semibold tracking-[0.15em] transition-colors duration-200 ${
              locale === loc
                ? isDark
                  ? "text-white"
                  : "text-slate-900"
                : isDark
                  ? "text-white/40 hover:text-white/70"
                  : "text-slate-300 hover:text-slate-500"
            }`}
          >
            {localeLabels[loc]}
          </button>
        </div>
      ))}
    </div>
  );
}
