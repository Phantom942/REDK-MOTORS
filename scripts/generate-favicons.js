#!/usr/bin/env node
/**
 * Génère favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
 * depuis favicon.svg. Exécuter : npm run favicon
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const svgPath = path.join(root, 'favicon.svg');

async function run() {
  const sharp = require('sharp');
  const ico = require('sharp-ico');

  const svg = sharp(fs.readFileSync(svgPath));
  await Promise.all([
    svg.clone().resize(16, 16).png().toFile(path.join(root, 'favicon-16x16.png')),
    svg.clone().resize(32, 32).png().toFile(path.join(root, 'favicon-32x32.png')),
    svg.clone().resize(180, 180).png().toFile(path.join(root, 'apple-touch-icon.png')),
  ]);

  const png32 = sharp(fs.readFileSync(path.join(root, 'favicon-32x32.png')));
  await ico.sharpsToIco([png32], path.join(root, 'favicon.ico'), { sizes: [32, 16] });

  console.log('Favicons générés : favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png');
}

run().catch((e) => {
  console.error('Erreur:', e.message);
  process.exit(1);
});
