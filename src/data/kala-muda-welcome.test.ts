import { describe, expect, it } from "vitest";
import { KALA_MUDA_WELCOME_SLIDE } from "./kala-muda-welcome";

describe("Beranda carousel welcome video slide", () => {
  it("carries join-community text like the other banners", () => {
    expect(KALA_MUDA_WELCOME_SLIDE.title.toLowerCase()).toContain("gabung");
    expect(KALA_MUDA_WELCOME_SLIDE.title.toLowerCase()).toContain("komunitas anak muda");
    expect(KALA_MUDA_WELCOME_SLIDE.description.toLowerCase()).toContain("komunitas anak muda");
    expect(KALA_MUDA_WELCOME_SLIDE.cta.trim().length).toBeGreaterThan(0);
    expect(KALA_MUDA_WELCOME_SLIDE.label.trim().length).toBeGreaterThan(0);
  });

  it("sends the call to action to the recruitment page without moving the whole card", () => {
    expect(KALA_MUDA_WELCOME_SLIDE.href).toBe("/recruitment");
    expect(KALA_MUDA_WELCOME_SLIDE.link).toBe("");
  });
});
