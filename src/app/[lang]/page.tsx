import { Hero } from "@/components/Hero";
import { HomeRideStory } from "@/components/HomeRideStory";
import { DestinationShowcase } from "@/components/DestinationShowcase";
import { ExperienceBrowser } from "@/components/ExperienceBrowser";
import { Faq } from "@/components/Faq";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { getPageLocale, pageAlternates } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { locale } = await getPageLocale(params);
  return { alternates: pageAlternates(locale, "/") };
}

export default function Home() {
  return <main id="main-content"><Hero /><HomeRideStory /><ExperienceBrowser /><DestinationShowcase /><Gallery /><Testimonials /><Faq compact /></main>;
}
