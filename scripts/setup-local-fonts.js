/**
 * Copie les sous-ensembles latin WOFF2 depuis @fontsource vers assets/fonts/
 * et régénère assets/css/fonts-local.css (self-host, sans Google Fonts).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fontsDir = path.join(root, "assets", "fonts");
const cssPath = path.join(root, "assets", "css", "fonts-local.css");

const FONT_SPECS = [
  {
    package: "@fontsource/manrope",
    files: [
      "manrope-latin-400-normal.woff2",
      "manrope-latin-500-normal.woff2",
      "manrope-latin-600-normal.woff2",
      "manrope-latin-700-normal.woff2",
    ],
    faces: [
      { family: "Manrope", weight: 400, file: "manrope-latin-400-normal.woff2" },
      { family: "Manrope", weight: 500, file: "manrope-latin-500-normal.woff2" },
      { family: "Manrope", weight: 600, file: "manrope-latin-600-normal.woff2" },
      { family: "Manrope", weight: 700, file: "manrope-latin-700-normal.woff2" },
    ],
  },
  {
    package: "@fontsource/space-grotesk",
    files: [
      "space-grotesk-latin-500-normal.woff2",
      "space-grotesk-latin-600-normal.woff2",
      "space-grotesk-latin-700-normal.woff2",
    ],
    faces: [
      { family: "Space Grotesk", weight: 500, file: "space-grotesk-latin-500-normal.woff2" },
      { family: "Space Grotesk", weight: 600, file: "space-grotesk-latin-600-normal.woff2" },
      { family: "Space Grotesk", weight: 700, file: "space-grotesk-latin-700-normal.woff2" },
    ],
  },
];

fs.mkdirSync(fontsDir, { recursive: true });

const cssBlocks = [];

for (const spec of FONT_SPECS) {
  const srcDir = path.join(root, "node_modules", spec.package, "files");
  if (!fs.existsSync(srcDir)) {
    console.error(`Package manquant : ${spec.package}. Lancez npm install.`);
    process.exit(1);
  }

  for (const file of spec.files) {
    const src = path.join(srcDir, file);
    const dest = path.join(fontsDir, file);
    if (!fs.existsSync(src)) {
      console.error(`Fichier introuvable : ${src}`);
      process.exit(1);
    }
    fs.copyFileSync(src, dest);
    console.log(`Copié : ${file}`);
  }

  for (const face of spec.faces) {
    cssBlocks.push(`@font-face {
  font-family: "${face.family}";
  font-style: normal;
  font-display: swap;
  font-weight: ${face.weight};
  src: url("/assets/fonts/${face.file}") format("woff2");
}`);
  }
}

const css = `/* Self-hosted — Manrope + Space Grotesk (latin). Généré par scripts/setup-local-fonts.js */
${cssBlocks.join("\n\n")}
`;

fs.writeFileSync(cssPath, css, "utf8");
console.log(`CSS écrit : ${path.relative(root, cssPath)}`);
