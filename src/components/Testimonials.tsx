"use client";

import { guestReviews } from "@/lib/guest-content";
import { MotionSection } from "./MotionSection";
import { useLocale } from "@/components/LocaleProvider";

export function Testimonials() {
  const { t } = useLocale();
  if (!guestReviews.length) return null;
  return <MotionSection cinema className="notebook-reviews section-space" labelledBy="reviews-title">
    <div className="container-page">
      <div className="notebook-section-heading" data-reveal="heading">
        <h2 className="type-display" id="reviews-title">{t("A few words")}<br /><em>{t("from the ride.")}</em></h2>
        {guestReviews.some(review => review.sample) && <p className="notebook-draft-note">{t("Fictional reviews for design preview.")}</p>}
      </div>
      <div className="notebook-review-grid">{guestReviews.map(review => <figure key={review.id} className="notebook-review" data-reveal="quote">
        <blockquote><p>{t("“{quote}”", { quote: t(review.quote) })}</p></blockquote>
        <figcaption>{review.attribution}</figcaption>
      </figure>)}</div>
    </div>
  </MotionSection>;
}
