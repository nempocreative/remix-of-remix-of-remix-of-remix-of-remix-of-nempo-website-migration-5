/**
 * Data Pasanggiri Jaipong untuk slide proposal Pasar Seni Garut.
 * Semua angka diambil dari src/data/lomba.ts supaya proposal selalu sama dengan halaman /lomba.
 */
import {
  BELUM_DIUMUMKAN,
  biayaGelombang,
  cariLomba,
  rentangGelombang,
  rupiah,
  totalKuota,
  FOTO_MAX_BYTES,
  MUSIK_MAX_BYTES,
  USIA_MAX,
  USIA_MIN,
} from "@/data/lomba";

const lomba = cariLomba("pasanggiri-jaipong");
if (!lomba) throw new Error("Data Pasanggiri Jaipong tidak ditemukan");

const MB = 1024 * 1024;

/** Selempang merah marun untuk TK–SD, hitam emas untuk SMP–SMA. */
export function warnaSelempang(kategoriId: string): "merah" | "hitam" {
  return kategoriId === "smp-sma" ? "hitam" : "merah";
}

export const PASANGGIRI = {
  judul: lomba.judul,
  subjudul: lomba.subjudul,
  ringkas: lomba.ringkas,
  tanggal: lomba.tanggal ?? BELUM_DIUMUMKAN,
  acaraPuncak: lomba.acaraPuncak ?? BELUM_DIUMUMKAN,
  lokasi: lomba.lokasi ?? BELUM_DIUMUMKAN,
  halaman: "nempogarut.com/lomba",
  biayaNormal: rupiah(lomba.biayaPendaftaran),
  kuotaPerKategori: lomba.kuotaPerKategori,
  totalKuota: totalKuota(lomba),
  kategori: lomba.kategori.map((k) => ({ ...k, selempang: warnaSelempang(k.id) })),
  gelombang: lomba.gelombang.map((g) => ({
    ke: g.ke,
    rentang: rentangGelombang(g),
    diskon: g.diskonPersen > 0 ? `Diskon ${g.diskonPersen}%` : "Harga normal",
    biaya: rupiah(biayaGelombang(lomba, g)),
    coret: g.diskonPersen > 0 ? rupiah(lomba.biayaPendaftaran) : null,
  })),
  hadiah: [
    { peringkat: "Juara 1", foto: "piala-juara-1.webp", isi: lomba.hadiahJuara1 },
    { peringkat: "Juara 2", foto: "piala-juara-2.webp", isi: lomba.hadiahJuara23 },
    { peringkat: "Juara 3", foto: "piala-juara-3.webp", isi: lomba.hadiahJuara23 },
    { peringkat: "Juara Harapan 1", foto: "piala-juara-harapan-1.webp", isi: lomba.hadiahSemua },
  ],
  hadiahSemua: lomba.hadiahSemua,
  berkas: [
    { label: "Kategori lomba", ket: lomba.kategori.map((k) => k.nama).join(" · ") },
    { label: "Nama lengkap peserta", ket: "Sesuai data sekolah/akta" },
    { label: "Usia", ket: `${USIA_MIN}–${USIA_MAX} tahun` },
    { label: "Alamat lengkap", ket: "Domisili peserta" },
    { label: "Asal sekolah / sanggar", ket: "Boleh dikosongkan" },
    { label: "No. WhatsApp orang tua/pendamping", ket: "Untuk konfirmasi & info teknis" },
    { label: "Musik pengiring (unggah)", ket: `MP3, M4A, WAV, AAC, OGG · maks ${MUSIK_MAX_BYTES / MB} MB` },
    { label: "Foto terbaik (unggah)", ket: `Disarankan memakai atribut tari · JPG, PNG, WebP · maks ${FOTO_MAX_BYTES / MB} MB` },
  ],
  alur: [
    "Isi formulir di nempogarut.com/lomba",
    "Dapat kode pendaftaran (PJ-0001)",
    "Bayar via WhatsApp resmi Nempo sesuai gelombang",
    "Peserta tercatat setelah pembayaran dikonfirmasi",
  ],
  selempang: [
    { warna: "merah", nama: "Merah Marun", untuk: "TK · SD 1–3 · SD 4–6", foto: "selempang-merah-dipakai.webp", strip: "selempang-merah.webp" },
    { warna: "hitam", nama: "Hitam Emas", untuk: "SMP–SMA", foto: "selempang-hitam-dipakai.webp", strip: "selempang-hitam.webp" },
  ],
} as const;
