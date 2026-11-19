import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";

const dir = "public/ggs-hair-studio/assets";
const bundle = readdirSync(dir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => readFileSync(`${dir}/${f}`, "utf8"))
  .join("\n");

describe("GGS site without My GGS (owner request)", () => {
  it("has no My GGS menu or header account button", () => {
    expect(bundle).not.toContain("My GGS");
    expect(bundle).not.toContain("link-header-account");
  });
});
