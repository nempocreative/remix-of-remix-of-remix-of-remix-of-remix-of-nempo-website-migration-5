import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { notificationItems } from "./notifications";

const routeSource = readFileSync(resolve(process.cwd(), "src/nempo-app.tsx"), "utf8");
const registeredPaths = [...routeSource.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);

describe("isi notifikasi", () => {
  it("hanya empat: ajakan join, buat event, cek medsos, daftar lomba", () => {
    expect(notificationItems).toHaveLength(4);
    const titles = notificationItems.map((n) => n.title.toLowerCase()).join(" | ");
    expect(titles).toContain("join");
    expect(titles).toContain("acara");
    expect(titles).toContain("medsos");
    expect(titles).toContain("jaipong");
  });

  it("notifikasi lomba menunjuk halaman lomba dan menyebut tanggal dibuka", () => {
    const lomba = notificationItems.find((n) => n.href === "/lomba");
    expect(lomba?.title).toContain("Pasanggiri Jaipong");
    expect(lomba?.message).toContain("22 November 2026");
    expect(lomba?.message).toContain("25 peserta");
  });

  it("setiap tautan menunjuk halaman yang terdaftar", () => {
    for (const item of notificationItems) {
      expect(registeredPaths).toContain(item.href.split("#", 1)[0]);
    }
  });
});
