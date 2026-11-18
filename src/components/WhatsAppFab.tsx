"use client";

import { enquiryLink } from "@/lib/site-config";
import { useLocale } from "./LocaleProvider";

export function WhatsAppFab() {
  const { t } = useLocale();
  if (!enquiryLink) return null;
  const label = t("Chat on WhatsApp");
  return <a className="whatsapp-fab" href={enquiryLink} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <span className="whatsapp-fab-ripple" aria-hidden="true" />
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M16.04 3C8.9 3 3.1 8.78 3.1 15.9c0 2.28.6 4.5 1.73 6.46L3 29l6.83-1.79a12.9 12.9 0 0 0 6.2 1.58h.01c7.13 0 12.93-5.79 12.93-12.9C28.97 8.78 23.17 3 16.04 3Zm0 23.6h-.01a10.7 10.7 0 0 1-5.46-1.5l-.39-.23-4.05 1.06 1.08-3.95-.26-.4a10.67 10.67 0 0 1-1.64-5.68c0-5.9 4.81-10.7 10.74-10.7 2.87 0 5.56 1.11 7.59 3.14a10.6 10.6 0 0 1 3.14 7.57c0 5.9-4.81 10.7-10.74 10.7Zm5.89-8.01c-.32-.16-1.91-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.26-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.12 1.32 3.33.16.21 2.28 3.47 5.52 4.87.77.33 1.37.53 1.84.68.77.24 1.48.21 2.03.13.62-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z"/>
    </svg>
    <span className="whatsapp-fab-label" aria-hidden="true">{label}</span>
  </a>;
}
