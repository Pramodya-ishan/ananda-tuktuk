"use client";

import { useEffect, useState } from "react";
import { LocaleLink as Link } from "./LocaleLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconArrowUpRight, IconMenu2, IconX } from "@tabler/icons-react";
import { useSheet } from "./useSheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "./LocaleProvider";
import { stripLocale } from "@/lib/i18n/locale";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/tours" },
  { label: "About me", href: "/about" },

];

export function Brand({ linked = true }: { linked?: boolean }) {
  const { t } = useLocale();
  const mark = <><span className="brand-mark"><Image src="/images/ananda-logo-covered.png" width={36} height={27} alt="" style={{ height: "auto" }} /></span><span className="brand-name">{t("Ananda's")}<span>{t("tuk-tuk rides · Sri Lanka")}</span></span></>;
  return linked ? <Link className="brand" href="/" aria-label={t("Ananda's tuk-tuk — Home")}>{mark}</Link> : <span className="brand" role="img" aria-label={t("Ananda's tuk-tuk")}>{mark}</span>;
}

export function NavBar() {
  const { t } = useLocale();
  const pathname = stripLocale(usePathname());
  const { ref, open, close } = useSheet();
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const onChange = () => { if (wide.matches) ref.current?.close(); };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, [ref]);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <>
    <header className="site-header" data-scrolled={scrolled}>
      <nav className="nav-shell" aria-label={t("Main navigation")}>
        <Brand />
        <ul className="desktop-nav">
          {links.map((link) => <li key={link.href}><Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{t(link.label)}</Link></li>)}
        </ul>
        <div className="nav-contact-controls">
          <LanguageSwitcher />
          <button className="icon-button menu-trigger" onClick={(event) => open(event.detail !== 0)} aria-haspopup="dialog" aria-controls="site-menu" aria-label={t("Open menu")}><IconMenu2 size={23} aria-hidden="true" /></button>
        </div>
      </nav>
    </header>
    <dialog ref={ref} id="site-menu" className="sheet menu-sheet" aria-labelledby="menu-title" onCancel={(event) => { event.preventDefault(); close(false); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="sheet-panel menu-panel">
        <div className="sheet-top"><span id="menu-title" className="eyebrow">{t("Where shall we go?")}</span><button className="icon-button" aria-label={t("Close menu")} onClick={(event) => close(event.detail !== 0)} autoFocus><IconX size={22} aria-hidden="true" /></button></div>
        <nav aria-label={t("Mobile navigation")} className="mobile-nav">
          {links.map((link, index) => <Link style={{ "--link-index": index } as React.CSSProperties} key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => close(false)}>{t(link.label)}<IconArrowUpRight size={22} aria-hidden="true" /></Link>)}
        </nav>
        <div className="menu-language"><span className="eyebrow">{t("Language")}</span><LanguageSwitcher variant="list" /></div>
      </div>
    </dialog>
  </>;
}
