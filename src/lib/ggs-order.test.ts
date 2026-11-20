import { describe, it, expect } from 'vitest';
import { prepareOrder, emptyOrderFields, promoOrder, serviceOrder, type GgsOrder } from '../../scripts/ggs-hair-studio/order-message';

const today = '2026-11-20';
const fill = (order: GgsOrder, extra: Record<string, unknown> = {}) => ({ ...emptyOrderFields(order), name: 'Nana', phone: '081234567890', date: '2026-11-22', time: '14:00', ...extra });

describe('GGS order form → WhatsApp message', () => {
  it('men\'s services go to the barber number with every filled section', () => {
    const order = serviceOrder({ name: 'Dewasa (only cut)', category: 'Hair Cut', price: 35000, durationMinutes: 30, audience: 'pria' }, 'Beranda');
    const r = prepareOrder(order, fill(order, { notes: 'Model taper' }), today);
    if (!r.ok) throw new Error(r.error);
    expect(r.number).toBe('6281333359200');
    for (const part of ['*DATA PELANGGAN*', '• Nama: Nana', '• No. WhatsApp: 081234567890', '*LAYANAN*', '• Layanan: Dewasa (only cut)', '• Harga: Rp35.000', '• Durasi: 30 menit', '*JADWAL*', '• Hari/tanggal: Minggu, 22 November 2026', '• Jam: 14.00 WIB', '*CATATAN*', 'Model taper', '_Dikirim dari web GGS · Beranda_']) {
      expect(r.text).toContain(part);
    }
    expect(r.text).not.toContain('ALAMAT');
  });

  it('women\'s and Home Service requests go to GGS Beauty and need an address', () => {
    const order: GgsOrder = { kind: 'home-service', studio: 'wanita', item: 'Nail Art Panggilan', homeService: true };
    expect(prepareOrder(order, fill(order), today).ok).toBe(false);
    const r = prepareOrder(order, fill(order, { address: 'Jl. Ciledug No. 12, Garut' }), today);
    if (!r.ok) throw new Error(r.error);
    expect(r.number).toBe('6282342777723');
    expect(r.text).toContain('*ALAMAT HOME SERVICE*\nJl. Ciledug No. 12, Garut');
    expect(r.text).toContain('Home Service (datang ke rumah)');
  });

  it('a general Home Service request goes to the studio the customer picks', () => {
    const order: GgsOrder = { kind: 'home-service', studio: 'wanita', chooseStudio: true, homeService: true };
    const r = prepareOrder(order, fill(order, { studio: 'pria', item: 'Botak licin', address: 'Jl. Pembangunan 5, Garut' }), today);
    if (!r.ok) throw new Error(r.error);
    expect(r.number).toBe('6281333359200');
    expect(r.text).toContain('• Layanan: Botak licin');
  });

  it('products show quantity and estimated total without asking for a date', () => {
    const order: GgsOrder = { kind: 'produk', studio: 'wanita', item: 'Hair serum', unitPrice: 45000 };
    const r = prepareOrder(order, fill(order, { date: '', time: '', quantity: 3 }), today);
    if (!r.ok) throw new Error(r.error);
    expect(r.text).toContain('• Jumlah: 3 pcs');
    expect(r.text).toContain('• Perkiraan total: Rp135.000');
    expect(r.text).not.toContain('JADWAL');
  });

  it('promo messages carry the promo price and last day', () => {
    const order = promoOrder({ audience: 'wanita', title: 'Smoothing', label: '20%', normalPrice: 300000, promoPrice: 240000, terms: 'Rambut sebahu', end: '2026-11-30' });
    const r = prepareOrder(order, fill(order), today);
    if (!r.ok) throw new Error(r.error);
    expect(r.text).toContain('• Harga: Rp240.000 (normal Rp300.000)');
    expect(r.text).toContain('Diskon 20% · Rambut sebahu · berlaku s/d 30 November 2026');
  });

  it('rejects past dates, a missing service and a missing name', () => {
    const order: GgsOrder = { kind: 'layanan', studio: 'pria' };
    expect(prepareOrder(order, fill(order, { item: 'Keramas', date: '2026-11-19' }), today).ok).toBe(false);
    expect(prepareOrder(order, fill(order, { item: '' }), today).ok).toBe(false);
    expect(prepareOrder(order, fill(order, { item: 'Keramas', name: '' }), today).ok).toBe(false);
  });
});
