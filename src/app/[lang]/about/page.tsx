import type { Metadata } from "next";
import { LocalNotebook, NotebookEnding } from "@/components/LocalNotebook";
import { HomeRideStory } from "@/components/HomeRideStory";
import { getPageLocale, pageAlternates } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { locale, t } = await getPageLocale(params);
  return {
    title: t("About me"),
    description: t("I'm Ananda, your local tuk-tuk driver around Dambulla and Sigiriya. I'll pick you up, wait at your stops and bring you back to your hotel."),
    alternates: pageAlternates(locale, "/about"),
  };
}

export default function AboutPage() {
  return <main id="main-content"><LocalNotebook /><HomeRideStory about /><NotebookEnding /></main>;
}
