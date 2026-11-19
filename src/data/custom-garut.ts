import kaosDepan from "@/assets/kaos-garut-depan.jpg";
import kaosBelakang from "@/assets/kaos-garut-belakang.jpg";
import kaos2Depan from "@/assets/kaos-garut-2-depan.jpg";
import kaos2Belakang from "@/assets/kaos-garut-2-belakang.jpg";
import kaos3Depan from "@/assets/kaos-garut-3-depan.jpg";
import kaos3Belakang from "@/assets/kaos-garut-3-belakang.jpg";
import { customConsultUrl } from "@/data/produk-custom";

export type GarutTeeSide = "depan" | "belakang";
export type GarutTee = {
  id: string; code: string; name: string; design: string; color: string; description: string;
  sides: readonly { id: GarutTeeSide; label: string; image: string; print: string; detail: string }[];
};

export const garutTees: readonly GarutTee[] = [
  {
    id: "kota-intan", code: "NMP-GRT-01", name: "Kaos Polos Custom Garut", design: "Garut Kota Intan", color: "Hitam",
    description: "Kaos polos dengan sablon khas Garut di depan dan belakang. Cocok untuk oleh-oleh, komunitas, atau seragam acara.",
    sides: [
      { id: "depan", label: "Depan", image: kaosDepan, print: "Sablon kecil di dada kiri", detail: "Tanduk domba Garut dan garis gunung, tulisan GARUT · Kota Intan." },
      { id: "belakang", label: "Belakang", image: kaosBelakang, print: "Sablon besar di punggung", detail: "Domba Garut di depan Gunung Cikuray dan danau, tulisan GARUT · Kota Intan · Swiss van Java." },
    ],
  },
  {
    id: "swiss-van-java", code: "NMP-GRT-02", name: "Kaos Retro Swiss van Java", design: "Garut Gambar Tangan", color: "Krem",
    description: "Ilustrasi gambar tangan dua warna tinta tentang suasana Garut, dengan tulisan huruf cetak tegas.",
    sides: [
      { id: "depan", label: "Depan", image: kaos2Depan, print: "Sablon besar di dada", detail: "Gunung Papandayan berasap, kebun teh, rumah Sunda, dan domba Garut, tulisan GARUT · Swiss van Java." },
      { id: "belakang", label: "Belakang", image: kaos2Belakang, print: "Sablon besar di punggung", detail: "Kolase dodol Garut, kopi Garut, rakit di danau, dan domba Garut, tulisan Oleh-oleh dari Kota Intan." },
    ],
  },
  {
    id: "cukil-domba", code: "NMP-GRT-03", name: "Kaos Cukil Domba Garut", design: "Cukil Domba & Jeruk", color: "Hijau Hutan",
    description: "Gaya cukil kayu satu warna tinta krem di kaos hijau hutan: domba Garut, Gunung Cikuray, dan jeruk Garut.",
    sides: [
      { id: "depan", label: "Depan", image: kaos3Depan, print: "Stempel bulat di dada", detail: "Kepala domba Garut, Gunung Cikuray, dan ranting jeruk dalam lingkaran, tulisan GARUT · Kota Intan." },
      { id: "belakang", label: "Belakang", image: kaos3Belakang, print: "Sablon besar di punggung", detail: "Domba Garut berdiri di bukit batu dengan Gunung Cikuray dan dahan jeruk Garut, tulisan GARUT · Tanah Domba & Jeruk." },
    ],
  },
];

export const garutTee = garutTees[0]!;
export const garutTeeSizes = ["S", "M", "L", "XL", "XXL"] as const;
export const garutTeeCustomizable = ["Warna kaos", "Tulisan atau nama komunitas", "Ukuran dan posisi sablon", "Desain Garut versi kamu"] as const;

export function garutTeeConsultUrl(size: string, quantity: string, details: string, tee: GarutTee = garutTee) {
  const product = `[${tee.code}] ${tee.name} — desain ${tee.design} (sablon depan & belakang)`;
  const request = [size.trim() ? `Ukuran: ${size.trim()}` : "", details.trim()].filter(Boolean).join(". ");
  return customConsultUrl(product, quantity, request);
}
