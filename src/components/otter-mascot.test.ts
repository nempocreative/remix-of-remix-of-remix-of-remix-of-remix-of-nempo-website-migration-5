import { describe, expect, it } from "vitest";
import { mainNavItems } from "@/data/main-nav-items";
import { OTTER_POSIS, OTTER_UKURAN, otterPose } from "@/components/otter-mascot";

describe("otterPose", () => {
  it("memberi maskot ke semua ikon menu grid", () => {
    const pose = mainNavItems.map((_, i) => otterPose(i));
    expect(pose).toHaveLength(mainNavItems.length);
    pose.forEach((p) => expect(OTTER_POSIS).toContain(p));
  });

  it("memakai keempat pose, bukan satu pose diulang", () => {
    const terpakai = new Set(mainNavItems.map((_, i) => otterPose(i)));
    expect(terpakai.size).toBe(OTTER_POSIS.length);
  });

  it("memberi pose yang sama untuk index yang sama", () => {
    expect(otterPose(3)).toBe(otterPose(3));
    expect(otterPose(0)).toBe(otterPose(8));
    expect(otterPose(-3)).toBe(otterPose(3));
    expect(otterPose(1.7)).toBe(otterPose(1));
  });
});

describe("OTTER_UKURAN", () => {
  it("menjaga bentuk maskot (64:44) dan tepi kartu tepat di tepi atas kotak", () => {
    for (const u of Object.values(OTTER_UKURAN)) {
      expect(Math.abs(u.tinggi - (u.lebar * 44) / 64)).toBeLessThanOrEqual(0.6);
      expect(Math.abs(u.atas + (u.tinggi * 26) / 44)).toBeLessThanOrEqual(0.6);
    }
  });
});
