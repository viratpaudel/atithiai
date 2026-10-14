/* global console, fetch, setTimeout, document, window, process, localStorage */
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";

const BASE = "http://localhost:4173";
let dev;
const results = [];

function record(id, pass, note = "") {
  results.push({ id, pass, note });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}  ${note}`);
}

async function waitServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

const TABS = ["home", "discover", "services", "ai", "lens", "profile"];
const errorPatterns = ["start fresh", "Something went wrong", "error boundary"];

async function visitTabs(page) {
  for (const t of TABS) {
    await page.evaluate((tab) => {
      const btns = [...document.querySelectorAll("nav button, button")];
      const b = btns.find((x) => x.getAttribute("aria-label")?.toLowerCase().includes(tab) || x.textContent?.toLowerCase().includes(tab));
      if (b) b.click();
    }, t);
    await page.waitForTimeout(600);
  }
}

async function run() {
  dev = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], { shell: true, stdio: "inherit" });
  await waitServer();
  const browser = await chromium.launch();

  // ---------- a) clean localStorage ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
    await page.goto(BASE, { waitUntil: "load", timeout: 20000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const bad = errors.some((e) => errorPatterns.some((p) => e.toLowerCase().includes(p.toLowerCase())));
    record("a-clean-localStorage", !bad, errors.slice(0, 3).join(" | ") || "no errors");
    await visitTabs(page);
    record("a-all-tabs", !bad, "visited all tabs");
    await ctx.close();
  }

  // ---------- b) returning user (started exploring) ----------
  for (const dest of ["ubud", "lisbon", "jaipur"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate((d) => {
      localStorage.clear();
      localStorage.setItem("atithi-started-exploring", "true");
      localStorage.setItem("atithi-destination", d);
    }, dest);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const bad = errors.some((e) => errorPatterns.some((p) => e.toLowerCase().includes(p.toLowerCase())));
    record(`b-returning-${dest}`, !bad, errors.slice(0, 3).join(" | ") || "no errors");
    await visitTabs(page);
    record(`b-returning-${dest}-tabs`, !bad, "");
    await ctx.close();
  }

  // ---------- c) corrupted localStorage ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem("atithi-traveler-profile-v1", "{invalid json");
      localStorage.setItem("atithi-plan", '{"stops":"notanarray"}');
      localStorage.setItem("atithi-chat", '[[[[{"bad"}]]]');
      localStorage.setItem("atithi-requests", '12345');
      localStorage.setItem("atithi-theme", "chartreuse");
      localStorage.setItem("atithi-started-exploring", "true");
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const bad = errors.some((e) => errorPatterns.some((p) => e.toLowerCase().includes(p.toLowerCase())));
    record("c-corrupted-storage", !bad, errors.slice(0, 4).join(" | ") || "no errors");
    await visitTabs(page);
    record("c-corrupted-tabs", !bad, "");
    await ctx.close();
  }

  // ---------- d) localStorage.setItem throws (Safari private) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() { throw new Error("QuotaExceededError: blocked"); },
      });
    });
    await page.goto(BASE, { waitUntil: "domcontentloaded" }).catch((e) => errors.push("goto: " + e.message));
    await page.waitForTimeout(1500).catch(() => {});
    const bad = errors.some((e) => errorPatterns.some((p) => e.toLowerCase().includes(p.toLowerCase())));
    record("d-private-mode", !bad, errors.slice(0, 4).join(" | ") || "no errors");
    await ctx.close();
  }

  // ---------- e) offline / 500 / 429 / malformed JSON ----------
  const apiFails = [
    { id: "e-offline-all-reject", mode: "abort" },
    { id: "e-500", mode: "500" },
    { id: "e-429", mode: "429" },
    { id: "e-malformed", mode: "malformed" },
  ];
  for (const { id, mode } of apiFails) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
    await page.route("**/api/**", async (route) => {
      if (mode === "abort") return route.abort();
      if (mode === "500") return route.fulfill({ status: 500, body: "Internal error" });
      if (mode === "429") return route.fulfill({ status: 429, body: "rate limited" });
      return route.fulfill({ status: 200, contentType: "application/json", body: "{{{not json" });
    });
    await page.route("**openweather**", (route) => route.abort());
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.setItem("atithi-started-exploring", "true"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    let bad = errors.some((e) => errorPatterns.some((p) => e.toLowerCase().includes(p.toLowerCase())));
    let crash = false;
    try { await visitTabs(page); } catch { crash = true; }
    record(id, !bad && !crash, (crash ? "visit crashed: " : "") + errors.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // ---------- interactions ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
    await page.goto(BASE + "/?demo=1", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.setItem("atithi-started-exploring", "true"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    // theme toggle
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => (x.getAttribute("aria-label") || "").match(/theme|dark|light/i));
      if (b) b.click();
    });
    await page.waitForTimeout(300);
    record("int-theme-toggle", !errors.some((e) => errorPatterns.some((p) => e.includes(p))), errors.slice(0, 2).join(" | ") || "ok");

    // demo mode toggle
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /demo mode/i.test(x.textContent || ""));
      if (b) b.click();
    });
    await page.waitForTimeout(300);
    record("int-demo-mode-toggle", !errors.some((e) => errorPatterns.some((p) => e.includes(p))), "");

    // demo disruption (?demo=1)
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /disrupt|landslide|roadblock/i.test(x.textContent || ""));
      if (b) b.click();
    });
    await page.waitForTimeout(800);
    record("int-demo-disruption", !errors.some((e) => errorPatterns.some((p) => e.includes(p))), "");

    await visitTabs(page);
    record("int-all-tabs-after-interactions", !errors.some((e) => errorPatterns.some((p) => e.includes(p))), errors.slice(0, 3).join(" | "));
    await ctx.close();
  }

  await browser.close();
  fs.writeFileSync("smoke-results.json", JSON.stringify(results, null, 2));
  const fails = results.filter((r) => !r.pass);
  console.log(`\nTOTAL: ${results.length}, FAIL: ${fails.length}`);
  dev.kill();
  process.exit(fails.length ? 1 : 0);
}

run().catch((e) => {
  console.error("RUNNER ERROR:", e);
  if (dev) dev.kill();
  process.exit(2);
});
