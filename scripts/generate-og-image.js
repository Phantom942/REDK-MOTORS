#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const svgPath = path.join(root, 'assets', 'img', 'og-default.svg');
const outPath = path.join(root, 'assets', 'img', 'og-default.png');

async function run() {
  const sharp = require('sharp');
  await sharp(fs.readFileSync(svgPath))
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(outPath);
  console.log('OG image générée :', outPath);
}

run().catch((e) => {
  console.error('Erreur:', e.message);
  process.exit(1);
});
