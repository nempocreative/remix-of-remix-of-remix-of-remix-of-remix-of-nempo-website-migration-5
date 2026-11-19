/** Proposal estimates for the entire three-day edition, not daily costs. */
export const RAB = [
  { nama: 'Panggung 12 × 6 meter', detail: 'Paket 3 hari', biaya: 10_000_000, kelompok: 'produksi' },
  { nama: 'Lighting + videotron', detail: 'Paket 3 hari', biaya: 15_000_000, kelompok: 'produksi' },
  { nama: 'Sound system + genset', detail: 'Sound 10.000 watt · paket 3 hari', biaya: 8_000_000, kelompok: 'produksi' },
  { nama: 'Tenda backstage', detail: '2 unit · ukuran menyusul', biaya: 2_000_000, kelompok: 'produksi' },
  { nama: 'Tenda sound system & kru', detail: 'Ukuran ±5 meter', biaya: 1_500_000, kelompok: 'produksi' },
  { nama: 'Tenda UMKM + pengunjung', detail: 'Asumsi Rp450.000 × 25 unit × 3 hari', biaya: 450_000 * 25 * 3, kelompok: 'produksi' },
  { nama: 'Dekorasi bambu', detail: 'Gapura, panggung & photobooth', biaya: 30_000_000, kelompok: 'produksi' },
  { nama: 'Talent: MC & penampil', detail: '30 penampil · paket 3 hari', biaya: 40_000_000, kelompok: 'operasional' },
  { nama: 'Piala pasanggiri + sertifikat', detail: 'Paket penghargaan', biaya: 5_000_000, kelompok: 'operasional' },
  { nama: 'Games Sunda', detail: 'Aktivitas selama 3 hari', biaya: 2_000_000, kelompok: 'operasional' },
  { nama: 'Konsumsi seluruh talent', detail: 'Total selama 3 hari', biaya: 10_000_000, kelompok: 'operasional' },
  { nama: 'Air minum', detail: 'Asumsi 10 dus · Rp600.000 total / 3 hari', biaya: 600_000, kelompok: 'operasional' },
  { nama: 'Konsumsi panitia', detail: 'Makan · total selama 3 hari', biaya: 1_500_000, kelompok: 'operasional' },
  { nama: 'Biaya lainnya', detail: 'Rincian penggunaan saat pelaksanaan', biaya: 10_000_000, kelompok: 'operasional' },
] as const;
export const totalRab = RAB.reduce((total, row) => total + row.biaya, 0);
export const subtotalRab = (kelompok: 'produksi' | 'operasional') => RAB.filter(row => row.kelompok === kelompok).reduce((total, row) => total + row.biaya, 0);
export const sponsorUsulan = [
  { nama: 'Sponsor Utama', jumlah: 1, nilai: 100_000_000, manfaat: 'Identitas utama di panggung, gapura & videotron; aktivasi brand 2 hari acara; penyebutan MC dan publikasi utama.' },
  { nama: 'Sponsor Pendukung', jumlah: 2, nilai: 25_000_000, manfaat: 'Logo di materi acara & videotron; area aktivasi sesuai kesepakatan; penyebutan MC selama 2 hari acara.' },
  { nama: 'Mitra Program', jumlah: 3, nilai: (totalRab - 150_000_000) / 3, manfaat: 'Dukungan satu program atau kebutuhan acara; logo pada materi program dan apresiasi dalam laporan mitra.' },
] as const;
export const targetSponsor = sponsorUsulan.reduce((total, row) => total + row.jumlah * row.nilai, 0);
/** Negotiable deliverables, not confirmed inventory or guaranteed audience results. */
export const manfaatSponsor = [
  { nama: 'Identitas brand', nilai: ['“Didukung oleh” + logo terbesar di materi utama', 'Logo tingkat pendukung di materi utama', 'Logo di materi program yang didukung'] },
  { nama: 'Area acara', nilai: ['Panggung, gapura & photobooth', 'Panggung & papan mitra', 'Area program pilihan'] },
  { nama: 'Booth aktivasi', nilai: ['Usulan 3 × 3 m · selama 2 hari acara', 'Usulan 2 × 3 m · selama 2 hari acara', 'Titik sampling pada sesi program'] },
  { nama: 'Videotron', nilai: ['Usulan video ≤30 detik · 12 tayang/hari', 'Usulan video ≤15 detik · 6 tayang/hari', 'Logo bersama pada sesi program'] },
  { nama: 'Penyebutan MC', nilai: ['6 kali/hari · total 18 kali', '3 kali/hari · total 9 kali', '3 kali pada program pilihan'] },
  { nama: 'Publikasi khusus', nilai: ['3 unggahan feed + 9 story', '2 unggahan feed + 6 story', '1 unggahan feed + 3 story'] },
  { nama: 'Laporan mitra', nilai: ['Rekap promosi, foto aktivasi & keuangan', 'Rekap promosi & foto aktivasi', 'Dokumentasi & hasil program'] },
] as const;
export const aktivasiSponsor = [
  { hari: 'Hari 1 · Opening Day', kegiatan: 'Brand introduction & sambutan pembukaan', rincian: 'Pembukaan booth, sampling produk, video brand di jeda panggung, dan dokumentasi opening.' },
  { hari: 'Hari 2 · Pasanggiri', kegiatan: 'Dukungan budaya & interaksi komunitas', rincian: 'Aktivasi di luar area lomba, dukungan hadiah sesuai kesepakatan, serta foto penyerahan penghargaan.' },
  { hari: 'Hari 3 · Champion Day', kegiatan: 'Penguatan brand & penutupan', rincian: 'Games berhadiah, apresiasi mitra, dokumentasi pemenang dan rangkuman acara untuk publikasi.' },
] as const;
export const syaratSponsor = [
  'Seluruh manfaat dan kuota di atas adalah usulan untuk 2 hari acara (30–31 Desember); dikunci dalam perjanjian setelah denah, materi dan rundown disetujui.',
  'Eksklusivitas kategori hanya untuk Sponsor Utama bila disepakati tertulis; tidak termasuk tenant independen tanpa kesepakatan tambahan.',
  'Brand menyediakan materi siap tayang dan petugas booth; produksi booth, listrik tambahan, produk sampling & hadiah di luar paket kecuali disepakati.',
  'Dukungan barang/jasa dinilai sesuai pos RAB yang digantikan. Tidak menjamin jumlah pengunjung, penjualan, jangkauan atau data pribadi pengunjung.',
] as const;
export const terminSponsor = [
  { persen: 50, tahap: 'Setelah kerja sama ditandatangani', tujuan: 'Booking vendor & persiapan produksi' },
  { persen: 40, tahap: 'Usulan H−7 sebelum acara', tujuan: 'Pelunasan kebutuhan produksi & operasional' },
  { persen: 10, tahap: 'Setelah laporan diserahkan', tujuan: 'Rekonsiliasi bukti pengeluaran & dokumentasi' },
] as const;
export const rupiah = (nilai: number) => `Rp${nilai.toLocaleString('id-ID')}`;