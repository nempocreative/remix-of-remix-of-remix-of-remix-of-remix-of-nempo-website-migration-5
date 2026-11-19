import PasanggiriFrame, { base, masuk } from '../components/PasanggiriFrame';
import { PASANGGIRI as P } from '../pasanggiri';

export default function SlidePasanggiri5Hadiah() {
  return (
    <PasanggiriFrame label="Penghargaan" judul={<>Hadiah <span className="pjg-emas">Tiap Kategori</span></>}>
      {(go) => (
        <div className="flex h-full flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-4 gap-[1.6cqw]">
            {P.hadiah.map((h, i) => {
              const utama = i === 0;
              return (
                <div
                  key={h.peringkat}
                  className="pjg-kartu flex min-h-0 flex-col items-center overflow-hidden px-[1.2cqw] pb-[1.4cqh] pt-[1cqh]"
                  style={{ ...masuk(go, 0.25 + i * 0.1, 'pop'), ...(utama ? { borderColor: 'rgba(212,160,23,.7)', background: 'linear-gradient(160deg, rgba(212,160,23,.2), #1A0D06 70%)' } : {}) }}
                >
                  <div className="relative min-h-0 w-full flex-1">
                    <img
                      src={`${base}${h.foto}`}
                      alt={`Piala ${h.peringkat} Pasanggiri Jaipong`}
                      className="absolute inset-0 h-full w-full object-contain pjg-melayang"
                      style={{ animationDelay: `${i * 0.6}s`, filter: 'drop-shadow(0 1.2cqh 1.4cqw rgba(0,0,0,.5))' }}
                    />
                  </div>
                  <p className={`mt-[0.8cqh] font-psg-display font-black ${utama ? 'pjg-emas' : ''}`} style={{ fontSize: '1.8cqw', lineHeight: 1.1, color: '#f5e6c3' }}>
                    {h.peringkat}
                  </p>
                  <ul className="mt-[0.8cqh] flex flex-wrap justify-center gap-[0.4cqw]">
                    {h.isi.map((x) => (
                      <li
                        key={x}
                        className="px-[0.6cqw] py-[0.3cqh] font-psg-body"
                        style={{ fontSize: '0.82cqw', lineHeight: 1.3, color: 'rgba(245,230,195,.82)', border: '0.05cqw solid rgba(212,160,23,.35)', background: 'rgba(26,13,6,.6)' }}
                      >
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div
            className="mt-[2cqh] flex items-center justify-center gap-[1.5cqw] py-[1.3cqh]"
            style={{ ...masuk(go, 0.85), background: 'linear-gradient(90deg, transparent, rgba(212,160,23,.18), transparent)', borderTop: '0.05cqw solid rgba(212,160,23,.35)', borderBottom: '0.05cqw solid rgba(212,160,23,.35)' }}
          >
            <p className="font-psg-display font-bold text-psg-accent" style={{ fontSize: '1.5cqw' }}>Semua peserta</p>
            <p className="font-psg-body" style={{ fontSize: '1.25cqw', color: 'rgba(245,230,195,.85)' }}>
              mendapat {P.hadiahSemua.join(' & ').toLowerCase()} — tanpa terkecuali
            </p>
          </div>
        </div>
      )}
    </PasanggiriFrame>
  );
}
