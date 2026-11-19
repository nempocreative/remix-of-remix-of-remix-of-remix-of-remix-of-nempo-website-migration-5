/**
 * Tanggal dan rundown proposal Pasar Seni Garut 2026 — acara dua hari, 30–31 Desember.
 * 29 Desember hanya hari persiapan (bukan acara, belum dibuka untuk pengunjung).
 * Hari pertama (30 Des) Pasanggiri Jaipong; hari kedua (31 Des) acara puncak, dibagi sesi pagi & malam.
 * Tanggal diambil dari data lomba supaya sama dengan halaman /lomba.
 */
import { PASANGGIRI } from "./pasanggiri";

export type BarisRundown = {
  time: string;
  activity: string;
  location: string;
  /** Jam masuk sholat untuk baris jeda sholat, mis. "11.51". */
  adzan?: string;
};

const keMenit = (jam: string) => {
  const [h, m] = jam.split(".").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

/** Lama satu baris rundown dalam menit dari "HH.MM – HH.MM"; null kalau barisnya cuma satu titik waktu. */
export function menitDurasi(time: string): number | null {
  const bagian = time.split(/\s*[–-]\s*/);
  if (bagian.length !== 2) return null;
  return keMenit(bagian[1]!) - keMenit(bagian[0]!);
}

/** Durasi siap tampil, selalu dalam menit, mis. "45 menit", "180 menit"; "—" untuk baris satu titik waktu. */
export function durasi(time: string): string {
  const menit = menitDurasi(time);
  return menit === null ? "—" : `${menit} menit`;
}

export const TANGGAL_ACARA = "30–31 Desember 2026";

/** Kegiatan ini rutin setiap bulan — bukan acara setahun sekali. */
export const KADENSI = "Rutin setiap bulan";

/** Hari persiapan sebelum acara — bukan bagian acara, tidak dibuka untuk pengunjung. */
export const HARI_PERSIAPAN = "Selasa, 29 Desember 2026";

export const HARI_ACARA = {
  pasanggiri: PASANGGIRI.tanggal,
  puncak: PASANGGIRI.acaraPuncak,
} as const;

/** 29 Des — persiapan: registrasi tenant, technical meeting Pasanggiri, penataan area. Belum ada acara untuk pengunjung. */
export const RUNDOWN_PERSIAPAN: BarisRundown[] = [
  { time: "08.00 – 09.00", activity: "Registrasi Tenant & Final Briefing",   location: "Area Tenant"     },
  { time: "09.00 – 12.00", activity: "Technical Meeting Pasanggiri",         location: "Community Stage" },
  { time: "12.00 – 13.00", activity: "ISHOMA & Sholat Zuhur",                location: "Musala"          },
  { time: "13.00 – 17.00", activity: "Penataan Area Tenant & Cek Sound",     location: "Seluruh Area"    },
];
export const SOROTAN_PERSIAPAN = [0, 1];

/** Hari pertama (30 Des) — hari Pasanggiri Jaipong. */
export const RUNDOWN_HARI_2: BarisRundown[] = [
  { time: "08.00 – 09.00", activity: "Registrasi Ulang Peserta Pasanggiri Jaipong", location: "Meja Registrasi" },
  { time: "09.00", activity: "Open Gate", location: "Main Gate" },
  { time: "09.00 – 22.00", activity: "Operasional UMKM & Pasar Seni", location: "Seluruh Area" },
  { time: "09.00 – 11.30", activity: "Pasanggiri Jaipong — Kategori TK & SD 1–3", location: "Main Stage" },
  { time: "11.30 – 13.00", activity: "ISHOMA", location: "Area Festival" },
  { time: "13.00 – 15.30", activity: "Pasanggiri Jaipong — Kategori SD 4–6 & SMP–SMA", location: "Main Stage" },
  { time: "13.00 – 14.00", activity: "Workshop Branding UMKM", location: "Community Stage" },
  { time: "15.30 – 16.30", activity: "Showcase Komunitas Kreatif", location: "Main Stage" },
  { time: "16.30 – 18.00", activity: "Rekap Nilai Dewan Juri Pasanggiri", location: "Ruang Juri" },
  { time: "18.00 – 19.00", activity: "ISHOMA", location: "Area Festival" },
  { time: "19.00 – 20.00", activity: "Pengumuman Pemenang & Penobatan Duta Pasar Seni", location: "Main Stage" },
  { time: "20.00 – 21.00", activity: "Musik Akustik & Panggung Komunitas", location: "Main Stage" },
  { time: "21.00 – 22.00", activity: "Malam Apresiasi Karya", location: "Main Stage" },
  { time: "22.00", activity: "Penutupan Hari Pertama", location: "—" },
];
export const SOROTAN_HARI_2 = [0, 3, 5, 10];

/** Hari kedua (31 Des), sesi pagi — seni Sunda, talkshow UMKM, lalu penganugerahan. */
export const RUNDOWN_HARI_3_PAGI: BarisRundown[] = [
  { time: "09.00",             activity: "Open Gate",                                  location: "Main Gate"     },
  { time: "09.00 – 22.00",     activity: "Operasional UMKM & Pasar Seni",               location: "Seluruh Area"  },
  { time: "09.30 – 10.30",     activity: "Talkshow UMKM",                               location: "Main Stage"    },
  { time: "10.30 – 11.00",     activity: "Penampilan Tari",                             location: "Main Stage"    },
  { time: "11.00 – 11.30",     activity: "Penampilan Gondang Babakan Loa",              location: "Main Stage"    },
  { time: "11.30 – 12.00",     activity: "Games Sunda",                                 location: "Main Stage"    },
  { time: "12.00 – 13.00",     activity: "ISHOMA",                                      location: "Area Festival" },
  { time: "13.00 – 13.30",     activity: "Penampilan Tari",                             location: "Main Stage"    },
  { time: "13.30 – 14.15",     activity: "Penampilan Dongeng Sunda",                    location: "Main Stage"    },
  { time: "14.15 – 14.45",     activity: "Puisi Garut",                                 location: "Main Stage"    },
  { time: "14.45 – 15.30",     activity: "Ketuk Tilu Klagar",                           location: "Main Stage"    },
  { time: "15.30 – 16.30",     activity: "Musik Etnik",                                 location: "Main Stage"    },
  { time: "16.30 – 17.00",     activity: "Final Voting People's Choice Champion",       location: "Seluruh Area"  },
  { time: "17.00 – 18.30",     activity: "Local Champion Awards 2026",                  location: "Main Stage"    },
  { time: "18.30 – 19.00",     activity: "Penyerahan Trophy Bergilir Pasar Seni Garut", location: "Main Stage"    },
];
export const SOROTAN_HARI_3_PAGI = [2, 4, 9, 10];
/** Momen paling puncak di sesi pagi: penganugerahan. */
export const PUNCAK_HARI_3_PAGI = [13];

/** Hari kedua (31 Des), sesi malam — penutup tahun dengan tarian pemenang & kesenian Sunda. */
export const RUNDOWN_HARI_3_MALAM: BarisRundown[] = [
  { time: "19.30 – 19.50", activity: "Bubuka Karinding — Saduli Ragap",    location: "Main Stage"    },
  { time: "19.50 – 20.10", activity: "Tarawangsa — Saduli Ragap",          location: "Main Stage"    },
  { time: "20.10 – 20.20", activity: "Opening MC",                         location: "Main Stage"    },
  { time: "20.20 – 20.35", activity: "Tarian Pemenang — Kategori TK",       location: "Main Stage"    },
  { time: "20.35 – 20.50", activity: "Tarian Pemenang — Kategori SD 1–3",   location: "Main Stage"    },
  { time: "20.50 – 21.05", activity: "Tarian Pemenang — Kategori SD 4–6",   location: "Main Stage"    },
  { time: "21.05 – 21.20", activity: "Tarian Pemenang — Kategori SMP–SMA",  location: "Main Stage"    },
  { time: "21.20 – 21.30", activity: "MC Masuk",                           location: "Main Stage"    },
  { time: "21.30 – 21.45", activity: "Ice Breaking",                       location: "Main Stage"    },
  { time: "21.45 – 22.15", activity: "Musik Etnik — 2 Lagu",               location: "Main Stage"    },
  { time: "22.15 – 22.45", activity: "Musikal Tari Teater Bagendit",       location: "Main Stage"    },
  { time: "22.45 – 22.55", activity: "MC Masuk",                           location: "Main Stage"    },
  { time: "22.55 – 23.15", activity: "Kaulinan Barudak",                   location: "Area Festival" },
  { time: "23.15 – 23.35", activity: "Wiradomba",                          location: "Main Stage"    },
  { time: "23.35 – 23.55", activity: "Etnik Bajidor",                      location: "Main Stage"    },
  { time: "23.55",         activity: "Penutupan & Foto Bersama",           location: "Main Stage"    },
];
export const SOROTAN_HARI_3_MALAM = [0, 1, 3, 6, 14];
/** Momen paling puncak di sesi malam: musikal tari teater Bagendit. */
export const PUNCAK_HARI_3_MALAM = [10];
