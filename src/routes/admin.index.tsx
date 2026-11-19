import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { AppShell } from "@/components/app-shell";

const Entry = lazyWithRetry(() => import("@/apps/cms/entry"));

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Ruang Kerja Admin — Nempo Organizer Garut" },
      {
        name: "description",
        content:
          "Ruang kerja admin Nempo Organizer Garut: kelola agenda acara, pendaftar lomba, banner, kerja sama, dan berita.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Ruang Kerja Admin — Nempo Organizer Garut" },
      {
        property: "og:description",
        content: "Ruang kerja admin Nempo Organizer Garut. Khusus petugas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell app={Entry} />,
});
