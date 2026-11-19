import { KeuanganFrame, TabelRab } from '../components/KeuanganFrame';
export default function SlideKeuangan1Produksi() {
  return <KeuanganFrame judul="RAB — Produksi & Venue"><TabelRab kelompok="produksi" />
    <p className="mt-[2cqh] text-[1.05cqw] text-psg-text/70">Angka pengajuan untuk keseluruhan 3 hari (29 Des persiapan + 30–31 Des acara), bukan biaya per hari. Harga final mengikuti penawaran vendor. Tenda: asumsi Rp450.000 per unit per hari.</p>
  </KeuanganFrame>;
}