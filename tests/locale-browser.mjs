import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const modules = process.env.ANANDA_BROWSER_MODULES;
const { chromium } = require(modules ? path.join(modules, "playwright") : "playwright");
const base = process.env.ANANDA_BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  for (const path of ["/", "/about", "/tours", "/contact"]) {
    const response = await fetch(`${base}${path}`, { headers: { "Accept-Language": "en" }, redirect: "manual" });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
    await response.body?.cancel();
  }
  const french = await browser.newContext({ locale: "fr-CA", viewport: { width: 320, height: 800 }, reducedMotion: "reduce" });
  await french.addInitScript(() => {
    window.open = (url) => { window.bookingDraft = String(url); return null; };
  });
  const page = await french.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/tours#explore`);
  assert.equal(new URL(page.url()).pathname, "/fr/tours");
  assert.equal(new URL(page.url()).hash, "#explore");
  assert.equal(await page.locator("html").getAttribute("lang"), "fr");
  assert.equal(await page.locator("h1").innerText(), "Votre journée.\nVos étapes.");
  assert.equal(await page.locator("link[hreflang='de']").count(), 1);
  await page.locator(".experience-card .add-stop").first().click();
  await page.goto(`${base}/fr/contact?ride=outing#plan`);
  await page.waitForFunction(() => document.querySelector('input[value="A few stops"]').checked);
  await page.locator('input[value="A short ride"]').check();
  await page.locator('[name="pickup"]').fill("Hôtel du Lac");
  await page.locator('[name="notes"]').fill("Deux sacs");

  const switcher = page.locator(".language-switcher summary");
  const options = page.locator(".language-options button");
  assert.equal(await options.count(), 5);
  await switcher.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowDown");
  assert.equal(new URL(page.url()).pathname, "/fr/contact");
  await page.keyboard.press("Escape");
  assert.equal(await switcher.evaluate((element) => element === document.activeElement), true);
  await switcher.click();
  await options.filter({ hasText: "Deutsch" }).click();
  await page.waitForURL("**/de/contact?ride=outing#plan");
  assert.equal(await page.locator("html").getAttribute("lang"), "de");
  assert.equal(await page.locator(".selected-stops li").count(), 1);
  assert.equal(await page.locator('[name="pickup"]').inputValue(), "Hôtel du Lac");
  assert.equal(await page.locator('[name="notes"]').inputValue(), "Deux sacs");
  assert.equal(await page.locator('input[value="A short ride"]').isChecked(), true);
  await page.locator(".planner-submit").click();
  const draft = new URL(await page.evaluate(() => window.bookingDraft)).searchParams.get("text");
  assert.match(draft, /Preferred language: German/);
  assert.match(draft, /Pickup: Hôtel du Lac/);
  assert.match(draft, /• Sigiriya Rock/);
  const call = page.locator(".footer-whatsapp-call a");
  assert.match(await call.getAttribute("href"), /^https:\/\/(?:wa\.me\/\d+|call\.whatsapp\.com\/voice\/)/);
  assert.equal(await page.locator(".footer-contact a[href^='tel:']").count(), 1);

  await page.locator('input[value="Help me choose"]').check();
  await page.goto(`${base}/de/contact?ride=short#plan`);
  await page.waitForFunction(() => document.querySelector('input[value="A short ride"]').checked);
  assert.equal(await page.locator('[name="pickup"]').inputValue(), "Hôtel du Lac");
  await page.goto(`${base}/about`);
  assert.equal(new URL(page.url()).pathname, "/de/about");
  await page.goto(`${base}/ru/about`);
  assert.equal(await page.locator("html").getAttribute("lang"), "ru");
  assert.equal(await page.locator(".brand").getAttribute("href"), "/ru");
  await switcher.click();
  await options.filter({ hasText: "Русский" }).click();
  assert.equal((await french.cookies()).find((cookie) => cookie.name === "ananda-language")?.value, "ru");
  assert.equal(await page.locator(".language-switcher").getAttribute("open"), null);
  await switcher.click();
  await options.filter({ hasText: "English" }).click();
  await page.waitForURL(new URL("/about", base).href);
  assert.equal(new URL(page.url()).pathname, "/about");
  await page.goto(`${base}/tours`);
  assert.equal(new URL(page.url()).pathname, "/tours");
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.locator(".brand").getAttribute("href"), "/");
  assert.deepEqual(errors, []);
  await french.close();

  for (const [locale, pathname, lang] of [["zh-Hans-CN", "/zh-cn", "zh-CN"], ["hi-IN", "/", "en"]]) {
    const context = await browser.newContext({ locale, reducedMotion: "reduce" });
    const landing = await context.newPage();
    await landing.goto(base);
    assert.equal(new URL(landing.url()).pathname, pathname);
    assert.equal(await landing.locator("html").getAttribute("lang"), lang);
    if (locale === "zh-Hans-CN") {
      await landing.goto(`${base}/zh-CN`);
      assert.equal(new URL(landing.url()).pathname, "/zh-cn");
      assert.equal((await landing.goto(`${base}/zh-cn`)).status(), 200);
    }
    await context.close();
  }

  for (const width of [320, 390, 900, 1440]) {
    const layout = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
    for (const locale of ["en", "de", "fr", "ru", "zh-cn"]) {
      await layout.goto(`${base}/${locale}`);
      const boxes = await layout.locator(".nav-shell").evaluate((nav) => {
        const rect = (selector) => nav.querySelector(selector).getBoundingClientRect();
        const navBox = nav.getBoundingClientRect();
        const control = rect(".language-switcher");
        const adjacent = rect(".nav-cta").width ? rect(".nav-cta") : rect(".menu-trigger");
        return { contained: control.x >= navBox.x && adjacent.right <= navBox.right, gap: adjacent.left - control.right, height: control.height, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.equal(boxes.contained, true, `${width}px ${locale} controls overflow header`);
      assert.ok(boxes.gap >= 0 && boxes.height >= 44, `${width}px ${locale} controls overlap or are too small`);
      assert.equal(boxes.overflow, false, `${width}px ${locale} page has horizontal overflow`);
    }
    await layout.close();
  }
  console.log("PASS browser-language routing, manual override, draft persistence, English WhatsApp payload, footer links and header layout");
} finally {
  await browser.close();
}
