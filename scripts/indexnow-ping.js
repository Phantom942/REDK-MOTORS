#!/usr/bin/env node
/**
 * Signale les URLs du sitemap aux moteurs IndexNow (Bing, Yandex, Seznam, Naver…).
 * Usage : node scripts/indexnow-ping.js
 * Env   : SITE_URL, INDEXNOW_KEY (optionnel — clé par défaut = fichier *.txt à la racine)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const SITE_URL = (process.env.SITE_URL || "https://redkmotors.fr").replace(/\/$/, "");
const INDEXNOW_KEY = (process.env.INDEXNOW_KEY || "315a9d29deec456a9cd2ae11fe67e677").trim();
const BATCH_SIZE = 5000;
const LOCAL_SITE = process.env.INDEXNOW_LOCAL_SITE || path.join(__dirname, "..", "_site");

function parseLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`${url} → HTTP ${res.status}`);
  }
  return res.text();
}

async function collectFromLive(baseUrl) {
  const indexXml = await fetchText(`${baseUrl}/sitemap.xml`);
  const submaps = parseLocs(indexXml);
  const urls = [];

  for (const sm of submaps) {
    const xml = await fetchText(sm);
    urls.push(...parseLocs(xml));
  }

  return urls.filter((u) => u.startsWith(baseUrl));
}

function collectFromLocal() {
  const urls = [];
  const files = ["sitemap-pages.xml", "sitemap-blog.xml", "sitemap-exemples.xml"];

  for (const file of files) {
    const filePath = path.join(LOCAL_SITE, file);
    if (!fs.existsSync(filePath)) continue;
    urls.push(...parseLocs(fs.readFileSync(filePath, "utf8")));
  }

  return [...new Set(urls)];
}

async function collectUrls() {
  try {
    const live = await collectFromLive(SITE_URL);
    if (live.length > 0) return [...new Set(live)];
  } catch (err) {
    console.warn(`indexnow: sitemap live indisponible (${err.message}) — fallback _site`);
  }

  const local = collectFromLocal();
  if (local.length === 0) {
    throw new Error("aucune URL trouvée (sitemap live + _site vides)");
  }
  return local;
}

async function verifyKeyFile() {
  const keyUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
  const res = await fetch(keyUrl, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`fichier clé ${keyUrl} → HTTP ${res.status}`);
  }
  const body = (await res.text()).trim();
  if (body !== INDEXNOW_KEY) {
    throw new Error(`contenu clé invalide sur ${keyUrl}`);
  }
  console.log(`indexnow: clé vérifiée → ${keyUrl}`);
}

async function submitBatch(urlList) {
  const host = new URL(SITE_URL).hostname;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (res.status === 200 || res.status === 202) {
    console.log(`indexnow: ${urlList.length} URL(s) → HTTP ${res.status}`);
    return true;
  }

  const detail = await res.text();
  throw new Error(`IndexNow HTTP ${res.status}: ${detail || res.statusText}`);
}

async function main() {
  if (!/^[a-f0-9]{8,128}$/i.test(INDEXNOW_KEY)) {
    throw new Error("INDEXNOW_KEY invalide (hex 8–128 caractères)");
  }

  try {
    await verifyKeyFile();
  } catch (err) {
    console.warn(`indexnow: clé non vérifiable en prod (${err.message}) — envoi quand même`);
  }

  const urls = await collectUrls();
  console.log(`indexnow: ${urls.length} URL(s) à signaler pour ${SITE_URL}`);

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    await submitBatch(urls.slice(i, i + BATCH_SIZE));
  }

  console.log("indexnow: terminé");
}

main().catch((err) => {
  console.error(`indexnow: échec — ${err.message}`);
  process.exit(1);
});
