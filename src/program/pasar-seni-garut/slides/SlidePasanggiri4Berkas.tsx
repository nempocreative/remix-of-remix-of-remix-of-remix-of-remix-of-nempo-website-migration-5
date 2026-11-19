import { FileAudio, ImageIcon } from 'lucide-react';
import PasanggiriFrame, { masuk } from '../components/PasanggiriFrame';
import { PASANGGIRI as P } from '../pasanggiri';

export default function SlidePasanggiri4Berkas() {
  return (
    <PasanggiriFrame label="Info Pendaftaran" judul={<>Data, Berkas & <span className="pjg-emas">Alur Daftar</span></>}>
      {(go) => (
        <div className="grid h-full grid-cols-[1.5fr_1fr] gap-[3cqw]">
          <div className="flex min-h-0 flex-col">
            <p className="mb-[1.4cqh] font-psg-body uppercase" style={{ fontSize: '0.85cqw', letterSpacing: '0.22em', color: 'rgba(212,160,23,.75)', ...masuk(go, 0.2) }}>
              Isian formulir online
            </p>
            <div className="grid flex-1 grid-cols-2 gap-[1cqw]">
              {P.berkas.map((b, i) => {
                const unggah = b.label.includes('unggah');
                const Icon = b.label.startsWith('Musik') ? FileAudio : ImageIcon;
                return (
                  <div
                    key={b.label}
                    className="pjg-kartu flex items-start gap-[0.9cqw] px-[1.3cqw] py-[1.3cqh]"
                    style={{ ...masuk(go, 0.28 + i * 0.06), ...(unggah ? { borderColor: 'rgba(212,160,23,.6)' } : {}) }}
                  >
                    {unggah ? (
                      <Icon className="mt-[0.3cqh] shrink-0 text-psg-accent" style={{ width: '1.5cqw', height: '1.5cqw' }} aria-hidden="true" />
                    ) : (
                      <span className="font-psg-display font-bold text-psg-accent" style={{ fontSize: '1.15cqw', minWidth: '1.6cqw' }}>{String(i + 1).padStart(2, '0')}</span>
                    )}
                    <div>
                      <p className="font-psg-display font-bold" style={{ fontSize: '1.2cqw', color: '#f5e6c3', lineHeight: 1.2 }}>{b.label}</p>
                      <p className="font-psg-body" style={{ fontSize: '0.92cqw', color: 'rgba(245,230,195,.58)', lineHeight: 1.35 }}>{b.ket}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <p className="mb-[1.4cqh] font-psg-body uppercase" style={{ fontSize: '0.85cqw', letterSpacing: '0.22em', color: 'rgba(212,160,23,.75)', ...masuk(go, 0.3) }}>
              Alur pendaftaran
            </p>
            <ol className="relative flex flex-1 flex-col justify-between">
              <span className="absolute bottom-[3cqh] left-[1.3cqw] top-[3cqh] w-[0.1cqw]" style={{ background: 'rgba(212,160,23,.35)' }} aria-hidden="true" />
              {P.alur.map((a, i) => (
                <li key={a} className="relative flex items-center gap-[1.2cqw]" style={masuk(go, 0.45 + i * 0.12)}>
                  <span
                    className="grid h-[2.6cqw] w-[2.6cqw] shrink-0 place-items-center font-psg-display font-bold"
                    style={{ fontSize: '1.1cqw', background: i === P.alur.length - 1 ? '#D4A017' : '#2A1408', color: i === P.alur.length - 1 ? '#1A0D06' : '#D4A017', border: '0.08cqw solid #D4A017' }}
                  >
                    {i + 1}
                  </span>
                  <p className="font-psg-body" style={{ fontSize: '1.2cqw', color: 'rgba(245,230,195,.85)', lineHeight: 1.35 }}>{a}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </PasanggiriFrame>
  );
}
