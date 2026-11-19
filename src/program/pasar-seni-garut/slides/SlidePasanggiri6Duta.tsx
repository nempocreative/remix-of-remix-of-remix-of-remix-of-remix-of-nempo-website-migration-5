import PasanggiriFrame, { base, masuk } from '../components/PasanggiriFrame';
import { PASANGGIRI as P } from '../pasanggiri';

const peran = [
  'Menjadi wajah Pasar Seni Garut 2026',
  `Tampil menari di acara puncak, ${P.acaraPuncak}`,
  'Ikut mengenalkan jaipong dan budaya Sunda di kegiatan promosi Nempo',
  'Hadir bersama orang tua/pendamping di setiap kegiatan',
];

export default function SlidePasanggiri6Duta() {
  return (
    <PasanggiriFrame label="Duta Pasar Seni" judul={<>Juara 1 Menjadi <span className="pjg-emas">Duta Pasar Seni</span></>}>
      {(go) => (
        <div className="grid h-full grid-cols-[1fr_1.15fr] gap-[3cqw]">
          <div className="grid min-h-0 grid-cols-2 gap-[1.4cqw]">
            {P.selempang.map((s, i) => (
              <figure key={s.warna} className="flex min-h-0 flex-col" style={masuk(go, 0.25 + i * 0.15, 'pop')}>
                <div className="relative min-h-0 flex-1 overflow-hidden" style={{ border: '0.08cqw solid rgba(212,160,23,.5)' }}>
                  <img src={`${base}${s.foto}`} alt={`Contoh selempang Duta Pasar Seni ${s.nama.toLowerCase()} dipakai`} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 25%' }} />
                </div>
                <figcaption className="mt-[1cqh]">
                  <p className="font-psg-display font-bold" style={{ fontSize: '1.35cqw', color: '#f5e6c3' }}>{s.nama}</p>
                  <p className="font-psg-body" style={{ fontSize: '0.95cqw', color: 'rgba(212,160,23,.8)' }}>{s.untuk}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="flex min-h-0 flex-col">
            <p className="font-psg-body" style={{ fontSize: '1.25cqw', lineHeight: 1.5, color: 'rgba(245,230,195,.78)', ...masuk(go, 0.3) }}>
              Setiap kategori melahirkan satu Duta Pasar Seni. Empat duta dinobatkan dengan selempang resmi dan tampil di panggung acara puncak.
            </p>

            <div className="mt-[2cqh] grid grid-cols-4 gap-[0.8cqw]">
              {P.kategori.map((k, i) => (
                <div key={k.id} className="pjg-kartu px-[0.8cqw] py-[1.2cqh] text-center" style={masuk(go, 0.4 + i * 0.08, 'pop')}>
                  <span className="mx-auto mb-[0.8cqh] block h-[0.5cqh] w-[60%]" style={{ background: k.selempang === 'hitam' ? 'linear-gradient(90deg,#0d0806,#D4A017,#0d0806)' : 'linear-gradient(90deg,#7a1424,#D4A017,#7a1424)' }} />
                  <p className="font-psg-body uppercase" style={{ fontSize: '0.7cqw', letterSpacing: '0.16em', color: 'rgba(212,160,23,.7)' }}>Duta</p>
                  <p className="font-psg-display font-bold" style={{ fontSize: '1.4cqw', color: '#f5e6c3' }}>{k.nama}</p>
                </div>
              ))}
            </div>

            <p className="mb-[1cqh] mt-[2.4cqh] font-psg-body uppercase" style={{ fontSize: '0.85cqw', letterSpacing: '0.22em', color: 'rgba(212,160,23,.75)', ...masuk(go, 0.6) }}>
              Usulan peran duta
            </p>
            <ul className="flex flex-col gap-[1cqh]">
              {peran.map((p, i) => (
                <li key={p} className="flex items-start gap-[0.8cqw] font-psg-body" style={{ fontSize: '1.12cqw', lineHeight: 1.4, color: 'rgba(245,230,195,.82)', ...masuk(go, 0.65 + i * 0.08) }}>
                  <span className="mt-[0.9cqh] h-[0.45cqw] w-[0.45cqw] shrink-0 rounded-full bg-psg-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </PasanggiriFrame>
  );
}
