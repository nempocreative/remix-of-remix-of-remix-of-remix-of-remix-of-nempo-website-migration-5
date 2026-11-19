import { KeuanganFrame } from '../components/KeuanganFrame';
import { rupiah, sponsorUsulan, targetSponsor, terminSponsor } from '../keuangan';
export default function SlideKeuangan3Sponsor() {
  return <KeuanganFrame judul="Usulan Pendanaan Sponsor — 3 Hari">
    <div className="mb-[2cqh] flex items-center justify-between border-y border-psg-accent/30 py-[1.5cqh]">
      <p className="text-[1.3cqw]">Target dukungan menutup seluruh RAB</p><p className="text-[2.5cqw] font-bold text-psg-accent">{rupiah(targetSponsor)}</p>
    </div>
    <div className="grid grid-cols-3 gap-[2cqw]">
      {sponsorUsulan.map(p => <div key={p.nama} className="border border-psg-accent/30 p-[1.5cqw]">
        <h3 className="text-[1.6cqw] font-bold">{p.nama}</h3>
        <p className="mt-[1cqh] text-[2.2cqw] font-bold text-psg-accent">{rupiah(p.nilai)}</p>
        <p className="text-[1.1cqw] text-psg-text/70">{p.jumlah} mitra · subtotal {rupiah(p.nilai * p.jumlah)}</p>
        <p className="mt-[1.6cqh] text-[1.15cqw] leading-snug">{p.manfaat}</p>
      </div>)}
    </div>
    <h3 className="mb-[1cqh] mt-[2cqh] text-[1.3cqw] font-bold text-psg-accent">USULAN TERMIN & PENGELOLAAN</h3>
    <div className="grid grid-cols-3 gap-[2cqw]">{terminSponsor.map(t => <div key={t.persen} className="border-t border-psg-accent/30 pt-[1cqh]">
      <p className="text-[1.4cqw] font-bold">{t.persen}% · {t.tahap}</p><p className="mt-[0.5cqh] text-[1.05cqw] text-psg-text/70">{t.tujuan}</p>
    </div>)}</div>
    <p className="mt-auto pt-[1.5cqh] text-[1.05cqw] leading-snug text-psg-text/70">Paket & termin masih usulan, berlaku setelah disepakati. Dukungan barang/jasa mengurangi pos RAB terkait, bukan dihitung dua kali. Pengeluaran dicatat per pos dan per hari, disertai bukti; laporan keuangan & dokumentasi diusulkan maksimal H+14. Pendapatan tenant belum dihitung sebagai dana pasti.</p>
  </KeuanganFrame>;
}