#!/usr/bin/env node
/**
 * Génère favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
 * et assets/img/og-brand.png (1200×630, fond noir, logo à gauche)
 * depuis assets/img/logo-basique-horizontal.png. Exécuter : npm run favicon
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'assets', 'img', 'logo-basique-horizontal.png');
const ogOutPath = path.join(root, 'assets', 'img', 'og-brand.png');

const OG_W = 1200;
const OG_H = 630;

/**
 * Bannière large : carré côté gauche (hauteur) pour le favicon.
 */
async function toSquareSource(inputBuffer) {
  const sharp = require('sharp');
  const meta = await sharp(inputBuffer).metadata();
  const w = meta.width;
  const h = meta.height;
  if (!w || !h) throw new Error('Dimensions invalides pour le logo source');

  let left = 0;
  let top = 0;
  let side = w;
  if (w > h) {
    side = h;
  } else if (h > w) {
    side = w;
  }
  return sharp(inputBuffer).extract({ left, top, width: side, height: side });
}

async function writeOgImage(inputBuffer) {
  const sharp = require('sharp');
  const overlay = await sharp(inputBuffer)
    .resize(OG_W, OG_H, { fit: 'inside' })
    .toBuffer();
  const { width, height } = await sharp(overlay).metadata();
  const top = Math.max(0, Math.round((OG_H - (height || 0)) / 2));

  await sharp({
    create: {
      width: OG_W,
      height: OG_H,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([{ input: overlay, left: 0, top }])
    .png()
    .toFile(ogOutPath);
}

async function run() {
  const sharp = require('sharp');
  const ico = require('sharp-ico');

  const inputBuffer = fs.readFileSync(sourcePath);
  const square = await toSquareSource(inputBuffer);

  await Promise.all([
    square.clone().resize(16, 16).png().toFile(path.join(root, 'favicon-16x16.png')),
    square.clone().resize(32, 32).png().toFile(path.join(root, 'favicon-32x32.png')),
    square.clone().resize(180, 180).png().toFile(path.join(root, 'apple-touch-icon.png')),
  ]);

  const png32 = sharp(fs.readFileSync(path.join(root, 'favicon-32x32.png')));
  await ico.sharpsToIco([png32], path.join(root, 'favicon.ico'), { sizes: [32, 16] });

  await writeOgImage(inputBuffer);

  console.log(
    'Favicons + OG : favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png,',
    path.relative(root, ogOutPath),
  );
}

run().catch((e) => {
  console.error('Erreur:', e.message);
  process.exit(1);
});
