import type { Metadata } from "next";
import { CinematicHero } from "@/components/CinematicHero";
import { ExperienceBrowser } from "@/components/ExperienceBrowser";
import { OutingIdeas } from "@/components/OutingIdeas";
import { Planner } from "@/components/Planner";
import { getPageLocale, pageAlternates } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[lang]/tours">): Promise<Metadata> {
  const { locale, t } = await getPageLocale(params);
  return {
    title: t("Places to Explore"),
    description: t("Come exploring with me, Ananda. Choose Sigiriya, Dambulla, local food, woodwork, herbs, herbal massage centres and scenic stops for your tuk-tuk ride."),
    alternates: pageAlternates(locale, "/tours"),
  };
}

export default async function ToursPage({ params }: PageProps<"/[lang]/tours">) {
  const { t } = await getPageLocale(params);
  return <main id="main-content"><CinematicHero eyebrow={t("Places around Dambulla & Sigiriya")} title={t("Your day.")} emphasis={t("Your stops.")} subtitle={t("Choose sights, food, crafts, shops or a herbal massage. We'll work out the route together.")} backgroundImage="/images/heritage.webp" alt={t("Colourful traditional Sri Lankan masks")} action={t("Choose stops")} href="#explore" /><ExperienceBrowser full /><OutingIdeas /><Planner /></main>;
}
