import tumblerPasangan from "@/assets/tumbler-pasangan-merah-muda-foto.webp";
import kaosGarut2 from "@/assets/kaos-garut-2-belakang.jpg";
import kaosGarut from "@/assets/kaos-garut-belakang.jpg";
import kaosGarut3 from "@/assets/kaos-garut-3-belakang.jpg";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

export type CustomCategoryId = "tumbler" | "oleh-oleh";

export const customCategories: readonly { id: CustomCategoryId; label: string; description: string }[] = [
  { id: "tumbler", label: "Tumbler Custom", description: "Dikelompokkan per model tumbler. Badannya polos tanpa merek, siap dicetak nama, logo, atau desainmu." },
  { id: "oleh-oleh", label: "Oleh-oleh Garut", description: "Buah tangan khas Garut pilihan Nempo." },
];

export const customProducts: readonly { id: string; code: string; category: CustomCategoryId; name: string; image: string; description: string; colors?: readonly string[]; href?: string }[] = [
  { id: "tumbler-pasangan", code: "NMP-TMB-01", category: "tumbler", name: "Tumbler Mini Pasangan", image: tumblerPasangan, description: "Tumbler mini tutup kayu untuk pasangan: foto berdua di satu sisi, kata-kata di sisi lain.", colors: ["Merah Muda", "Biru Dongkal", "Hitam", "Hijau Sage"], href: "/tumbler-custom" },
  { id: "kaos-garut", code: "NMP-GRT-01", category: "oleh-oleh", name: "Kaos Custom Garut", image: kaosGarut, description: "Kaos polos dengan desain khas Garut, sablon depan dan belakang.", href: "/custom-garut" },
  { id: "kaos-garut-retro", code: "NMP-GRT-02", category: "oleh-oleh", name: "Kaos Retro Swiss van Java", image: kaosGarut2, description: "Kaos krem dengan ilustrasi Garut gambar tangan, sablon depan dan belakang.", href: "/custom-garut" },
  { id: "kaos-garut-cukil", code: "NMP-GRT-03", category: "oleh-oleh", name: "Kaos Cukil Domba Garut", image: kaosGarut3, description: "Kaos hijau hutan bergaya cukil kayu: domba Garut, Gunung Cikuray, dan jeruk Garut.", href: "/custom-garut" },
];

export function productsInCategory(category: CustomCategoryId) {
  return customProducts.filter(product => product.category === category);
}

export function customConsultUrl(product: string, quantity: string, details: string) {
  const url = new URL(NEMPO_CONSULT_URL);
  url.searchParams.set("text", ["Halo Nempo, saya ingin konsultasi Produk Custom.", `Produk: ${product}`, quantity.trim() ? `Jumlah: ${quantity.trim()}` : "Jumlah: ingin diskusi", details.trim() ? `Kebutuhan: ${details.trim()}` : "", "Mohon informasi pilihan bahan, harga, dan waktu pengerjaannya."].filter(Boolean).join("\n"));
  return url.toString();
}
