import { notFound } from "next/navigation";
import { cache } from "react";
import { getSiteUrl } from "../site-config";
import { bookingMessages } from "./booking";
import { contentMessages } from "./content";
import { editorialMessages } from "./editorial";
import { locales, localeFromSegment, localePath, translate, type Locale, type Translations } from "./locale";
import { siteMessages } from "./site";

export const getMessages = cache((locale: Locale): Translations => locale === "en" ? {} : {
  ...contentMessages[locale], ...bookingMessages[locale], ...editorialMessages[locale], ...siteMessages[locale],
});

export async function getPageLocale(params: Promise<{ lang: string }>) {
  const locale = localeFromSegment((await params).lang);
  if (!locale) notFound();
  const messages = getMessages(locale);
  return { locale, messages, t: (english: string) => translate(messages, english) };
}

export function pageAlternates(locale: Locale, path: string) {
  const siteUrl = getSiteUrl();
  const url = (href: string) => siteUrl ? new URL(href, siteUrl).href : href;
  // The explicit English route is stable even for browsers that prefer another language.
  const english = url(path === "/" ? "/en" : `/en${path}`);
  return {
    canonical: url(localePath(locale, path)),
    languages: {
      ...Object.fromEntries(locales.map((language) => [language, language === "en" ? english : url(localePath(language, path))])),
      "x-default": url(path),
    },
  };
}
