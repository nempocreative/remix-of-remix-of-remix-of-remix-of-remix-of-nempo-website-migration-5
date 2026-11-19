import PasanggiriFrame, { masuk } from '../components/PasanggiriFrame';
import { PASANGGIRI as P } from '../pasanggiri';

const WARNA = {
  merah: { nama: 'Selempang merah marun', chip: 'linear-gradient(135deg,#7a1424,#b0283a)' },
  hitam: { nama: 'Selempang hitam emas', chip: 'linear-gradient(135deg,#0d0806,#3a2a12)' },
} as const;

export default function SlidePasanggiri2Kategori() {
  return (
    <PasanggiriFrame label="Pasanggiri Jaipong" judul={<>Kategori & <span className="pjg-emas">Kuota Peserta</span></>}>
      {(go) => (
        <div className="flex h-full flex-col">
          <div className="grid flex-1 grid-cols-4 gap-[1.6cqw]">
            {P.kategori.map((k, i) => (
              <div key={k.id} className="pjg-kartu relative flex flex-col overflow-hidden p-[1.8cqw]" style={masuk(go, 0.25 + i * 0.1, 'pop')}>
                <div className="absolute inset-x-0 top-0 h-[0.6cqh]" style={{ background: WARNA[k.selempang].chip, borderBottom: '0.06cqw solid #D4A017' }} />
                <p className="font-psg-body uppercase" style={{ fontSize: '0.8cqw', letterSpacing: '0.2em', color: 'rgba(212,160,23,.7)' }}>
                  Kategori {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-[1cqh] font-psg-display font-black pjg-emas" style={{ fontSize: '3.6cqw', lineHeight: 1 }}>{k.nama}</p>
                <p className="mt-[1cqh] font-psg-body" style={{ fontSize: '1.15cqw', color: 'rgba(245,230,195,.72)' }}>{k.keterangan}</p>

                <div className="mt-auto">
                  <div className="flex items-end justify-between">
                    <p className="font-psg-body" style={{ fontSize: '0.95cqw', color: 'rgba(245,230,195,.55)' }}>Kuota</p>
                    <p className="font-psg-display font-bold" style={{ fontSize: '2.2cqw', color: '#f5e6c3', lineHeight: 1 }}>
                      {P.kuotaPerKategori}<span style={{ fontSize: '1cqw', color: 'rgba(245,230,195,.55)' }}> peserta</span>
                    </p>
                  </div>
                  <div className="mt-[1cqh] grid grid-cols-5 gap-[0.3cqw]">
                    {Array.from({ length: P.kuotaPerKategori }, (_, j) => (
                      <span key={j} className="h-[0.9cqh]" style={{ background: 'rgba(212,160,23,.55)', ...masuk(go, 0.6 + i * 0.1 + j * 0.015, 'pop') }} />
                    ))}
                  </div>
                  <div className="mt-[1.8cqh] flex items-center gap-[0.7cqw]">
                    <span className="h-[1.6cqw] w-[1.6cqw] shrink-0" style={{ background: WARNA[k.selempang].chip, border: '0.08cqw solid #D4A017' }} />
                    <p className="font-psg-body" style={{ fontSize: '0.95cqw', color: 'rgba(245,230,195,.7)' }}>{WARNA[k.selempang].nama} untuk Juara 1</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[2.4cqh] flex items-center gap-[2cqw]" style={masuk(go, 0.9)}>
            <p className="font-psg-display font-black text-psg-accent" style={{ fontSize: '3cqw', lineHeight: 1 }}>{P.totalKuota}</p>
            <p className="font-psg-body" style={{ fontSize: '1.15cqw', color: 'rgba(245,230,195,.72)', lineHeight: 1.45 }}>
              penari dari seluruh Jawa Barat · maksimal {P.kuotaPerKategori} peserta tiap kategori,
              pendaftaran kategori tertutup otomatis saat kuotanya penuh.
            </p>
          </div>
        </div>
      )}
    </PasanggiriFrame>
  );
}
