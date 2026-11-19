import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/client-access")({
  head: () => ({
    meta: [
      { title: "Client Access — Web Klien Nempo" },
      { name: "description", content: "Akses web klien yang dibuat Nempo, seperti GGS Hair Studio." },
      { property: "og:title", content: "Client Access — Web Klien Nempo" },
      { property: "og:description", content: "Web klien buatan Nempo: GGS Hair Studio dan lainnya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
