import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const t = useTranslations();

  const links = [
    { href: "/" as const, label: t("common.home") },
    { href: "/about" as const, label: t("common.about") },
    { href: "/products" as const, label: t("common.products") },
    { href: "/contact" as const, label: t("common.contact") },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <span className="text-white font-bold text-lg font-[family-name:var(--font-heading)]">A</span>
              </div>
              <span className="text-xl font-bold text-white font-[family-name:var(--font-heading)] tracking-tight">
                Argenit
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-5">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-5">
              {t("footer.contactInfo")}
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-light shrink-0 mt-0.5" />
                <span>
                  {t("contact.addressValue")}<br />
                  {t("contact.addressValue2")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-light shrink-0" />
                {t("contact.phoneValue")}
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-light shrink-0" />
                <a href={`mailto:${t("contact.emailValue")}`} className="hover:text-white transition-colors">
                  {t("contact.emailValue")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Argenit. {t("common.allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}
