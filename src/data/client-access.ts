/** Browser-safe list of client websites shown on /client-access. No access codes live here. */
export type KlienNempo = {
  slug: string;
  nama: string;
  bidang: string;
  ringkas: string;
  lokasi: string;
  sampul: string;
  tautan: string;
  pakaiKataSandi: boolean;
  sorotan: string[];
  /** Set true to keep a client out of the /client-access list without deleting its data. */
  sembunyi?: boolean;
};

export const KLIEN_NEMPO: KlienNempo[] = [
  {
    slug: "ggs-hair-studio",
    nama: "GGS Hair Studio",
    bidang: "Salon & barbershop",
    ringkas:
      "Situs web GGS Hair Studio: daftar layanan potong, warna, dan perawatan rambut, galeri gaya, katalog produk, tim stylist, serta info cabang.",
    lokasi: "Garut, Jawa Barat",
    sampul: "/ggs-hair-studio/ggs-editorial.jpg",
    tautan: "/ggs-hair-studio/",
    pakaiKataSandi: false,
    sorotan: ["Layanan & harga", "Galeri gaya rambut", "Katalog produk", "Tim stylist"],
  },
];

/** Clients shown on /client-access: everything not hidden. */
export const KLIEN_TAMPIL = KLIEN_NEMPO.filter((k) => !k.sembunyi);
