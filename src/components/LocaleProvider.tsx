"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translate, type Locale, type Translations, type Values } from "@/lib/i18n/locale";

const LocaleContext = createContext({ locale: "en" as Locale, t: (english: string, values?: Values) => translate({}, english, values) });

export function LocaleProvider({ locale, messages, children }: { locale: Locale; messages: Translations; children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, t: (english, values) => translate(messages, english, values) }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
