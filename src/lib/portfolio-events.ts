// Acara Nempo yang dikelola admin (/cms/acara) dan tampil di Beranda,
// Riwayat Event, dan Portofolio. Fungsi di sini aman untuk browser dan diuji.
import type { EventPortfolioItem } from "@/data/event-portfolio";

export interface PortfolioEventRow {
  id: number;
  slug: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string | null;
  badge: string;
  category: string;
  image_url: string | null;
  thumb_url: string | null;
  builtin_poster: string | null;
  link: string | null;
  active: boolean;
}

export const PORTFOLIO_EVENT_COLUMNS =
  "id, slug, name, location, start_date, end_date, badge, category, image_url, thumb_url, builtin_poster, link, active";

export const PORTFOLIO_CATEGORIES = ["Musik", "Budaya", "Olahraga", "Perlombaan", "Edukasi", "Kuliner", "Opening", "Lainnya"];

export const POSTER_BUCKET = "event-posters";
const POSTER_PATH = /^[a-z0-9-]+\.(webp|jpe?g|png)$/;

/** Alamat poster yang diunggah admin, dilayani oleh situs ini sendiri. */
export function posterUrl(fileName: string): string {
  return `/api/public/event-poster/${fileName}`;
}
export function isPosterFileName(fileName: string): boolean {
  return POSTER_PATH.test(fileName);
}
/** Nama file di penyimpanan dari alamat poster, atau null kalau bukan unggahan admin. */
export function posterFileFromUrl(url: string | null | undefined): string | null {
  const prefix = "/api/public/event-poster/";
  if (!url || !url.startsWith(prefix)) return null;
  const name = url.slice(prefix.length);
  return isPosterFileName(name) ? name : null;
}

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y: y!, m: m!, d: d! };
}

/** "31 Desember 2025", "20–21 Juni 2026", "30 Juni – 2 Juli 2026". */
export function formatEventDateLabel(start: string, end?: string | null): string {
  const a = parts(start);
  if (!end || end <= start) return `${a.d} ${MONTHS[a.m - 1]} ${a.y}`;
  const b = parts(end);
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m - 1]} ${a.y}`;
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m - 1]} – ${b.d} ${MONTHS[b.m - 1]} ${a.y}`;
  return `${a.d} ${MONTHS[a.m - 1]} ${a.y} – ${b.d} ${MONTHS[b.m - 1]} ${b.y}`;
}

/** Slug dari nama + tahun acara, misalnya "temu-tarung-2026". */
export function makeEventSlug(name: string, startDate: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  const year = startDate.slice(0, 4);
  return [base || "acara", /^\d{4}$/.test(year) ? year : ""].filter(Boolean).join("-");
}

type Builtins = Record<string, Pick<EventPortfolioItem, "image" | "thumb">>;

/** Baris database -> item portofolio. Null kalau tidak punya poster. */
export function rowToPortfolioItem(row: PortfolioEventRow, builtins: Builtins): EventPortfolioItem | null {
  const builtin = row.builtin_poster ? builtins[row.builtin_poster] : undefined;
  const image = row.image_url || builtin?.image;
  if (!image) return null;
  const thumb = row.thumb_url || (row.image_url ? row.image_url : builtin?.thumb) || image;
  return {
    id: row.slug,
    name: row.name,
    image,
    thumb,
    location: row.location,
    date: formatEventDateLabel(row.start_date, row.end_date),
    badge: row.badge || row.category,
    startDate: row.start_date,
    ...(row.end_date && row.end_date > row.start_date ? { endDate: row.end_date } : {}),
    category: row.category,
    ...(row.link ? { link: row.link } : {}),
  };
}

/** Hanya acara yang ditampilkan, urut dari yang paling lama. */
export function rowsToPortfolio(rows: PortfolioEventRow[], builtins: Builtins): EventPortfolioItem[] {
  return rows
    .filter((r) => r.active)
    .map((r) => rowToPortfolioItem(r, builtins))
    .filter((x): x is EventPortfolioItem => x !== null)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name));
}

/**
 * Acara bawaan (src/data/event-portfolio.ts) selalu ikut tampil, kecuali
 * database sudah punya baris untuk acara itu (aktif = versi database dipakai,
 * disembunyikan admin = tidak tampil). Jadi riwayat tidak pernah kosong walau
 * database baru masih kosong.
 */
export function withBuiltinEvents(
  dbItems: EventPortfolioItem[],
  rows: Pick<PortfolioEventRow, "slug" | "builtin_poster">[],
  hiddenKeys: string[],
  builtins: EventPortfolioItem[],
): EventPortfolioItem[] {
  const covered = new Set<string>(hiddenKeys);
  for (const r of rows) {
    covered.add(r.slug);
    if (r.builtin_poster) covered.add(r.builtin_poster);
  }
  const extra = builtins.filter((b) => !covered.has(b.id));
  return [...dbItems, ...extra].sort(
    (a, b) => a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name),
  );
}
