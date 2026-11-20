import { useState, type FormEvent } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { TEAM_GROUPS } from './team-data';
import { prepareBookingRequest, type BookingRequest } from './booking-request';
import { openGgsWhatsApp } from './ggs-whatsapp';

type Service = { id: number; audience?: string; name: string; price: number; priceLabel?: string; durationMinutes: number };
export function GgsBookingForm({ services, loading, initialServiceId, selectedHairStyle }: { services: Service[]; loading: boolean; initialServiceId: string; selectedHairStyle: string | null }) {
  const [fields, setFields] = useState<BookingRequest>(() => {
    const params = new URLSearchParams(window.location.search);
    const service = services.find((s) => String(s.id) === initialServiceId);
    const audience = params.get('studio') === 'pria' || service?.audience === 'pria' ? 'pria' : 'wanita';
    const model = params.get('model')?.slice(0, 100) || selectedHairStyle;
    return { audience, name: '', phone: '', serviceId: initialServiceId, staffId: 'any', date: '', time: '', place: 'studio', address: '', notes: model ? `Model rambut: ${model}` : '' };
  });
  const [error, setError] = useState('');
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const group = TEAM_GROUPS.find((g) => g.id === fields.audience);
  const studioServices = services.filter((s) => s.audience === fields.audience);
  const service = studioServices.find((s) => String(s.id) === fields.serviceId);
  const staff = group?.members.find((m) => m.id === fields.staffId);
  const update = (key: keyof BookingRequest, value: string) => { setFields((old) => ({ ...old, [key]: value })); setError(''); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = prepareBookingRequest(fields, services, today);
    if (!result.ok) { setError(result.error); return; }
    openGgsWhatsApp(result.text, result.number);
  };
  return <div className="ggs-booking" data-studio={fields.audience}>
    <div className="ggs-booking-studios" role="radiogroup" aria-label="Pilih studio">
      {TEAM_GROUPS.map((g) => <label key={g.id}><input type="radio" name="studio" checked={fields.audience === g.id} onChange={() => { setFields((old) => ({ ...old, audience: g.id, serviceId: '', staffId: 'any' })); setError(''); }} /><span><strong>{g.id === 'pria' ? 'Cowok · Barber' : 'Cewek · Beauty'}</strong><small>{g.id === 'pria' ? '0813-3335-9200' : '0823-4277-7723'}</small></span></label>)}
    </div>
    <form onSubmit={submit} className="ggs-booking-layout clearer-form" data-testid="form-appointment">
      <div>
        <fieldset><legend>01 / Data pelanggan</legend><div className="clearer-form-grid">
          <label>Nama pelanggan<input required minLength={2} maxLength={120} autoComplete="name" value={fields.name} onChange={(e) => update('name', e.target.value)} /></label>
          <label>Nomor WhatsApp<input required type="tel" minLength={8} maxLength={20} autoComplete="tel" placeholder="08xxxxxxxxxx" value={fields.phone} onChange={(e) => update('phone', e.target.value)} /></label>
        </div></fieldset>
        <fieldset><legend>02 / Layanan &amp; staf</legend><div className="clearer-form-grid">
          <label className="clearer-form-wide">Layanan {fields.audience === 'pria' ? 'cowok' : 'cewek'}<select aria-label={fields.audience === 'pria' ? 'Layanan cowok' : 'Layanan cewek'} required disabled={loading || !studioServices.length} value={fields.serviceId} onChange={(e) => update('serviceId', e.target.value)}><option value="">{loading ? 'Memuat layanan…' : 'Pilih layanan'}</option>{studioServices.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.priceLabel ?? `Rp${s.price.toLocaleString('id-ID')}`}</option>)}</select></label>
          <label className="clearer-form-wide">Staf pilihan<select aria-label="Staf pilihan" value={fields.staffId} onChange={(e) => update('staffId', e.target.value)}><option value="any">Siapa saja yang tersedia</option>{group?.members.map((m) => <option key={m.id} value={m.id}>{m.name ?? m.role} · {m.role}</option>)}</select></label>
        </div>{staff && <div className="ggs-booking-staff"><img src={`${import.meta.env.BASE_URL}${staff.image.replace(/^\//, '')}`} alt={staff.name ?? staff.role} /><div><strong>{staff.name}</strong><p>{staff.role}</p></div></div>}</fieldset>
        <fieldset><legend>03 / Jadwal &amp; detail</legend><div className="clearer-form-grid">
          <label>Tanggal kunjungan<input required type="date" min={today} value={fields.date} onChange={(e) => update('date', e.target.value)} /></label>
          <label>Jam kunjungan (WIB)<input required type="time" value={fields.time} onChange={(e) => update('time', e.target.value)} /></label>
          <label className="clearer-form-wide">Tempat<select aria-label="Tempat" value={fields.place} onChange={(e) => update('place', e.target.value)}><option value="studio">Datang ke studio</option><option value="rumah">Home Service (ke rumah)</option></select></label>
          {fields.place === 'rumah' && <label className="clearer-form-wide">Alamat Home Service<textarea required maxLength={300} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan" value={fields.address} onChange={(e) => update('address', e.target.value)} /></label>}
          <label className="clearer-form-wide">Catatan / model rambut (opsional)<textarea maxLength={500} placeholder="Model rambut, panjang rambut, atau kebutuhan khusus." value={fields.notes} onChange={(e) => update('notes', e.target.value)} /></label>
        </div></fieldset>
      </div>
      <aside className="ggs-booking-summary"><h2>Rincian booking</h2><dl>
        <div><dt>Studio tujuan</dt><dd>{group?.studio}</dd></div>
        <div><dt>Layanan</dt><dd>{service?.name ?? 'Belum dipilih'}</dd></div>
        <div><dt>Harga layanan</dt><dd>{service ? service.priceLabel ?? `Rp${service.price.toLocaleString('id-ID')}` : '—'}</dd></div>
        {service && service.durationMinutes > 0 && <div><dt>Durasi layanan</dt><dd>{service.durationMinutes} menit</dd></div>}
        <div><dt>Staf pilihan</dt><dd>{staff?.name ?? 'Siapa saja yang tersedia'}</dd></div>
        <div><dt>Tempat</dt><dd>{fields.place === 'rumah' ? 'Home Service (ke rumah)' : 'Datang ke studio'}</dd></div>
        <div><dt>Jadwal (WIB)</dt><dd>{fields.date || 'Tanggal belum dipilih'} · {fields.time || 'Jam belum dipilih'}</dd></div>
      </dl><p>Jadwal dan staf belum dipesan. Kirim pesan di WhatsApp, lalu tunggu konfirmasi dari {group?.studio}.</p>
        {error && <p role="alert" className="clearer-error">{error}</p>}
        <button type="submit" className="clearer-primary-button" disabled={loading || !studioServices.length}><MessageCircle size={18} /> Lanjut ke WhatsApp {fields.audience === 'pria' ? 'Barber' : 'Beauty'} <ArrowRight size={16} /></button>
      </aside>
    </form>
  </div>;
}