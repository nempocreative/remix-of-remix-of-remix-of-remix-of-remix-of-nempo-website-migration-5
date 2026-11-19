import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/custom-garut")({
  head: () => ({ meta: [
    { title: "Custom Garut — Kaos Polos Sablon Khas Garut | Nempo" },
    { name: "description", content: "Kaos polos custom dengan desain khas Garut, sablon depan dan belakang. Konsultasikan ukuran, jumlah, dan desain bersama Nempo." },
    { property: "og:title", content: "Custom Garut — Kaos Sablon Depan & Belakang" },
    { property: "og:description", content: "Contoh desain Garut Kota Intan: domba Garut dan Gunung Cikuray di kaos polos, siap disesuaikan untukmu." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});
