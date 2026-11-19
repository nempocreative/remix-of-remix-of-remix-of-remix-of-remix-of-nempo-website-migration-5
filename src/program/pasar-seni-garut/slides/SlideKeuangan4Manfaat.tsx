import { KeuanganFrame } from '../components/KeuanganFrame';
import { manfaatSponsor, rupiah, sponsorUsulan } from '../keuangan';

export default function SlideKeuangan4Manfaat() {
  return <KeuanganFrame judul="Paket Sponsor — Manfaat & Eksposur">
    <table className="w-full table-fixed text-left text-[1.15cqw] leading-snug">
      <thead className="border-y border-psg-accent/40">
        <tr><th className="w-[19%] py-[1.4cqh] text-psg-accent">USULAN MANFAAT</th>
          {sponsorUsulan.map(p => <th key={p.nama} className="px-[1cqw] py-[1.4cqh] align-top">
            <p className="text-[1.5cqw]">{p.nama}</p><p className="mt-[0.5cqh] text-[1.6cqw] text-psg-accent">{rupiah(p.nilai)}</p>
            <p className="mt-[0.5cqh] text-[1cqw] font-normal text-psg-text/70">Per mitra · kuota {p.jumlah} mitra</p>
          </th>)}</tr>
      </thead>
      <tbody>{manfaatSponsor.map(m => <tr key={m.nama} className="border-b border-psg-accent/20">
        <th className="py-[1.3cqh] pr-[1cqw] font-semibold">{m.nama}</th>
        {m.nilai.map((n, i) => <td key={i} className="px-[1cqw] py-[1.3cqh] align-top text-psg-text/85">{n}</td>)}
      </tr>)}</tbody>
    </table>
    <p className="mt-auto pt-[1.5cqh] text-[1.05cqw] text-psg-text/70">Harga berlaku untuk keseluruhan 2 hari acara (30–31 Desember), bukan per hari. Kuota promosi adalah usulan per mitra; penempatan dan jadwal mengikuti persetujuan bersama, tanpa mengganggu penampilan atau lomba.</p>
  </KeuanganFrame>;
}