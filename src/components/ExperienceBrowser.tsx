"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionLink as Link } from "./SectionLink";
import { IconArrowUpRight, IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { categories, featuredStopIds, stops, type Category, type Stop } from "@/lib/content";
import { useRide } from "./RideProvider";
import { useSheet } from "./useSheet";
import { MotionSection } from "./MotionSection";
import { PlacePhotoGallery } from "./PlacePhotoGallery";
import { useLocale } from "./LocaleProvider";

export function ExperienceBrowser({ full = false }: { full?: boolean }) {
  const { locale, t } = useLocale();
  const [heading, emphasis] = t(full ? "Choose your\nstops." : "More than\nthe sights.").split("\n");
  const [category, setCategory] = useState<Category>("all");
  const [active, setActive] = useState<Stop>(stops[0]);
  const [hasOpened, setHasOpened] = useState(false);
  const [galleryVisit, setGalleryVisit] = useState(0);
  const { selected, toggleStop } = useRide();
  const { ref: dialogRef, open: openSheet, close: closeSheet } = useSheet();
  const available = full ? stops : stops.filter((stop) => featuredStopIds.includes(stop.id));
  const visible = available.filter((stop) => category === "all" || stop.category === category);
  const count = selected.length;
  function filter(id: Category) {
    if (id === category) return;
    setCategory(id);
  }
  return <MotionSection cinema id="explore" className="experience-section section-space" label={t("Places and experiences to explore")} motionKey={category}>
    <div className="container-page">
      <div className="section-heading heading-with-link" data-reveal="heading">
        <div>
          <h2 className="type-display">{heading}{locale === "zh-CN" ? "" : " "}<em>{emphasis}</em></h2>
          <p>{t(full ? "Tap a photo for details. Add any stops you like." : "Choose the stops you like. I only charge for the ride; meals, tickets, shopping and treatments are paid separately by you.")}</p>
        </div>
        {!full && <Link href="/tours#explore" className="text-link">{t("All places")}<IconArrowUpRight size={17} aria-hidden="true" /></Link>}
      </div>
      {full && <div className="category-filters" role="group" aria-label={t("Filter places by interest")} data-reveal="filters">{categories.map((item) => <button key={item.id} className="filter-chip" aria-pressed={category === item.id} onClick={() => filter(item.id)}>{t(item.label)}</button>)}</div>}
      <div className="experience-grid">
        {visible.map((stop) => {
          const added = selected.includes(stop.id);
          const title = t(stop.title);
          return <article key={stop.id} className="experience-card" data-selected={added} data-reveal={stop.id}>
            <div className="experience-media"><button className="experience-open" aria-haspopup="dialog" onClick={(event) => { setActive(stop); setHasOpened(true); setGalleryVisit(value => value + 1); openSheet(event.detail !== 0); dialogRef.current?.querySelector(".sheet-panel")?.scrollTo({ top: 0, behavior: "instant" }); }}>
              <span className="experience-photo" aria-hidden="true"><Image src={stop.image} alt={t(stop.alt)} fill sizes="(max-width: 359px) 92vw, (max-width: 999px) 44vw, 30vw" quality={65} className="cover-image" /><span className="photo-open-icon"><IconArrowUpRight size={18} /></span></span>
              <span className="sr-only">{title}</span>
            </button>
            <button className="add-stop" aria-label={t(added ? "Added to my ride : {title}" : "Add this stop : {title}", { title })} aria-pressed={added} onClick={() => toggleStop(stop.id)}><span className="add-stop-icon"><IconPlus className="stop-plus" size={17} aria-hidden="true" /><IconCheck className="stop-check" size={17} aria-hidden="true" /></span><span>{t(added ? "Added" : "Add stop")}</span></button></div>
            <div className="experience-text"><h3 className="experience-title">{title}</h3><p className="experience-summary">{t(stop.summary)}</p></div>
          </article>;
        })}
      </div>
      <div className="explore-bottom" data-reveal="continue">
        <p>{t("Shopping stops are optional.")}</p>
        <Link href={count ? "/contact#plan" : "/tours#explore"} className="text-link">
          {count ? t(count === 1 ? "Plan with my {count} stop" : "Plan with my {count} stops", { count }) : t("Plan a ride")}
          <IconArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{t(count === 1 ? "{count} stop in your ride." : "{count} stops in your ride.", { count })}</p>
    </div>
    <dialog ref={dialogRef} className="sheet detail-sheet" aria-labelledby="stop-title" onCancel={(event) => { event.preventDefault(); closeSheet(false); }} onClick={(event) => { if (event.target === event.currentTarget) closeSheet(); }}>
      <div className="sheet-panel detail-panel">
        <div className="detail-header"><button className="icon-button sheet-close" aria-label={t("Close place details")} onClick={(event) => closeSheet(event.detail !== 0)} autoFocus><IconX size={22} aria-hidden="true" /></button></div>
        {hasOpened && <PlacePhotoGallery key={galleryVisit} title={active.title} photos={[{ src: active.image, alt: active.alt }, ...(active.photos ?? [])]} />}
        <div className="detail-copy"><h2 id="stop-title" className="type-title">{t(active.title)}</h2><p>{t(active.description)}</p><p className="detail-note">{t(active.note)}</p>{active.photoNote && <p className="photo-note">{t(active.photoNote)}</p>}</div>
        <div className="detail-actions"><button className={selected.includes(active.id) ? "btn-outline" : "btn-brand"} aria-pressed={selected.includes(active.id)} onClick={() => toggleStop(active.id)}>{selected.includes(active.id) ? <IconCheck size={18} aria-hidden="true" /> : <IconPlus size={18} aria-hidden="true" />}{t(selected.includes(active.id) ? "Remove this stop" : "Add this stop")}</button><button className="text-link" onClick={(event) => closeSheet(event.detail !== 0)}>{t("Keep exploring")}</button></div>
      </div>
    </dialog>
  </MotionSection>;
}
