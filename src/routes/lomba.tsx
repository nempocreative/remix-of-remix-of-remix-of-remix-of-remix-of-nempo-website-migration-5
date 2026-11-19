import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/lomba")({
  head: () => ({
    meta: [
      { title: "Lomba — Pasanggiri Jaipong se-Jawa Barat & Duta Pasar Seni | Nempo" },
      {
        name: "description",
        content:
          "Pasanggiri Jaipong se-Jawa Barat & Pemilihan Duta Pasar Seni, Rabu 30 Desember 2026. Kategori TK, SD 1–3, SD 4–6, SMP–SMA. Pendaftaran Rp150.000, maksimal 25 peserta tiap kategori.",
      },
      { property: "og:title", content: "Pasanggiri Jaipong se-Jawa Barat & Pemilihan Duta Pasar Seni" },
      {
        property: "og:description",
        content: "Lomba 30 Desember 2026, acara puncak 31 Desember. Juara 1 tiap kategori jadi Duta Pasar Seni. Daftar Rp150.000, kuota 25 peserta per kategori.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Sans+3:wght@300;400;600;700&display=swap",
      },
    ],
  }),
  component: NempoShell,
});
