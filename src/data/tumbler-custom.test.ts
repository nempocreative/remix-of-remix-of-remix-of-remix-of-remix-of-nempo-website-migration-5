import { describe, expect, it } from "vitest";
import { tumblerColors, tumblerConsultUrl, tumblerDesigns } from "./tumbler-custom";
import { productsInCategory } from "./produk-custom";

describe("couple tumbler design", () => {
  it("prints a photo on one side and words on the other", () => {
    expect(tumblerDesigns[0]!.sides.map(side => side.id)).toEqual(["foto", "kata"]);
  });
  it("is listed under the mini tumbler category with its own code", () => {
    expect(productsInCategory("tumbler").map(product => product.code)).toEqual(["NMP-TMB-01"]);
  });
  it("sends the design code, both-side print and chosen colour to WhatsApp", () => {
    const text = new URL(tumblerConsultUrl("Hitam", "2 buah", "Nama Dimas & Sari")).searchParams.get("text") ?? "";
    expect(text).toContain("Produk: [NMP-TMB-01] Tumbler Mini Pasangan — desain Foto & Kata-kata Pasangan (cetak 2 sisi)");
    expect(text).toContain("Jumlah: 2 buah\nKebutuhan: Warna: Hitam. Nama Dimas & Sari");
  });
  it("has both printed sides for every colour", () => {
    const design = tumblerDesigns[0]!;
    for (const color of tumblerColors) {
      expect(Object.keys(design.images[color.slug])).toEqual(["foto", "kata"]);
    }
    expect(tumblerColors.map(color => color.name)).toEqual(["Merah Muda", "Biru Dongkal", "Hitam", "Hijau Sage"]);
  });
  it("does not invent a colour when none is chosen", () => {
    expect(new URL(tumblerConsultUrl("", "", "")).searchParams.get("text")).not.toContain("Warna:");
  });
});
