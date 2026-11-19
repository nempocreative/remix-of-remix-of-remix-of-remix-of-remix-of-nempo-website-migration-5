/**
 * Copy for the home-page "daftar lomba" card. Browser-safe (no server, no React)
 * so the wording can be tested without rendering the page.
 */
import { BELUM_DIUMUMKAN, rupiah, type Lomba } from "@/data/lomba";

/** Lomba yang ditawari kartu di Beranda. */
export const LOMBA_HOME_SLUG = "pasanggiri-jaipong";

/** Baris ringkasan kartu: tanggal main, kuota, biaya. Diambil dari data lomba supaya angkanya tidak pernah melenceng. */
export function lombaCtaBaris(lomba: Lomba): string[] {
  return [
    lomba.tanggal ?? BELUM_DIUMUMKAN,
    `Kuota ${lomba.kuotaPerKategori} peserta tiap kategori · ${lomba.kategori.length} kategori`,
    `${rupiah(lomba.biayaPendaftaran)} / peserta`,
  ];
}

/** "& Pemilihan Duta Pasar Seni" → "Pemilihan Duta Pasar Seni". */
export function lombaCtaSubjudul(lomba: Lomba): string {
  return lomba.subjudul.replace(/^&\s*/, "");
}
