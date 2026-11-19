import { describe, expect, it } from "vitest";
import { PASANGGIRI, warnaSelempang } from "./pasanggiri";
import manifest from "./manifest.json";

describe("Pasanggiri data in the Pasar Seni proposal", () => {
  it("uses the competition and main-event dates", () => {
    expect(PASANGGIRI.tanggal).toBe("Rabu, 30 Desember 2026");
    expect(PASANGGIRI.acaraPuncak).toBe("Kamis, 31 Desember 2026");
  });

  it("has four categories with 25 places each, 100 in total", () => {
    expect(PASANGGIRI.kategori.map((k) => k.nama)).toEqual(["TK", "SD 1–3", "SD 4–6", "SMP–SMA"]);
    expect(PASANGGIRI.kuotaPerKategori).toBe(25);
    expect(PASANGGIRI.totalKuota).toBe(100);
  });

  it("prices the three registration rounds from Rp150.000", () => {
    expect(PASANGGIRI.biayaNormal).toBe("Rp150.000");
    expect(PASANGGIRI.gelombang.map((g) => [g.rentang, g.biaya])).toEqual([
      ["22–24 November 2026", "Rp120.000"],
      ["25–30 November 2026", "Rp135.000"],
      ["1–28 Desember 2026", "Rp150.000"],
    ]);
  });

  it("gives first place the Duta title and the main-event performance", () => {
    const juara1 = PASANGGIRI.hadiah[0]!;
    expect(juara1.peringkat).toBe("Juara 1");
    expect(juara1.isi).toContain("Gelar Duta Pasar Seni");
    expect(juara1.isi).toContain("Kesempatan tampil di acara puncak Pasar Seni");
    expect(PASANGGIRI.hadiahSemua).toEqual(["Piala", "Sertifikat"]);
  });

  it("gives maroon sashes to TK–SD and black-gold to SMP–SMA", () => {
    expect(["tk", "sd-1-3", "sd-4-6"].map(warnaSelempang)).toEqual(["merah", "merah", "merah"]);
    expect(warnaSelempang("smp-sma")).toBe("hitam");
  });

  it("asks for the registration form fields including both uploads", () => {
    const label = PASANGGIRI.berkas.map((b) => b.label).join(" | ");
    for (const f of ["Nama lengkap", "Usia", "Alamat", "Musik pengiring", "Foto terbaik"]) expect(label).toContain(f);
  });

  it("the deck lists the Pasanggiri slides", () => {
    expect(manifest.filter((m) => m.file.startsWith("SlidePasanggiri")).length).toBe(6);
  });
});
