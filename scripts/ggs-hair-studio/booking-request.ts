import { z } from 'zod';
import { TEAM_GROUPS } from './team-data';
import { prepareOrder, serviceOrder } from './order-message';

export const bookingRequestSchema = z.object({
  audience: z.enum(['pria', 'wanita']),
  name: z.string().trim().min(2, 'Isi nama minimal 2 huruf.').max(80).regex(/^[^\x00-\x1f<>]+$/, 'Nama tidak valid.'),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/, 'Isi nomor WhatsApp yang valid.'),
  serviceId: z.string().min(1, 'Pilih layanan.'),
  staffId: z.string().min(1, 'Pilih staf atau siapa saja.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pilih tanggal.'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Pilih jam.'),
  place: z.enum(['studio', 'rumah']).default('studio'),
  address: z.string().trim().max(300).regex(/^[^\x00-\x08\x0b\x0c\x0e-\x1f<>]*$/, 'Alamat tidak valid.').default(''),
  notes: z.string().trim().max(500).regex(/^[^\x00-\x08\x0b\x0c\x0e-\x1f<>]*$/, 'Catatan tidak valid.'),
});
export type BookingRequest = z.input<typeof bookingRequestSchema>;
type Service = { id: number; audience?: string; name: string; category?: string; price: number; durationMinutes: number; priceLabel?: string };

/** Booking page → the same tidy WhatsApp message as every other GGS order form. */
export function prepareBookingRequest(input: unknown, services: Service[], today: string) {
  const result = bookingRequestSchema.safeParse(input);
  if (!result.success) return { ok: false as const, error: result.error.issues[0]?.message ?? 'Periksa isian booking.' };
  const b = result.data;
  const service = services.find((s) => String(s.id) === b.serviceId && s.audience === b.audience);
  if (!service) return { ok: false as const, error: 'Pilih layanan dari studio yang sesuai.' };
  const group = TEAM_GROUPS.find((g) => g.id === b.audience);
  if (b.staffId !== 'any' && !group?.members.some((m) => m.id === b.staffId)) return { ok: false as const, error: 'Pilih staf dari studio yang sesuai.' };
  return prepareOrder(serviceOrder(service, 'Halaman Booking'), {
    studio: b.audience, name: b.name, phone: b.phone, item: service.name, staffId: b.staffId, date: b.date, time: b.time,
    place: b.place, address: b.address, quantity: 1, notes: b.notes,
  }, today);
}
