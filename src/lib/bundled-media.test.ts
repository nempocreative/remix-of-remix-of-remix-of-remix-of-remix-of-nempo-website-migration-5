import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function codeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return codeFiles(path);
    return /\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("site media is bundled with the site", () => {
  it("no page or component loads media from separate Lovable storage", () => {
    const offenders = codeFiles("src").filter((file) => {
      const text = readFileSync(file, "utf8");
      return /\.asset\.json["']/.test(text) || text.includes("/__l5e/");
    });
    expect(offenders).toEqual([]);
  });
});
