import PasanggiriFrame, { masuk } from '../components/PasanggiriFrame';
import { PASANGGIRI as P } from '../pasanggiri';

export default function SlidePasanggiri3Biaya() {
  return (
    <PasanggiriFrame label="Pendaftaran" judul={<>Gelombang & <span className="pjg-emas">Biaya Pendaftaran</span></>}>
      {(go) => (
        <div className="flex h-full flex-col">
          <div className="grid flex-1 grid-cols-3 gap-[2cqw]">
            {P.gelombang.map((g, i) => {
              const awal = i === 0;
              return (
                <div
                  key={g.ke}
                  className="pjg-kartu relative flex flex-col overflow-hidden p-[2.2cqw]"
                  style={{
                    ...masuk(go, 0.25 + i * 0.12, 'pop'),
                    ...(awal ? { background: 'linear-gradient(135deg, rgba(212,160,23,.22), rgba(212,160,23,.06))', borderColor: 'rgba(212,160,23,.65)' } : {}),
                  }}
                >
                  <p className="absolute right-[1.2cqw] top-[0.5cqh] font-psg-display font-black" style={{ fontSize: '7cqw', color: 'rgba(212,160,23,.1)', lineHeight: 1 }}>{g.ke}</p>
                  <p className="font-psg-body uppercase" style={{ fontSize: '0.85cqw', letterSpacing: '0.22em', color: 'rgba(212,160,23,.8)' }}>Gelombang {g.ke}</p>
                  <p className="mt-[1cqh] font-psg-display font-bold" style={{ fontSize: '1.9cqw', color: '#f5e6c3', lineHeight: 1.2 }}>{g.rentang}</p>
                  <span
                    className="mt-[1.6cqh] w-fit px-[1cqw] py-[0.5cqh] font-psg-body font-bold uppercase"
                    style={{
                      fontSize: '0.85cqw', letterSpacing: '0.15em',
                      background: g.coret ? '#D4A017' : 'transparent', color: g.coret ? '#1A0D06' : 'rgba(245,230,195,.7)',
                      border: '0.06cqw solid rgba(212,160,23,.6)',
                    }}
                  >
                    {g.diskon}
                  </span>
                  <div className="mt-auto">
                    {g.coret && (
                      <p className="font-psg-body line-through" style={{ fontSize: '1.2cqw', color: 'rgba(245,230,195,.4)' }}>{g.coret}</p>
                    )}
                    <p className={`font-psg-display font-black ${awal ? 'pjg-emas' : ''}`} style={{ fontSize: '3.8cqw', lineHeight: 1, color: '#f5e6c3' }}>{g.biaya}</p>
                    <p className="mt-[0.6cqh] font-psg-body" style={{ fontSize: '0.95cqw', color: 'rgba(245,230,195,.5)' }}>per peserta</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-[2.4cqh] grid grid-cols-3 gap-[2cqw]" style={masuk(go, 0.75)}>
            {[
              `Harga normal ${P.biayaNormal} per peserta`,
              'Biaya mengikuti gelombang pada hari formulir dikirim',
              'Pembayaran lewat WhatsApp resmi Nempo setelah daftar',
            ].map((t) => (
              <p key={t} className="flex items-start gap-[0.7cqw] font-psg-body" style={{ fontSize: '1.05cqw', color: 'rgba(245,230,195,.7)', lineHeight: 1.4 }}>
                <span className="mt-[0.9cqh] h-[0.45cqw] w-[0.45cqw] shrink-0 rounded-full bg-psg-accent" />
                {t}
              </p>
            ))}
          </div>
        </div>
      )}
    </PasanggiriFrame>
  );
}
