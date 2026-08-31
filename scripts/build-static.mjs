#!/usr/bin/env node
/**
 * Builds the cPanel static export into dist/.
 *
 * `output: "export"` cannot represent the crowdfunding section: it ships route
 * handlers (three of which need SUPABASE_SERVICE_ROLE_KEY and so can never run
 * in a browser) and a force-dynamic page. Next fails the whole build if either
 * is present, so this stages them out of the tree for the duration of the build
 * and puts them back afterwards.
 *
 * The result is the marketing site exactly as it shipped before the
 * crowdfunding merge. /crowdfunding is NOT in it — which is why the navbar tab
 * is compiled out too, via NEXT_PUBLIC_CROWDFUNDING_ENABLED=false, rather than
 * pointing visitors at a 404.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const staging = path.join(root, ".static-export-staging");

// Everything that needs a Node runtime at request time.
const SERVER_ONLY = ["src/app/api", "src/app/crowdfunding"];

const moved = [];

function stashServerOnlyPaths() {
  fs.rmSync(staging, { recursive: true, force: true });
  for (const rel of SERVER_ONLY) {
    const from = path.join(root, rel);
    if (!fs.existsSync(from)) continue;
    const to = path.join(staging, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.renameSync(from, to);
    moved.push({ from, to });
    console.log(`  staged out ${rel}`);
  }
}

function restoreServerOnlyPaths() {
  for (const { from, to } of moved.reverse()) {
    fs.mkdirSync(path.dirname(from), { recursive: true });
    fs.renameSync(to, from);
  }
  fs.rmSync(staging, { recursive: true, force: true });
}

function run(cmd, args, env) {
  execFileSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

console.log("Staging out the server-only routes...");
stashServerOnlyPaths();

try {
  run("pnpm", ["exec", "next", "build"], {
    STATIC_EXPORT: "true",
    // The tab would 404 on a host that has no /crowdfunding.
    NEXT_PUBLIC_CROWDFUNDING_ENABLED: "false",
  });
} finally {
  // Runs even if the build throws, so a failure never leaves the tree gutted.
  console.log("Restoring the server-only routes...");
  restoreServerOnlyPaths();
}

const out = path.join(root, "out");
if (!fs.existsSync(path.join(out, "index.html"))) {
  throw new Error("out/index.html missing — the export did not produce a site");
}

// Next ignores next.config's headers() under `output: "export"`, so Apache
// carries the security and cache headers instead.
fs.copyFileSync(
  path.join(root, "deploy/.htaccess"),
  path.join(out, ".htaccess"),
);

const dist = path.join(root, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.renameSync(out, dist);

// This build generated .next/types from a tree with the server routes removed,
// so a later `pnpm typecheck` would see route unions that disagree with the
// dev server's. Drop them and let the next dev/build regenerate.
fs.rmSync(path.join(root, ".next/types"), { recursive: true, force: true });

const pages = fs
  .readdirSync(dist, { recursive: true })
  .filter((f) => String(f).endsWith(".html")).length;
console.log(`\nExported ${pages} HTML files into dist/`);
