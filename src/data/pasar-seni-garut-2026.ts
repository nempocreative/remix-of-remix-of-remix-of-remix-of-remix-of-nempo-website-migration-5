// Data acara "Pasar Seni Garut 2026" — aman dipakai di browser (tidak ada kunci/rahasia).
// Semua isi yang belum dipastikan pemilik ditandai `belumPasti: true` supaya halaman
// tidak pernah mengaku tiket, tempat spesifik, atau pengisi acara sudah fix.

const publicImage = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const PSG26 = {
  nama: "Pasar Seni Garut",
  tahun: "2026",
  tagline: "Dua hari di pasar, seribu karya dari Garut.",
  tanggalMulai: "2026-12-30",
  tanggalSelesai: "2026-12-31",
  lokasiUmum: "Garut, Jawa Barat",
  lokasiSpesifik: "Tempat pasti masih disusun",
  jamBuka: "Jam buka masih disusun",
  halaman: "/pasar-seni-garut-2026",
  poster: publicImage("media/pasar-seni-garut/cover-hero.webp"),
} as const;

export type StatusAcara = "coming-soon" | "berlangsung" | "selesai";

/** Sisa waktu ke hari pertama. Tidak pernah negatif; `lewat` menandai sudah lewat. */
export function sisaWaktu(
  target: Date,
  sekarang: Date = new Date(),
): { hari: number; jam: number; menit: number; detik: number; lewat: boolean } {
  const selisih = target.getTime() - sekarang.getTime();
  const lewat = selisih <= 0;
  const total = Math.max(0, Math.floor(selisih / 1000));
  return {
    hari: Math.floor(total / 86400),
    jam: Math.floor((total % 86400) / 3600),
    menit: Math.floor((total % 3600) / 60),
    detik: total % 60,
    lewat,
  };
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function labelTanggal(dari: Date): string {
  return `${HARI[dari.getDay()]}, ${dari.getDate()} ${BULAN[dari.getMonth()]} ${dari.getFullYear()}`;
}

/** "Rabu, 30 Desember 2026" — dipakai di hero dan kartu hari. */
export function tanggalPanjang(): string {
  return labelTanggal(new Date(2026, 11, 30));
}

/** Rentang singkat: "30–31 Desember 2026". */
export function tanggalRentang(): string {
  return "30–31 Desember 2026";
}

export type HariAcara = {
  urut: number;
  tanggalISO: string;
  labelHari: string;
  tanggalPanjang: string;
  suasana: string;
  belumPasti: boolean;
};

/** Dua hari acara dengan nama hari yang benar (30 Des 2026 = Rabu). */
export function daftarHari(): HariAcara[] {
  const hari = [
    {
      urut: 1,
      tanggalISO: "2026-12-30",
      labelHari: "Hari ke-1",
      suasana: "Gerbang dibuka: Pasanggiri Jaipong, pasar UMKM, dan kampung kuliner mulai ramai.",
    },
    {
      urut: 2,
      tanggalISO: "2026-12-31",
      labelHari: "Hari ke-2",
      suasana: "Penutup pasar: koin Nempo ditukar, karya sisa lapak dipajang terakhir.",
    },
  ];
  return hari.map((h) => {
    const [y, m, d] = h.tanggalISO.split("-").map(Number);
    return {
      ...h,
      tanggalPanjang: labelTanggal(new Date(y, m - 1, d)),
      belumPasti: true,
    };
  });
}

/** Status acara: sebelum hari pertama, selama dua hari, atau sesudahnya. */
export function statusAcara(hariIni: Date = new Date()): StatusAcara {
  const mulai = new Date(2026, 11, 30, 0, 0, 0, 0).getTime();
  const akhir = new Date(2026, 11, 31, 23, 59, 59, 999).getTime();
  const t = hariIni.getTime();
  if (t < mulai) return "coming-soon";
  if (t <= akhir) return "berlangsung";
  return "selesai";
}

/** Isi file .ics "simpan tanggal" — all-day, 30–31 Desember 2026. */
export function berkasKalender(): string {
  const baris = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nempo Garut//Pasar Seni Garut 2026//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:pasar-seni-garut-2026@nempogarut.com",
    "DTSTAMP:20260101T000000Z",
    "DTSTART;VALUE=DATE:20261230",
    "DTEND;VALUE=DATE:20270101",
    "SUMMARY:Pasar Seni Garut 2026",
    "DESCRIPTION:Dua hari pasar seni, UMKM, dan budaya di Garut. Detail tempat dan jam menyusul.",
    "LOCATION:Garut\\, Jawa Barat",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${baris.join("\r\n")}\r\n`;
}

export type Sorotan = { judul: string; isi: string; belumPasti: boolean };

/** Yang sedang disiapkan — semuanya masih rencana, bukan kepastian. */
export const sorotan: Sorotan[] = [
  {
    judul: "Pasar UMKM & kampung kuliner",
    isi: "Lapak jajanan Garut dan karya perajin lokal dikumpul jadi satu jalan pasar.",
    belumPasti: true,
  },
  {
    judul: "Panggung warisan & kaulinan barudak",
    isi: "Pertunjukan bernuansa Sunda dan permainan tradisional untuk anak-anak.",
    belumPasti: true,
  },
  {
    judul: "Duta pasar seni & koin Nempo",
    isi: "Koin Nempo dipakai sebagai tanda kepesertaan dan penukaran hadiah di dalam pasar.",
    belumPasti: true,
  },
];

export type TanyaJawab = { t: string; j: string };

export const tanyaJawab: TanyaJawab[] = [
  {
    t: "Tiketnya berapa?",
    j: "Belum ada harga tiket. Informasi tiket dan cara masuk akan diumumkan setelah dipastikan.",
  },
  {
    t: "Tempatnya di mana tepatnya?",
    j: "Acara direncanakan di Garut, Jawa Barat. Lokasi pasti dan jam buka masih disusun.",
  },
  {
    t: "Saya punya UMKM / lapak, bisa ikut?",
    j: "Bisa. Sampaikan lewat WhatsApp resmi Nempo supaya kami catat dan kabari lebih dulu.",
  },
  {
    t: "Pengisi acaranya siapa saja?",
    j: "Daftar pengisi acara belum ditetapkan, jadi belum kami umumkan.",
  },
];

/** Galeri bocoran: foto yang sudah ada di proyek ini. */
export const galeri = [
  { src: publicImage("media/pasar-seni-garut/venue-gapura.jpg"), caption: "Gerbang pasar" },
  { src: publicImage("media/pasar-seni-garut/creative-market.webp"), caption: "Lapak kriya" },
  { src: publicImage("media/pasar-seni-garut/heritage-stage.webp"), caption: "Panggung warisan" },
  { src: publicImage("media/pasar-seni-garut/kaulinan-1.jpg"), caption: "Kaulinan barudak" },
];
