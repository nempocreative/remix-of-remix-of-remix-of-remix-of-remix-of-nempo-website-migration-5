// Turns the owner's two price lists into the GGS app's service list, so the home page, the
// services pages and the booking form all show the real prices. Men's rows belong to GGS Barber
// Studio and book on the barber's WhatsApp; women's rows belong to GGS Beauty.
// Used by content.mjs at build time (plain type-strippable TypeScript, no enums).

export type PricelistSection = { group: string; title: string; items: string[][]; note?: string };
export type GgsAudience = "pria" | "wanita";
export type PricelistService = {
  id: number;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  price: number;
  priceLabel: string;
  audience: GgsAudience;
  featured: boolean;
  active: true;
  imageUrl: string;
};

// Shown on the home page carousels; every other row stays on the price lists and booking form.
export const FEATURED_PRIA = [
  "Dewasa (only cut)",
  "Anak & pelajar",
  "Botak licin",
  "Paket G (Ganteng)",
  "Paket GP (Ganteng Pisan)",
  "Paket GPS (Ganteng Pisan Sob)",
  "Creambath, pijat kepala & bahu",
  "Keratin smoothing",
];
export const FEATURED_WANITA = [
  "Potong rambut",
  "Cuci blow",
  "Kuku asli motif",
  "Creambath L’Oréal",
  "Keratin Smoothing · Pendek",
  "Colouring Highlight · Pendek",
  "Full body massage 60 menit",
  "MeniPedi",
];

const SIZE_ONLY = /^(pendek|sedang|panjang|no bleaching|bleaching)\b/i;

/** "50.000 – 100.000" → 50000, "Mulai 100.000" → 100000. */
export const lowestPrice = (label: string) => Number((label.match(/\d[\d.]*/)?.[0] ?? "0").replace(/\./g, ""));

/** "50.000 – 100.000" → "Rp50.000 – 100.000", "Mulai 100.000" → "Mulai Rp100.000". */
export const rupiahLabel = (label: string) =>
  /^mulai\s+/i.test(label) ? label.replace(/^mulai\s+/i, "Mulai Rp") : `Rp${label}`;

/** Reads "· 15 menit" (or "60 menit") from a row; 0 when the list gives no duration. */
export const minutesIn = (...texts: (string | undefined)[]) => {
  for (const text of texts) {
    const found = text?.match(/(\d+)\s*menit/i);
    if (found) return Number(found[1]);
  }
  return 0;
};

// Each service shows the AI photo (Indonesian faces, from pricelist-photos/) that matches it.
export const photo = (audience: GgsAudience, name: string, category: string) => {
  const n = name.toLowerCase();
  const c = category.toLowerCase();
  if (audience === "pria") {
    if (/paket/.test(c)) return "men-cut-service.jpg";
    if (/colou?r|highlight|warna/.test(n)) return "men-color-service.jpg";
    if (/perming|keratin|styling/.test(n)) return "men-styling-service.jpg";
    if (/creambath|keramas/.test(n)) return "men-creambath-service.jpg";
    if (/pijat|masker|facial/.test(n)) return "men-facial-service.jpg";
    if (/kumis|jenggot|botak|licin/.test(n)) return "men-shave-service.jpg";
    if (/anak|pelajar/.test(n)) return "men-kids-cut-service.jpg";
    return "men-cut-service.jpg";
  }
  if (/nail/.test(c) && /kaki/.test(n)) return "women-menipedi-service.jpg";
  if (/nail|kuku/.test(c + " " + n)) return "women-nail-service.jpg";
  if (/anak/.test(c)) return "women-kids-service.jpg";
  if (/menipedi|manicure|pedicure/.test(c + " " + n)) return "women-menipedi-service.jpg";
  if (/massage|reflex|pijat|bekam|kerok/.test(c + " " + n)) return "women-massage-service.jpg";
  if (/face|wajah/.test(c + " " + n)) return "women-face-service.jpg";
  if (/body|ratus|waxing|lulur|scrub|ketiak|badan/.test(c + " " + n)) return "women-body-service.jpg";
  if (/creambath|treatment|masker/.test(c + " " + n) && !/keratin/.test(c)) return "women-creambath-service.jpg";
  if (/colou?r|highlight|warna/.test(c)) return "women-color-service.jpg";
  if (/keratin|catok/.test(c + " " + n)) return "women-keratin-service.jpg";
  if (/blow|curly|cuci/.test(n) && !/potong/.test(n)) return "women-blow-service.jpg";
  return "women-cut-service.jpg";
};

export function servicesFromPricelists(pria: PricelistSection[], wanita: PricelistSection[], imageBase = "/ggs-hair-studio/") {
  const out: PricelistService[] = [];
  const add = (audience: GgsAudience, sections: PricelistSection[], featured: string[]) => {
    for (const section of sections) {
      for (const [rawName = "", label = "", detail] of section.items) {
        const base = rawName.replace(/\s*·\s*\d+\s*menit\s*$/i, "").trim();
        const name = SIZE_ONLY.test(base) ? `${section.title} · ${base}` : base;
        out.push({
          id: out.length + 1,
          name,
          category: section.title,
          description: detail ?? "",
          durationMinutes: minutesIn(rawName, detail),
          price: lowestPrice(label),
          priceLabel: rupiahLabel(label),
          audience,
          featured: featured.includes(name),
          active: true,
          imageUrl: `${imageBase}${photo(audience, name, section.title)}`,
        });
      }
    }
  };
  add("pria", pria, FEATURED_PRIA);
  add("wanita", wanita, FEATURED_WANITA);
  return out;
}
