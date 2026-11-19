import { KeuanganFrame } from '../components/KeuanganFrame';
import { aktivasiSponsor, syaratSponsor } from '../keuangan';

export default function SlideKeuangan5Aktivasi() {
  return <KeuanganFrame judul="Aktivasi 3 Hari & Kesepakatan Mitra">
    <div className="grid grid-cols-3 gap-[2cqw]">
      {aktivasiSponsor.map(a => <div key={a.hari} className="border-t-2 border-psg-accent pt-[1.4cqh]">
        <p className="text-[1.2cqw] font-bold text-psg-accent">{a.hari}</p>
        <h3 className="mt-[1cqh] text-[1.6cqw] font-bold leading-snug">{a.kegiatan}</h3>
        <p className="mt-[1cqh] text-[1.25cqw] leading-snug text-psg-text/80">{a.rincian}</p>
      </div>)}
    </div>
    <h3 className="mb-[1.5cqh] mt-[3cqh] border-t border-psg-accent/30 pt-[2cqh] text-[1.4cqw] font-bold text-psg-accent">BATAS PAKET & KOMITMEN BERSAMA</h3>
    <div className="grid grid-cols-2 gap-x-[3cqw] gap-y-[2cqh]">{syaratSponsor.map((s, i) => <p key={s} className="flex gap-[1cqw] text-[1.2cqw] leading-snug">
      <span className="font-bold text-psg-accent">0{i + 1}</span><span>{s}</span>
    </p>)}</div>
    <p className="mt-auto pt-[2cqh] text-[1.1cqw] text-psg-text/70">Alur kerja sama: pilih paket → sepakati manfaat & nilai dukungan → tanda tangan → materi & aktivasi → laporan maksimal H+14 (usulan).</p>
  </KeuanganFrame>;
}