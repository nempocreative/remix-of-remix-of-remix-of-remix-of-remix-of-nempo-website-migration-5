import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM_NEMPO } from "@/data/program";

// Owner rule: the Pasar Seni Garut deck must not mention the brands "ESSE" or "Juara".
// Later the owner added the Pasanggiri Jaipong slides, whose prize ranks ("Juara 1/2/3",
// "Juara Harapan 1", "Hadiah Juara") are allowed; any other "Juara" stays forbidden.
const PERINGKAT = /juara\s+(?:[123]\b|harapan\s+1\b)|hadiah\s+juara/gi;
const tanpaPeringkat = (text: string) => text.replace(PERINGKAT, "");
const BRAND = /esse|juara/i;
const dir = resolve(process.cwd(), "src/program/pasar-seni-garut");
const files = [
  "manifest.json",
  "deck.tsx",
  ...readdirSync(resolve(dir, "components")).map((f) => `components/${f}`),
  ...readdirSync(resolve(dir, "slides")).map((f) => `slides/${f}`),
];

describe("Pasar Seni Garut deck brand words", () => {
  it.each(files)("%s has no ESSE or Juara brand", (file) => {
    const text = readFileSync(resolve(dir, file), "utf8");
    expect(tanpaPeringkat(text)).not.toMatch(BRAND);
  });

  it("program listing and page metadata have no ESSE or Juara", () => {
    const route = readFileSync(resolve(process.cwd(), "src/routes/program.pasar-seni-garut.tsx"), "utf8");
    expect(tanpaPeringkat(route)).not.toMatch(BRAND);
    expect(tanpaPeringkat(JSON.stringify(PROGRAM_NEMPO))).not.toMatch(BRAND);
  });

  it("still catches a brand-style Juara outside prize ranks", () => {
    expect(tanpaPeringkat("Disponsori Juara Kopi")).toMatch(BRAND);
    expect(tanpaPeringkat("Hadiah Juara 1 dan Juara Harapan 1")).not.toMatch(BRAND);
  });
});
