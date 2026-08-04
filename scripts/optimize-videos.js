#!/usr/bin/env node
/**
 * Ré-encode les vidéos hero pour le web : H.264, faststart, sans audio.
 * Génère aussi un poster WebP (1re frame) pour améliorer le LCP.
 * Usage : npm run videos:optimize
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const videoDir = path.join(__dirname, "..", "assets", "video");
const posterDir = path.join(__dirname, "..", "assets", "posters");

/** Fichiers lourds — encodage agressif (960px, CRF 31–32). Ne remplace que si plus léger. */
const AGGRESSIVE = {
  "contact.mp4": { crf: 32, maxDuration: 10, maxW: 960 },
  "carrosserie.mp4": { crf: 31, maxDuration: 12, maxW: 960 },
  "pneumatique.mp4": { crf: 31, maxDuration: 12, maxW: 960 },
  "entretien.mp4": { crf: 31, maxDuration: 12, maxW: 960 },
  "mecanique.mp4": { crf: 31, maxDuration: 12, maxW: 960 },
};

function optimize(file) {
  const input = path.join(videoDir, file);
  const tmp = path.join(videoDir, `.tmp-${file}`);
  const isMobile = file.includes("-mobile");
  const override = AGGRESSIVE[file] || {};
  const maxW = isMobile ? 720 : override.maxW || 1280;
  const crf = isMobile ? 30 : override.crf || 28;
  const maxDuration = override.maxDuration || 15;
  const preset = override.crf >= 31 ? "slow" : "medium";

  const vf = `scale='min(${maxW},iw)':-2`;
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      input,
      "-t",
      String(maxDuration),
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-crf",
      String(crf),
      "-preset",
      preset,
      "-movflags",
      "+faststart",
      "-an",
      tmp,
    ],
    { stdio: "inherit" }
  );

  const before = fs.statSync(input).size;
  const after = fs.statSync(tmp).size;
  if (after >= before) {
    fs.unlinkSync(tmp);
    console.log(`  ○ ${file}: conservé (${(before / 1024 / 1024).toFixed(2)} Mo — pas de gain)\n`);
    return;
  }
  fs.renameSync(tmp, input);
  const pct = Math.round((1 - after / before) * 100);
  console.log(
    `  ✓ ${file}: ${(before / 1024 / 1024).toFixed(2)} Mo → ${(after / 1024 / 1024).toFixed(2)} Mo (-${pct}%)\n`
  );
}

function generatePoster(file) {
  if (file.includes("-mobile")) return;
  const input = path.join(videoDir, file);
  const base = file.replace(/\.mp4$/, "");
  const posterPath = path.join(posterDir, `${base}-poster.webp`);
  execFileSync(
    "ffmpeg",
    ["-y", "-i", input, "-vframes", "1", "-q:v", "75", posterPath],
    { stdio: "pipe" }
  );
  const kb = Math.round(fs.statSync(posterPath).size / 1024);
  console.log(`  ✓ poster ${base}-poster.webp (${kb} Ko)`);
}

const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".mp4"));
fs.mkdirSync(posterDir, { recursive: true });
console.log(`Optimisation de ${files.length} vidéos…\n`);
for (const file of files) {
  console.log(`→ ${file}`);
  optimize(file);
  try {
    generatePoster(file);
  } catch (err) {
    console.warn(`  ⚠ poster ${file}: ${err.message}`);
  }
}
console.log("Terminé.");
