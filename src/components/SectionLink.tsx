"use client";

import type { ComponentProps } from "react";
import { useLocalizedHref } from "./LocaleLink";

// Next.js 16.2.10 can append a cached route's fragment twice on repeat visits.
// Native section links keep the URL and scroll target correct. The ride draft
// survives these navigations in session storage, and regular navigation uses Link.
export function SectionLink({ href, ...props }: ComponentProps<"a">) {
  const localize = useLocalizedHref();
  return <a {...props} href={href === undefined ? undefined : localize(href)} />;
}
