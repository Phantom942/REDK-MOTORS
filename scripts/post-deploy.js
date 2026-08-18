#!/usr/bin/env node
/**
 * Post-déploiement : IndexNow (priorité + sitemap) + vérif headers prod.
 */
const { execSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");

function run(label, cmd) {
  console.log(`\n=== ${label} ===\n`);
  execSync(cmd, { cwd: root, stdio: "inherit" });
}

async function main() {
  run("IndexNow priorité", "npm run indexnow:priority");
  run("IndexNow sitemap", "npm run indexnow:ping");
  run("Vérif prod", "npm run verify:prod");
  console.log("\nPost-déploiement terminé.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
