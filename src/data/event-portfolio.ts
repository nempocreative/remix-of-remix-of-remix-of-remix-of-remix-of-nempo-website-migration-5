import musicomedyPosterImage from "@/assets/event-musicomedy-night-poster.jpg";
import colorTheBeatPosterImage from "@/assets/event-color-the-beat-poster.jpg";
import ggsBeautyOpeningImage from "@/assets/event-ggs-beauty-opening.jpg";
import lalanaPagiPosterImage from "@/assets/event-lalana-pagi-poster.jpg";
import nightOutMaxiPosterImage from "@/assets/event-night-out-maxi-poster.jpg";
import ngahijiBoboranSiamPosterImage from "@/assets/event-ngahiji-boboran-siam-poster.jpg";
import riuhRonaPosterImage from "@/assets/event-riuh-rona-poster.jpg";
import secangkirKopiPosterImage from "@/assets/event-secangkir-kopi-poster.jpg";
import temuTarungPosterImage from "@/assets/temu-tarung-instagram.webp";
import universityCoffeeNightPosterImage from "@/assets/event-university-coffee-night-poster.jpg";

import secangkirKopiThumb from "@/assets/home-thumbs/event-secangkir-kopi-poster.webp";
import universityCoffeeNightThumb from "@/assets/home-thumbs/event-university-coffee-night-poster.webp";
import lalanaPagiThumb from "@/assets/home-thumbs/event-lalana-pagi-poster.webp";
import ngahijiBoboranSiamThumb from "@/assets/home-thumbs/event-ngahiji-boboran-siam-poster.webp";
import temuTarungThumb from "@/assets/home-thumbs/temu-tarung-instagram.webp";
import nightOutMaxiThumb from "@/assets/home-thumbs/event-night-out-maxi-poster.webp";
import colorTheBeatThumb from "@/assets/home-thumbs/event-color-the-beat-poster.webp";
import riuhRonaThumb from "@/assets/home-thumbs/event-riuh-rona-poster.webp";
import ggsBeautyOpeningThumb from "@/assets/home-thumbs/event-ggs-beauty-opening.webp";
import musicomedyNightThumb from "@/assets/home-thumbs/event-musicomedy-night-poster.webp";

export interface EventPortfolioItem {
  id: string;
  name: string;
  image: string;
  location: string;
  date: string;
  badge: string;
  /** Hari acara (YYYY-MM-DD), dipakai riwayat di halaman Event. */
  startDate: string;
  /** Hari terakhir kalau acaranya lebih dari sehari. */
  endDate?: string;
  /** Kategori yang sama dengan filter di halaman Event. */
  category: string;
  /** Salinan poster kecil (WebP) untuk kartu riwayat. */
  thumb: string;
  link?: string;
}

/**
 * Poster asli tiap acara Nempo, dipakai beranda dan halaman Portofolio.
 * Tambah satu di sini, muncul di keduanya.
 */
export const eventPortfolioItems: EventPortfolioItem[] = [
  {
    id: "secangkir-kopi-biang-2025",
    name: "Secangkir Kopi dengan Alunan Musik Tradisi di Akhir Tahun",
    image: secangkirKopiPosterImage,
    location: "Biang",
    date: "31 Desember 2025",
    badge: "Musik Tradisi",
    startDate: "2025-12-31",
    category: "Musik",
    thumb: secangkirKopiThumb,
  },
  {
    id: "university-coffee-night-2026",
    name: "University Coffee Night",
    image: universityCoffeeNightPosterImage,
    location: "Domusa",
    date: "18 Januari 2026",
    badge: "Coffee Night",
    startDate: "2026-01-18",
    category: "Musik",
    thumb: universityCoffeeNightThumb,
  },
  {
    id: "lalana-pagi-2026",
    name: "Lalana Pagi",
    image: lalanaPagiPosterImage,
    location: "Kopi Jaya",
    date: "1 Februari 2026",
    badge: "Acara Pagi",
    startDate: "2026-02-01",
    category: "Budaya",
    thumb: lalanaPagiThumb,
  },
  {
    id: "ngahiji-boboran-siam-2026",
    name: "Ngahiji dina Kebagjaan Boboran Siam",
    image: ngahijiBoboranSiamPosterImage,
    location: "Situ Bagendit",
    date: "23 Maret 2026",
    badge: "Boboran Siam",
    startDate: "2026-03-23",
    category: "Budaya",
    thumb: ngahijiBoboranSiamThumb,
  },
  {
    id: "temu-tarung-2026",
    name: "Temu Tarung",
    image: temuTarungPosterImage,
    location: "SOR",
    date: "20–21 Juni 2026",
    badge: "Olahraga",
    startDate: "2026-06-20",
    endDate: "2026-06-21",
    category: "Olahraga",
    thumb: temuTarungThumb,
    link: "https://www.instagram.com/p/DZEkb52hIHF/",
  },
  {
    id: "night-out-maxi-2026",
    name: "Night Out Maxi",
    image: nightOutMaxiPosterImage,
    location: "Temu Space",
    date: "22 Agustus 2026",
    badge: "Night Out",
    startDate: "2026-08-22",
    category: "Musik",
    thumb: nightOutMaxiThumb,
  },
  {
    id: "color-the-beat-2026",
    name: "Color The Beat",
    image: colorTheBeatPosterImage,
    location: "Biang",
    date: "29 Agustus 2026",
    badge: "Musik",
    startDate: "2026-08-29",
    category: "Musik",
    thumb: colorTheBeatThumb,
  },
  {
    id: "riuh-rona-2026",
    name: "Riuh Rona",
    image: riuhRonaPosterImage,
    location: "Maru",
    date: "5 September 2026",
    badge: "Event",
    startDate: "2026-09-05",
    category: "Musik",
    thumb: riuhRonaThumb,
  },
  {
    id: "opening-ggs-2026",
    name: "Grand Opening GGS Beauty",
    image: ggsBeautyOpeningImage,
    location: "GGS Beauty",
    date: "18 Oktober 2026",
    badge: "Opening",
    startDate: "2026-10-18",
    category: "Opening",
    thumb: ggsBeautyOpeningThumb,
  },
  {
    id: "musicomedy-night-2026",
    name: "MusiComedy Night",
    image: musicomedyPosterImage,
    location: "Good Story Cafe",
    date: "4 November 2026",
    badge: "Musik & Komedi",
    startDate: "2026-11-04",
    category: "Musik",
    thumb: musicomedyNightThumb,
    link: "https://www.instagram.com/p/DfMTZ0GM2Bj/",
  },
];

/** Poster bawaan per acara, dipakai baris database yang menunjuk `builtin_poster`. */
export const builtinPosters: Record<string, Pick<EventPortfolioItem, "image" | "thumb">> = Object.fromEntries(
  eventPortfolioItems.map((item) => [item.id, { image: item.image, thumb: item.thumb }]),
);
