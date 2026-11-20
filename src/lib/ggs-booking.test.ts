import { describe, it, expect } from 'vitest';
import { prepareBookingRequest } from '../../scripts/ggs-hair-studio/booking-request';
import { TEAM_GROUPS } from '../../scripts/ggs-hair-studio/team-data';
const services = [{ id: 1, audience: 'pria', name: 'Potong rambut', price: 35000, durationMinutes: 0 }, { id: 2, audience: 'wanita', name: 'Cuci blow', price: 50000, durationMinutes: 0 }];
const booking = { audience: 'pria', name: 'Nana', phone: '081234567890', serviceId: '1', staffId: 'any', date: '2026-11-22', time: '13:30', notes: 'Model taper' };
describe('GGS detailed booking', () => {
  it('sends men to the barber and includes customer phone, time and staff', () => {
    const staff = TEAM_GROUPS.find((g) => g.id === 'pria')?.members[0];
    const result = prepareBookingRequest({ ...booking, staffId: staff?.id }, services, '2026-11-19');
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.number).toBe('6281333359200');
    expect(result.text).toContain('081234567890');
    expect(result.text).toContain('13.30');
    expect(result.text).toContain(`Staf pilihan: ${staff?.name} (Barberman)`);
  });
  it('sends women to GGS Beauty', () => {
    const result = prepareBookingRequest({ ...booking, audience: 'wanita', serviceId: '2' }, services, '2026-11-19');
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.number).toBe('6282342777723');
    expect(result.text).toContain('GGS Beauty');
  });
  it('rejects a service from the other studio', () => {
    expect(prepareBookingRequest({ ...booking, serviceId: '2' }, services, '2026-11-19').ok).toBe(false);
  });
  it('rejects a staff member from the other studio', () => {
    const staffId = TEAM_GROUPS.find((g) => g.id === 'wanita')?.members[0]?.id;
    expect(prepareBookingRequest({ ...booking, staffId }, services, '2026-11-19').ok).toBe(false);
  });
  it('rejects past and nonexistent dates', () => {
    expect(prepareBookingRequest({ ...booking, date: '2026-11-18' }, services, '2026-11-19').ok).toBe(false);
    expect(prepareBookingRequest({ ...booking, date: '2026-11-31' }, services, '2026-11-19').ok).toBe(false);
  });
  it('rejects malformed contact, time and oversized notes', () => {
    expect(prepareBookingRequest({ ...booking, phone: '<script>' }, services, '2026-11-19').ok).toBe(false);
    expect(prepareBookingRequest({ ...booking, time: '25:00' }, services, '2026-11-19').ok).toBe(false);
    expect(prepareBookingRequest({ ...booking, notes: 'a'.repeat(601) }, services, '2026-11-19').ok).toBe(false);
  });
});