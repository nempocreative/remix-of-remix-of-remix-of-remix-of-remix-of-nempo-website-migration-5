import { describe, expect, it } from "vitest";
import {
  formatEventDateLabel,
  makeEventSlug,
  posterFileFromUrl,
  posterUrl,
  rowsToPortfolio,
  withBuiltinEvents,
  type PortfolioEventRow,
} from "@/lib/portfolio-events";
import { builtinPosters, eventPortfolioItems } from "@/data/event-portfolio";

const row = (over: Partial<PortfolioEventRow>): PortfolioEventRow => ({
  id: 1, slug: "a", name: "A", location: "Biang", start_date: "2026-01-01", end_date: null,
  badge: "", category: "Musik", image_url: null, thumb_url: null, builtin_poster: null, link: null, active: true,
  ...over,
});

describe("acara portofolio dari admin", () => {
  it("menulis tanggal satu hari, beberapa hari, dan lintas bulan/tahun", () => {
    expect(formatEventDateLabel("2025-12-31")).toBe("31 Desember 2025");
    expect(formatEventDateLabel("2026-06-20", "2026-06-21")).toBe("20–21 Juni 2026");
    expect(formatEventDateLabel("2026-06-30", "2026-07-02")).toBe("30 Juni – 2 Juli 2026");
    expect(formatEventDateLabel("2025-12-30", "2026-01-01")).toBe("30 Desember 2025 – 1 Januari 2026");
  });

  it("acara yang disembunyikan admin tidak tampil", () => {
    const items = rowsToPortfolio(
      [row({ slug: "x", builtin_poster: "temu-tarung-2026" }), row({ slug: "y", builtin_poster: "lalana-pagi-2026", active: false })],
      builtinPosters,
    );
    expect(items.map((i) => i.id)).toEqual(["x"]);
  });

  it("poster unggahan admin menggantikan poster bawaan", () => {
    const [item] = rowsToPortfolio(
      [row({ builtin_poster: "temu-tarung-2026", image_url: posterUrl("baru.webp"), thumb_url: posterUrl("baru-thumb.webp") })],
      builtinPosters,
    );
    expect(item!.image).toBe("/api/public/event-poster/baru.webp");
    expect(item!.thumb).toBe("/api/public/event-poster/baru-thumb.webp");
  });

  it("acara tanpa poster tidak tampil, dan urutan dari yang paling lama", () => {
    const items = rowsToPortfolio(
      [
        row({ slug: "baru", start_date: "2026-05-01", image_url: posterUrl("b.webp") }),
        row({ slug: "lama", start_date: "2025-05-01", image_url: posterUrl("a.webp") }),
        row({ slug: "kosong" }),
      ],
      builtinPosters,
    );
    expect(items.map((i) => i.id)).toEqual(["lama", "baru"]);
  });

  it("membuat slug dari nama dan tahun", () => {
    expect(makeEventSlug("Temu Tarung!", "2026-06-20")).toBe("temu-tarung-2026");
    expect(makeEventSlug("   ", "2026-01-01")).toBe("acara-2026");
  });

  it("hanya menerima nama file poster yang aman", () => {
    expect(posterFileFromUrl("/api/public/event-poster/abc-123.webp")).toBe("abc-123.webp");
    expect(posterFileFromUrl("/api/public/event-poster/../rahasia.webp")).toBeNull();
    expect(posterFileFromUrl("https://contoh.com/a.webp")).toBeNull();
  });
});

describe("riwayat acara bawaan tidak hilang", () => {
  it("database kosong tetap menampilkan semua acara bawaan", () => {
    const items = withBuiltinEvents([], [], [], eventPortfolioItems);
    expect(items).toHaveLength(eventPortfolioItems.length);
    expect(items.map((i) => i.id)).toContain("temu-tarung-2026");
  });

  it("baris database menggantikan acara bawaan yang sama, tanpa dobel", () => {
    const rows = [row({ slug: "temu-tarung-2026", name: "Temu Tarung (DB)", start_date: "2026-06-20", builtin_poster: "temu-tarung-2026" })];
    const items = withBuiltinEvents(rowsToPortfolio(rows, builtinPosters), rows, [], eventPortfolioItems);
    expect(items.filter((i) => i.id === "temu-tarung-2026").map((i) => i.name)).toEqual(["Temu Tarung (DB)"]);
    expect(items).toHaveLength(eventPortfolioItems.length);
  });

  it("acara bawaan yang disembunyikan admin tidak muncul lagi", () => {
    const items = withBuiltinEvents([], [], ["lalana-pagi-2026"], eventPortfolioItems);
    expect(items.map((i) => i.id)).not.toContain("lalana-pagi-2026");
    expect(items).toHaveLength(eventPortfolioItems.length - 1);
  });
});
