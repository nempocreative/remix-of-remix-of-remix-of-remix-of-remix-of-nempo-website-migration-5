import { describe, expect, it } from "vitest";
import { ggsHairStudioPage } from "./ggs-hair-studio-page";
import { jawabanGgs } from "./ggs-hair-studio-api";
import { KLIEN_NEMPO, KLIEN_TAMPIL } from "@/data/client-access";

describe("GGS Hair Studio access", () => {
  it("opens without any password", async () => {
    const res = await ggsHairStudioPage(new Request("http://x/ggs-hair-studio/products"));
    expect(res.status).toBe(200);
  });
  it("serves the studio's services and products, and refuses bookings honestly", () => {
    expect((jawabanGgs("GET", "services").body as unknown[]).length).toBeGreaterThan(0);
    expect((jawabanGgs("GET", "products").body as unknown[]).length).toBeGreaterThan(0);
    expect(jawabanGgs("POST", "appointments").status).toBe(503);
    expect(jawabanGgs("GET", "account/session").status).toBe(401);
  });
  it("lists only GGS Hair Studio on Client Access, open without a password (Garut Beans lives under Program)", () => {
    expect(KLIEN_NEMPO.map((k) => k.tautan)).toEqual(["/ggs-hair-studio/"]);
    expect(KLIEN_NEMPO.map((k) => k.pakaiKataSandi)).toEqual([false]);
  });
  it("shows GGS Hair Studio on Client Access and keeps hidden clients out", () => {
    expect(KLIEN_TAMPIL.map((k) => k.slug)).toContain("ggs-hair-studio");
    expect(KLIEN_TAMPIL.every((k) => !k.sembunyi)).toBe(true);
  });
  it("link previews show the GGS share image at the site's own full address", async () => {
    const html = await (await ggsHairStudioPage(new Request("https://nempogarut.com/ggs-hair-studio/products"))).text();
    expect(html).toContain('<meta property="og:image" content="https://nempogarut.com/ggs-hair-studio/og-image.jpg" />');
    expect(html).toContain('<link rel="canonical" href="https://nempogarut.com/ggs-hair-studio/products" />');
    expect(html).toContain('href="/ggs-hair-studio/favicon-32.png?v=ggs-2"');
  });
});
