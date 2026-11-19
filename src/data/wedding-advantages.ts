// Keunggulan WO Nempo — every number is derived from the package/adat data so the
// page can never show a figure that disagrees with the price list.
import { weddingPackages, weddingAdatOptions, weddingRupiah } from "./wedding-packages";
import { WCC_PACKAGES } from "./wedding-content-creator";

const teams = weddingPackages.map((p) => p.team);
const prices = weddingPackages.map((p) => p.price);
const adatSavings = weddingAdatOptions.map((o) => o.normal - o.special);

/** "4–8 orang" — smallest to largest crew across the three WO packages. */
export const weddingTeamRange = `${Math.min(...teams)}–${Math.max(...teams)} orang`;

/** Cheapest WO package price, formatted. */
export const weddingPriceFrom = weddingRupiah(Math.min(...prices));

/** Rupiah saved on the adat Sunda special rate (identical on both formats). */
export const weddingAdatSaving = Math.min(...adatSavings);
export const weddingAdatSavingRupiah = weddingRupiah(weddingAdatSaving);

/** Cheapest Wedding Content Creator package price, formatted. */
export const weddingContentFrom = weddingRupiah(Math.min(...WCC_PACKAGES.map((p) => p.price)));

/** Packages that bundle the free digital invitation and sawer set. */
export const weddingFreeInvitationPackages = weddingPackages
  .filter((p) => p.digitalInvitationAndSawer)
  .map((p) => p.name);

export type WeddingAdvantage = { title: string; detail: string };

export const weddingAdvantages: WeddingAdvantage[] = [
  {
    title: `Tim ${weddingTeamRange}`,
    detail: "Crew disesuaikan dengan besar acara. Rundown, vendor, dan alur tamu dikoordinasi sampai acara selesai.",
  },
  {
    title: `Mulai ${weddingPriceFrom}`,
    detail: "Harga paket sudah mencakup manajemen acara. Dekor, catering, MUA, dokumentasi, dan hiburan disepakati terpisah.",
  },
  {
    title: "Undangan digital & alat sawer gratis",
    detail: `Didapat di paket ${weddingFreeInvitationPackages.join(" dan ")}.`,
  },
  {
    title: `Hemat ${weddingAdatSavingRupiah} tarif adat`,
    detail: "Tarif spesial WO pada dua format pertunjukan adat Sunda dari vendor rekanan.",
  },
  {
    title: `Konten pernikahan mulai ${weddingContentFrom}`,
    detail: "Video highlight dan candid siap dibagikan, file digital maksimal H+1.",
  },
  {
    title: "Basis Garut, Jawa Barat",
    detail: "Koordinasi lapangan lebih dekat, transportasi luar Garut kota menyesuaikan.",
  },
];
