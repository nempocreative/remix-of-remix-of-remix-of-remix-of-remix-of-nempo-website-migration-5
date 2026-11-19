import { describe, expect, it } from "vitest";
import {
  PSG26,
  berkasKalender,
  daftarHari,
  sisaWaktu,
  statusAcara,
  tanggalPanjang,
  tanggalRentang,
} from "./pasar-seni-garut-2026";

// Pemilik: Pasar Seni Garut 2026 digelar 30 dan 31 Desember 2026 saja.
describe("tanggal acara", () => {
  it("mulai 30 dan selesai 31 Desember 2026", () => {
    expect(PSG26.tanggalMulai).toBe("2026-12-30");
    expect(PSG26.tanggalSelesai).toBe("2026-12-31");
    expect(tanggalRentang()).toBe("30–31 Desember 2026");
  });

  it("hari pertama Rabu, 30 Desember 2026", () => {
    expect(tanggalPanjang()).toBe("Rabu, 30 Desember 2026");
  });

  it("dua hari: Rabu 30 dan Kamis 31 Desember 2026", () => {
    const hari = daftarHari();
    expect(hari).toHaveLength(2);
    expect(hari.map((h) => h.tanggalPanjang)).toEqual([
      "Rabu, 30 Desember 2026",
      "Kamis, 31 Desember 2026",
    ]);
    expect(hari.map((h) => h.tanggalISO)).toEqual(["2026-12-30", "2026-12-31"]);
  });
});

describe("hitung mundur", () => {
  const target = new Date(2026, 11, 30, 0, 0, 0, 0);

  it("tepat 10 hari sebelum: 10 hari 0 jam 0 menit 0 detik", () => {
    const s = sisaWaktu(target, new Date(2026, 11, 20, 0, 0, 0, 0));
    expect(s).toEqual({ hari: 10, jam: 0, menit: 0, detik: 0, lewat: false });
  });

  it("satu detik sebelum: tidak pernah minus", () => {
    const s = sisaWaktu(target, new Date(2026, 11, 29, 23, 59, 59, 0));
    expect(s).toEqual({ hari: 0, jam: 0, menit: 0, detik: 1, lewat: false });
  });

  it("sudah lewat: nol semua dan lewat = true", () => {
    const s = sisaWaktu(target, new Date(2027, 0, 5, 8, 0, 0, 0));
    expect(s).toEqual({ hari: 0, jam: 0, menit: 0, detik: 0, lewat: true });
  });

  it("28 hari 7 jam 6 menit 5 detik", () => {
    const s = sisaWaktu(target, new Date(2026, 11, 1, 16, 53, 55, 0));
    expect(s).toEqual({ hari: 28, jam: 7, menit: 6, detik: 5, lewat: false });
  });
});

describe("status acara", () => {
  it("sebelum hari pertama: coming-soon", () => {
    expect(statusAcara(new Date(2026, 11, 29, 23, 59, 59, 0))).toBe("coming-soon");
  });
  it("hari pertama: berlangsung", () => {
    expect(statusAcara(new Date(2026, 11, 30, 0, 0, 0, 0))).toBe("berlangsung");
  });
  it("hari terakhir: berlangsung", () => {
    expect(statusAcara(new Date(2026, 11, 31, 23, 59, 59, 0))).toBe("berlangsung");
  });
  it("sesudah hari terakhir: selesai", () => {
    expect(statusAcara(new Date(2027, 0, 1, 0, 0, 0, 0))).toBe("selesai");
  });
});

describe("file kalender", () => {
  const ics = berkasKalender();
  it("all-day 30 Desember 2026 sampai 1 Januari 2027 (batas eksklusif)", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20261230");
    expect(ics).toContain("DTEND;VALUE=DATE:20270101");
  });
  it("berjudul Pasar Seni Garut 2026 dan tertutup rapi", () => {
    expect(ics).toContain("SUMMARY:Pasar Seni Garut 2026");
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });
});
