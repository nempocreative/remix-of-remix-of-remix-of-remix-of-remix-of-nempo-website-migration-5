import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

const POSTER = "https://nempo.id/media/pasar-seni-garut/cover-hero.webp";

export const Route = createFileRoute("/pasar-seni-garut-2026")({
  head: () => ({
    meta: [
      { title: "Pasar Seni Garut 2026 — Segera | Nempo Organizer" },
      {
        name: "description",
        content:
          "Pasar Seni Garut 2026 segera hadir: 30 dan 31 Desember 2026 di Garut, Jawa Barat. Detail acara diumumkan menyusul.",
      },
      { property: "og:title", content: "Pasar Seni Garut 2026 — 30–31 Desember 2026" },
      {
        property: "og:description",
        content:
          "Coming soon di Garut, 30–31 Desember 2026. Hitung mundurnya sudah jalan, detail acara menyusul.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: POSTER },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: POSTER },
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
