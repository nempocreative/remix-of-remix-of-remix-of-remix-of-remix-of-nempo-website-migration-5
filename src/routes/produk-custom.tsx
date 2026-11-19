import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/produk-custom")({
  head: () => ({ meta: [
    { title: "Produk Custom — Tumbler & Oleh-oleh Garut | Nempo Garut" },
    { name: "description", content: "Tumbler custom per model dan kaos oleh-oleh khas Garut. Cetak nama, logo, atau desainmu bersama Nempo." },
    { property: "og:title", content: "Produk Custom: Tumbler & Oleh-oleh Garut | Nempo Garut" },
    { property: "og:description", content: "Pilih model tumbler atau kaos khas Garut, lalu konsultasikan desainnya bersama Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});