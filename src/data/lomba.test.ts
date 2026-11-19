import { describe, expect, it } from "vitest";
import {
  biayaGelombang, cariLomba, kodePendaftaran, pesanBayarLomba, rentangGelombang, statusPendaftaran, rupiah, totalKuota, validasiFoto, validasiMusik, validasiPendaftar,
} from "./lomba";

const jaipong = cariLomba("pasanggiri-jaipong")!;
const isian = {
  kategoriId: "sd-1-3", namaLengkap: "Siti Aisyah Rahma", usia: "8", alamat: "Jl. Ciledug No. 12, Garut", asal: "Sanggar Sekar", kontak: "0812 3456 7890",
};

// Pemilik: pendaftaran 150k.
describe("biaya pendaftaran", () => {
  it("Rp150.000 per peserta", () => {
    expect(jaipong.biayaPendaftaran).toBe(150000);
    expect(rupiah(jaipong.biayaPendaftaran)).toBe("Rp150.000");
  });
});

// Pemilik: peserta maksimal 25 setiap kategori.
describe("kuota", () => {
  it("25 peserta per kategori, 100 untuk 4 kategori", () => {
    expect(jaipong.kuotaPerKategori).toBe(25);
    expect(totalKuota(jaipong)).toBe(100);
  });
});

// Pemilik: kategori TK, SD 1-3, SD 4-6, SMP-SMA.
describe("kategori", () => {
  it("tepat empat kategori sesuai urutan", () => {
    expect(jaipong.kategori.map((k) => k.nama)).toEqual(["TK", "SD 1–3", "SD 4–6", "SMP–SMA"]);
  });
});

// Pemilik: juara 1 tiap kategori dapat uang tunai, piala kaki 2, selempang, sertifikat, dan jadi duta.
describe("hadiah", () => {
  it("juara 1 mendapat semua hadiah utama dan gelar duta", () => {
    for (const h of ["Uang pembinaan", "Piala kaki 2", "Selempang", "Sertifikat", "Gelar Duta Pasar Seni", "Kesempatan tampil di acara puncak Pasar Seni"]) {
      expect(jaipong.hadiahJuara1).toContain(h);
    }
  });
  // Pemilik: juara 2 dan 3 dapat uang pembinaan, piala, sertifikat.
  it("juara 2 dan 3 mendapat uang pembinaan, piala, sertifikat", () => {
    expect(jaipong.hadiahJuara23).toEqual(["Uang pembinaan", "Piala", "Sertifikat"]);
  });
  // Pemilik: semua peserta dapat piala dan sertifikat.
  it("semua peserta mendapat piala dan sertifikat", () => {
    expect(jaipong.hadiahSemua).toEqual(["Piala", "Sertifikat"]);
  });
});

// Pemilik: lomba 30 Desember 2026, acara puncak 31 Desember 2026.
describe("tanggal", () => {
  it("hari lomba 30 Desember 2026 dan acara puncak 31 Desember 2026", () => {
    expect(jaipong.tanggal).toBe("Rabu, 30 Desember 2026");
    expect(jaipong.acaraPuncak).toBe("Kamis, 31 Desember 2026");
  });
});

