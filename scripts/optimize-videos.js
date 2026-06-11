#!/usr/bin/env node
/**
 * Ré-encode les vidéos hero pour le web : max 15 s, H.264, faststart, sans audio.
 * Usage : npm run videos:optimize
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const videoDir = path.join(__dirname, '..', 'assets', 'video');
const MAX_DURATION = 15;

function optimize(file) {
  const input = path.join(videoDir, file);
  const tmp = path.join(videoDir, `.tmp-${file}`);
  const isMobile = file.includes('-mobile');
  const maxW = isMobile ? 720 : 1280;
  const crf = isMobile ? 30 : 28;

  const vf = `scale='min(${maxW},iw)':-2`;
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      input,
      '-t',
      String(MAX_DURATION),
      '-vf',
      vf,
      '-c:v',
      'libx264',
      '-crf',
      String(crf),
      '-preset',
      'medium',
      '-movflags',
      '+faststart',
      '-an',
      tmp,
    ],
    { stdio: 'inherit' }
  );

  const before = fs.statSync(input).size;
  fs.renameSync(tmp, input);
  const after = fs.statSync(input).size;
  const pct = Math.round((1 - after / before) * 100);
  console.log(`  ✓ ${file}: ${(before / 1024 / 1024).toFixed(2)} Mo → ${(after / 1024 / 1024).toFixed(2)} Mo (${pct}%)\n`);
}

const files = fs.readdirSync(videoDir).filter((f) => f.endsWith('.mp4'));
console.log(`Optimisation de ${files.length} vidéos (max ${MAX_DURATION}s, sans audio)…\n`);
for (const file of files) {
  console.log(`→ ${file}`);
  optimize(file);
}
console.log('Terminé.');
