"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SectionLink as Link } from "./SectionLink";
import { IconCheck as Check, IconBrandWhatsapp as MessageCircle, IconPhone as Phone, IconX as X, IconMapPin, IconClock, IconArrowBackUp, IconBolt, IconRoute, IconSparkles, IconPlus, IconCalendar, IconLuggage } from "@tabler/icons-react";
import { stops } from "@/lib/content";
import { buildRideMessage, createWhatsAppLink, maxGuests, rideTypes, sriLankaDate, timesOfDay, type RideDraft } from "@/lib/ride";
import { contactPhone, contactPhoneLabel, whatsappPhone } from "@/lib/site-config";
import { useRide } from "./RideProvider";
import { MotionSection } from "./MotionSection";
import { useLocale } from "./LocaleProvider";
import { Stepper } from "./Stepper";

const rideIcons = { "A short ride": IconBolt, "A few stops": IconRoute, "Help me choose": IconSparkles } as const;

export function Planner({ initialRide }: { initialRide?: RideDraft["rideType"] }) {
  const { locale, t } = useLocale();
  const [title, emphasis] = t("Your\nride.").split("\n");
  const { selected, draft: details, updateDraft, initializeRideType, toggleStop, clearStops } = useRide();
  useEffect(() => {
    if (initialRide) initializeRideType(initialRide);
  }, [initialRide, initializeRideType]);
  const [status, setStatus] = useState("");
  const chosen = selected.map((id) => stops.find((stop) => stop.id === id)).filter((stop) => stop !== undefined);
  const message = buildRideMessage({ ...details, locale, stops: chosen.map((stop) => stop.title) });
  const whatsapp = createWhatsAppLink(whatsappPhone ?? "", message);

  const today = sriLankaDate();
  const quickDates = [
    { label: "Today", value: today },
    { label: "Tomorrow", value: new Date(Date.parse(`${today}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10) },
  ];
  const customDate = Boolean(details.date) && !quickDates.some(({ value }) => value === details.date);
  const guests = details.guests ? Number(details.guests) : null;
  const peopleLabel = (count: number) => t(count === 1 ? "1 person" : "{count} people", { count });
  const dateLabel = quickDates.find(({ value }) => value === details.date)?.label;
  const summary = [
    t(chosen.length === 1 ? "1 stop" : "{count} stops", { count: chosen.length }),
    guests !== null ? peopleLabel(guests) : "",
    details.date ? (dateLabel ? t(dateLabel) : new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(`${details.date}T12:00:00`))) : "",
    details.time || (details.timeOfDay ? t(details.timeOfDay) : ""),
  ].filter(Boolean);

  function change(patch: Partial<RideDraft>) {
    updateDraft(patch);
    setStatus("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (whatsapp) {
      window.open(whatsapp, "_blank", "noopener,noreferrer");
      setStatus("Your request is ready in WhatsApp. Send it in the chat and I'll reply to you.");
    } else setStatus("WhatsApp is unavailable right now. Please call me to arrange your ride.");
  }

  return <MotionSection cinema id="plan" className="planner-section section-space" labelledBy="planner-title"><div className="container-page planner-layout">
    <div className="planner-intro">
      <div className="planner-welcome" data-reveal="welcome">
        <h2 id="planner-title" className="type-display">{title}{locale === "zh-CN" ? "" : " "}<em>{emphasis}</em></h2>
        <p>{t("Pick your stops, or ask me for ideas.")}</p>
      </div>
      <div className="planner-practical" data-reveal="practical">
        <ul className="planner-assurance">
          <li><IconMapPin size={18} aria-hidden="true" />{t("I can pick you up.")}</li>
          <li><IconClock size={18} aria-hidden="true" />{t("I can wait at your stops.")}</li>
          <li><IconArrowBackUp size={18} aria-hidden="true" />{t("I can bring you back.")}</li>
        </ul>
        <p className="planner-cost-note">{t("I'll confirm the route, price and availability with you. Tickets, food, shopping and treatments are extra unless we agree otherwise.")}</p>
      </div>
    </div>
    <form className="planner-form" onSubmit={submit} data-reveal="form">
      <fieldset className="planner-step ride-type-field">
        <legend><span className="step-index" aria-hidden="true">1</span>{t("What kind of ride?")}</legend>
        <div className="ride-type-options">{rideTypes.map((type) => {
          const Icon = rideIcons[type];
          return <label className="ride-type-choice" key={type}><input type="radio" name="ride-type" value={type} checked={details.rideType === type} onChange={() => change({ rideType: type })} /><span><Icon size={18} aria-hidden="true" />{t(type)}</span></label>;
        })}</div>
      </fieldset>

      <div className="planner-step selected-stops">
        <div className="field-heading">
          <h3><span className="step-index" aria-hidden="true">2</span>{t("Your stops")}{chosen.length > 0 && <span className="stop-count">{chosen.length}</span>}</h3>
          {selected.length > 0 && <button type="button" className="quiet-button" onClick={clearStops}>{t("Clear stops")}</button>}
        </div>
        {chosen.length ? <ul>{chosen.map((stop) => {
          const stopTitle = t(stop.title);
          return <li key={stop.id}><span>{stopTitle}</span><button type="button" className="icon-button" aria-label={t("Remove {title} from your ride", { title: stopTitle })} onClick={() => toggleStop(stop.id)}><X size={15} aria-hidden="true" /></button></li>;
        })}</ul> : <p className="stops-empty">{t("We can choose together.")}</p>}
        <Link href="/tours#explore" className="add-stop-link"><IconPlus size={16} aria-hidden="true" />{t(chosen.length ? "Add another stop" : "Browse the places")}</Link>
      </div>

      <fieldset className="planner-step when-field">
        <legend><span className="step-index" aria-hidden="true">3</span>{t("When?")} <small>{t("(optional)")}</small></legend>
        <div className="chip-row" role="group" aria-label={t("Date")}>
          {quickDates.map(({ label, value }) => <button type="button" key={label} className="choice-chip" aria-pressed={details.date === value} onClick={() => change({ date: details.date === value ? "" : value })}>{t(label)}</button>)}
          <label className="choice-chip input-chip" data-active={customDate}>
            <IconCalendar size={16} aria-hidden="true" /><span className="sr-only">{t("Date")}</span>
            <input type="date" name="date" min={today} value={details.date} onChange={(event) => change({ date: event.target.value })} />
          </label>
        </div>
        <div className="chip-row" role="group" aria-label={t("Time")}>
          {timesOfDay.map((part) => {
            const active = details.timeOfDay === part && !details.time;
            return <button type="button" key={part} className="choice-chip" aria-pressed={active} onClick={() => change({ timeOfDay: active ? "" : part, time: "" })}>{t(part)}</button>;
          })}
          <label className="choice-chip input-chip" data-active={Boolean(details.time)}>
            <IconClock size={16} aria-hidden="true" /><span className="sr-only">{t("Time")}</span>
            <input type="time" name="time" value={details.time} onChange={(event) => change({ time: event.target.value, timeOfDay: "" })} />
          </label>
        </div>
      </fieldset>

      <div className="planner-step guests-step">
        <div className="guests-row">
          <h3><span className="step-index" aria-hidden="true">4</span>{t("How many people?")}</h3>
          <Stepper name="guests" label={t("How many people?")} value={guests} max={maxGuests} emptyLabel={t("Not sure")}
            decreaseLabel={t("Fewer people")} increaseLabel={t("More people")}
            valueText={guests === null ? t("Not sure") : peopleLabel(guests)}
            onChange={(value) => change({ guests: value === null ? "" : String(value) })} />
        </div>
        <label className="return-switch luggage-switch">
          <span className="luggage-label"><IconLuggage size={20} aria-hidden="true" /><span>{t("Bringing suitcases or big bags?")}<small>{t("Turn on so I can make sure everything fits.")}</small></span></span>
          <input type="checkbox" name="luggage" checked={details.luggage} onChange={(event) => change({ luggage: event.target.checked })} />
          <span className="switch-track" aria-hidden="true"><span className="switch-thumb"><Check size={12} /></span></span>
        </label>
      </div>

      <label className="planner-step form-field pickup-field">
        <span><span className="step-index" aria-hidden="true">5</span>{t("Your hotel or pickup area")} <small>{t("(optional)")}</small></span>
        <span className="input-with-icon"><IconMapPin size={18} aria-hidden="true" /><input name="pickup" autoComplete="street-address" placeholder={t("Hotel name, area, or meeting spot")} maxLength={180} value={details.pickup} onChange={(event) => change({ pickup: event.target.value })} /></span>
      </label>

      <label className="return-switch">
        <span>{t("Bring me back to my hotel")}<small>{t("Untick for a one-way ride.")}</small></span>
        <input type="checkbox" name="return" checked={details.returnToHotel} onChange={(event) => change({ returnToHotel: event.target.checked })} />
        <span className="switch-track" aria-hidden="true"><span className="switch-thumb"><Check size={12} /></span></span>
      </label>

      <label className="form-field notes-field">
        <span>{t("Anything else?")} <small>{t("(optional)")}</small></span>
        <textarea name="notes" rows={3} placeholder={t("A restaurant you like, how long you have, or a question…")} maxLength={500} value={details.notes} onChange={(event) => change({ notes: event.target.value })} />
        <small className="char-count" aria-hidden="true">{details.notes.length}/500</small>
      </label>

      <div className="planner-summary" aria-hidden="true">{summary.map((part) => <span key={part}>{part}</span>)}</div>
      <button className="planner-submit" type="submit"><MessageCircle size={20} aria-hidden="true" />{t("Send request on WhatsApp")}</button>
      <p className="submit-note">{locale === "en"
        ? "Your ride details open in my WhatsApp chat. Send the message and I'll confirm the plan with you."
        : t("WhatsApp opens with a draft in English. Send the message and I'll confirm the plan with you.")}</p>
      {contactPhone && contactPhoneLabel && <a href={`tel:+${contactPhone}`} className="text-link call-alternative"><Phone size={17} aria-hidden="true" />{t("Prefer a call? {phone}", { phone: contactPhoneLabel })}</a>}
      <p className="form-status" role="status" aria-live="polite">{status && t(status)}</p>
    </form>
  </div></MotionSection>;
}
