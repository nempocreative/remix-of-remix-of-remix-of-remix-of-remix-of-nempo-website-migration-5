import { describe, expect, it } from "vitest";
import { cariLomba } from "@/data/lomba";
import { LOMBA_HOME_SLUG, lombaCtaBaris, lombaCtaSubjudul } from "./lomba-home-cta";

const lomba = cariLomba(LOMBA_HOME_SLUG)!;

// Pemilik: lomba 30 Desember 2026, kuota 25 tiap kategori, biaya 150k.
describe("kartu lomba di Beranda", () => {
  it("menampilkan tanggal, kuota, dan biaya sesuai data lomba", () => {
    expect(lombaCtaBaris(lomba)).toEqual([
      "Rabu, 30 Desember 2026",
      "Kuota 25 peserta tiap kategori · 4 kategori",
      "Rp150.000 / peserta",
    ]);
  });

  it("sub judul tanpa tanda & di depan", () => {
    expect(lombaCtaSubjudul(lomba)).toBe("Pemilihan Duta Pasar Seni");
  });
});
