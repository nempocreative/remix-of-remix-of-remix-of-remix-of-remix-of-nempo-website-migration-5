/**
 * Menu Lomba — data lomba yang dibuka NEMPO. Aman untuk browser (tanpa server).
 * Pendaftaran disimpan lewat server (lomba.functions.ts); pembayaran lanjut lewat WhatsApp resmi Nempo.
 */
import { NEMPO_WA_URL } from "@/lib/contact";

export type KategoriLomba = {
  id: string;
  nama: string;
  keterangan: string;
};

export type Gelombang = {
  ke: number;
  /** Tanggal WIB, YYYY-MM-DD, termasuk hari itu. */
  mulai: string;
  selesai: string;
  diskonPersen: number;
};

export type Lomba = {
  slug: string;
  judul: string;
  subjudul: string;
  ringkas: string;
  kategori: KategoriLomba[];
  /** Rupiah per peserta. */
  biayaPendaftaran: number;
  /** Gelombang pendaftaran berurutan; di luar rentang ini pendaftaran tutup. */
  gelombang: Gelombang[];
  kuotaPerKategori: number;
  hadiahJuara1: string[];
  hadiahJuara23: string[];
  /** Didapat setiap peserta yang ikut, bukan hanya juara. */
  hadiahSemua: string[];
  /** Kosong = belum diumumkan. */
  tanggal: string | null;
  /** Tanggal acara puncak Pasar Seni (juara 1 berkesempatan tampil). */
  acaraPuncak: string | null;
  lokasi: string | null;
  gambar: string;
};

export const BELUM_DIUMUMKAN = "Segera diumumkan";

export const lombaList: Lomba[] = [
  {
    slug: "pasanggiri-jaipong",
    judul: "Pasanggiri Jaipong se-Jawa Barat",
    subjudul: "& Pemilihan Duta Pasar Seni",
    ringkas: "Road to Pasar Seni 2027. Juara 1 tiap kategori menjadi Duta Pasar Seni dan berkesempatan tampil di acara puncak Pasar Seni.",
    kategori: [
      { id: "tk", nama: "TK", keterangan: "Taman Kanak-kanak" },
      { id: "sd-1-3", nama: "SD 1–3", keterangan: "SD kelas 1 sampai 3" },
      { id: "sd-4-6", nama: "SD 4–6", keterangan: "SD kelas 4 sampai 6" },
      { id: "smp-sma", nama: "SMP–SMA", keterangan: "SMP sampai SMA" },
    ],
    biayaPendaftaran: 150_000,
    gelombang: [
      { ke: 1, mulai: "2026-11-22", selesai: "2026-11-24", diskonPersen: 20 },
      { ke: 2, mulai: "2026-11-25", selesai: "2026-11-30", diskonPersen: 10 },
      { ke: 3, mulai: "2026-12-01", selesai: "2026-12-28", diskonPersen: 0 },
    ],
    kuotaPerKategori: 25,
    hadiahJuara1: ["Uang pembinaan", "Piala kaki 2", "Selempang", "Sertifikat", "Gelar Duta Pasar Seni", "Kesempatan tampil di acara puncak Pasar Seni"],
    hadiahJuara23: ["Uang pembinaan", "Piala", "Sertifikat"],
    hadiahSemua: ["Piala", "Sertifikat"],
    tanggal: "Rabu, 30 Desember 2026",
    acaraPuncak: "Kamis, 31 Desember 2026",
    lokasi: null,
    gambar: "/media/pasar-seni-garut/dancer-putri.webp",
  },
];

export function cariLomba(slug: string): Lomba | undefined {
  return lombaList.find((l) => l.slug === slug);
}

/** 150000 → "Rp150.000" */
export function rupiah(nilai: number): string {
  return "Rp" + Math.round(nilai).toLocaleString("id-ID").replace(/,/g, ".");
}

