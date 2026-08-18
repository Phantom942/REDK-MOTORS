/**
 * Génère logo-redk-motors.webp depuis le PNG source (header/footer).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "assets", "img", "logo-redk-motors.png");
const destPath = path.join(root, "assets", "img", "logo-redk-motors.webp");

if (!fs.existsSync(sourcePath)) {
  console.error(`Source introuvable : ${sourcePath}`);
  process.exit(1);
}

sharp(sourcePath)
  .webp({ quality: 85, effort: 6 })
  .toFile(destPath)
  .then((info) => {
    const pngSize = fs.statSync(sourcePath).size;
    console.log(
      `WebP créé : ${path.relative(root, destPath)} (${info.size} o, PNG ${pngSize} o, −${Math.round((1 - info.size / pngSize) * 100)} %)`
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
