import { describe, expect, it } from "vitest";
import { customCategories, customProducts, customConsultUrl, productsInCategory } from "./produk-custom";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

describe("custom product consultation", () => {
  it("offers the mini tumbler and the Garut t-shirt", () => {
    expect(customProducts.map(product => ({ id: product.id, name: product.name }))).toEqual([
      { id: "tumbler-pasangan", name: "Tumbler Mini Pasangan" },
      { id: "kaos-garut", name: "Kaos Custom Garut" },
      { id: "kaos-garut-retro", name: "Kaos Retro Swiss van Java" },
      { id: "kaos-garut-cukil", name: "Kaos Cukil Domba Garut" },
    ]);
  });
  it("lists the Garut t-shirt under Oleh-oleh Garut", () => {
    expect(customCategories.map(category => category.label)).toContain("Oleh-oleh Garut");
    expect(productsInCategory("oleh-oleh").map(product => product.href)).toEqual(["/custom-garut", "/custom-garut", "/custom-garut"]);
    expect(productsInCategory("tumbler").map(product => product.id)).toEqual(["tumbler-pasangan"]);
  });
  it("sends the chosen product and actual request to the official contact", () => {
    const url = new URL(customConsultUrl("Tumbler Mini Tutup Kayu", "30 buah", "Logo komunitas & warna hijau"));
    expect(url.origin + url.pathname).toBe(NEMPO_CONSULT_URL);
    expect(url.searchParams.get("text")).toContain("Produk: Tumbler Mini Tutup Kayu\nJumlah: 30 buah\nKebutuhan: Logo komunitas & warna hijau");
  });
  it("does not invent a quantity when the visitor leaves it blank", () => {
    expect(new URL(customConsultUrl("Tumbler Mini Tutup Kayu", "  ", "")).searchParams.get("text")).toContain("Jumlah: ingin diskusi");
  });
  it("keeps only the designed couple tumbler, unbranded, in every merchandise colour", () => {
    expect(customCategories.map(category => category.label)).toEqual(["Tumbler Custom", "Oleh-oleh Garut"]);
    const tumbler = productsInCategory("tumbler")[0]!;
    expect(tumbler.name).not.toMatch(/nempo/i);
    expect(tumbler.colors).toEqual(["Merah Muda", "Biru Dongkal", "Hitam", "Hijau Sage"]);
  });
});
