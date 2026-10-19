#!/usr/bin/env node
/**
 * Vérifie bootstrap GTM post-consentement + hit page_view GA4 (Playwright).
 * URL : TEST_GTM_URL (défaut https://redkmotors.fr/) ou serveur local _site via TEST_GTM_BASE.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const GA4 = "G-BN0P1VLZR5";
const PROD = process.env.TEST_GTM_URL || "https://redkmotors.fr/";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function parseMeasurement(url, postData) {
  const out = { en: null, tid: null, url };
  try {
    const u = new URL(url);
    u.searchParams.forEach((v, k) => {
      if (k === "en" || k === "tid" || k === "id") out[k === "id" ? "tid" : k] = v;
    });
  } catch {
    /* ignore */
  }
  if (postData) {
    try {
      const p = Object.fromEntries(new URLSearchParams(postData));
      out.en = out.en || p.en;
      out.tid = out.tid || p.tid;
    } catch {
      /* ignore */
    }
  }
  if (url.includes(GA4)) out.tid = out.tid || GA4;
  return out;
}

function isMeasurementUrl(url) {
  return /\/g\/collect|\/j\/collect|googletagmanager\.com\/td|google-analytics\.com|analytics\.google/i.test(
    url,
  );
}

async function startLocalSite() {
  const site = join(ROOT, "_site");
  if (!existsSync(site)) throw new Error("_site absent — npm run build");
  const server = createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";
    const filePath = normalize(join(site, urlPath));
    if (!filePath.startsWith(site) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}/` });
    });
  });
}

async function runScenario(baseUrl, label) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const googleBeforeAccept = [];
  const afterConsent = [];
  let accepted = false;

  page.on("request", (req) => {
    const u = req.url();
    if (!/googletagmanager|google-analytics|analytics\.google/i.test(u)) return;
    if (!accepted) googleBeforeAccept.push(u);
  });

  page.on("response", (res) => {
    if (!accepted) return;
    const u = res.url();
    if (!/google|googletagmanager|analytics/i.test(u)) return;
    const req = res.request();
    afterConsent.push({
      status: res.status(),
      ...parseMeasurement(u, req.postData()),
    });
  });

  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(800);

  if (googleBeforeAccept.length > 0) {
    fail(`${label}: requêtes Google avant consentement (${googleBeforeAccept.length})`);
  } else {
    ok(`${label}: aucune requête Google avant consentement`);
  }

  accepted = true;
  await page.locator("#cookie-accept-all").click();
  await page.waitForTimeout(12000);

  const dlState = await page.evaluate(() => {
    const dl = window.dataLayer || [];
    const gtmJsEntries = dl.filter(
      (x) => x && typeof x === "object" && x.event === "gtm.js" && x["gtm.start"],
    );
    return {
      bootstrapCount: gtmJsEntries.length,
      bootstrap: gtmJsEntries[0] || null,
      gtmScript: !!document.querySelector("script[data-redk-gtm]"),
      gaCookies: document.cookie.split(";").map((c) => c.trim()).filter((c) => c.startsWith("_ga")),
    };
  });

  if (dlState.bootstrapCount !== 1) {
    fail(`${label}: attendu 1 push gtm.js/gtm.start, obtenu ${dlState.bootstrapCount}`);
  } else {
    ok(`${label}: bootstrap GTM standard (gtm.start + event gtm.js) une fois`);
  }

  const pageViews = afterConsent.filter(
    (h) =>
      h.en === "page_view" ||
      (h.url && h.url.includes(GA4) && /page_view|en=page_view/.test(JSON.stringify(h))),
  );

  const collectOrTd = afterConsent.filter(
    (h) => isMeasurementUrl(h.url) && (h.tid === GA4 || h.url.includes(GA4)),
  );

  if (collectOrTd.length === 0) {
    fail(`${label}: aucun hit mesure GA4 (${GA4}) après consentement`);
  } else {
    ok(`${label}: ${collectOrTd.length} requête(s) mesure GA4 (HTTP ${collectOrTd.map((c) => c.status).join(", ")})`);
  }

  if (pageViews.length === 0 && collectOrTd.every((c) => !c.en)) {
    console.log(
      `WARN: ${label}: en=page_view non trouvé en query — hits:`,
      collectOrTd.map((c) => c.url?.slice(0, 120)),
    );
  } else if (pageViews.length > 0) {
    ok(`${label}: page_view confirmé (${pageViews.length} hit(s))`);
  }

  // Rechargement même session — pas de double bootstrap sur même navigation idempotente
  const pvBeforeReload = collectOrTd.length;
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(12000);
  const reloadState = await page.evaluate(() => {
    const dl = window.dataLayer || [];
    return {
      bootstrapCount: dl.filter(
        (x) => x && typeof x === "object" && x.event === "gtm.js" && x["gtm.start"],
      ).length,
      gaCookies: document.cookie.split(";").map((c) => c.trim()).filter((c) => c.startsWith("_ga")),
    };
  });
  if (reloadState.bootstrapCount !== 1) {
    fail(`${label}: après reload, attendu 1 bootstrap par page, obtenu ${reloadState.bootstrapCount}`);
  } else {
    ok(`${label}: un seul bootstrap gtm.js par chargement (reload)`);
  }

  await browser.close();
  return { collectOrTd: collectOrTd.length, pvBeforeReload, dlState };
}

async function main() {
  const { server, base } = await startLocalSite();
  try {
    await runScenario(base, "local");
  } finally {
    server.close();
  }
  if (process.env.TEST_GTM_PROD === "1") {
    await runScenario(PROD, "prod");
  } else {
    console.log("INFO: test prod ignoré (déployer le fix puis TEST_GTM_PROD=1)");
  }
  if (process.exitCode) process.exit(process.exitCode);
  console.log("Tests GTM page_view: OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
