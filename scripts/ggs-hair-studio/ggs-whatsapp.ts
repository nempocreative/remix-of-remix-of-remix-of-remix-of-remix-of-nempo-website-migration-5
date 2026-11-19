// Copied into the GGS app by patch-whatsapp.mjs. Women's and general orders go to GGS Beauty; men's services to the barber.
export const GGS_WHATSAPP = '6282342777723';
// The men's barber (GGS Barber Studio) takes bookings on its own WhatsApp (0813-3335-9200, owner's poster).
export const GGS_WHATSAPP_PRIA = '6281333359200';

type Audience = { audience?: string };
/** Men's services book with the barber, everything else with GGS Beauty. */
export const whatsappFor = (service?: Audience) => (service?.audience === 'pria' ? GGS_WHATSAPP_PRIA : GGS_WHATSAPP);
const studioFor = (service?: Audience) => (service?.audience === 'pria' ? 'GGS Barber Studio' : 'GGS Beauty');

const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString('id-ID')}`;

export const ggsWhatsAppUrl = (text: string, number = GGS_WHATSAPP) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export function openGgsWhatsApp(text: string, number = GGS_WHATSAPP) {
  const url = ggsWhatsAppUrl(text, number);
  const opened = window.open(url, '_blank', 'noopener');
  if (!opened) window.location.href = url;
}

type BookableService = Audience & { name: string; price: number; durationMinutes: number; priceLabel?: string };
const serviceDetail = (service: BookableService) =>
  [service.priceLabel ?? rupiah(service.price), service.durationMinutes > 0 && `${service.durationMinutes} menit`].filter(Boolean).join(', ');

export const serviceWaText = (service: BookableService) =>
  `Halo ${studioFor(service)}, saya ingin booking layanan *${service.name}* (${serviceDetail(service)}). Kapan jadwal yang tersedia?`;

/** Opens the WhatsApp of the studio that owns this service. */
export const openServiceWhatsApp = (service: BookableService) => openGgsWhatsApp(serviceWaText(service), whatsappFor(service));

export const productWaText = (product: { name: string; price: number }) =>
  `Halo GGS Hair Studio, saya ingin memesan produk *${product.name}* (${rupiah(product.price)}). Apakah masih tersedia?`;

export const homeServiceWaText = () =>
  'Halo GGS Hair Studio, saya ingin booking *Home Service*. Alamat dan layanan yang saya inginkan: ';

export function bookingWaText(b: { name: string; service?: BookableService; date: string; time: string; notes: string }) {
  const when = b.date
    ? new Date(`${b.date}T${b.time || '00:00'}`).toLocaleString('id-ID', { dateStyle: 'full', ...(b.time ? { timeStyle: 'short' } : {}) })
    : '';
  return [
    `Halo ${b.service ? studioFor(b.service) : 'GGS Hair Studio'}, saya ingin buat janji.`,
    b.name && `Nama: ${b.name}`,
    b.service && `Layanan: ${b.service.name} (${serviceDetail(b.service)})`,
    when && `Waktu yang diinginkan: ${when}`,
    b.notes && `Catatan: ${b.notes}`,
  ].filter(Boolean).join('\n');
}

export const pricelistWaText = (category: string, name: string, price: string) =>
  `Halo GGS Hair Studio, saya ingin booking *${name}* (${category}, Rp${price}). Kapan jadwal yang tersedia?`;

export function openGgsPriaWhatsApp(text: string) {
  const url = `https://wa.me/${GGS_WHATSAPP_PRIA}?text=${encodeURIComponent(text)}`;
  const opened = window.open(url, '_blank', 'noopener');
  if (!opened) window.location.href = url;
}

export const pricelistPriaWaText = (category: string, name: string, price: string) =>
  `Halo GGS Hair Studio, saya ingin booking *${name}* (${category}, Rp${price}) dari Pricelist Pria. Kapan jadwal yang tersedia?`;
