import { CalendarDays, MapPin, Music2, Users } from 'lucide-react';
import PasanggiriFrame, { base, masuk } from '../components/PasanggiriFrame';
import { PASANGGIRI as P } from '../pasanggiri';

const info = [
  { Icon: CalendarDays, label: 'Hari lomba', isi: P.tanggal },
  { Icon: Music2, label: 'Acara puncak', isi: P.acaraPuncak },
  { Icon: MapPin, label: 'Lokasi', isi: P.lokasi },
  { Icon: Users, label: 'Peserta', isi: `${P.kategori.length} kategori · ${P.totalKuota} penari` },
];

export default function SlidePasanggiri1Overview() {
  return (
    <PasanggiriFrame
      label="Road to Pasar Seni 2027"
      judul={<>Pasanggiri Jaipong <span className="pjg-emas">se-Jawa Barat</span></>}
    >
      {(go) => (
        <div className="grid h-full grid-cols-[1fr_1.35fr] gap-[3.5cqw]">
          <div className="relative overflow-hidden" style={{ ...masuk(go, 0.25, 'pop'), border: '0.08cqw solid rgba(212,160,23,.45)' }}>
            <img src={`${base}dancer-putri.webp`} alt="Penari jaipong putri" className="absolute inset-0 h-full w-full object-cover pjg-melayang" style={{ objectPosition: 'center 20%' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,13,6,.92) 0%, rgba(26,13,6,.1) 55%)' }} />
            <div className="absolute inset-x-[1.8cqw] bottom-[2.4cqh]">
              <p className="font-psg-body uppercase text-psg-accent" style={{ fontSize: '0.8cqw', letterSpacing: '0.25em' }}>Juara 1 tiap kategori</p>
              <p className="font-psg-display font-bold" style={{ fontSize: '2cqw', color: '#f5e6c3', lineHeight: 1.15 }}>
                Dinobatkan menjadi<br />Duta Pasar Seni
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <p className="font-psg-display italic text-psg-accent" style={{ fontSize: '1.7cqw', ...masuk(go, 0.3) }}>
              {P.subjudul}
            </p>
            <p className="mt-[1.4cqh] font-psg-body" style={{ fontSize: '1.3cqw', lineHeight: 1.5, color: 'rgba(245,230,195,.75)', ...masuk(go, 0.38) }}>
              Lomba tari jaipong untuk anak dan remaja yang menjadi bagian resmi Pasar Seni Garut 2026. {P.ringkas}
            </p>

            <div className="mt-[3cqh] grid grid-cols-2 gap-[1.2cqw]">
              {info.map(({ Icon, label, isi }, i) => (
                <div key={label} className="pjg-kartu flex items-start gap-[1cqw] p-[1.4cqw]" style={masuk(go, 0.45 + i * 0.08)}>
                  <Icon className="shrink-0 text-psg-accent" style={{ width: '1.8cqw', height: '1.8cqw' }} aria-hidden="true" />
                  <div>
                    <p className="font-psg-body uppercase" style={{ fontSize: '0.75cqw', letterSpacing: '0.18em', color: 'rgba(212,160,23,.7)' }}>{label}</p>
                    <p className="font-psg-display font-bold" style={{ fontSize: '1.35cqw', color: '#f5e6c3', lineHeight: 1.25 }}>{isi}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-[1.5cqw] pt-[2cqh]" style={masuk(go, 0.8)}>
              <div className="px-[1.6cqw] py-[1.2cqh]" style={{ background: 'linear-gradient(135deg, #D4A017, #f5c842)', color: '#1A0D06' }}>
                <p className="font-psg-body uppercase" style={{ fontSize: '0.75cqw', letterSpacing: '0.2em', fontWeight: 700 }}>Biaya daftar</p>
                <p className="font-psg-display font-black" style={{ fontSize: '2cqw', lineHeight: 1 }}>{P.biayaNormal}</p>
              </div>
              <p className="font-psg-body" style={{ fontSize: '1.1cqw', color: 'rgba(245,230,195,.7)', lineHeight: 1.45 }}>
                Diskon hingga {P.gelombang[0]?.diskon.replace('Diskon ', '')} di gelombang awal ·
                kuota {P.kuotaPerKategori} peserta tiap kategori · daftar di <span className="text-psg-accent">{P.halaman}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </PasanggiriFrame>
  );
}
