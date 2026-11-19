import { describe, expect, it } from "vitest";
import { cmsBase } from "./base";

describe("cmsBase", () => {
  it("uses /admin as the canonical back-office address", () => {
    expect(cmsBase("/admin")).toBe("/admin");
    expect(cmsBase("/admin/acara")).toBe("/admin");
    expect(cmsBase("/admin/lomba")).toBe("/admin");
  });

  it("keeps the legacy /cms address working", () => {
    expect(cmsBase("/cms")).toBe("/cms");
    expect(cmsBase("/cms/acara")).toBe("/cms");
  });

  it("falls back to /admin for any other address", () => {
    expect(cmsBase("/")).toBe("/admin");
    expect(cmsBase("")).toBe("/admin");
    expect(cmsBase("/portofolio")).toBe("/admin");
  });
});
