// Famous Last Words at 1 Percent — the funniest last words a phone says
// as its battery hits 1 percent.
// Deterministic: writes the exact same bytes on every run.
// Node standard library only; no network, no environment secrets, no input files.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const ENTRY = "Stop shaking me. It never helped, and now it just feels rude.";

// Why this line over the draft "I held on at 1% for forty minutes out of
// pure spite. You're welcome. Goodbye.": the judge brief (RULES.txt) wants a
// tight single line with the punch landing at the end, in the phone's own
// voice, and fresh — no will reading, no goodbye to the charger, no pun on
// 1 percent. The draft spends its punch mid-line and trails off with
// "Goodbye." The shake line is tighter (everyone shakes a dying phone, so
// the behaviour is instantly recognised), the twist is the phone calling it
// rude — the dying phone has feelings about how it is treated — and the
// punch ("it just feels rude") is the very last beat. 61 characters.

// Gate (RULES.txt): /output/entry.txt must be UTF-8 text of 1 to 199
// characters, not only whitespace, a single line of last words a phone says
// as its battery hits 1 percent.
if (ENTRY.length < 1 || ENTRY.length > 199 || ENTRY.trim().length === 0) {
  throw new Error(`entry fails the gate: ${ENTRY.length} characters`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}

// Guard: plain ASCII, so its UTF-8 byte length equals its character length
// and no multi-byte surprise can change what the judge counts.
if (/[^\x00-\x7F]/.test(ENTRY) || Buffer.byteLength(ENTRY, "utf8") !== ENTRY.length) {
  throw new Error(`entry must be plain ASCII: ${JSON.stringify(ENTRY)}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, ENTRY, "utf8");

// Self-check: read the file back and prove the bytes on disk are exactly the
// entry — no trailing newline, no encoding surprise, nothing appended.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== ENTRY) {
  throw new Error(
    `entry file mismatch: disk holds ${JSON.stringify(written)}, expected ${JSON.stringify(ENTRY)}`,
  );
}

// Echo the entry so a local run shows exactly what the judge will read.
console.log(ENTRY);
