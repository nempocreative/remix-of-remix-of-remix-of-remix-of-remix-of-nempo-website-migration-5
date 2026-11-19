import { describe, expect, it } from "vitest";
import {
  GGS_BEAUTY_WA_NUMBER,
  NAIL_ART_WA_URL,
  NEMPO_CONSULT_URL,
  NEMPO_WA_NUMBER,
} from "./contact";

// Nail Art Panggilan is booked with GGS Beauty, never with Nempo's own number.
describe("Nail Art Panggilan contact", () => {
  it("opens GGS Beauty's WhatsApp 0823-4277-7723", () => {
    expect(GGS_BEAUTY_WA_NUMBER).toBe("+62 823-4277-7723");
    expect(NAIL_ART_WA_URL.startsWith("https://wa.me/6282342777723?text=")).toBe(true);
  });

  it("prefills a nail art call-out request", () => {
    const text = decodeURIComponent(NAIL_ART_WA_URL.split("?text=")[1] ?? "");
    expect(text).toContain("GGS Beauty");
    expect(text).toContain("Nail Art Panggilan");
  });

  it("does not use Nempo's consultation number", () => {
    expect(NAIL_ART_WA_URL).not.toContain("6285724981356");
    expect(NEMPO_CONSULT_URL).toContain("6285724981356");
    expect(NEMPO_WA_NUMBER).toBe("+62 857-2498-1356");
  });
});
