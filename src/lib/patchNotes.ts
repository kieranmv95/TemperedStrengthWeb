import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

const PATCH_NOTES_DIR = path.join(process.cwd(), "src", "patch-notes");

function parseVersionSegments(version: string): number[] {
  return version
    .split(".")
    .map((s) => Number.parseInt(s, 10))
    .map((n) => (Number.isFinite(n) ? n : 0));
}

function compareVersionsDesc(a: string, b: string): number {
  const aa = parseVersionSegments(a);
  const bb = parseVersionSegments(b);
  const len = Math.max(aa.length, bb.length);
  for (let i = 0; i < len; i += 1) {
    const av = aa[i] ?? 0;
    const bv = bb[i] ?? 0;
    if (av !== bv) return bv - av;
  }
  return b.localeCompare(a);
}

export async function getPatchNotesVersions(): Promise<string[]> {
  const entries = await fs.readdir(PATCH_NOTES_DIR, { withFileTypes: true });
  const versions = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => e.name.replace(/\.md$/i, ""))
    .filter(Boolean)
    .sort(compareVersionsDesc);

  return versions;
}

export async function getPatchNotesMarkdown(version: string): Promise<string> {
  const safe = version.replace(/[^0-9a-zA-Z._-]/g, "");
  const filePath = path.join(PATCH_NOTES_DIR, `${safe}.md`);
  return await fs.readFile(filePath, "utf8");
}

