import { z } from 'zod';
import { TEAM_GROUPS } from './team-data';
import { bookingWaText, whatsappFor } from './ggs-whatsapp';

export const bookingRequestSchema = z.object({
  audience: z.enum(['pria', 'wanita']),
  name: z.string().trim().min(2, 'Isi nama minimal 2 huruf.').max(120).regex(/^[^\x00-\x1f<>]+$/, 'Nama tidak valid.'),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/, 'Isi nomor WhatsApp yang valid.'),
  serviceId: z.string().min(1, 'Pilih layanan.'),
  staffId: z.string().min(1, 'Pilih staf atau siapa saja.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pilih tanggal.'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Pilih jam.'),
  notes: z.string().trim().max(600).regex(/^[^\x00-\x08\x0b\x0c\x0e-\x1f<>]*$/, 'Catatan tidak valid.'),
});
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
type Service = { id: number; audience?: string; name: string; price: number; durationMinutes: number; priceLabel?: string };

export function prepareBookingRequest(input: unknown, services: Service[], today: string) {
  const result = bookingRequestSchema.safeParse(input);
  if (!result.success) return { ok: false as const, error: result.error.issues[0]?.message ?? 'Periksa isian booking.' };
  const b = result.data;
  const actualDate = new Date(`${b.date}T12:00:00Z`);
  if (Number.isNaN(actualDate.getTime()) || actualDate.toISOString().slice(0, 10) !== b.date || b.date < today) return { ok: false as const, error: 'Pilih tanggal hari ini atau setelahnya.' };
  const service = services.find((s) => String(s.id) === b.serviceId && s.audience === b.audience);
  if (!service) return { ok: false as const, error: 'Pilih layanan dari studio yang sesuai.' };
  const group = TEAM_GROUPS.find((g) => g.id === b.audience);
  const member = group?.members.find((m) => m.id === b.staffId);
  if (b.staffId !== 'any' && !member) return { ok: false as const, error: 'Pilih staf dari studio yang sesuai.' };
  const staff = member ? `${member.name ?? member.role} · ${member.role}` : 'Siapa saja yang tersedia';
  const text = bookingWaText({ name: b.name, service, date: b.date, time: b.time, notes: b.notes });
  return { ok: true as const, number: whatsappFor(service), text: `${text}\nWhatsApp pelanggan: ${b.phone}\nStaf pilihan: ${staff}\nMohon konfirmasi ketersediaan staf, jam, dan harga akhir.` };
}