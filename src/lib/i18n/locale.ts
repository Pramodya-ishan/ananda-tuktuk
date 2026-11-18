export const locales = ["en", "de", "fr", "ru", "zh-CN"] as const;
export type Locale = (typeof locales)[number];
export type Translations = Readonly<Record<string, string>>;
export type Values = Record<string, string | number>;

export const languageNames: Record<Locale, string> = {
  en: "English", de: "Deutsch", fr: "Français", ru: "Русский", "zh-CN": "简体中文",
};
export const languageCodes: Record<Locale, string> = {
  en: "EN", de: "DE", fr: "FR", ru: "RU", "zh-CN": "中文",
};
export const localeCookie = "ananda-language";

export function localeFromSegment(segment: string): Locale | undefined {
  return locales.find((locale) => locale.toLowerCase() === segment);
}

export function stripLocale(pathname: string): string {
  const segment = pathname.split("/")[1];
  return localeFromSegment(segment) ? pathname.slice(segment.length + 1) || "/" : pathname;
}

export function localePath(locale: Locale, href: string): string {
  if (locale === "en" || !href.startsWith("/") || href.startsWith("//")) return href;
  const [, path, suffix] = href.match(/^([^?#]*)(.*)$/) ?? [];
  return `/${locale.toLowerCase()}${path === "/" ? "" : path}${suffix}`;
}

export function detectLocale(header: string | null): Locale {
  const preferences = (header ?? "").split(",").map((entry) => {
    const [tag, ...params] = entry.toLowerCase().trim().split(";");
    const quality = params.find((param) => /^\s*q\s*=/.test(param));
    const weight = quality === undefined ? 1 : Number(quality.split("=")[1]);
    return { tag: tag.trim(), weight };
  }).filter(({ weight }) => weight > 0 && weight <= 1).sort((a, b) => b.weight - a.weight);

  for (const { tag } of preferences) {
    if (!/^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/.test(tag)) continue;
    const primary = tag.split("-")[0];
    if (primary === "zh") {
      const script = tag.split("-").find((part) => part === "hans" || part === "hant");
      if (script === "hans" || (!script && !/(?:^|-)(tw|hk|mo)(?:-|$)/.test(tag))) return "zh-CN";
      continue;
    }
    const locale = localeFromSegment(primary);
    if (locale) return locale;
  }
  return "en";
}

export function preferredLocale(saved: string | undefined, header: string | null): Locale {
  return locales.find((locale) => locale === saved) ?? detectLocale(header);
}

export function translate(messages: Translations, english: string, values?: Values): string {
  const text = Object.hasOwn(messages, english) ? messages[english] : english;
  return values ? text.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : placeholder) : text;
}
