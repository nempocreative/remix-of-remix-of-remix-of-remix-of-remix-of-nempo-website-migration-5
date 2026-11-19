import { describe, expect, it } from "vitest";
import { DOMBA_GOYANG, LOGO_G, pilihGeser, tambahPatchGarutBeans } from "./garut-beans-patch";
import { existsSync } from "node:fs";

describe("Garut Beans card swipe", () => {
  it("swiping left shows the next card, swiping right the previous one", () => {
    expect(pilihGeser(-80, 5, 2, 10)).toBe(3);
    expect(pilihGeser(80, 5, 2, 10)).toBe(1);
  });
  it("wraps around at both ends", () => {
    expect(pilihGeser(-80, 0, 9, 10)).toBe(0);
    expect(pilihGeser(80, 0, 0, 10)).toBe(9);
  });
  it("ignores short taps and mostly vertical page scrolling", () => {
    expect(pilihGeser(-20, 0, 2, 10)).toBeNull();
    expect(pilihGeser(-60, 90, 2, 10)).toBeNull();
  });
  it("does nothing without at least two cards", () => {
    expect(pilihGeser(-80, 0, 0, 1)).toBeNull();
  });
});

describe("Garut Beans page additions", () => {
  it("adds the style and script to the page once, before head and body close", () => {
    const html = tambahPatchGarutBeans("<html><head></head><body><div id=root></div></body></html>");
    expect(html.match(/<style data-nempo-patch>/g)).toHaveLength(1);
    expect(html.match(/<script data-nempo-patch>/g)).toHaveLength(1);
    expect(html.indexOf("data-nempo-patch>")).toBeLessThan(html.indexOf("</head>"));
  });
  it("the page script runs on its own and picks the next dot on a swipe", () => {
    const html = tambahPatchGarutBeans("<head></head><body></body>");
    const skrip = html.split("<script data-nempo-patch>")[1]!.split("</script>")[0]!;
    expect(() => new Function("document", "MutationObserver", skrip)).not.toThrow();
  });
  it("the new sheep picture ships outside the rebuilt folder", () => {
    expect(existsSync(`public${DOMBA_GOYANG}`)).toBe(true);
  });
  it("the loading screen swaps the coffee bean for the G logo", () => {
    const html = tambahPatchGarutBeans("<head></head><body></body>");
    expect(html).toContain("data-initial-loader-bean");
    expect(html).toContain(LOGO_G);
    expect(existsSync(`public${LOGO_G}`)).toBe(true);
  });
});
