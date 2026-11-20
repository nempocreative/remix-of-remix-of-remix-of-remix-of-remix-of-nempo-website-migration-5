// Every GGS booking button opens this short form first; sending it opens the studio's WhatsApp
// with a tidy message (order-message.ts). Copied into the app by patch-order-form.mjs.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, MessageCircle, X } from 'lucide-react';
import { TEAM_GROUPS } from './team-data';
import { STUDIO, emptyOrderFields, prepareOrder, type GgsOrder, type GgsOrderFields } from './order-message';
import { openGgsWhatsApp } from './ggs-whatsapp';
import pricelistPria from './pricelist-pria.json';
import pricelistWanita from './pricelist-wanita.json';

const EVENT = 'ggs-order';
const SAVED = 'ggs-order-contact';

/** Opens the order form for what the visitor tapped. */
export function openGgsOrder(order: GgsOrder) {
  window.dispatchEvent(new CustomEvent<GgsOrder>(EVENT, { detail: order }));
}

type Section = { title: string; items: string[][] };
const suggestions = (studio: 'pria' | 'wanita') =>
  ((studio === 'pria' ? pricelistPria : pricelistWanita) as Section[]).flatMap((s) => s.items.map(([name, price]) => ({ name, price, category: s.title })));

const kindTitle = (o: GgsOrder) =>
  o.kind === 'produk' ? 'Pesan produk' : o.kind === 'promo' ? 'Booking promo' : o.homeService ? 'Booking Home Service' : 'Booking layanan';

