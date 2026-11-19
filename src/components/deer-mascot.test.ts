import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { mainNavItems } from "@/data/main-nav-items";
import { DEER_POSIS, DEER_TEPI_Y, deerPose } from "@/components/deer-mascot";

const sumberRusa = readFileSync("src/components/deer-mascot.tsx", "utf8");
const sumberMenu = readFileSync("src/components/icons3d.tsx", "utf8");

describe("deerPose", () => {
  it("memberi maskot ke semua ikon menu grid", () => {
    const pose = mainNavItems.map((_, i) => deerPose(i));
    expect(pose).toHaveLength(mainNavItems.length);
    pose.forEach((p) => expect(DEER_POSIS).toContain(p));
  });

  it("memakai keempat pose, bukan satu pose diulang", () => {
    const terpakai = new Set(mainNavItems.map((_, i) => deerPose(i)));
    expect(terpakai.size).toBe(DEER_POSIS.length);
  });

  it("memberi pose yang sama untuk index yang sama", () => {
    expect(deerPose(3)).toBe(deerPose(3));
    expect(deerPose(0)).toBe(deerPose(8));
    expect(deerPose(-3)).toBe(deerPose(3));
    expect(deerPose(1.7)).toBe(deerPose(1));
  });
});

describe("rusa menu", () => {
  it("menu grid memakai rusa bertanduk, bukan berang-berang", () => {
    expect(sumberMenu).toContain("DeerMascot");
    expect(sumberMenu).not.toContain("OtterMascot");
  });

  it("garis tepi kartu tetap di y = 26", () => {
    expect(DEER_TEPI_Y).toBe(26);
  });

  // kanvas hanya 0..44 dan tepi stiker krem melebar ~1,7 unit ke luar,
  // jadi ujung runcing teratas harus menyisakan ruang di bawah tepi atas
  it("ujug tanduk tidak terpotong tepi atas kanvas", () => {
    const cabang = [...sumberRusa.matchAll(/u:\s*\{\s*x:\s*[\d.]+,\s*y:\s*([-\d.]+),\s*dx:\s*[-\d.]+,\s*dy:\s*([-\d.]+),\s*p:\s*([\d.]+)/g)]
      .map((m) => Number(m[1]) + Number(m[2]) * (Number(m[3]) + 0.6));
    expect(cabang.length).toBeGreaterThanOrEqual(4);
    expect(Math.min(...cabang)).toBeGreaterThanOrEqual(2.2);
  });

  // kepala yang miring lebih dari ~6 derajat mengangkat ujung tanduk terluar
  // melewati tepi atas kanvas
  it("kemiringan kepala pose tidak melewati 6 derajat", () => {
    const blok = sumberRusa.match(/function kepala\([\s\S]*?\n\}/);
    expect(blok).not.toBeNull();
    const sudut = [...blok![0].matchAll(/rotate\((-?[\d.]+)/g)].map((m) => Math.abs(Number(m[1])));
    expect(sudut.length).toBeGreaterThanOrEqual(2);
    for (const s of sudut) expect(s).toBeLessThanOrEqual(6);
  });
});
