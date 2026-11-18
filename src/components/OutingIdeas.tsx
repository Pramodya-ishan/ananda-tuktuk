"use client";

import Image from "next/image";
import { SectionLink as Link } from "./SectionLink";
import { outings, stops } from "@/lib/content";
import { useRide } from "./RideProvider";
import { MotionSection } from "./MotionSection";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useLocale } from "./LocaleProvider";

export function OutingIdeas() {
  const { locale, t } = useLocale();
  const [heading, emphasis] = t("A few ideas for\nyour day.").split("\n");
  const { addStops, updateDraft } = useRide();
  return <MotionSection cinema className="outing-section section-space" label={t("Ideas for an outing")}>
    <div className="container-page">
      <div className="section-heading" data-reveal="heading">
        <h2 className="type-display">{heading}{locale === "zh-CN" ? "" : " "}<em>{emphasis}</em></h2>
        <p>{t("Choose an outing. Add food, a workshop, herbs or a massage if you like.")}</p>
      </div>
      <div className="outing-grid">{outings.map((outing) => <article className="outing-card" data-reveal={outing.title} key={outing.title}>
        <div className="outing-photo"><Image src={outing.image} alt={t(outing.alt)} fill sizes="(max-width: 599px) 92vw, (max-width: 999px) 44vw, 30vw" quality={65} className="cover-image" /></div>
        <div className="outing-copy">
          <h3>{t(outing.title)}</h3>
          <p>{t(outing.description)}</p>
          <ol className="outing-stops">{outing.stops.map((id) => {
            const stop = stops.find((entry) => entry.id === id);
            return stop && <li key={id}>{t(stop.title)}</li>;
          })}</ol>
          <Link href="/contact?ride=outing#plan" onClick={() => {
            addStops(outing.stops);
            updateDraft({ rideType: "A few stops" });
          }} className="text-link">{t("Choose this outing")}<IconArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </article>)}</div>
      <p className="outing-footnote" data-reveal="note">{t("Hotel pickup, waiting and a ride back. We'll confirm the route and any activity costs together.")}</p>
    </div>
  </MotionSection>;
}