export function GgsOrderSheet() {
  const [order, setOrder] = useState<GgsOrder | null>(null);
  const [fields, setFields] = useState<GgsOrderFields | null>(null);
  const [error, setError] = useState('');
  const firstInput = useRef<HTMLInputElement>(null);
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta' }).format(new Date());

  useEffect(() => {
    const onOrder = (event: Event) => {
      const next = (event as CustomEvent<GgsOrder>).detail;
      let saved: { name?: string; phone?: string } = {};
      try { saved = JSON.parse(localStorage.getItem(SAVED) || '{}'); } catch { /* ignore */ }
      setOrder(next);
      setFields({ ...emptyOrderFields(next), name: saved.name ?? '', phone: saved.phone ?? '' });
      setError('');
    };
    window.addEventListener(EVENT, onOrder);
    return () => window.removeEventListener(EVENT, onOrder);
  }, []);

  useEffect(() => {
    if (!order) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOrder(null); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    const t = window.setTimeout(() => firstInput.current?.focus({ preventScroll: true }), 60);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', close); window.clearTimeout(t); };
  }, [order]);

  if (!order || !fields) return null;
  const studio = order.chooseStudio ? fields.studio : order.studio;
  const s = STUDIO[studio];
  const product = order.kind === 'produk';
  const editableItem = !order.item;
  const group = TEAM_GROUPS.find((g) => g.id === studio);
  const list = editableItem ? suggestions(studio) : [];
  const typed = list.find((x) => x.name.toLowerCase() === fields.item.trim().toLowerCase());
  const effective: GgsOrder = editableItem && typed ? { ...order, category: typed.category, price: `Rp${typed.price}` } : order;
  const update = <K extends keyof GgsOrderFields>(key: K, value: GgsOrderFields[K]) => { setFields((old) => (old ? { ...old, [key]: value } : old)); setError(''); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = prepareOrder(effective, fields, today);
    if (!result.ok) { setError(result.error); return; }
    try { localStorage.setItem(SAVED, JSON.stringify({ name: fields.name.trim(), phone: fields.phone.trim() })); } catch { /* ignore */ }
    openGgsWhatsApp(result.text, result.number);
    setOrder(null);
  };

  return (
    <div className="ggs-order" data-studio={studio} onMouseDown={(e) => { if (e.target === e.currentTarget) setOrder(null); }}>
      <div className="ggs-order__sheet" role="dialog" aria-modal="true" aria-labelledby="ggs-order-title" data-testid="dialog-order">
        <div className="ggs-order__head">
          <div>
            <p className="ggs-order__kicker">{s.name.toUpperCase()} · WA {s.phone}</p>
            <h2 id="ggs-order-title">{kindTitle(order)}</h2>
          </div>
          <button type="button" className="ggs-order__close" onClick={() => setOrder(null)} aria-label="Tutup formulir"><X size={20} /></button>
        </div>
        {!editableItem && (
          <div className="ggs-order__item" data-testid="order-item">
            <strong>{order.item}</strong>
            <span>{[order.category, order.price, order.duration].filter(Boolean).join(' · ')}</span>
            {order.promo && <small>{order.promo}</small>}
          </div>
        )}
        <form onSubmit={submit} noValidate>
          {order.chooseStudio && (
            <div className="ggs-order__choice" role="radiogroup" aria-label="Pilih studio">
              {(['wanita', 'pria'] as const).map((id) => (
                <label key={id}><input type="radio" name="ggs-order-studio" checked={fields.studio === id} onChange={() => setFields((old) => (old ? { ...old, studio: id, staffId: 'any' } : old))} /><span>{id === 'pria' ? 'Cowok · Barber' : 'Cewek · Beauty'}</span></label>
              ))}
            </div>
          )}
          {editableItem && (
            <label className="ggs-order__wide">{product ? 'Produk yang dipesan' : 'Layanan yang diinginkan'}
              <input list="ggs-order-items" required maxLength={120} placeholder={studio === 'pria' ? 'Contoh: Paket GP (Ganteng Pisan)' : 'Contoh: Kuku asli motif'} value={fields.item} onChange={(e) => update('item', e.target.value)} data-testid="input-order-item" />
              <datalist id="ggs-order-items">{list.map((x) => <option key={`${x.category}-${x.name}`} value={x.name}>{`${x.category} · Rp${x.price}`}</option>)}</datalist>
              {typed && <small className="ggs-order__hint">{typed.category} · Rp{typed.price}</small>}
            </label>
          )}
          <div className="ggs-order__grid">
            <label>Nama<input ref={firstInput} required minLength={2} maxLength={80} autoComplete="name" value={fields.name} onChange={(e) => update('name', e.target.value)} data-testid="input-order-name" /></label>
            <label>No. WhatsApp<input required type="tel" inputMode="tel" maxLength={20} autoComplete="tel" placeholder="08xxxxxxxxxx" value={fields.phone} onChange={(e) => update('phone', e.target.value)} data-testid="input-order-phone" /></label>
          </div>
          {product ? (
            <div className="ggs-order__grid">
              <label>Jumlah<input type="number" min={1} max={20} value={fields.quantity} onChange={(e) => update('quantity', Math.max(1, Math.min(20, Number(e.target.value) || 1)))} data-testid="input-order-qty" /></label>
              <label>Cara terima<select value={fields.place} onChange={(e) => update('place', e.target.value as 'studio' | 'rumah')}><option value="studio">Ambil di studio</option><option value="rumah">Diantar ke alamat</option></select></label>
            </div>
          ) : (
            <>
              <div className="ggs-order__grid">
                <label>Tanggal<input required type="date" min={today} value={fields.date} onChange={(e) => update('date', e.target.value)} data-testid="input-order-date" /></label>
                <label>Jam (WIB)<input required type="time" value={fields.time} onChange={(e) => update('time', e.target.value)} data-testid="input-order-time" /></label>
              </div>
              <div className="ggs-order__grid">
                <label>Staf pilihan<select value={fields.staffId} onChange={(e) => update('staffId', e.target.value)} data-testid="select-order-staff"><option value="any">Siapa saja yang tersedia</option>{group?.members.map((m) => <option key={m.id} value={m.id}>{m.name ?? m.role} · {m.role}</option>)}</select></label>
                <label>Tempat<select value={fields.place} onChange={(e) => update('place', e.target.value as 'studio' | 'rumah')} data-testid="select-order-place"><option value="studio">Datang ke studio</option><option value="rumah">Home Service (ke rumah)</option></select></label>
              </div>
            </>
          )}
          {fields.place === 'rumah' && (
            <label className="ggs-order__wide">{product ? 'Alamat pengiriman' : 'Alamat Home Service'}<textarea required rows={2} maxLength={300} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan" value={fields.address} onChange={(e) => update('address', e.target.value)} data-testid="input-order-address" /></label>
          )}
          <label className="ggs-order__wide"><span>Catatan <span className="ggs-order__opt">(opsional)</span></span><textarea rows={2} maxLength={500} placeholder={product ? 'Varian, warna, atau pertanyaan' : 'Model, panjang rambut, warna kuku, atau kebutuhan khusus'} value={fields.notes} onChange={(e) => update('notes', e.target.value)} data-testid="input-order-notes" /></label>
          {error && <p role="alert" className="ggs-order__error">{error}</p>}
          <button type="submit" className="clearer-primary-button ggs-order__send" data-testid="button-order-send"><MessageCircle size={18} aria-hidden="true" /> Kirim ke WhatsApp {studio === 'pria' ? 'Barber' : 'Beauty'} <ArrowRight size={16} aria-hidden="true" /></button>
          <p className="ggs-order__note">Pesanan belum tersimpan sebagai reservasi. {s.name} akan membalas di WhatsApp untuk konfirmasi.</p>
        </form>
      </div>
    </div>
  );
}