/** Tanggal hari ini di Garut (WIB, UTC+7) sebagai YYYY-MM-DD. */
export function tanggalWib(sekarang: Date = new Date()): string {
  return new Date(sekarang.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

export function biayaGelombang(lomba: Lomba, g: Gelombang): number {
  return Math.round((lomba.biayaPendaftaran * (100 - g.diskonPersen)) / 100);
}

export type StatusPendaftaran =
  | { status: "belum"; berikutnya: Gelombang }
  | { status: "buka"; gelombang: Gelombang; biaya: number }
  | { status: "tutup" };

/** Gelombang yang sedang berjalan menurut tanggal WIB. */
export function statusPendaftaran(lomba: Lomba, sekarang: Date = new Date()): StatusPendaftaran {
  const hari = tanggalWib(sekarang);
  const aktif = lomba.gelombang.find((g) => hari >= g.mulai && hari <= g.selesai);
  if (aktif) return { status: "buka", gelombang: aktif, biaya: biayaGelombang(lomba, aktif) };
  const berikutnya = lomba.gelombang.find((g) => hari < g.mulai);
  return berikutnya ? { status: "belum", berikutnya } : { status: "tutup" };
}

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/** "2026-11-22" → "Minggu, 22 November 2026"; tanpaHari → "22 November 2026". */
export function labelTanggal(iso: string, tanpaHari = false): string {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  const hari = HARI[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const isi = `${d} ${BULAN[m - 1]} ${y}`;
  return tanpaHari ? isi : `${hari}, ${isi}`;
}

/** "22–24 November 2026" atau "25 November – 1 Desember 2026". */
export function rentangGelombang(g: Gelombang): string {
  const [y1, m1, d1] = g.mulai.split("-").map(Number) as [number, number, number];
  const [y2, m2, d2] = g.selesai.split("-").map(Number) as [number, number, number];
  if (y1 === y2 && m1 === m2) return `${d1}–${d2} ${BULAN[m2 - 1]} ${y2}`;
  if (y1 === y2) return `${d1} ${BULAN[m1 - 1]} – ${d2} ${BULAN[m2 - 1]} ${y2}`;
  return `${labelTanggal(g.mulai, true)} – ${labelTanggal(g.selesai, true)}`;
}

export function totalKuota(lomba: Lomba): number {
  return lomba.kategori.length * lomba.kuotaPerKategori;
}

/** Batas formulir pendaftaran (juga dijaga database & server). */
export const USIA_MIN = 3;
export const USIA_MAX = 25;
export const NAMA_MAX = 100;
export const ALAMAT_MAX = 300;
export const ASAL_MAX = 100;
export const MUSIK_MAX_BYTES = 20 * 1024 * 1024;
export const FOTO_MAX_BYTES = 10 * 1024 * 1024;

export type DataPendaftar = {
  kategoriId: string;
  namaLengkap: string;
  usia: string;
  alamat: string;
  asal: string;
  kontak: string;
};

export type PendaftarBersih = {
  kategoriId: string;
  kategoriNama: string;
  namaLengkap: string;
  usia: number;
  alamat: string;
  asal: string | null;
  kontak: string;
};

const rapikan = (v: string) => v.trim().replace(/\s+/g, " ");

/** Memeriksa isian teks formulir pendaftaran. */
export function validasiPendaftar(
  lomba: Lomba,
  data: DataPendaftar,
): { ok: true; data: PendaftarBersih } | { ok: false; galat: string } {
  const kategori = lomba.kategori.find((k) => k.id === data.kategoriId);
  if (!kategori) return { ok: false, galat: "Pilih kategori dulu." };
  const nama = rapikan(data.namaLengkap);
  if (nama.length < 2) return { ok: false, galat: "Tulis nama lengkap peserta." };
  if (nama.length > NAMA_MAX) return { ok: false, galat: "Nama lengkap terlalu panjang." };
  const usiaTeks = data.usia.trim();
  const usia = Number(usiaTeks);
  if (!/^\d{1,2}$/.test(usiaTeks) || usia < USIA_MIN || usia > USIA_MAX) {
    return { ok: false, galat: `Tulis usia peserta dalam tahun (${USIA_MIN}–${USIA_MAX}).` };
  }
  const alamat = data.alamat.trim().replace(/\r\n/g, "\n");
  if (alamat.length < 5) return { ok: false, galat: "Tulis alamat peserta." };
  if (alamat.length > ALAMAT_MAX) return { ok: false, galat: `Alamat maksimal ${ALAMAT_MAX} huruf.` };
  const asal = rapikan(data.asal);
  if (asal.length > ASAL_MAX) return { ok: false, galat: "Nama sekolah/sanggar terlalu panjang." };
  const kontak = rapikan(data.kontak);
  if (!/^[0-9+\s-]{9,20}$/.test(kontak) || kontak.replace(/\D/g, "").length < 9) {
    return { ok: false, galat: "Tulis nomor WhatsApp orang tua/pendamping." };
  }
  return {
    ok: true,
    data: { kategoriId: kategori.id, kategoriNama: kategori.nama, namaLengkap: nama, usia, alamat, asal: asal || null, kontak },
  };
}

type Berkas = { name: string; type: string; size: number };

const MUSIK_MIME: Record<string, { mime: string; ext: string }> = {
  "audio/mpeg": { mime: "audio/mpeg", ext: "mp3" },
  "audio/mp3": { mime: "audio/mpeg", ext: "mp3" },
  "audio/mp4": { mime: "audio/mp4", ext: "m4a" },
  "audio/x-m4a": { mime: "audio/mp4", ext: "m4a" },
  "audio/m4a": { mime: "audio/mp4", ext: "m4a" },
  "audio/aac": { mime: "audio/aac", ext: "aac" },
  "audio/wav": { mime: "audio/wav", ext: "wav" },
  "audio/x-wav": { mime: "audio/wav", ext: "wav" },
  "audio/wave": { mime: "audio/wav", ext: "wav" },
  "audio/ogg": { mime: "audio/ogg", ext: "ogg" },
};
const MUSIK_EXT: Record<string, string> = { mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg" };

/** Jenis file musik pengiring; beberapa HP mengirim tipe kosong, jadi dicek juga dari akhiran nama file. */
export function jenisMusik(berkas: Pick<Berkas, "name" | "type">): { mime: string; ext: string } | null {
  const dariTipe = MUSIK_MIME[berkas.type.toLowerCase()];
  if (dariTipe) return dariTipe;
  const ext = berkas.name.toLowerCase().split(".").pop() ?? "";
  const mime = MUSIK_EXT[ext];
  return mime && (!berkas.type || berkas.type === "application/octet-stream") ? { mime, ext } : null;
}

const FOTO_MIME: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function jenisFoto(tipe: string): { mime: string; ext: string } | null {
  const ext = FOTO_MIME[tipe.toLowerCase()];
  return ext ? { mime: tipe.toLowerCase(), ext } : null;
}

export function validasiMusik(musik: Berkas | null): { ok: true; mime: string; ext: string } | { ok: false; galat: string } {
  if (!musik || musik.size <= 0) return { ok: false, galat: "Unggah musik pengiring dulu." };
  const jenis = jenisMusik(musik);
  if (!jenis) return { ok: false, galat: "Musik pengiring harus berupa MP3, M4A, WAV, AAC, atau OGG." };
  if (musik.size > MUSIK_MAX_BYTES) return { ok: false, galat: "Ukuran musik pengiring maksimal 20 MB." };
  return { ok: true, ...jenis };
}

export function validasiFoto(foto: Berkas | null): { ok: true; mime: string; ext: string } | { ok: false; galat: string } {
  if (!foto || foto.size <= 0) return { ok: false, galat: "Unggah foto terbaik peserta dulu." };
  const jenis = jenisFoto(foto.type);
  if (!jenis) return { ok: false, galat: "Foto harus berupa JPG, PNG, atau WebP." };
  if (foto.size > FOTO_MAX_BYTES) return { ok: false, galat: "Ukuran foto maksimal 10 MB." };
  return { ok: true, ...jenis };
}

/** 7 → "PJ-0007" */
export function kodePendaftaran(id: number): string {
  return `PJ-${String(id).padStart(4, "0")}`;
}

/** Pesan WhatsApp setelah pendaftaran tersimpan, untuk minta cara pembayaran. */
export function pesanBayarLomba(
  lomba: Lomba,
  data: PendaftarBersih,
  kode: string,
  bayar: { gelombang: number; biaya: number },
): { pesan: string; url: string } {
  const pesan = [
    `Halo Nempo, saya sudah daftar ${lomba.judul} ${lomba.subjudul} lewat website.`,
    `Kode pendaftaran: ${kode}`,
    `Kategori: ${data.kategoriNama}`,
    `Nama lengkap: ${data.namaLengkap} (${data.usia} tahun)`,
    `Biaya pendaftaran (gelombang ${bayar.gelombang}): ${rupiah(bayar.biaya)}`,
    "Mohon info cara pembayarannya. Terima kasih.",
  ].join("\n");
  return { pesan, url: `${NEMPO_WA_URL}?text=${encodeURIComponent(pesan)}` };
}
