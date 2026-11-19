import { describe, expect, it } from "vitest";
import { modules, navGroups } from "@/apps/cms/lib/modules";
import { tableFor } from "@/apps/cms/lib/api";

// Owner removed these old features; their database tables stay but the CMS must not offer them.
const REMOVED = ["wisata", "kuliner", "cafe", "penginapan", "transportasi", "vouchers", "kamus-sunda", "influencers", "influencer-banner-photos", "mitra", "users", "user-rewards", "reviews", "jajan-yuk"];

describe("fitur lama yang dihapus dari CMS", () => {
  it("tidak punya modul CMS", () => {
    for (const slug of REMOVED) expect(modules[slug]).toBeUndefined();
  });

  it("tidak muncul di menu CMS", () => {
    const hrefs = navGroups.flatMap((g) => g.items.map(([, href]) => href));
    for (const slug of REMOVED) expect(hrefs).not.toContain(`/${slug}`);
  });

  it("tidak terhubung ke tabel database", () => {
    for (const slug of REMOVED) expect(tableFor[slug]).toBeUndefined();
  });

  it("modul yang masih dipakai tetap ada", () => {
    for (const slug of ["events", "banners", "partnership", "berita", "settings"]) expect(modules[slug]).toBeDefined();
  });
});
