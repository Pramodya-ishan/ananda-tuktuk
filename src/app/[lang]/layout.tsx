import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import localFont from "next/font/local";
import "../globals.css";
import "../footer.css";
import "../language.css";
import "../whatsapp-fab.css";
import "../planner.css";
import { LenisProvider } from "@/components/LenisProvider";
import { RideProvider } from "@/components/RideProvider";
import { NavBar } from "@/components/NavBar";
import { MobileRideBar } from "@/components/MobileRideBar";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getSiteUrl } from "@/lib/site-config";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getPageLocale } from "@/lib/i18n/server";
import { locales } from "@/lib/i18n/locale";

const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-roman.woff2", style: "normal", weight: "100 900" },
    { path: "../fonts/fraunces-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-fraunces", display: "swap", fallback: ["Georgia", "serif"],
});
const inter = localFont({
  src: "../fonts/inter.woff2", weight: "100 900", variable: "--font-inter", display: "swap",
});

const siteUrl = getSiteUrl();
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8F6F2",
};

type LangParams = Promise<{ lang: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const { locale, t } = await getPageLocale(params);
  const description = t("I'm Ananda, your local tuk-tuk driver around Dambulla and Sigiriya. Choose sights, food, crafts and herbal massage centres. I'll pick you up, wait and bring you back.");
  const title = t("Ananda's Tuk-Tuk Rides | Dambulla & Sigiriya");
  const siteName = t("Ananda's Tuk-Tuk");
  const socialTitle = t("A friendly ride. A little more of Sri Lanka.");
  return {
    metadataBase: siteUrl,
    title: { default: title, template: `%s | ${siteName}` },
    description,
    openGraph: {
      type: "website", locale: { en: "en_GB", de: "de_DE", fr: "fr_FR", ru: "ru_RU", "zh-CN": "zh_CN" }[locale],
      siteName, title: socialTitle, description,
      ...(siteUrl ? { images: [{ url: "/images/hero-red.webp", width: 1024, height: 1024, alt: t("A red tuk-tuk with Sigiriya Rock in the distance") }] } : {}),
    },
    twitter: { card: "summary_large_image", title: socialTitle, description },
  };
}

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: LangParams }>) {
  const { locale, messages, t } = await getPageLocale(params);
  // English also serves the unprefixed, language-negotiated URLs. Prevent
  // Next's static cache headers from overriding Proxy's no-store policy there.
  if (locale === "en") await connection();
  return <html lang={locale} data-scroll-behavior="smooth" className={`${fraunces.variable} ${inter.variable}`}><body>
    <a href="#main-content" className="skip-link">{t("Skip to content")}</a>
    <LocaleProvider locale={locale} messages={messages}><RideProvider><LenisProvider><NavBar />{children}<Footer messages={messages} /><MobileRideBar /><WhatsAppFab /></LenisProvider></RideProvider></LocaleProvider>
  </body></html>;
}
