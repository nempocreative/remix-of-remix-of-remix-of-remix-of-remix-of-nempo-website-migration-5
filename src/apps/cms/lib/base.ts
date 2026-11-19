/**
 * Alamat ruang kerja admin.
 *
 * `/admin` adalah alamat kanonik — inilah yang dipakai di domain sendiri,
 * mis. www.nempogrut.com/admin. `/cms` tetap berfungsi sebagai alamat lama.
 */
export const CMS_BASES = ["/admin", "/cms"] as const;

/** Base path of the back-office, taken from the address in the browser. */
export function cmsBase(
  pathname: string = typeof window === "undefined" ? "" : window.location.pathname,
): string {
  const first = pathname.split("/")[1]?.toLowerCase();
  return first === "cms" ? "/cms" : "/admin";
}
