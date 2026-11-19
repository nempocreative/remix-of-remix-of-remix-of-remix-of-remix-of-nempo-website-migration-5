import { KeuanganFrame, TabelRab } from '../components/KeuanganFrame';
import { rupiah, totalRab } from '../keuangan';
export default function SlideKeuangan2Operasional() {
  return <KeuanganFrame judul="RAB — Program & Operasional"><TabelRab kelompok="operasional" />
    <div className="mt-[2cqh] flex items-center justify-between bg-psg-accent px-[1.6cqw] py-[1.4cqh] text-psg-bg">
      <p className="text-[1.35cqw] font-bold">TOTAL RAB 3 HARI</p><p className="text-[2.4cqw] font-bold tabular-nums">{rupiah(totalRab)}</p>
    </div>
    <p className="mt-[1cqh] text-[1cqw] text-psg-text/70">Total hasil rincian, menggantikan Rp135.000.000 pada catatan awal. Air minum diasumsikan Rp600.000 total untuk 3 hari.</p>
  </KeuanganFrame>;
}