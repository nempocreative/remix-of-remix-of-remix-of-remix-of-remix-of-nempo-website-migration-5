import { describe, expect, it } from 'vitest';
import { resolveLoginEmail } from './admin-login';

describe('resolveLoginEmail', () => {
  it('maps the ID adminnempo to the admin email', () => {
    expect(resolveLoginEmail('adminnempo')).toBe('nempogarut@gmail.com');
  });
  it('accepts the ID with stray spaces and capitals', () => {
    expect(resolveLoginEmail('  AdminNempo ')).toBe('nempogarut@gmail.com');
  });
  it('keeps a typed email as the email', () => {
    expect(resolveLoginEmail('nempogarut@gmail.com')).toBe('nempogarut@gmail.com');
  });
  it('does not turn an unknown ID into an admin email', () => {
    expect(resolveLoginEmail('adminlain')).toBe('adminlain');
  });
});
