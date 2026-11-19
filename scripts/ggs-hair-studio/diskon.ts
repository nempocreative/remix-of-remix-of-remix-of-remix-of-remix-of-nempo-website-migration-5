// Active discounts for the GGS home page ("Diskon aktif" torn-ticket cards), copied into the app by patch-diskon.mjs.
export type GgsDiscount = {
  id: string;
  audience: "pria" | "wanita";
  title: string;
  label: string;
  normalPrice?: number; // omitted when the owner gave only the promo price
  promoPrice: number;
  terms: string;
  start: string; // YYYY-MM-DD, first day the discount runs
  end: string; // YYYY-MM-DD, last day the discount runs
};

/** Today's date in Garut (Asia/Jakarta) as YYYY-MM-DD. */
export const jakartaToday = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

/** Discounts running today (start and end days included), the ones ending soonest first. */
export const activeDiscounts = (list: GgsDiscount[], today: string) =>
  list.filter((d) => d.start <= today && today <= d.end).sort((a, b) => a.end.localeCompare(b.end));

export const discountStudio = (d: GgsDiscount) => (d.audience === "pria" ? "GGS Barber Studio" : "GGS Beauty");

const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;
export const discountPrice = rupiah;

export const discountEndLabel = (end: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(`${end}T12:00:00+07:00`));

/** True when the label is a percentage such as "29%" (shown big on the ticket stub). */
export const discountIsPercent = (d: GgsDiscount) => /^\d+%$/.test(d.label);

const priceDetail = (d: GgsDiscount) =>
  d.normalPrice ? `diskon ${d.label}, ${rupiah(d.promoPrice)} dari ${rupiah(d.normalPrice)}` : `harga promo ${rupiah(d.promoPrice)}`;

export const discountWaText = (d: GgsDiscount) =>
  `Halo ${discountStudio(d)}, saya ingin booking promo *${d.title}* (${priceDetail(d)}). Kapan jadwal yang tersedia?`;
