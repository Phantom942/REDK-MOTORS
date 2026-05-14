#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

const allowedExtensions = new Set([
  '.njk',
  '.html',
  '.json',
  '.js',
  '.md',
  '.xml',
  '.txt',
]);

const forbiddenPatterns = [
  /10\s*h?\s*[-–]\s*20\s*h(?:00)?/i,
  /10\s*h\s*à\s*20\s*h/i,
  /20:00/,
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
      continue;
    }
    if (allowedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = walk(srcDir);
const issues = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (forbiddenPatterns.some((pattern) => pattern.test(line))) {
      issues.push({
        file: path.relative(projectRoot, file),
        line: index + 1,
        text: line.trim(),
      });
    }
  });
}

if (issues.length > 0) {
  console.error("Erreur: anciens horaires détectés (attendu: 10h-18h).");
  for (const issue of issues) {
    console.error(`- ${issue.file}:${issue.line} -> ${issue.text}`);
  }
  process.exit(1);
}

console.log("OK: aucun ancien horaire détecté (10h-20h / 20:00).");