// Pemilik: formulir berisi nama lengkap, alamat, usia, musik pengiring, foto terbaik.
describe("formulir pendaftaran", () => {
  it("menerima isian lengkap dan merapikan teks", () => {
    const h = validasiPendaftar(jaipong, { ...isian, namaLengkap: "  Siti   Aisyah Rahma " });
    expect(h.ok).toBe(true);
    if (!h.ok) return;
    expect(h.data.namaLengkap).toBe("Siti Aisyah Rahma");
    expect(h.data.usia).toBe(8);
    expect(h.data.kategoriNama).toBe("SD 1–3");
  });
  it("wajib kategori, nama lengkap, usia, alamat, dan nomor WhatsApp", () => {
    expect(validasiPendaftar(jaipong, { ...isian, kategoriId: "" }).ok).toBe(false);
    expect(validasiPendaftar(jaipong, { ...isian, namaLengkap: " " }).ok).toBe(false);
    expect(validasiPendaftar(jaipong, { ...isian, usia: "" }).ok).toBe(false);
    expect(validasiPendaftar(jaipong, { ...isian, alamat: "" }).ok).toBe(false);
    expect(validasiPendaftar(jaipong, { ...isian, kontak: "123" }).ok).toBe(false);
  });
  it("usia 3 sampai 25 tahun", () => {
    expect(validasiPendaftar(jaipong, { ...isian, usia: "2" }).ok).toBe(false);
    expect(validasiPendaftar(jaipong, { ...isian, usia: "3" }).ok).toBe(true);
    expect(validasiPendaftar(jaipong, { ...isian, usia: "25" }).ok).toBe(true);
    expect(validasiPendaftar(jaipong, { ...isian, usia: "26" }).ok).toBe(false);
    expect(validasiPendaftar(jaipong, { ...isian, usia: "7.5" }).ok).toBe(false);
  });
  it("musik pengiring wajib berupa file audio maks 20 MB", () => {
    expect(validasiMusik(null).ok).toBe(false);
    expect(validasiMusik({ name: "lagu.mp3", type: "audio/mpeg", size: 5_000_000 }).ok).toBe(true);
    expect(validasiMusik({ name: "lagu.m4a", type: "", size: 5_000_000 }).ok).toBe(true);
    expect(validasiMusik({ name: "lagu.pdf", type: "application/pdf", size: 5_000 }).ok).toBe(false);
    expect(validasiMusik({ name: "lagu.wav", type: "audio/wav", size: 21 * 1024 * 1024 }).ok).toBe(false);
  });
  it("foto terbaik wajib berupa JPG/PNG/WebP maks 10 MB", () => {
    expect(validasiFoto(null).ok).toBe(false);
    expect(validasiFoto({ name: "f.jpg", type: "image/jpeg", size: 900_000 }).ok).toBe(true);
    expect(validasiFoto({ name: "f.gif", type: "image/gif", size: 900_000 }).ok).toBe(false);
    expect(validasiFoto({ name: "f.png", type: "image/png", size: 11 * 1024 * 1024 }).ok).toBe(false);
  });
});

describe("pesan pembayaran WhatsApp", () => {
  it("memuat kode, kategori, nama, usia, dan biaya", () => {
    const h = validasiPendaftar(jaipong, isian);
    if (!h.ok) throw new Error(h.galat);
    const { pesan, url } = pesanBayarLomba(jaipong, h.data, kodePendaftaran(7), { gelombang: 1, biaya: 120000 });
    expect(pesan).toContain("Kode pendaftaran: PJ-0007");
    expect(pesan).toContain("Kategori: SD 1–3");
    expect(pesan).toContain("Nama lengkap: Siti Aisyah Rahma (8 tahun)");
    expect(pesan).toContain("Biaya pendaftaran (gelombang 1): Rp120.000");
    expect(url.startsWith("https://wa.me/6285724981356?text=")).toBe(true);
  });
});

// Pemilik: gelombang 1 22–24 Nov diskon 20%, gelombang 2 25–30 Nov diskon 10%, gelombang 3 1–28 Des harga normal.
describe("gelombang pendaftaran", () => {
  const wib = (iso: string) => new Date(`${iso}+07:00`);
  it("harga tiap gelombang", () => {
    expect(jaipong.gelombang.map((g) => biayaGelombang(jaipong, g))).toEqual([120000, 135000, 150000]);
  });
  it("tanggal tiap gelombang", () => {
    expect(jaipong.gelombang.map(rentangGelombang)).toEqual(["22–24 November 2026", "25–30 November 2026", "1–28 Desember 2026"]);
  });
  it("belum dibuka sebelum 22 November 2026 (WIB)", () => {
    const s = statusPendaftaran(jaipong, wib("2026-11-21T23:59:00"));
    expect(s.status).toBe("belum");
    if (s.status === "belum") expect(s.berikutnya.ke).toBe(1);
  });
  it("gelombang 1 mulai 22 November pukul 00.00 WIB sampai 24 November", () => {
    for (const t of ["2026-11-22T00:00:00", "2026-11-24T23:59:00"]) {
      const s = statusPendaftaran(jaipong, wib(t));
      expect(s.status === "buka" && s.gelombang.ke === 1 && s.biaya === 120000).toBe(true);
    }
  });
  it("gelombang 2 tanggal 25–30 November", () => {
    for (const t of ["2026-11-25T00:00:00", "2026-11-30T23:59:00"]) {
      const s = statusPendaftaran(jaipong, wib(t));
      expect(s.status === "buka" && s.gelombang.ke === 2 && s.biaya === 135000).toBe(true);
    }
  });
  it("gelombang 3 tanggal 1–28 Desember, lalu tutup", () => {
    for (const t of ["2026-12-01T00:00:00", "2026-12-28T23:59:00"]) {
      const s = statusPendaftaran(jaipong, wib(t));
      expect(s.status === "buka" && s.gelombang.ke === 3 && s.biaya === 150000).toBe(true);
    }
    expect(statusPendaftaran(jaipong, wib("2026-12-29T00:00:00")).status).toBe("tutup");
  });
});
