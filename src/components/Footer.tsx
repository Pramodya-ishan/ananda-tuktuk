import { LocaleLink as Link } from "./LocaleLink";
import { IconArrowUpRight, IconPhone } from "@tabler/icons-react";
import { contactPhone } from "@/lib/site-config";
import { translate, type Translations } from "@/lib/i18n/locale";
import { SectionLink } from "./SectionLink";
import { MotionSection } from "./MotionSection";

function phoneLabel(phone: string) {
  return phone.startsWith("94") && phone.length === 11
    ? `+94 ${phone.slice(2, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`
    : `+${phone}`;
}

export function Footer({ messages }: { messages: Translations }) {
  const t = (english: string) => translate(messages, english);
  return <MotionSection as="footer" cinema className="site-footer">
    <div className="container-page">
      <div className="footer-main">
        <div className="footer-intro" data-reveal="intro">
          <Link href="/" className="footer-brand">{t("Ananda's")}<br /><em>{t("tuk-tuk.")}</em></Link>
          <p>{t("I'm your local driver around Dambulla & Sigiriya.")}</p>
          <SectionLink href="/tours#explore" className="btn-brand footer-cta">{t("Plan a ride")}<IconArrowUpRight size={18} aria-hidden="true" /></SectionLink>
        </div>
        <nav className="footer-links" aria-labelledby="footer-explore-title" data-reveal="links">
          <h2 id="footer-explore-title" className="footer-heading">{t("Explore")}</h2>
          <Link href="/">{t("Home")}</Link>
          <Link href="/tours">{t("Places & stops")}</Link>
          <Link href="/about">{t("About me")}</Link>
          <Link href="/contact">{t("Arrange a ride")}</Link>
        </nav>
        <div className="footer-contact" data-reveal="contact">
          <h2 className="footer-heading">{t("Talk to me")}</h2>
          {contactPhone && <a href={`tel:+${contactPhone}`} className="footer-contact-link"><IconPhone size={20} aria-hidden="true" /><span><span className="footer-contact-label">{t("Call me")}</span><span className="footer-contact-number">{phoneLabel(contactPhone)}</span></span></a>}
        </div>
      </div>
      <div className="footer-bottom" data-reveal="bottom"><p>© {new Date().getFullYear()} {t("Ananda's Tuk-Tuk")}</p><p>{t("Hotel pickup · Waiting · Ride back")}</p></div>
      <p className="footer-credit"><span>{t("Designed and developed by")}</span><a href="https://himansa.web.app/" target="_blank" rel="noopener noreferrer">Himansa Wickramasighe</a></p>
    </div>
  </MotionSection>;
}
