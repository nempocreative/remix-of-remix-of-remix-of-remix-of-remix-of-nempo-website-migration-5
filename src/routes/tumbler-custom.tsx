import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/tumbler-custom")({
  head: () => ({ meta: [
    { title: "Tumbler Mini Pasangan — Foto & Kata-kata 2 Sisi | Nempo Garut" },
    { name: "description", content: "Tumbler mini tutup kayu untuk pasangan: foto berdua di satu sisi, kata-kata dan nama di sisi lain. Konsultasi desain bersama Nempo." },
    { property: "og:title", content: "Tumbler Mini Pasangan — Cetak Foto & Kata-kata" },
    { property: "og:description", content: "Hadiah untuk pasangan: tumbler mini dengan foto berdua dan kata-kata untuk dia, dicetak dua sisi." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});
