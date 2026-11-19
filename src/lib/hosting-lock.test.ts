import { describe, expect, it } from "vitest";
import { shouldBlock } from "./hosting-lock";

describe("hosting lock", () => {
  it("blocks the legacy CMS address on a published domain", () =>
    expect(shouldBlock("nempo.id", "/cms/login")).toBe(true));
  it("blocks the backup page on lovable.app", () => expect(shouldBlock("nempo.lovable.app", "/backup")).toBe(true));
  it("keeps the organizer site public", () => expect(shouldBlock("nempo.id", "/wisata")).toBe(false));
  it("keeps the admin address open on the owner's own domain", () =>
    expect(shouldBlock("www.nempogrut.com", "/admin")).toBe(false));
  it("keeps the admin address open on the published preview host too", () =>
    expect(shouldBlock("id-preview--abc.lovable.app", "/admin/acara")).toBe(false));
  it("allows the legacy CMS address in the editor preview", () =>
    expect(shouldBlock("id-preview--abc.lovable.app", "/cms")).toBe(false));
});
