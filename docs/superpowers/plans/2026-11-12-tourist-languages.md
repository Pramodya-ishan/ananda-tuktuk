# Tourist Languages Implementation Plan

> **For agentic workers:** Execute the approved design in small independently verifiable tasks.

**Goal:** Make the site usable in English, Simplified Chinese, Russian, French, and German without losing ride plans.

**Architecture:** Next.js locale routes render the correct document language and load one translation catalog per visit. A request proxy negotiates the browser preference on unprefixed routes; a native header control stores overrides and navigates to the equivalent URL.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-12-tourist-languages-design.md`

- [x] Add locale negotiation tests and route English URLs internally to English; redirect to non-English prefixes while retaining queries. Test ordered preferences, unsupported languages, explicit URLs and override precedence.
- [x] Add locale provider, localized links, header switcher and alternate-language metadata. Verify mobile layout and preserve current URL fragment and ride selections on a language change.
- [x] Translate the active site copy, destination and outing data, FAQs and planner; preserve IDs, English WhatsApp booking draft, and user-entered values. Test a translated booking and English payload.
- [x] Add the footer call action with an optional configured WhatsApp voice link and a clearly labelled chat-to-call fallback. Keep regular phone and chat links.
- [x] Run unit tests, lint, production build and browser checks across supported locales. No push or deployment.

Verified against a local production build: 10 unit tests, 21 general browser checks, and the locale browser suite at widths from 320px to 1440px. The locale suite checks public URL handling, non-cacheable negotiated English responses, a keyboard-accessible switcher, draft persistence, and the footer chat-to-call fallback.
