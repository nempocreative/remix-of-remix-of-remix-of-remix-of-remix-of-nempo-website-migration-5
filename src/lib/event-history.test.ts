import { describe, expect, it } from "vitest";
import { eventPortfolioItems } from "@/data/event-portfolio";
import { isPastEvent, mergeEventHistory, portfolioToHistory, type HistoryEvent } from "./event-history";

const dbEvent = (title: string, date: string): HistoryEvent => ({
  key: `db-${title}`, title, category: "Musik", date, location: "Garut", image: "", visitors: 0,
});

describe("riwayat event", () => {
  it("menampilkan semua 10 acara Nempo yang sudah terlaksana per 16 November 2026", () => {
    expect(portfolioToHistory(eventPortfolioItems, "2026-11-16")).toHaveLength(10);
  });

  it("acara yang belum lewat hari terakhirnya tidak masuk riwayat", () => {
    expect(isPastEvent("2026-06-20", "2026-06-21", "2026-06-21")).toBe(false);
    expect(isPastEvent("2026-06-20", "2026-06-21", "2026-06-22")).toBe(true);
  });

  it("MusiComedy Night dari database tidak muncul dua kali", () => {
    const merged = mergeEventHistory(
      [dbEvent("MusiComedy Night", "2026-11-04")],
      portfolioToHistory(eventPortfolioItems, "2026-11-16"),
    );
    expect(merged.filter((ev) => ev.title.toLowerCase() === "musicomedy night")).toHaveLength(1);
    expect(merged[0]?.key).toBe("db-MusiComedy Night");
    expect(merged).toHaveLength(10);
  });

  it("riwayat diurutkan dari yang paling baru", () => {
    const merged = mergeEventHistory([], portfolioToHistory(eventPortfolioItems, "2026-11-16"));
    expect(merged[0]?.title).toBe("MusiComedy Night");
    expect(merged.at(-1)?.title).toBe("Secangkir Kopi dengan Alunan Musik Tradisi di Akhir Tahun");
  });
});
