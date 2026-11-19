// Cuplikan layanan Momen Digital untuk beranda: lima kategori portofolio
// (kelas, geng, organisasi, event, komunitas). Data contoh tetap fiktif dan
// memakai kembali meta tiap modul momen supaya judul dan tautan selalu sama.
import { kelasMeta } from "@/data/momen-kelas";
import { grupMeta } from "@/data/momen-grup";
import { organisasiMeta } from "@/data/momen-organisasi";
import { eventMeta } from "@/data/momen-event";
import { komunitasMeta } from "@/data/momen-komunitas";
// Foto kartu beranda versi kecil (400×300) supaya cepat muncul; foto besar
// tetap dipakai di halaman demo masing-masing.
import thumbKelas from "@/assets/momen-digital/kelas.webp";
import thumbGeng from "@/assets/momen-digital/geng.webp";
import thumbOrganisasi from "@/assets/momen-digital/organisasi.webp";
import thumbEvent from "@/assets/momen-digital/event.webp";
import thumbKomunitas from "@/assets/momen-digital/komunitas.webp";

export type MomenDigitalItem = {
  id: string;
  judul: string;
  kategori: string;
  contoh: string;
  deskripsi: string;
  href: string;
  foto: string;
  warna: string;
  warnaLatar: string;
  /** Tiga isi utama halaman demo, tampil sebagai label kecil di cuplikan beranda. */
  sorotan: [string, string, string];
};

/** Indeks kartu berikutnya untuk putaran otomatis; kembali ke awal setelah kartu terakhir. */
export function momenBerikutnya(indeks: number, total: number): number {
  if (total <= 0) return 0;
  return (((indeks + 1) % total) + total) % total;
}

export const momenDigitalItems: MomenDigitalItem[] = [
  {
    id: "kelas",
    judul: "Momen Kelas",
    kategori: "Yearbook",
    contoh: `${kelasMeta.nama} · ${kelasMeta.sekolah}`,
    deskripsi: "Kenangan satu kelas dalam satu halaman: siswa, wali kelas, dan cerita setahun penuh.",
    href: kelasMeta.halaman,
    foto: thumbKelas,
    warna: "#2B3FD8",
    warnaLatar: "#E4E9FF",
    sorotan: ["Profil siswa", "Kapsul waktu", "Pesan dinding"],
  },
  {
    id: "geng",
    judul: "Momen Geng",
    kategori: "Tongkrongan",
    contoh: `${grupMeta.nama} · sejak ${grupMeta.sejak}`,
    deskripsi: "Halaman kenangan untuk geng atau sahabat: album, kebiasaan tiap orang, dan pesan dinding.",
    href: grupMeta.halaman,
    foto: thumbGeng,
    warna: "#DB2777",
    warnaLatar: "#FCE7F3",
    sorotan: ["Album bareng", "Aturan main", "Pesan dinding"],
  },
  {
    id: "organisasi",
    judul: "Momen Organisasi",
    kategori: "Kepengurusan",
    contoh: `${organisasiMeta.nama} · ${organisasiMeta.kabinet}`,
    deskripsi: "Portofolio satu periode: pengurus, program kerja, dan jejak yang ditinggalkan.",
    href: organisasiMeta.halaman,
    foto: thumbOrganisasi,
    warna: "#0F766E",
    warnaLatar: "#CCFBF1",
    sorotan: ["Pengurus", "Program kerja", "Jejak periode"],
  },
  {
    id: "event",
    judul: "Momen Event",
    kategori: "Dokumentasi",
    contoh: `${eventMeta.nama} · ${eventMeta.tahun}`,
    deskripsi: "Rangkuman acara dalam bentuk slideshow foto, susunan panitia, dan cerita di balik layar.",
    href: eventMeta.halaman,
    foto: thumbEvent,
    warna: "#D97706",
    warnaLatar: "#FEF3C7",
    sorotan: ["Slideshow acara", "Panitia", "Di balik layar"],
  },
  {
    id: "komunitas",
    judul: "Momen Komunitas",
    kategori: "Komunitas",
    contoh: `${komunitasMeta.nama} · ${komunitasMeta.usia} tahun`,
    deskripsi: "Cerita tumbuhnya komunitas dari tahun ke tahun: anggota, kegiatan rutin, dan capaian.",
    href: komunitasMeta.halaman,
    foto: thumbKomunitas,
    warna: "#2563EB",
    warnaLatar: "#DBEAFE",
    sorotan: ["Grafik anggota", "Kegiatan rutin", "Penggerak"],
  },
];
