import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AlternateSlugProvider } from "@/components/product/AlternateSlugProvider";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    tr: "Argenit - Akıllı Bilişim Teknolojileri",
    en: "Argenit - Smart Information Technologies",
  };
  const descriptions: Record<string, string> = {
    tr: "Sitogenetik ve dijital patoloji alanında yenilikçi çözümler",
    en: "Innovative solutions in cytogenetics and digital pathology",
  };
  return {
    title: {
      default: titles[locale] || titles.en,
      template: `%s | Argenit`,
    },
    description: descriptions[locale] || descriptions.en,
    robots: { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "tr")) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} className="antialiased">
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AlternateSlugProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AlternateSlugProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
