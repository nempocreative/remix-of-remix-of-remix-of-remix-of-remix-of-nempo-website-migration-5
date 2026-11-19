import { describe, expect, it } from "vitest";
import { BANNER_SNOOZE_DAYS, isBannerSnoozed } from "./install-app";

const DAY = 24 * 60 * 60 * 1000;

describe("install banner snooze", () => {
  it("shows the banner when it was never closed", () => {
    expect(isBannerSnoozed(null, Date.now())).toBe(false);
  });
  it("keeps the banner hidden for 3 days after closing", () => {
    expect(BANNER_SNOOZE_DAYS).toBe(3);
    const closed = 1_000_000_000_000;
    expect(isBannerSnoozed(closed, closed + 2 * DAY)).toBe(true);
  });
  it("shows the banner again after 3 days", () => {
    const closed = 1_000_000_000_000;
    expect(isBannerSnoozed(closed, closed + 3 * DAY + 1)).toBe(false);
  });
});
