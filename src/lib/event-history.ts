// Riwayat event di halaman Event: event selesai dari database digabung dengan
// poster acara Nempo yang sudah terlaksana (src/data/event-portfolio.ts).
import type { EventPortfolioItem } from "@/data/event-portfolio";

export interface HistoryEvent {
  key: string;
  title: string;
  category: string;
  date: string;
  dateEnd?: string;
  location: string;
  image: string;
  organizer?: string;
  organizerIg?: string;
  /** null = jumlah pengunjung tidak dicatat, jadi tidak ditampilkan. */
  visitors: number | null;
  /** Halaman detail di situs ini (event dari database). */
  href?: string;
  /** Tautan luar, misalnya postingan Instagram acara. */
  externalUrl?: string;
}

export function normalizeEventTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Hari terakhir acara sudah lewat dari `today` (YYYY-MM-DD). */
export function isPastEvent(date: string, dateEnd: string | undefined, today: string): boolean {
  const end = dateEnd && dateEnd > date ? dateEnd : date;
  return end < today;
}

export function portfolioToHistory(items: EventPortfolioItem[], today: string): HistoryEvent[] {
  return items
    .filter((item) => isPastEvent(item.startDate, item.endDate, today))
    .map((item) => ({
      key: `portfolio-${item.id}`,
      title: item.name,
      category: item.category,
      date: item.startDate,
      ...(item.endDate ? { dateEnd: item.endDate } : {}),
      location: item.location,
      image: item.thumb,
      organizer: "Nempo Garut",
      visitors: null,
      ...(item.link ? { externalUrl: item.link } : {}),
    }));
}

/**
 * Event dari database didahulukan; poster portofolio dengan judul yang sama
 * tidak dobel. Urutan: paling baru di depan.
 */
export function mergeEventHistory(fromDatabase: HistoryEvent[], fromPortfolio: HistoryEvent[]): HistoryEvent[] {
  const seen = new Set(fromDatabase.map((ev) => normalizeEventTitle(ev.title)));
  const extra = fromPortfolio.filter((ev) => !seen.has(normalizeEventTitle(ev.title)));
  return [...fromDatabase, ...extra].sort((a, b) => b.date.localeCompare(a.date));
}
