import { describe, expect, it } from "vitest";
import {
  weddingAdvantages,
  weddingTeamRange,
  weddingPriceFrom,
  weddingAdatSaving,
  weddingAdatSavingRupiah,
  weddingContentFrom,
  weddingFreeInvitationPackages,
} from "./wedding-advantages";

describe("wedding advantages", () => {
  it("crew range matches the three packages", () => {
    expect(weddingTeamRange).toBe("4–8 orang");
  });
  it("starting price is the Essential package", () => {
    expect(weddingPriceFrom).toBe("Rp2.500.000");
  });
  it("adat saving is Rp700.000 on both formats", () => {
    expect(weddingAdatSaving).toBe(700000);
    expect(weddingAdatSavingRupiah).toBe("Rp700.000");
  });
  it("content creator starts at the Intimate price", () => {
    expect(weddingContentFrom).toBe("Rp350.000");
  });
  it("free invitation and sawer only on Signature and Premium", () => {
    expect(weddingFreeInvitationPackages).toEqual(["Signature", "Premium"]);
  });
  it("every advantage has a title and a detail", () => {
    expect(weddingAdvantages.length).toBe(6);
    for (const a of weddingAdvantages) {
      expect(a.title.trim().length).toBeGreaterThan(0);
      expect(a.detail.trim().length).toBeGreaterThan(0);
    }
  });
  it("the price advantage stays honest about what WO covers", () => {
    const price = weddingAdvantages.find((a) => a.title.includes(weddingPriceFrom));
    expect(price?.detail).toContain("manajemen acara");
    expect(price?.detail).toContain("disepakati terpisah");
  });
});
