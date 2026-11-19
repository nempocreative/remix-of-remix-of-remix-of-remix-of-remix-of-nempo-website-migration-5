// Kapan animasi logo + tanduk tampil saat pindah halaman. Aman untuk browser dan diuji.
export const TRANSITION_SHOW_MS = 1100;
export const TRANSITION_FADE_MS = 350;

/** Halaman yang bukan bagian situs utama (CMS, Garut Beans, cadangan, API) tidak ikut. */
const DI_LUAR_SITUS = /^\/(admin|cms|garut-beans|backup|api)(\/|$)/;

/** Beranda punya layar pembuka sendiri, jadi transisi tidak ditumpuk di sana. */
export function shouldShowTransition(from: string, to: string): boolean {
  if (from === to) return false;
  if (to === "/" || to === "") return false;
  if (DI_LUAR_SITUS.test(from) || DI_LUAR_SITUS.test(to)) return false;
  return true;
}
