import { describe, expect, it } from "vitest";
import { shouldShowTransition } from "./route-transition";

describe("shouldShowTransition", () => {
  it("shows when moving to another menu", () => {
    expect(shouldShowTransition("/", "/portofolio")).toBe(true);
    expect(shouldShowTransition("/portofolio", "/event")).toBe(true);
  });
  it("does not show when staying on the same page", () => {
    expect(shouldShowTransition("/event", "/event")).toBe(false);
  });
  it("does not stack on the home opening screen", () => {
    expect(shouldShowTransition("/event", "/")).toBe(false);
  });
  it("skips CMS and Garut Beans", () => {
    expect(shouldShowTransition("/", "/cms")).toBe(false);
    expect(shouldShowTransition("/cms/acara", "/portofolio")).toBe(false);
    expect(shouldShowTransition("/program", "/garut-beans")).toBe(false);
  });
});
