#!/usr/bin/env node
/**
 * Bootstrap GTM post-consentement + exactement 1 page_view GA4 par chargement.
 * Nécessite : _site (npm run build), réseau, conteneur GTM-NTC72X2G publié.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const GA4 = "G-BN0P1VLZR5";

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

/** @returns {'script' | 'measurement' | 'other_google' | null} */
function classifyGoogleUrl(url) {
  if (!/google|googletagmanager|doubleclick|gstatic/i.test(url)) return null;
  if (/googletagmanager\.com\/gtm\.js(\?|$)/.test(url)) return "script";
  if (/googletagmanager\.com\/gtag\/js(\?|$)/.test(url)) return "script";
  if (
    /\/g\/collect|\/j\/collect|googletagmanager\.com\/td\?|google-analytics\.com\/g\/collect|analytics\.google\.com\/g\/collect|region\d+\.google-analytics\.com\/g\/collect/.test(
      url,
    )
  ) {
    return "measurement";
  }
  if (/google|googletagmanager|doubleclick/i.test(url)) return "other_google";
  return null;
}

function mergeParams(url, postData) {
  const params = {};
  try {
    new URL(url).searchParams.forEach((v, k) => {
      params[k] = v;
    });
  } catch {
    /* ignore */
  }
  if (postData) {
    try {
      new URLSearchParams(postData).forEach((v, k) => {
        params[k] = v;
      });
    } catch {
      /* ignore */
    }
  }
  return params;
}

/** Hit GA4 page_view strict : en=page_view et tid/id = G-BN0P1VLZR5 */
function parseGa4PageViewHit(url, postData, status) {
  const kind = classifyGoogleUrl(url);
  if (kind !== "measurement") return null;
  const params = mergeParams(url, postData);
  const en = params.en;
  const tid = params.tid || params.id;
  if (en !== "page_view" || tid !== GA4) return null;
  return { en, tid, status, url: url.split("?")[0] };
}

function assertExactlyOnePageView(hits, label) {
  if (hits.length === 0) {
    fail(`${label}: aucun hit en=page_view tid=${GA4}`);
    return;
  }
  if (hits.length > 1) {
    fail(
      `${label}: ${hits.length} hits page_view tid=${GA4} (attendu: 1) — ${JSON.stringify(hits)}`,
    );
    return;
  }
  const h = hits[0];
  if (h.status < 200 || h.status >= 400) {
    fail(`${label}: page_view HTTP ${h.status} (attendu 2xx/204)`);
    return;
  }
  ok(`${label}: exactement 1 page_view tid=${GA4} (HTTP ${h.status})`);
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

function createNetworkCollector(page, { onlyAfterConsent = false } = {}) {
  let consentGranted = !onlyAfterConsent;
  const googleBeforeConsent = [];
  const scripts = [];
  const measurements = [];
  const otherGoogle = [];

  page.on("request", (req) => {
    const u = req.url();
    const kind = classifyGoogleUrl(u);
    if (!kind) return;
    if (!consentGranted) googleBeforeConsent.push({ kind, url: u });
  });

  page.on("response", (res) => {
    if (onlyAfterConsent && !consentGranted) return;
    const u = res.url();
    const kind = classifyGoogleUrl(u);
    if (!kind) return;
    const req = res.request();
    const entry = {
      kind,
      status: res.status(),
      url: u,
      postData: req.postData(),
    };
    if (kind === "script") scripts.push(entry);
    else if (kind === "measurement") measurements.push(entry);
    else otherGoogle.push(entry);
  });

  return {
    grantConsent() {
      consentGranted = true;
    },
    googleBeforeConsent,
    scripts,
    measurements,
    otherGoogle,
    pageViewHits() {
      return measurements
        .map((m) => parseGa4PageViewHit(m.url, m.postData, m.status))
        .filter(Boolean);
    },
    resetMeasurements() {
      measurements.length = 0;
    },
  };
}

async function runScenario(baseUrl, label) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const net = createNetworkCollector(page, { onlyAfterConsent: true });

  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(800);

  const blockedBeforeConsent = net.googleBeforeConsent.filter(
    (x) => x.kind === "script" || x.kind === "measurement",
  );
  if (blockedBeforeConsent.length > 0) {
    fail(
      `${label}: script/mesure Google avant consentement (${blockedBeforeConsent.length})`,
    );
  } else {
    ok(`${label}: aucune requête GTM/GA4 (script/mesure) avant consentement`);
  }

  net.grantConsent();
  await page.locator("#cookie-accept-all").click();
  await page.waitForTimeout(12000);

  const dlState = await page.evaluate(() => {
    const dl = window.dataLayer || [];
    const gtmJsEntries = dl.filter(
      (x) => x && typeof x === "object" && x.event === "gtm.js" && x["gtm.start"],
    );
    return { bootstrapCount: gtmJsEntries.length };
  });

  if (dlState.bootstrapCount !== 1) {
    fail(`${label}: attendu 1 push gtm.js/gtm.start, obtenu ${dlState.bootstrapCount}`);
  } else {
    ok(`${label}: bootstrap GTM (gtm.start + gtm.js) une fois`);
  }

  if (net.scripts.length === 0) {
    fail(`${label}: aucun script GTM/gtag chargé après consentement`);
  } else {
    ok(`${label}: ${net.scripts.length} requête(s) script (gtm.js/gtag/js), distinctes des hits mesure`);
  }

  const firstLoadPageViews = net.pageViewHits();
  assertExactlyOnePageView(firstLoadPageViews, `${label} [1er chargement]`);

  const nonPageViewMeasurements = net.measurements.filter((m) => {
    const pv = parseGa4PageViewHit(m.url, m.postData, m.status);
    return !pv;
  });
  if (nonPageViewMeasurements.length > 0) {
    console.log(
      `INFO: ${label}: ${nonPageViewMeasurements.length} autre(s) requête(s) mesure GA4/GTM (non page_view)`,
    );
  }

  net.resetMeasurements();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(12000);

  const reloadBootstrap = await page.evaluate(() => {
    const dl = window.dataLayer || [];
    return dl.filter(
      (x) => x && typeof x === "object" && x.event === "gtm.js" && x["gtm.start"],
    ).length;
  });
  if (reloadBootstrap !== 1) {
    fail(`${label}: après reload, attendu 1 bootstrap gtm.js, obtenu ${reloadBootstrap}`);
  } else {
    ok(`${label}: un seul bootstrap gtm.js après reload`);
  }

  const reloadPageViews = net.pageViewHits();
  assertExactlyOnePageView(reloadPageViews, `${label} [reload]`);

  await browser.close();
}

async function main() {
  const prodUrl = process.env.TEST_GTM_URL;
  const runProd = process.env.TEST_GTM_PROD === "1";

  const { server, base } = await startLocalSite();
  try {
    await runScenario(base, "local");
  } finally {
    server.close();
  }

  if (runProd) {
    await runScenario(prodUrl || "https://redkmotors.fr/", "prod");
  }

  if (process.exitCode) process.exit(process.exitCode);
  console.log("Tests GTM page_view: OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
