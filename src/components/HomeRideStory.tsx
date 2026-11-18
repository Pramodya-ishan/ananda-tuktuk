"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import { MotionSection } from "./MotionSection";
import { SectionLink as Link } from "./SectionLink";
import { useLocale } from "@/components/LocaleProvider";

export function HomeRideStory({ about = false }: { about?: boolean }) {
  const { locale, t } = useLocale();
  return <MotionSection cinema className="notebook-ride section-space" labelledBy="home-ride-title">
    <div className="container-page">
      <div className="notebook-section-heading" data-reveal="heading">
        <h2 id="home-ride-title" className="type-display">{t("Your ride should")}<br />{t("fit")}{locale === "zh-CN" ? "" : " "}<em>{t("your day.")}</em></h2>
        <p>{t("Tell me where you’re staying, what you’d like to see and how much time you have. I’ll help you work out the stops.")}</p>
      </div>
      <div className="notebook-ledger">
        <Link href="/tours#explore" data-reveal="short"><span className="notebook-number">01</span><h3>{t("Just need a ride?")}</h3><p>{t("A hotel, a restaurant or an attraction.")}</p><IconArrowUpRight size={22} stroke={1.5} aria-hidden="true" /></Link>
        <Link href="/tours#explore" data-reveal="outing"><span className="notebook-number">02</span><h3>{t("Make a few stops.")}</h3><p>{t("I can wait while you explore.")}</p><IconArrowUpRight size={22} stroke={1.5} aria-hidden="true" /></Link>
        <div data-reveal="choice"><span className="notebook-number">03</span><h3>{t("Keep it your choice.")}</h3><p>{t("Shops, food or a herbal massage. You choose.")}</p></div>
      </div>
      <div className="notebook-ride-end" data-reveal="ending"><p>{t("We’ll agree on pickup, waiting and the ride back before we go.")}</p><Link className="text-link" href={about ? "/tours#explore" : "/about"}>{t(about ? "Let’s plan your ride" : "A little more about me")}<IconArrowUpRight size={18} stroke={1.5} aria-hidden="true" /></Link></div>
    </div>
  </MotionSection>;
}
