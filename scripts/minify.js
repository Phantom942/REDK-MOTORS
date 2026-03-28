#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const siteDir = path.join(__dirname, '..', '_site');

const cssDir = path.join(siteDir, 'assets', 'css');
fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(file => {
  const filePath = path.join(cssDir, file);
  const input = fs.readFileSync(filePath, 'utf8');
  // Niveau 2 sans fusion agressive des @media (évite de casser le responsive après minify)
  const output = new CleanCSS({
    level: {
      1: { all: true },
      2: {
        restructureRules: false,
        mergeMedia: false,
        mergeNonAdjacentRules: false,
      },
    },
  }).minify(input);
  if (output.styles) {
    fs.writeFileSync(filePath, output.styles);
    const saved = ((1 - output.styles.length / input.length) * 100).toFixed(1);
    console.log(`CSS ${file}: ${(input.length / 1024).toFixed(1)}KB -> ${(output.styles.length / 1024).toFixed(1)}KB (-${saved}%)`);
  }
});

const jsDir = path.join(siteDir, 'assets', 'js');
fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).forEach(file => {
  const filePath = path.join(jsDir, file);
  const input = fs.readFileSync(filePath, 'utf8');
  const output = input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  fs.writeFileSync(filePath, output);
  const saved = ((1 - output.length / input.length) * 100).toFixed(1);
  console.log(`JS  ${file}: ${(input.length / 1024).toFixed(1)}KB -> ${(output.length / 1024).toFixed(1)}KB (-${saved}%)`);
});

console.log('Minification terminée.');
