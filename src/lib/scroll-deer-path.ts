/* Jalur rusa Beranda: rusa berdiri di tepi atas tiap bagian halaman,
   lalu lompat-lompat ke bagian berikutnya saat pengunjung menggulir.
   Semua hitungan di sini murni (tanpa DOM) supaya bisa diuji. */

/** Batas mendatar (minX/maxX) dipakai bila rusa hanya boleh berdiri di
   atas bentuk sempit, misalnya bilah pencarian, bukan selebar isi halaman. */
export type DeerSpot = { x: number; y: number; minX?: number; maxX?: number };

/** Posisi mendatar bergantian kiri–kanan supaya rusa menyeberang tiap kali pindah. */
export const DEER_SPOT_FRACTIONS = [0.1, 0.86, 0.3, 0.72, 0.06, 0.92, 0.5] as const;

/** Titik tengah kaki rusa di bagian ke-`index` (koordinat dokumen). */
export function deerSpotX(index: number, left: number, width: number, deerWidth: number): number {
  const f = DEER_SPOT_FRACTIONS[Math.abs(Math.trunc(index)) % DEER_SPOT_FRACTIONS.length]!;
  return left + deerWidth / 2 + f * Math.max(0, width - deerWidth);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Tempat rusa seharusnya berada untuk garis bidik `probeY`
 * (posisi dokumen di tengah layar). Rusa diam di sebuah bagian sampai
 * bagian itu sudah naik sedikit, lalu baru menyeberang; jarak diam
 * dibatasi `viewportH` supaya titik lepas dan titik mendarat tetap kelihatan.
 */
export function deerGroundTarget(spots: DeerSpot[], probeY: number, viewportH: number): DeerSpot | null {
  if (spots.length === 0) return null;
  const first = spots[0]!;
  if (probeY <= first.y) return { ...first };
  for (let i = 0; i < spots.length - 1; i++) {
    const a = spots[i]!;
    const b = spots[i + 1]!;
    if (probeY >= b.y) continue;
    const d = b.y - a.y;
    if (d <= 0) return { ...b };
    const diam = Math.min(0.2 * d, 0.35 * viewportH);
    const u = clamp01((probeY - a.y - diam) / Math.max(1, d - 2 * diam));
    // bawa batas bagian yang paling dekat supaya rusa tidak keluar dari bentuk sempit
    const acuan = u < 0.5 ? a : b;
    return { x: a.x + (b.x - a.x) * u, y: a.y + d * u, minX: acuan.minX, maxX: acuan.maxX };
  }
  return { ...spots[spots.length - 1]! };
}

/** Mendekat halus ke target, sama cepatnya di layar 60 Hz maupun 120 Hz. */
export function approach(current: number, target: number, dt: number, rate: number): number {
  return current + (target - current) * (1 - Math.exp(-dt * rate));
}

/**
 * Fase lompatan 0..1. Selama rusa bergerak lompatan terus berulang;
 * saat berhenti, lompatan yang sedang berjalan diselesaikan dulu
 * sampai kaki menapak (fase 0), baru diam.
 */
export function hopStep(phase: number, dt: number, moving: boolean, period: number): number {
  if (phase <= 0 && !moving) return 0;
  const next = phase + dt / period;
  if (next < 1) return next;
  return moving ? next - 1 : 0;
}

export type HopPose = { lift: number; front: number; back: number; tilt: number; squash: number };

/** Pose tubuh di fase lompatan: tinggi, sudut kaki, kemiringan, dan efek mendarat. */
export function hopPose(phase: number): HopPose {
  if (phase <= 0 || phase >= 1) return { lift: 0, front: 0, back: 0, tilt: 0, squash: 0 };
  const lift = Math.sin(Math.PI * phase);
  const tilt = -10 * Math.cos(Math.PI * phase) * Math.min(1, lift * 2.5);
  const squash = phase < 0.12 ? 1 - phase / 0.12 : phase > 0.88 ? (phase - 0.88) / 0.12 : 0;
  return { lift, front: -48 * lift, back: 52 * lift, tilt, squash };
}

/**
 * Tempat rusa betina di samping rusa jantan. Ia berdiri di sisi yang
 * mengarah ke tengah isi halaman (sisi yang ada ruangnya), sehingga saat
 * menyeberang ia mengekor di belakang si jantan, lalu mendarat di dekatnya.
 */
export function partnerSpotX(leadTargetX: number, leadX: number, gap: number, minX: number, maxX: number): number {
  const center = (minX + maxX) / 2;
  const side = leadTargetX > center ? -1 : 1;
  const x = leadX + side * gap;
  return x < minX ? minX : x > maxX ? maxX : x;
}

/** Saat bermain, kedua rusa saling berhadapan: 1 = menghadap kanan, -1 = kiri. */
export function faceToward(selfX: number, otherX: number, fallback: number): number {
  if (Math.abs(otherX - selfX) < 1) return fallback;
  return otherX > selfX ? 1 : -1;
}

/**
 * Selama tepi atas bilah pencarian masih berjarak cukup dari atas layar,
 * sepasang rusa bertengger di atasnya alih-alih mengikuti bagian halaman.
 * `deerHeight` tinggi rusa supaya kepalanya tidak terpotong tepi layar.
 */
export function bolehBertengger(searchTop: number, scrollY: number, deerHeight: number): boolean {
  return searchTop >= scrollY + deerHeight;
}

/** Tepi atas sebuah bentuk tempat rusa bisa berdiri (koordinat dokumen). */
export type DeerAnchor = { top: number; left: number; width: number; cari?: boolean };

/**
 * Rapikan calon pijakan di halaman mana pun: urutkan dari atas, jepit ke
 * lebar layar (dengan `margin`), buang yang terlalu sempit untuk sepasang
 * rusa, dan gabungkan pijakan yang jaraknya kurang dari `minGap` (judul
 * di dalam bagian yang sama). Bilah pencarian selalu menang saat bentrok.
 */
export function rapikanJangkar(list: DeerAnchor[], viewportW: number, minWidth: number, minGap = 60, margin = 8): DeerAnchor[] {
  const out: DeerAnchor[] = [];
  const jepit = list
    .map((j) => {
      const left = Math.max(margin, j.left);
      const right = Math.min(viewportW - margin, j.left + j.width);
      return { ...j, left, width: right - left };
    })
    .filter((j) => j.width >= minWidth && Number.isFinite(j.top))
    .sort((a, b) => a.top - b.top);
  for (const j of jepit) {
    const prev = out[out.length - 1];
    if (!prev || j.top - prev.top > minGap) out.push(j);
    else if (j.cari && !prev.cari) out[out.length - 1] = j;
  }
  return out;
}

/** Rusa yang digeser pengunjung tetap di tempat barunya sampai halaman
   digulir lebih dari `batas` × tinggi layar dari posisi saat dilepas. */
export const BATAS_PARKIR = 0.6;

export function parkirBerlaku(parkScrollY: number, scrollY: number, viewportH: number): boolean {
  return Math.abs(scrollY - parkScrollY) <= viewportH * BATAS_PARKIR;
}

/**
 * Jepit posisi seretan (koordinat dokumen, titik kaki rusa) supaya rusa
 * tetap utuh di layar: tidak keluar kiri/kanan, kepala tidak terpotong
 * di atas, dan kaki tidak tenggelam di bawah.
 */
export function jepitSeretan(
  x: number,
  y: number,
  scrollY: number,
  viewportW: number,
  viewportH: number,
  deerW: number,
  margin = 8,
): { x: number; y: number } {
  const minX = margin + deerW / 2;
  const maxX = Math.max(minX, viewportW - margin - deerW / 2);
  const minY = scrollY + deerW * 0.8 + margin;
  const maxY = Math.max(minY, scrollY + viewportH - margin);
  return { x: Math.min(maxX, Math.max(minX, x)), y: Math.min(maxY, Math.max(minY, y)) };
}
