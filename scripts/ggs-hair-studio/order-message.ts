// Order form → tidy WhatsApp message for every GGS booking button (copied into the app by patch-order-form.mjs).
// Nothing is saved online: the message opens in the studio's WhatsApp and the studio confirms there.
import { z } from 'zod';
import { TEAM_GROUPS } from './team-data';

export type GgsStudio = 'pria' | 'wanita';
export type GgsOrderKind = 'layanan' | 'promo' | 'produk' | 'home-service' | 'tim';
export type GgsOrder = {
  kind: GgsOrderKind;
  studio: GgsStudio;
  /** What was tapped. Empty means the customer types the service in the form. */
  item?: string;
  category?: string;
  price?: string;
  duration?: string;
  promo?: string;
  /** Products: unit price used for the estimated total. */
  unitPrice?: number;
  staffId?: string;
  /** Home Service requests: the visit is at the customer's address. */
  homeService?: boolean;
  /** General requests (e.g. Home Service) may go to either studio. */
  chooseStudio?: boolean;
  /** Where on the site the button was, shown at the end of the message. */
  source?: string;
};

export const STUDIO = {
  pria: { name: 'GGS Barber Studio', number: '6281333359200', phone: '0813-3335-9200' },
  wanita: { name: 'GGS Beauty', number: '6282342777723', phone: '0823-4277-7723' },
} as const;

