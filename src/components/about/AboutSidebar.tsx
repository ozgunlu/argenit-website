"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

const sidebarItems: {
  href: string;
  labelTr: string;
  labelEn: string;
  external?: boolean;
}[] = [
  { href: "/about", labelTr: "Firma Profili", labelEn: "Company Profile" },
  { href: "/about/board", labelTr: "Yönetim Kurulu", labelEn: "Board of Directors" },
  { href: "/about/experts", labelTr: "Uzman Kadromuz", labelEn: "Our Expert Team" },
  { href: "/about/consultants", labelTr: "Danışman Kadromuz", labelEn: "Our Consultants" },
  { href: "/about/projects", labelTr: "Tamamlanmış Projeler", labelEn: "Completed Projects" },
  { href: "/about/quality", labelTr: "Kalite Politikamız", labelEn: "Quality Policy" },
  { href: "/about/privacy", labelTr: "Kişisel Verilerin Korunması", labelEn: "Personal Data Protection" },
  { href: "/documents/kvkk-basvuru-formu.pdf", labelTr: "KVKK Başvuru Formu", labelEn: "PDPL Application Form", external: true },
  { href: "/about/info-security", labelTr: "Bilgi Güvenliği ve Kişisel Veri Politikası", labelEn: "Information Security & Data Policy" },
];

const sidebarTitle = { tr: "Hakkımızda", en: "About Us" };

export default function AboutSidebar({ currentPath }: { currentPath: string }) {
  const pathname = usePathname();
  const locale = useLocale() as "tr" | "en";
  const activePath = pathname || currentPath;

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200 ${
      activePath === href
        ? "text-slate-900 bg-slate-100"
        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <aside className="lg:w-[260px] shrink-0">
      <div className="lg:sticky lg:top-28">
        <p className="font-[family-name:var(--font-heading)] text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold mb-4">
          {sidebarTitle[locale] || sidebarTitle.tr}
        </p>
        <nav className="flex flex-col gap-0.5">
          {sidebarItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass(item.href)}
              >
                {locale === "en" ? item.labelEn : item.labelTr}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href as "/about"}
                className={linkClass(item.href)}
              >
                {locale === "en" ? item.labelEn : item.labelTr}
              </Link>
            )
          )}
        </nav>
      </div>
    </aside>
  );
}
