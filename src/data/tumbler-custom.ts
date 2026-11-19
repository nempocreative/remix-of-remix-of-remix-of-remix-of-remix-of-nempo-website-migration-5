import merahMudaFoto from "@/assets/tumbler-pasangan-merah-muda-foto.webp";
import merahMudaKata from "@/assets/tumbler-pasangan-merah-muda-kata.webp";
import biruFoto from "@/assets/tumbler-pasangan-biru-dongkal-foto.webp";
import biruKata from "@/assets/tumbler-pasangan-biru-dongkal-kata.webp";
import hitamFoto from "@/assets/tumbler-pasangan-hitam-foto.webp";
import hitamKata from "@/assets/tumbler-pasangan-hitam-kata.webp";
import sageFoto from "@/assets/tumbler-pasangan-hijau-sage-foto.webp";
import sageKata from "@/assets/tumbler-pasangan-hijau-sage-kata.webp";
import { customConsultUrl } from "@/data/produk-custom";

export type TumblerSide = "foto" | "kata";
export type TumblerDesign = {
  id: string; code: string; name: string; model: string; design: string; description: string;
  sides: readonly { id: TumblerSide; label: string; print: string; detail: string }[];
  images: Readonly<Record<TumblerColorSlug, Readonly<Record<TumblerSide, string>>>>;
};

/** Same body colours (names and swatches) as the Nempo merchandise mini tumbler. */
export const tumblerColors = [
  { slug: "merah-muda", name: "Merah Muda", hex: "#DB8D80" },
  { slug: "biru-dongkal", name: "Biru Dongkal", hex: "#1D4B5B" },
  { slug: "hitam", name: "Hitam", hex: "#1A1A1A" },
  { slug: "hijau-sage", name: "Hijau Sage", hex: "#6EB88F" },
] as const;
export type TumblerColorSlug = (typeof tumblerColors)[number]["slug"];

export const tumblerDesigns: readonly TumblerDesign[] = [
  {
    id: "pasangan", code: "NMP-TMB-01", name: "Tumbler Mini Pasangan", model: "Tumbler Mini Tutup Kayu", design: "Foto & Kata-kata Pasangan",
    description: "Hadiah untuk pasangan: satu sisi foto berdua, sisi lainnya kata-kata untuk dia. Dicetak di tumbler mini tutup kayu.",
    sides: [
      { id: "foto", label: "Sisi foto", print: "Foto berbingkai lengkung", detail: "Foto berdua dicetak penuh warna, dengan nama kalian dan tanggal spesial di bawahnya." },
      { id: "kata", label: "Sisi kata-kata", print: "Kata-kata tinta putih", detail: "“Sejauh apa pun hari ini, pulangnya tetap ke kamu.” lalu nama kalian berdua." },
    ],
    images: {
      "merah-muda": { foto: merahMudaFoto, kata: merahMudaKata },
      "biru-dongkal": { foto: biruFoto, kata: biruKata },
      hitam: { foto: hitamFoto, kata: hitamKata },
      "hijau-sage": { foto: sageFoto, kata: sageKata },
    },
  },
];

export const tumblerCustomizable = ["Foto kalian sendiri", "Kata-kata dan nama", "Tanggal spesial", "Warna tumbler"] as const;

export function tumblerConsultUrl(color: string, quantity: string, details: string, design: TumblerDesign = tumblerDesigns[0]!) {
  const product = `[${design.code}] ${design.name} — desain ${design.design} (cetak 2 sisi)`;
  const request = [color.trim() ? `Warna: ${color.trim()}` : "", details.trim()].filter(Boolean).join(". ");
  return customConsultUrl(product, quantity, request);
}
