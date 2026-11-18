import assert from "node:assert/strict";
import test from "node:test";
import { detectLocale, localePath, preferredLocale, stripLocale } from "../src/lib/i18n/locale.ts";

test("browser preference uses weighted, supported language tags", () => {
  assert.equal(detectLocale("es-MX,fr-CA;q=0.7,de-DE;q=0.9"), "de");
  assert.equal(detectLocale("zh-Hans-CN,en;q=0.5"), "zh-CN");
  assert.equal(detectLocale("zh-Hans-HK,en;q=0.5"), "zh-CN");
  assert.equal(detectLocale("zh-Hant-TW,fr;q=0.5"), "fr");
  assert.equal(detectLocale("ru;q=0,hi-IN"), "en");
  assert.equal(detectLocale("fr;q=invalid,ru;q=0.5"), "ru");
  assert.equal(detectLocale(null), "en");
});

test("a saved choice overrides browser preference", () => {
  assert.equal(preferredLocale("en", "ru"), "en");
  assert.equal(preferredLocale("hi", "fr"), "fr");
});

test("localized routes keep query and fragment and leave external links alone", () => {
  assert.equal(localePath("de", "/contact?ride=outing#plan"), "/de/contact?ride=outing#plan");
  assert.equal(localePath("zh-CN", "/"), "/zh-cn");
  assert.equal(localePath("en", "/tours"), "/tours");
  assert.equal(localePath("fr", "#plan"), "#plan");
  assert.equal(localePath("fr", "//example.org"), "//example.org");
  assert.equal(stripLocale("/ru/tours"), "/tours");
  assert.equal(stripLocale("/zh-cn"), "/");
  assert.equal(stripLocale("/reviews"), "/reviews");
});
