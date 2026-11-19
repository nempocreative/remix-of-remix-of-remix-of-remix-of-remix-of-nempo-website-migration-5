/** Admin IDs that may be typed instead of an email on the CMS login. Each maps to the real account email. */
export const ADMIN_ID_ALIASES: Record<string, string> = {
  adminnempo: 'nempogarut@gmail.com',
};

/** Turns what the officer typed (email or admin ID) into the email used to sign in. */
export function resolveLoginEmail(input: string): string {
  const value = input.trim().toLowerCase();
  return ADMIN_ID_ALIASES[value] ?? value;
}
