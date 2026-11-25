import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The joke lives in entry.txt, not in this file, so swapping the line swaps the laugh.
// Read it at runtime, check the gate, and hand the grader exactly what it says.
// A line is only funny if it arrives intact — no trimming the punchline away.
// If the line breaks the rules, fail loudly instead of shipping a silent dud.
// The file itself stays dumb on purpose: the joke is data, this file is plumbing.
// A trailing newline is just file formatting, so strip it before measuring the line.
// The length check is the whole quality gate — short enough to land, long enough to exist.
// Output goes wherever the grader points us, created on demand if it is not there yet.

const entryPath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
const raw = readFileSync(entryPath, "utf8");
const line = raw.replace(/\r?\n$/, "");

if (line.length < 1 || line.length > 200 || line.trim().length === 0) {
  console.error("entry.txt must be 1-200 characters and not whitespace-only");
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line, "utf8");
