import type { ReactNode } from 'react';
import SlideHeader from './SlideHeader';
import SlideFooter from './SlideFooter';
import { RAB, rupiah, subtotalRab } from '../keuangan';

export function KeuanganFrame({ judul, children }: { judul: string; children: ReactNode }) {
  return <section className="relative flex h-full flex-col overflow-hidden bg-psg-bg px-[5cqw] pb-[8cqh] pt-[10cqh] font-psg-body text-psg-text">
    <img src="/media/pasar-seni-garut/batik-texture.webp" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10" />
    <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      <p className="mb-[1cqh] text-[1cqw] text-psg-accent">PENGAJUAN SPONSOR · ACARA 30–31 DESEMBER 2026 · PERSIAPAN 29 DESEMBER</p>
      <h2 className="mb-[3cqh] font-psg-display text-[3.2cqw] font-bold leading-tight">{judul}</h2>
      {children}
    </div>
    <SlideHeader /><SlideFooter slide={43} />
  </section>;
}

export function TabelRab({ kelompok }: { kelompok: 'produksi' | 'operasional' }) {
  return <div className="flex min-h-0 flex-1 flex-col">
    <table className="w-full table-fixed text-left text-[1.35cqw]">
      <thead className="border-y border-psg-accent/30 text-[1cqw] text-psg-accent">
        <tr><th className="w-[46%] py-[1.4cqh]">KEBUTUHAN</th><th className="w-[32%]">CAKUPAN</th><th className="text-right">ANGGARAN</th></tr>
      </thead>
      <tbody>{RAB.filter(row => row.kelompok === kelompok).map(row => <tr key={row.nama} className="border-b border-psg-accent/15">
        <td className="py-[1.1cqh] pr-[1cqw] font-semibold">{row.nama}</td>
        <td className="pr-[1.2cqw] text-[1.05cqw] leading-snug text-psg-text/70">{row.detail}</td>
        <td className="text-right font-semibold tabular-nums">{rupiah(row.biaya)}</td>
      </tr>)}</tbody>
    </table>
    <div className="mt-[1cqh] flex shrink-0 items-center justify-between border-t border-psg-accent/40 pt-[1cqh]">
      <p className="text-[1.3cqw]">Subtotal {kelompok === 'produksi' ? 'Produksi & Venue' : 'Program & Operasional'}</p>
      <p className="font-psg-display text-[1.8cqw] font-bold text-psg-accent">{rupiah(subtotalRab(kelompok))}</p>
    </div>
  </div>;
}