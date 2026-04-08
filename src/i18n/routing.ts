import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/products": {
      tr: "/urunler",
      en: "/products",
    },
    "/products/[slug]": {
      tr: "/urunler/[slug]",
      en: "/products/[slug]",
    },
    "/about": "/about",
    "/about/board": "/about/board",
    "/about/experts": "/about/experts",
    "/about/consultants": "/about/consultants",
    "/about/projects": "/about/projects",
    "/about/quality": "/about/quality",
    "/about/privacy": "/about/privacy",
    "/about/kvkk-form": "/about/kvkk-form",
    "/about/info-security": "/about/info-security",
    "/solutions/akas": {
      tr: "/cozumler/akas",
      en: "/solutions/akas",
    },
    "/solutions/easyfish": {
      tr: "/cozumler/easyfish",
      en: "/solutions/easyfish",
    },
    "/solutions/easypath": {
      tr: "/cozumler/easypath",
      en: "/solutions/easypath",
    },
    "/solutions/pathica": {
      tr: "/cozumler/pathica",
      en: "/solutions/pathica",
    },
    "/contact": "/contact",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type AppPathnames = typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
