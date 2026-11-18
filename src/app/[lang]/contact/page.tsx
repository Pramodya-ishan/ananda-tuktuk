import type { Metadata } from "next";
import { Planner } from "@/components/Planner";
import { Faq } from "@/components/Faq";
import { MotionSection } from "@/components/MotionSection";
import { getPageLocale, pageAlternates } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { locale, t } = await getPageLocale(params);
  return {
    title: t("Arrange a ride"),
    description: t("Arrange a tuk-tuk ride with me, Ananda. Share your stops, hotel and timing on WhatsApp. I'll confirm the route, waiting, return and price with you."),
    alternates: pageAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[lang]/contact">) {
  const { t } = await getPageLocale(params);
  const { ride } = await searchParams;
  const initialRide = ride === "short" ? "A short ride" : ride === "outing" ? "A few stops" : undefined;
  return <main id="main-content"><MotionSection cinema intro className="cinema-contact cinema-ui" label={t("Arrange a ride")}><div className="container-page"><p className="eyebrow" data-intro>{t("Tell me what you have in mind")}</p><h1 data-intro>{t("Let's plan")} <em>{t("a ride.")}</em></h1><p className="cinema-contact-intro" data-intro>{t("Share your pickup and stops. I’ll reply on WhatsApp to confirm the plan and price.")}</p></div></MotionSection><Planner key={initialRide} initialRide={initialRide} /><Faq /></main>;
}
