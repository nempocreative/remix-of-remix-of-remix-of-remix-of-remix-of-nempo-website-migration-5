import { describe, expect, it } from "vitest";
import { momenBerikutnya, momenDigitalItems } from "@/data/momen-digital";
import { kelasMeta } from "@/data/momen-kelas";
import { grupMeta } from "@/data/momen-grup";
import { organisasiMeta } from "@/data/momen-organisasi";
import { eventMeta } from "@/data/momen-event";
import { komunitasMeta } from "@/data/momen-komunitas";

describe("momenDigitalItems", () => {
  it("menampilkan kelima kategori momen digital", () => {
    expect(momenDigitalItems.map((m) => m.id)).toEqual([
      "kelas",
      "geng",
      "organisasi",
      "event",
      "komunitas",
    ]);
  });

  it("tautan tiap kategori sama dengan halaman demonya", () => {
    const byId = Object.fromEntries(momenDigitalItems.map((m) => [m.id, m.href]));
    expect(byId.kelas).toBe(kelasMeta.halaman);
    expect(byId.geng).toBe(grupMeta.halaman);
    expect(byId.organisasi).toBe(organisasiMeta.halaman);
    expect(byId.event).toBe(eventMeta.halaman);
    expect(byId.komunitas).toBe(komunitasMeta.halaman);
  });

  it("tiap kartu punya foto, judul, dan deskripsi", () => {
    for (const item of momenDigitalItems) {
      expect(item.foto.length).toBeGreaterThan(0);
      expect(item.judul.length).toBeGreaterThan(0);
      expect(item.deskripsi.length).toBeGreaterThan(0);
    }
  });
});

describe("momenBerikutnya", () => {
  it("maju satu kartu", () => {
    expect(momenBerikutnya(0, 5)).toBe(1);
    expect(momenBerikutnya(3, 5)).toBe(4);
  });
  it("kembali ke kartu pertama setelah yang terakhir", () => {
    expect(momenBerikutnya(4, 5)).toBe(0);
  });
  it("aman saat daftar kosong", () => {
    expect(momenBerikutnya(2, 0)).toBe(0);
  });
});
