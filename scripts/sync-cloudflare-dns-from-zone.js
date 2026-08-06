#!/usr/bin/env node
/**
 * Parse un export zone Amen (TSV: name TTL IN TYPE value) et affiche
 * les enregistrements à créer sur Cloudflare (hors NS/SOA).
 *
 * Usage: node scripts/sync-cloudflare-dns-from-zone.js [chemin.csv]
 */
const fs = require("fs");
const path = require("path");

const zoneFile =
  process.argv[2] ||
  path.join(process.env.USERPROFILE || "", "Downloads", "dns_zone_redkmotors.fr.csv");

const PROXY = {
  "redkmotors.fr": { A: true },
  "www.redkmotors.fr": { CNAME: true },
};

function shouldProxy(name, type) {
  return PROXY[name.replace(/\.$/, "")]?.[type] === true;
}

function parseZone(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      const parts = line.split(/\t+/);
      if (parts.length < 5) return null;
      const [rawName, ttl, , type, ...rest] = parts;
      const name = rawName.replace(/\.$/, "");
      const value = rest.join("\t").trim();
      return { name, ttl: Number(ttl), type, value };
    })
    .filter(Boolean)
    .filter((r) => !["NS", "SOA"].includes(r.type));
}

function toCloudflareRecord(row) {
  const proxied = shouldProxy(row.name, row.type);
  const base = { name: row.name, type: row.type, ttl: 1, proxied };

  switch (row.type) {
    case "A":
      return { ...base, content: row.value };
    case "CNAME":
      return { ...base, content: row.value.replace(/\.$/, "") };
    case "TXT":
      return { ...base, content: row.value, proxied: false };
    case "MX": {
      const [priority, target] = row.value.split(/\s+/);
      return {
        ...base,
        content: target.replace(/\.$/, ""),
        priority: Number(priority),
        proxied: false,
      };
    }
    case "SRV": {
      const [priority, weight, port, target] = row.value.split(/\s+/);
      const m = row.name.match(/^(_[^.]+)\.(_[^.]+)\.(.+)$/);
      return {
        ...base,
        proxied: false,
        data: {
          service: m?.[1] || "_autodiscover",
          proto: m?.[2] || "_tcp",
          name: m?.[3] || "redkmotors.fr",
          priority: Number(priority),
          weight: Number(weight),
          port: Number(port),
          target: target.replace(/\.$/, ""),
        },
      };
    }
    default:
      return null;
  }
}

function main() {
  if (!fs.existsSync(zoneFile)) {
    console.error("Fichier introuvable:", zoneFile);
    process.exit(1);
  }
  const rows = parseZone(fs.readFileSync(zoneFile, "utf8"));
  const records = rows.map(toCloudflareRecord).filter(Boolean);
  console.log(JSON.stringify({ source: zoneFile, count: records.length, records }, null, 2));
}

main();
