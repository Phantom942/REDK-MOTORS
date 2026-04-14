#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'assets', 'img', 'logo-redk-motors.png');
const outPath = path.join(root, 'assets', 'img', 'og-brand.png');

async function run() {
  const sharp = require('sharp');
  await sharp(fs.readFileSync(sourcePath))
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(outPath);
  console.log('OG image générée :', outPath);
}

run().catch((e) => {
  console.error('Erreur:', e.message);
  process.exit(1);
});
