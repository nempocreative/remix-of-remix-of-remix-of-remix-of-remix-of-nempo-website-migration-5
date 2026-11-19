import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM_NEMPO } from "@/data/program";
import {
  HARI_ACARA,
  HARI_PERSIAPAN,
  RUNDOWN_PERSIAPAN,
  KADENSI,
  RUNDOWN_HARI_2,
  RUNDOWN_HARI_3_MALAM,
  RUNDOWN_HARI_3_PAGI,
  TANGGAL_ACARA,
  durasi,
  menitDurasi,
} from "./jadwal";

const kegiatan = (rows: { activity: string }[]) => rows.map((r) => r.activity).join(" | ");

describe("Pasar Seni Garut 2026 schedule", () => {
  // Owner rule: 29 December is preparation only (tenant registration, technical meeting), not part of the event.
  it("29 December is a preparation day with the Pasanggiri technical meeting, not an event day", () => {
    expect(HARI_PERSIAPAN).toBe("Selasa, 29 Desember 2026");
    expect(Object.values(HARI_ACARA)).not.toContain(HARI_PERSIAPAN);
    expect(RUNDOWN_PERSIAPAN.find((r) => r.activity === "Technical Meeting Pasanggiri")?.time).toBe("09.00 – 12.00");
    expect(RUNDOWN_PERSIAPAN.some((r) => /Band|Opening|Pasanggiri Jaipong/.test(r.activity))).toBe(false);
  });

  // Owner rule: the event itself runs only 30 and 31 December 2026.
  it("runs 30–31 December 2026", () => {
    expect(TANGGAL_ACARA).toBe("30–31 Desember 2026");
    expect(HARI_ACARA).toEqual({
      pasanggiri: "Rabu, 30 Desember 2026",
      puncak: "Kamis, 31 Desember 2026",
    });
  });

  // Owner rule: the activity is a monthly routine, not a once-a-year event.
  it("is a monthly routine activity, not an annual one", () => {
    expect(KADENSI).toBe("Rutin setiap bulan");

    const dir = resolve(process.cwd(), "src/program/pasar-seni-garut");
    const files = [
      "deck.tsx",
      "manifest.json",
      ...readdirSync(resolve(dir, "slides")).map((f) => `slides/${f}`),
    ];
    for (const file of files) {
      expect(readFileSync(resolve(dir, file), "utf8")).not.toMatch(
        /event\s+tahunan|program\s+tahunan|festival\s+tahunan|ikon\s+tahunan/i,
      );
    }

    const kartu = PROGRAM_NEMPO.find((p) => p.slug === "pasar-seni-garut");
    expect(kartu?.ringkas).toMatch(/rutin digelar setiap bulan/i);
    expect(kartu?.sorotan).toContain("Rutin setiap bulan");
  });

  // Owner rule: rundown rows show their duration in minutes.
  it("formats row durations", () => {
    expect(durasi("08.00 – 09.00")).toBe("60 menit");
    expect(durasi("09.00 – 12.00")).toBe("180 menit");
    expect(durasi("13.00 – 13.45")).toBe("45 menit");
    expect(durasi("15.45 – 17.00")).toBe("75 menit");
    expect(durasi("09.00")).toBe("—");
    expect(menitDurasi("21.50 – 22.00")).toBe(10);
  });

  it("every ranged row in every rundown has a positive duration", () => {
    for (const rows of [RUNDOWN_PERSIAPAN, RUNDOWN_HARI_2, RUNDOWN_HARI_3_PAGI, RUNDOWN_HARI_3_MALAM]) {
      for (const r of rows) {
        const m = menitDurasi(r.time);
        if (m !== null) expect(m, r.time).toBeGreaterThan(0);
      }
    }
  });

  it("day 2 holds the Pasanggiri for all four categories and crowns the Duta", () => {
    const k = kegiatan(RUNDOWN_HARI_2);
    for (const c of ["TK", "SD 1–3", "SD 4–6", "SMP–SMA"]) expect(k).toContain(c);
    expect(k).toContain("Penobatan Duta Pasar Seni");
  });

  it("day 3 morning carries the owner's programme: talkshow, tari, gondang, games, dongeng, puisi, ketuk tilu, musik etnik", () => {
    const k = kegiatan(RUNDOWN_HARI_3_PAGI);
    for (const item of [
      "Talkshow UMKM",
      "Penampilan Gondang Babakan Loa",
      "Games Sunda",
      "Penampilan Dongeng Sunda",
      "Puisi Garut",
      "Ketuk Tilu Klagar",
      "Musik Etnik",
    ]) {
      expect(k).toContain(item);
    }
    expect(RUNDOWN_HARI_3_PAGI.filter((r) => r.activity === "Penampilan Tari")).toHaveLength(2);
  });

  it("day 3 night opens with Saduli Ragap, shows all four winners' dances, then closes with Bagendit, kaulinan, wiradomba, bajidor", () => {
    const k = kegiatan(RUNDOWN_HARI_3_MALAM);
    expect(k).toContain("Bubuka Karinding — Saduli Ragap");
    expect(k).toContain("Tarawangsa — Saduli Ragap");
    expect(k).toContain("Opening MC");
    for (const c of ["TK", "SD 1–3", "SD 4–6", "SMP–SMA"]) {
      expect(k).toContain(`Tarian Pemenang — Kategori ${c}`);
    }
    expect(RUNDOWN_HARI_3_MALAM.filter((r) => r.activity.startsWith("Tarian Pemenang"))).toHaveLength(4);
    expect(k).toContain("Ice Breaking");
    expect(k).toContain("Musik Etnik — 2 Lagu");
    expect(k).toContain("Musikal Tari Teater Bagendit");
    expect(k).toContain("Kaulinan Barudak");
    expect(k).toContain("Wiradomba");
    expect(k).toContain("Etnik Bajidor");
    expect(RUNDOWN_HARI_3_MALAM.filter((r) => r.activity === "MC Masuk")).toHaveLength(2);
  });

  it("day 3 morning ends with the awards and the night ends with the closing", () => {
    expect(RUNDOWN_HARI_3_PAGI.at(-1)?.activity).toContain("Trophy Bergilir");
    expect(RUNDOWN_HARI_3_MALAM.at(-1)?.activity).toContain("Penutupan");
  });
});
