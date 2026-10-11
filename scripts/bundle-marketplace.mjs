#!/usr/bin/env node
/**
 * Bundle marketplace (ESM) avec @supabase/supabase-js verrouillé — sans esm.sh.
 */
import esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const entry = path.join(root, "assets/js/marketplace/marketplace.js");
const outfile = path.join(root, "assets/js/marketplace/marketplace.bundle.js");

await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  outfile,
  sourcemap: true,
  logLevel: "info",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log(`Bundle marketplace → ${path.relative(root, outfile)}`);
