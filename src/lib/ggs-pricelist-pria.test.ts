import { describe, expect, it } from "vitest";
import pria from "../../scripts/ggs-hair-studio/pricelist-pria.json";
import { GGS_WHATSAPP, GGS_WHATSAPP_PRIA, pricelistPriaWaText } from "../../scripts/ggs-hair-studio/ggs-whatsapp";

const price = (name: string) => pria.flatMap((s) => s.items).find(([n]) => n === name)?.[1];

describe("GGS men's price list", () => {
  it("books through the barber's own WhatsApp 0813-3335-9200, not the women's number", () => {
    expect(GGS_WHATSAPP_PRIA).toBe("6281333359200");
    expect(GGS_WHATSAPP_PRIA).not.toBe(GGS_WHATSAPP);
  });

  it("keeps the poster prices", () => {
    expect(price("Dewasa (only cut)")).toBe("35.000");
    expect(price("Anak & pelajar")).toBe("25.000");
    expect(price("Panjang / gondrong")).toBe("40.000");
    expect(price("Paket GPS (Ganteng Pisan Sob)")).toBe("100.000");
    expect(price("Colouring bleaching")).toBe("350.000");
  });

  it("names the service, category and price in the booking message", () => {
    expect(pricelistPriaWaText("Paket Ekonomis", "Paket GP", "50.000")).toContain("*Paket GP* (Paket Ekonomis, Rp50.000)");
  });
});
