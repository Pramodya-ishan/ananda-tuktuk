"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ComponentProps } from "react";
import { localePath } from "@/lib/i18n/locale";
import { useLocale } from "./LocaleProvider";

const subscribe = () => () => {};
const onExplicitEnglishRoute = () => /^\/en(?:\/|$)/.test(window.location.pathname);
const serverSnapshot = () => false;

export function useLocalizedHref() {
  const { locale } = useLocale();
  // The App Router can report the internal /en rewrite rather than the public URL.
  // Observe route changes, but use the actual browser address to keep English links unprefixed.
  usePathname();
  const explicitEnglish = useSyncExternalStore(subscribe, onExplicitEnglishRoute, serverSnapshot);
  return (href: string) => locale === "en" && explicitEnglish && /^\/(?!\/)/.test(href)
    ? `/en${href.replace(/^\/(?=[?#]|$)/, "")}`
    : localePath(locale, href);
}

export function LocaleLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const localize = useLocalizedHref();
  return <Link {...props} href={localize(href)} />;
}
