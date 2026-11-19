import { describe, expect, it } from 'vitest';
import { RAB, totalRab, subtotalRab, targetSponsor, terminSponsor, sponsorUsulan } from './keuangan';

describe('RAB Pasar Seni tiga hari', () => {
  const biaya = (nama: string) => RAB.find(row => row.nama === nama)?.biaya;
  it.each([
    ['Panggung 12 × 6 meter', 10_000_000], ['Lighting + videotron', 15_000_000],
    ['Sound system + genset', 8_000_000], ['Tenda backstage', 2_000_000],
    ['Tenda sound system & kru', 1_500_000], ['Tenda UMKM + pengunjung', 33_750_000],
    ['Dekorasi bambu', 30_000_000], ['Talent: MC & penampil', 40_000_000],
    ['Piala pasanggiri + sertifikat', 5_000_000], ['Games Sunda', 2_000_000],
    ['Konsumsi seluruh talent', 10_000_000], ['Air minum', 600_000],
    ['Konsumsi panitia', 1_500_000], ['Biaya lainnya', 10_000_000],
  ])('%s memakai anggaran pengajuan', (nama, nilai) => { expect(biaya(nama as string)).toBe(nilai); });
  it('menjumlahkan seluruh biaya tanpa mengalikan paket tiga hari lagi', () => { expect(totalRab).toBe(169_350_000); });
  it('subtotal produksi dan operasional sesuai total', () => {
    expect(subtotalRab('produksi')).toBe(100_250_000);
    expect(subtotalRab('operasional')).toBe(69_100_000);
  });
  it('usulan sponsor menutup tepat seluruh RAB', () => { expect(targetSponsor).toBe(169_350_000); });
  it.each([
    ['Sponsor Utama', 1, 100_000_000],
    ['Sponsor Pendukung', 2, 25_000_000],
    ['Mitra Program', 3, 6_450_000],
  ])('rincian paket %s tetap sesuai usulan pendanaan', (nama, jumlah, nilai) => {
    const paket = sponsorUsulan.find(p => p.nama === nama);
    expect(paket?.jumlah).toBe(jumlah);
    expect(paket?.nilai).toBe(nilai);
  });
  it('usulan termin tidak melebihi nilai kerja sama', () => { expect(terminSponsor.reduce((n, t) => n + t.persen, 0)).toBe(100); });
});