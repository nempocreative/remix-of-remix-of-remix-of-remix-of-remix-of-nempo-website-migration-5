import { describe, expect, it } from "vitest";
import { garutTee, garutTeeConsultUrl } from "./custom-garut";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

describe("Custom Garut t-shirt", () => {
  it("shows the example design printed on both the front and the back", () => {
    expect(garutTee.sides.map(side => side.id)).toEqual(["depan", "belakang"]);
  });
  it("sends the shirt, both-side print, size and request to the official contact", () => {
    const url = new URL(garutTeeConsultUrl("L", "24 pcs", "Warna hijau tua"));
    expect(url.origin + url.pathname).toBe(NEMPO_CONSULT_URL);
    const text = url.searchParams.get("text");
    expect(text).toContain("Produk: [NMP-GRT-01] Kaos Polos Custom Garut — desain Garut Kota Intan (sablon depan & belakang)");
    expect(text).toContain("Jumlah: 24 pcs\nKebutuhan: Ukuran: L. Warna hijau tua");
  });
  it("does not invent a size or quantity when left blank", () => {
    const text = new URL(garutTeeConsultUrl("", " ", "")).searchParams.get("text") ?? "";
    expect(text).toContain("Jumlah: ingin diskusi");
    expect(text).not.toContain("Ukuran:");
  });
});

describe("second Garut t-shirt", () => {
  it("has its own code and both print sides", async () => {
    const { garutTees } = await import("./custom-garut");
    expect(garutTees.map(tee => tee.code)).toEqual(["NMP-GRT-01", "NMP-GRT-02", "NMP-GRT-03"]);
    expect(garutTees[1]!.sides.map(side => side.id)).toEqual(["depan", "belakang"]);
  });
  it("puts the chosen shirt's code in the WhatsApp message", async () => {
    const { garutTees, garutTeeConsultUrl } = await import("./custom-garut");
    expect(new URL(garutTeeConsultUrl("", "", "", garutTees[1])).searchParams.get("text")).toContain("Produk: [NMP-GRT-02] Kaos Retro Swiss van Java");
  });
});

describe("third Garut t-shirt", () => {
  it("puts NMP-GRT-03 in the WhatsApp message with both print sides", async () => {
    const { garutTees, garutTeeConsultUrl } = await import("./custom-garut");
    expect(garutTees[2]!.sides.map(side => side.id)).toEqual(["depan", "belakang"]);
    expect(new URL(garutTeeConsultUrl("M", "", "", garutTees[2])).searchParams.get("text")).toContain("Produk: [NMP-GRT-03] Kaos Cukil Domba Garut");
  });
});
