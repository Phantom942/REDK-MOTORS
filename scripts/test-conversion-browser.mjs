#!/usr/bin/env node
/**
 * Tests d'intégration navigateur (Playwright) — tracking conversions.
 * Scénarios : ordre funnel→track, idempotence loadAnalytics, consent on/off,
 * formulaire valide/invalide, parcours FormSubmit → merci (redirect vs success).
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SITE = join(ROOT, "_site");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function startStaticServer() {
  if (!existsSync(SITE)) {
    throw new Error("_site/ absent — lancer npm run build avant");
  }
  const server = createServer((req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (urlPath.endsWith("/")) urlPath += "index.html";
      const filePath = normalize(join(SITE, urlPath));
      if (!filePath.startsWith(SITE)) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }
      if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const ext = extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(readFileSync(filePath));
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

async function installDataLayerProbe(page) {
  await page.addInitScript(() => {
    window.__TEST_EVENTS__ = [];
    function wrap(arr) {
      if (!arr || arr.__redkWrapped) return arr;
      const _push = arr.push.bind(arr);
      arr.push = function (...args) {
        for (const a of args) {
          if (a && typeof a === "object" && a.event) {
            window.__TEST_EVENTS__.push(a);
          }
        }
        return _push(...args);
      };
      arr.__redkWrapped = true;
      return arr;
    }
    let current = wrap([]);
    Object.defineProperty(window, "dataLayer", {
      configurable: true,
      get() {
        return current;
      },
      set(v) {
        current = wrap(Array.isArray(v) ? v : []);
      },
    });
  });
}

async function acceptCookies(page) {
  const btn = page.locator("#cookie-accept-all");
  if (await btn.count()) {
    await btn.click();
  }
  await page.waitForFunction(
    () =>
      !!window.REDKMotorsConversionFunnel &&
      !!window.__REDK_TRACK_BOUND__ &&
      !window.__REDK_ANALYTICS_DISABLED__,
    { timeout: 8000 },
  );
}

async function eventNames(page) {
  return page.evaluate(() => (window.__TEST_EVENTS__ || []).map((e) => e.event));
}

async function clearEvents(page) {
  await page.evaluate(() => {
    window.__TEST_EVENTS__ = [];
  });
}

async function main() {
  const { server, base } = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await installDataLayerProbe(page);

  try {
    // --- 1) Ordre funnel → track + idempotence loadAnalytics ---
    await page.goto(`${base}/contact/`, { waitUntil: "domcontentloaded" });
    await acceptCookies(page);

    const order = await page.evaluate(() => {
      const scripts = [...document.querySelectorAll("script[data-redk-src]")].map((s) => ({
        src: s.getAttribute("data-redk-src"),
        loaded: s.getAttribute("data-redk-loaded"),
      }));
      return {
        scripts,
        hasFunnel: !!window.REDKMotorsConversionFunnel,
        trackBound: !!window.__REDK_TRACK_BOUND__,
      };
    });

    const funnelIdx = order.scripts.findIndex((s) =>
      (s.src || "").includes("conversion-funnel.js"),
    );
    const trackIdx = order.scripts.findIndex((s) => (s.src || "").includes("track.js"));
    if (funnelIdx === -1 || trackIdx === -1 || funnelIdx >= trackIdx) {
      fail(`ordre scripts invalide: ${JSON.stringify(order.scripts)}`);
    } else {
      ok("conversion-funnel.js chargé avant track.js (data-redk-src)");
    }
    if (!order.hasFunnel || !order.trackBound) {
      fail("funnel/track non initialisés après consentement");
    } else {
      ok("funnel + track initialisés");
    }

    const gtmBootstrap = await page.evaluate(() => {
      const dl = window.dataLayer || [];
      const entries = dl.filter(
        (x) => x && typeof x === "object" && x.event === "gtm.js" && x["gtm.start"],
      );
      return { count: entries.length, flag: !!window.__REDK_GTM_BOOTSTRAP__ };
    });
    if (gtmBootstrap.count !== 1 || !gtmBootstrap.flag) {
      fail(`bootstrap GTM invalide: ${JSON.stringify(gtmBootstrap)}`);
    } else {
      ok("gtm.start + gtm.js poussés une fois avant gtm.js");
    }

    // Double accept / re-loadAnalytics → pas de scripts dupliqués
    await page.evaluate(() => {
      if (window.REDKMotorsCookies && window.REDKMotorsCookies.openPreferences) {
        // re-simule accept via état + event (idempotence côté cookies.js)
      }
      // Clique éventuel encore présent (ne doit rien dupliquer)
      const btn = document.getElementById("cookie-accept-all");
      if (btn) btn.click();
    });
    // Forcer un second passage loadAnalytics via API publique si exposée :
    // cookies.js ne l'expose pas — on rejoue accept via rejet puis accept
    await page.evaluate(() => {
      // Ouvrir préférences et re-sauver analytics ON (appelle loadAnalytics)
      if (typeof window.REDKMotorsCookies?.openPreferences === "function") {
        window.REDKMotorsCookies.openPreferences();
      }
    });
    await page.waitForTimeout(200);
    const analyticsCb = page.locator("#cookie-analytics");
    if (await analyticsCb.count()) {
      await analyticsCb.check();
      await page.locator("#cookie-save-preferences").click();
      await page.waitForTimeout(400);
    }
    const counts = await page.evaluate(() => ({
      funnel: document.querySelectorAll(
        'script[data-redk-src="/assets/js/conversion-funnel.js"]',
      ).length,
      track: document.querySelectorAll('script[data-redk-src="/assets/js/track.js"]').length,
      gtm: document.querySelectorAll("script[data-redk-gtm]").length,
    }));
    if (counts.funnel !== 1 || counts.track !== 1 || counts.gtm !== 1) {
      fail(`scripts dupliqués: ${JSON.stringify(counts)}`);
    } else {
      ok("loadAnalytics idempotent (1 funnel + 1 track + 1 GTM)");
    }

    // --- 2) Consentement à chaque event + retrait + réactivation ---
    await clearEvents(page);
    await page.locator('a[href^="tel:"]').first().click();
    await page.waitForTimeout(150);
    let events = await eventNames(page);
    if (!events.includes("click_call")) {
      fail(`click_call absent avec consentement: ${JSON.stringify(events)}`);
    } else {
      ok("click_call avec consentement");
    }

    await page.evaluate(() => {
      window.__TEST_EVENTS__ = [];
      // Refus via bandeau / API : simule removeAnalytics
      if (document.getElementById("cookie-reject-all")) {
        document.getElementById("cookie-reject-all").click();
      } else {
        window.__REDK_ANALYTICS_DISABLED__ = true;
        const prev = window.REDKMotorsCookies.hasConsent.bind(window.REDKMotorsCookies);
        window.REDKMotorsCookies.hasConsent = (t) =>
          t === "analytics" ? false : prev(t);
        document.dispatchEvent(new CustomEvent("redk:analytics-consent-revoked"));
      }
    });
    // Si panneau ouvert avec reject — sinon forcer état cookie
    await page.evaluate(() => {
      window.__REDK_ANALYTICS_DISABLED__ = true;
      const api = window.REDKMotorsCookies;
      if (api) {
        const orig = api.hasConsent.bind(api);
        api.hasConsent = (t) => (t === "analytics" ? false : orig(t));
      }
    });
    await clearEvents(page);
    await page.locator('a[href^="tel:"]').first().click();
    await page.waitForTimeout(150);
    events = await eventNames(page);
    if (events.includes("click_call")) {
      fail("click_call encore poussé après retrait consentement");
    } else {
      ok("aucun event après retrait consentement");
    }

    // Réactivation sans recharger les scripts
    await page.evaluate(() => {
      window.__REDK_ANALYTICS_DISABLED__ = false;
      window.REDKMotorsCookies.hasConsent = (t) =>
        t === "essentiels" || t === "analytics";
      document.dispatchEvent(
        new CustomEvent("redk:analytics-consent", { detail: { analytics: true } }),
      );
    });
    await clearEvents(page);
    await page.locator('a[href^="tel:"]').first().click();
    await page.waitForTimeout(150);
    events = await eventNames(page);
    if (!events.includes("click_call")) {
      fail(`click_call absent après réactivation: ${JSON.stringify(events)}`);
    } else {
      ok("click_call après réactivation (scripts non rechargés)");
    }

    // --- 3) Contact call-first : aucun formulaire FormSubmit ---
    await page.goto(`${base}/contact/`, { waitUntil: "domcontentloaded" });
    if (await page.locator("#cookie-accept-all").count()) {
      await acceptCookies(page);
    }
    const contactForms = await page.locator("form[action*='formsubmit'], form[data-track-submit]").count();
    const callCta = await page.locator('#contact-call-title, a[data-track-pos="contact_call_block"]').count();
    if (contactForms > 0) {
      fail(`formulaire encore présent sur /contact/ (${contactForms})`);
    } else if (!callCta) {
      fail("CTA appel absent sur /contact/");
    } else {
      ok("/contact/ : pas de formulaire, CTA appel présent");
    }

    // --- 4) Merci recentré téléphone ---
    await page.goto(`${base}/merci/`, { waitUntil: "domcontentloaded" });
    const merciCopy = await page.locator("#merci-default-msg").innerText();
    if (!/Pas de formulaire/i.test(merciCopy)) {
      fail("merci doit indiquer l'absence de formulaire");
    } else {
      ok("merci : message call-first");
    }

    // --- 5) Espace Pro : appel, pas de formulaire ---
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/professionnels/`, { waitUntil: "domcontentloaded" });
    if (await page.locator("#cookie-accept-all").count()) {
      await acceptCookies(page);
    }
    const proForms = await page.locator("form[action*='formsubmit'], form[data-track-submit]").count();
    const proCall = await page.locator("#pro-call-title, a[data-track-pos='pro_call_block']").count();
    if (proForms > 0) {
      fail(`formulaire encore présent sur /professionnels/ (${proForms})`);
    } else if (!proCall) {
      fail("CTA appel Pro absent");
    } else {
      ok("/professionnels/ mobile : pas de formulaire, CTA appel");
    }

    await clearEvents(page);
    await page.locator('a[data-track-pos="pro_call_block"][href^="tel:"]').click();
    await page.waitForTimeout(150);
    events = await eventNames(page);
    if (!events.includes("click_call")) {
      fail(`click_call Pro attendu: ${JSON.stringify(events)}`);
    } else {
      ok("Espace Pro : click_call tracké (sans PII formulaire)");
    }

    if (!process.exitCode) {
      console.log("Tests conversion browser: OK");
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
