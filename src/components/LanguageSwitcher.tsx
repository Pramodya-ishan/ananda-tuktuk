"use client";

import { IconCheck, IconChevronDown, IconWorld } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { languageCodes, languageNames, localeCookie, localePath, locales, stripLocale, type Locale } from "@/lib/i18n/locale";
import { useLocale } from "./LocaleProvider";

function rememberLanguage(language: Locale) {
  const preference = `${localeCookie}=${language}`;
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${preference}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    return document.cookie.split(";").some((entry) => entry.trim() === preference);
  } catch {
    return false;
  }
}

export function LanguageSwitcher({ variant = "menu" }: { variant?: "menu" | "list" }) {
  const { locale, t } = useLocale();
  const disclosure = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      const menu = disclosure.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  function close() {
    if (disclosure.current) disclosure.current.open = false;
    trigger.current?.focus({ preventScroll: true });
  }

  function changeLanguage(language: Locale) {
    const { pathname, search, hash } = window.location;
    const path = stripLocale(pathname);
    const saved = rememberLanguage(language);
    if (language === locale) {
      close();
      return;
    }
    const target = language === "en" && !saved ? `/en${path === "/" ? "" : path}` : localePath(language, path);
    window.location.assign(`${target}${search}${hash}`);
  }

  if (variant === "list") return <ul className="language-chips" aria-label={t("Language")}>
    {locales.map((language) => <li key={language}>
      <button type="button" lang={language} data-language={language} aria-current={language === locale ? "true" : undefined} onClick={() => changeLanguage(language)}>
        <span className="language-chip-code">{languageCodes[language]}</span>{languageNames[language]}
      </button>
    </li>)}
  </ul>;

  return <details className="language-switcher" ref={disclosure}
    onKeyDown={(event) => {
      if (event.key === "Escape" && event.currentTarget.open) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    }}
    onBlur={(event) => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
    }}>
    <summary ref={trigger} className="language-display" aria-label={`${t("Language")}: ${languageNames[locale]}`}>
      <IconWorld size={18} aria-hidden="true" />
      <span className="language-code" aria-hidden="true">{languageCodes[locale]}</span>
      <span className="language-name" aria-hidden="true">{languageNames[locale]}</span>
      <IconChevronDown className="language-chevron" size={14} aria-hidden="true" />
    </summary>
    <ul className="language-options" aria-label={t("Language")}>
      {locales.map((language) => <li key={language}>
        <button type="button" lang={language} data-language={language} aria-current={language === locale ? "true" : undefined}
          onClick={() => changeLanguage(language)}>
          <span className="language-option-name">{languageNames[language]}<small>{languageCodes[language]}</small></span>
          {language === locale && <IconCheck size={16} aria-hidden="true" />}
        </button>
      </li>)}
    </ul>
  </details>;
}
