import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import list from "../../scripts/ggs-hair-studio/diskon.json";
import { activeDiscounts, discountWaText, jakartaToday, type GgsDiscount } from "../../scripts/ggs-hair-studio/diskon";
import { ROW_AUTOPLAY_PAUSE_EVENT } from "../../scripts/ggs-hair-studio/team-autoplay";
import { whatsappFor } from "../../scripts/ggs-hair-studio/ggs-whatsapp";

const deals = list as GgsDiscount[];
const deal = (over: Partial<GgsDiscount>): GgsDiscount => ({ id: "x", audience: "wanita", title: "T", label: "10%", normalPrice: 100000, promoPrice: 90000, terms: "", start: "2026-11-01", end: "2026-11-30", ...over });
const price = (id: string) => deals.find((d) => d.id === id)?.promoPrice;

describe("GGS active discounts", () => {
  it("shows a discount on its first and last day, and hides it before and after", () => {
    const d = [deal({})];
    expect(activeDiscounts(d, "2026-10-31")).toHaveLength(0);
    expect(activeDiscounts(d, "2026-11-01")).toHaveLength(1);
    expect(activeDiscounts(d, "2026-11-30")).toHaveLength(1);
    expect(activeDiscounts(d, "2026-12-01")).toHaveLength(0);
  });

  it("lists the discount ending soonest first", () => {
    const d = [deal({ id: "late", end: "2026-12-31" }), deal({ id: "soon", end: "2026-11-20" })];
    expect(activeDiscounts(d, "2026-11-10").map((x) => x.id)).toEqual(["soon", "late"]);
  });

  it("uses Garut's date, so 23:30 UTC already counts as the next day", () => {
    expect(jakartaToday(new Date("2026-11-30T23:30:00Z"))).toBe("2026-12-01");
  });

  it("men's discounts book on the barber's WhatsApp", () => {
    const barber = deal({ audience: "pria" });
    expect(whatsappFor({ audience: barber.audience })).toBe("6281333359200");
    expect(discountWaText(barber)).toContain("Halo GGS Barber Studio");
  });

  it("November women's promos: owner's prices, for GGS Beauty, running until 30 November 2026", () => {
    expect(price("massage")).toBe(85000);
    expect(deals.find((d) => d.id === "massage")?.normalPrice).toBe(120000);
    expect(price("nail-art")).toBe(35000);
    expect(price("fake-nails-polish")).toBe(120000);
    expect(deals.find((d) => d.id === "fake-nails-polish")?.title).toBe("Fake Nails + Polish");
    expect(deals.find((d) => d.id === "fake-nails-polish")?.terms).toBe("Tanpa aksesoris");
    expect(price("creambath")).toBe(80000);
    expect(price("ratus")).toBe(45000);
    expect(price("scrub-badan")).toBe(80000);
    expect(price("pelajar-potong-rambut")).toBe(50000);
    expect(price("pelajar-creambath")).toBe(80000);
    for (const d of deals) {
      expect(d.audience).toBe("wanita");
      expect(whatsappFor({ audience: d.audience })).toBe("6282342777723");
      expect(d.end).toBe("2026-11-30");
      if (d.normalPrice) expect(d.promoPrice).toBeLessThan(d.normalPrice);
    }
    expect(activeDiscounts(deals, "2026-11-30")).toHaveLength(8);
    expect(activeDiscounts(deals, "2026-12-01")).toHaveLength(0);
  });

  it("a promo without a normal price books with just its promo price", () => {
    expect(discountWaText(deal({ title: "Nail Art", normalPrice: undefined, promoPrice: 35000, label: "PROMO" }))).toContain("harga promo Rp35.000");
  });

  it("the built home page scrolls the discount row by itself and can be paused from the arrows", () => {
    // The auto-scroller's pause signal is only used by the discount arrows and the hook, so its
    // presence next to the row's class name proves a rebuild kept the wiring.
    const assets = "public/ggs-hair-studio/assets";
    const bundle = readdirSync(assets)
      .filter((f) => f.endsWith(".js"))
      .map((f) => readFileSync(`${assets}/${f}`, "utf8"))
      .join("");
    expect(ROW_AUTOPLAY_PAUSE_EVENT).toBe("ggs-autoplay-pause");
    expect(bundle).toContain("ggs-deals__row");
    expect(bundle).toContain(ROW_AUTOPLAY_PAUSE_EVENT);
  });
});