export const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString('id-ID')}`;

const safeText = (max: number) => z.string().trim().max(max).regex(/^[^\x00-\x08\x0b\x0c\x0e-\x1f<>]*$/, 'Ada karakter yang tidak diizinkan.');
export const orderFieldsSchema = z.object({
  studio: z.enum(['pria', 'wanita']),
  name: z.string().trim().min(2, 'Isi nama minimal 2 huruf.').max(80, 'Nama terlalu panjang.').regex(/^[^\x00-\x1f<>]+$/, 'Nama tidak valid.'),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/, 'Isi nomor WhatsApp yang valid.'),
  item: safeText(120),
  staffId: z.string().max(40),
  date: z.string(),
  time: z.string(),
  place: z.enum(['studio', 'rumah']),
  address: safeText(300),
  quantity: z.number().int().min(1, 'Jumlah minimal 1.').max(20, 'Jumlah maksimal 20.'),
  notes: safeText(500),
});
export type GgsOrderFields = z.infer<typeof orderFieldsSchema>;

export const emptyOrderFields = (order: GgsOrder): GgsOrderFields => ({
  studio: order.studio,
  name: '',
  phone: '',
  item: order.item ?? '',
  staffId: order.staffId ?? 'any',
  date: '',
  time: '',
  place: order.homeService ? 'rumah' : 'studio',
  address: '',
  quantity: 1,
  notes: '',
});

/** "Jumat, 20 November 2026" for a YYYY-MM-DD date, or null when the date does not exist. */
export function longDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) return null;
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

type Row = [label: string, value: string | number | false | null | undefined];
/** One WhatsApp message: bold section titles, one "• Label: value" line per filled row, empty rows and sections left out. */
export function formatOrderMessage(m: { greeting: string; sections: [title: string, rows: Row[]][]; closing: string[] }) {
  const blocks = m.sections
    .map(([title, rows]) => {
      const lines = rows
        .filter(([, v]) => v !== false && v !== null && v !== undefined && String(v).trim() !== '')
        .map(([label, v]) => (label ? `• ${label}: ${String(v).trim()}` : String(v).trim()));
      return lines.length ? `*${title}*\n${lines.join('\n')}` : '';
    })
    .filter(Boolean);
  return [m.greeting, ...blocks, m.closing.filter(Boolean).join('\n')].join('\n\n');
}

export const staffLabel = (studio: GgsStudio, staffId: string) => {
  const member = TEAM_GROUPS.find((g) => g.id === studio)?.members.find((m) => m.id === staffId);
  return member ? `${member.name ?? member.role} (${member.role})` : null;
};

export type PreparedOrder = { ok: true; number: string; text: string } | { ok: false; error: string };

export function prepareOrder(order: GgsOrder, input: GgsOrderFields, today: string): PreparedOrder {
  const parsed = orderFieldsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Periksa isian formulir.' };
  const f = parsed.data;
  const studio = order.chooseStudio ? f.studio : order.studio;
  const product = order.kind === 'produk';
  const item = (order.item ?? f.item).trim();
  if (item.length < 2) return { ok: false, error: product ? 'Tulis produk yang ingin dipesan.' : 'Tulis layanan yang diinginkan.' };
  const staff = f.staffId === 'any' ? null : staffLabel(studio, f.staffId);
  if (!product && f.staffId !== 'any' && !staff) return { ok: false, error: 'Pilih staf dari studio yang sesuai.' };
  const toHome = f.place === 'rumah';
  if (toHome && f.address.length < 10) return { ok: false, error: product ? 'Tulis alamat pengiriman lengkap.' : 'Tulis alamat lengkap untuk Home Service.' };
  let when: string | null = null;
  if (!product) {
    when = longDate(f.date);
    if (!when || f.date < today) return { ok: false, error: 'Pilih tanggal hari ini atau setelahnya.' };
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(f.time)) return { ok: false, error: 'Pilih jam kedatangan.' };
  }
  const s = STUDIO[studio];
  const sections: [string, Row[]][] = [
    ['DATA PELANGGAN', [['Nama', f.name], ['No. WhatsApp', f.phone]]],
    product
      ? ['PESANAN PRODUK', [
          ['Produk', item],
          ['Kategori', order.category],
          ['Harga satuan', order.unitPrice ? rupiah(order.unitPrice) : order.price],
          ['Jumlah', `${f.quantity} pcs`],
          ['Perkiraan total', order.unitPrice ? rupiah(order.unitPrice * f.quantity) : null],
        ]]
      : [order.kind === 'promo' ? 'PROMO' : 'LAYANAN', [
          [order.kind === 'promo' ? 'Promo' : 'Layanan', item],
          ['Kategori', order.category],
          ['Harga', order.price],
          ['Keterangan promo', order.promo],
          ['Durasi', order.duration],
          ['Staf pilihan', staff ?? 'Siapa saja yang tersedia'],
        ]],
    product
      ? ['PENGAMBILAN', [['Cara terima', toHome ? 'Diantar ke alamat' : 'Ambil di studio']]]
      : ['JADWAL', [['Hari/tanggal', when], ['Jam', `${f.time.replace(':', '.')} WIB`], ['Tempat', toHome ? 'Home Service (datang ke rumah)' : `Datang ke ${s.name}`]]],
    [product ? 'ALAMAT PENGIRIMAN' : 'ALAMAT HOME SERVICE', [['', toHome ? f.address : null]]],
    ['CATATAN', [['', f.notes]]],
  ];
  const text = formatOrderMessage({
    greeting: `Halo *${s.name}*, saya mau ${product ? 'pesan produk' : order.kind === 'promo' ? 'booking promo' : toHome ? 'booking Home Service' : 'booking'}.`,
    sections,
    closing: [
      product ? 'Mohon info ketersediaan, total, dan cara pembayarannya ya.' : 'Mohon konfirmasi ketersediaan jadwal, staf, dan harga akhirnya ya.',
      'Terima kasih.',
      order.source ? `_Dikirim dari web GGS · ${order.source}_` : '_Dikirim dari web GGS_',
    ],
  });
  return { ok: true, number: s.number, text };
}

/** Service card (home page, services pages) → order. */
export const serviceOrder = (service: { name: string; category?: string; price: number; priceLabel?: string; durationMinutes: number; audience?: string }, source = 'Layanan GGS'): GgsOrder => ({
  kind: 'layanan',
  studio: service.audience === 'pria' ? 'pria' : 'wanita',
  item: service.name,
  category: service.category,
  price: service.priceLabel ?? rupiah(service.price),
  duration: service.durationMinutes > 0 ? `${service.durationMinutes} menit` : undefined,
  source,
});

/** Discount ticket → order (promo price, normal price when known, last day). */
export const promoOrder = (d: { audience: GgsStudio; title: string; label: string; normalPrice?: number; promoPrice: number; terms: string; end: string }): GgsOrder => {
  const last = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d.end}T12:00:00Z`));
  return {
    kind: 'promo',
    studio: d.audience,
    item: d.title,
    price: d.normalPrice ? `${rupiah(d.promoPrice)} (normal ${rupiah(d.normalPrice)})` : `${rupiah(d.promoPrice)} (harga promo)`,
    promo: [/^\d+%$/.test(d.label) ? `Diskon ${d.label}` : d.label, d.terms, `berlaku s/d ${last}`].filter(Boolean).join(' · '),
    source: 'Diskon aktif',
  };
};
