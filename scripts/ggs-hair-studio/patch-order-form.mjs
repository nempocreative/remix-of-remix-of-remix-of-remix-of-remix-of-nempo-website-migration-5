// Owner request: every GGS booking button (service cards, price lists, discounts, team, products,
// Home Service, nail art video) opens a short order form first; sending it opens the studio's
// WhatsApp with a tidy, sectioned message (order-message.ts). Runs after patch-nail-art-video.mjs.
// Usage: node patch-order-form.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
for (const name of ["order-message.ts", "ggs-order-sheet.tsx", "team-data.ts", "pricelist-pria.json", "pricelist-wanita.json"]) {
  fs.copyFileSync(new URL(`./${name}`, import.meta.url), path.join(app, "src", name));
}
const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
const swap = (from, to, count = 1) => {
  const n = s.split(from).length - 1;
  if (n !== count) throw new Error(`patch-order-form: expected ${count}× but found ${n}×: ${from.slice(0, 80)}`);
  s = s.split(from).join(to);
};

swap("import { GgsBookingForm } from './ggs-booking-page';\n",
  "import { GgsBookingForm } from './ggs-booking-page';\nimport { GgsOrderSheet, openGgsOrder } from './ggs-order-sheet';\nimport { serviceOrder, promoOrder } from './order-message';\n");

// Service cards on the home page and the services pages.
swap("onClick={(event) => { event.preventDefault(); openServiceWhatsApp(service); }}\n                          data-testid={`link-home-book-service-",
  "onClick={(event) => { event.preventDefault(); openGgsOrder(serviceOrder(service as any, 'Beranda · Layanan')); }}\n                          data-testid={`link-home-book-service-");
swap("onClick={(event) => { event.preventDefault(); openServiceWhatsApp(service); }}\n                            data-testid={`link-home-book-womens-service-",
  "onClick={(event) => { event.preventDefault(); openGgsOrder(serviceOrder(service as any, 'Beranda · Layanan Wanita')); }}\n                            data-testid={`link-home-book-womens-service-");
swap("onClick={(event) => { event.preventDefault(); openServiceWhatsApp(service); }} aria-label={`Ajukan ${service.name}`}",
  "onClick={(event) => { event.preventDefault(); openGgsOrder(serviceOrder(service as any, 'Halaman Layanan')); }} aria-label={`Ajukan ${service.name}`}");

// Home Service: the customer picks the studio and types the service; the address is required.
swap("onClick={(event) => { event.preventDefault(); openGgsWhatsApp(homeServiceWaText()); }}\n            data-testid=\"link-home-service-details\"",
  "onClick={(event) => { event.preventDefault(); openGgsOrder({ kind: 'home-service', studio: 'wanita', chooseStudio: true, homeService: true, source: 'Beranda · Home Service' }); }}\n            data-testid=\"link-home-service-details\"");
swap("onClick={(event) => { event.preventDefault(); openGgsWhatsApp(homeServiceWaText()); }}\n            data-testid=\"link-home-service-booking\"",
  "onClick={(event) => { event.preventDefault(); openGgsOrder({ kind: 'home-service', studio: 'wanita', chooseStudio: true, homeService: true, source: 'Halaman Home Service' }); }}\n            data-testid=\"link-home-service-booking\"");

// Nail art video: GGS Beauty home visit for nail art.
swap("<a href={nailArtWaUrl(NAIL_ART_WA_TEXT)} target=\"_blank\" rel=\"noreferrer\" className=\"clearer-primary-button\" data-testid=\"link-nail-art-whatsapp\">",
  "<a href={nailArtWaUrl(NAIL_ART_WA_TEXT)} target=\"_blank\" rel=\"noreferrer\" className=\"clearer-primary-button\" onClick={(event) => { event.preventDefault(); openGgsOrder({ kind: 'home-service', studio: 'wanita', item: 'Nail Art Panggilan', category: 'Nail Art · Home Service', homeService: true, source: page ? 'Home Service · Video Nail Art' : 'Beranda · Video Nail Art' }); }} data-testid=\"link-nail-art-whatsapp\">");

// Discount tickets.
swap("onClick={() => openGgsWhatsApp(discountWaText(deal), whatsappFor({ audience: deal.audience }))}",
  "onClick={() => openGgsOrder(promoOrder(deal))}");

// Team cards: the chosen staff member is preselected.
swap("onClick={(event) => { event.preventDefault(); openGgsWhatsApp(teamWaText(group, member), whatsappFor({ audience: group.id })); }}",
  "onClick={(event) => { event.preventDefault(); openGgsOrder({ kind: 'tim', studio: group.id as 'pria' | 'wanita', staffId: member.id, source: 'Tim GGS' }); }}");

// Products.
swap("    openGgsWhatsApp(productWaText(product));\n    return;",
  "    openGgsOrder({ kind: 'produk', studio: 'wanita', item: product.name, category: product.category, unitPrice: product.price, source: 'Produk GGS' });\n    return;");

// Price lists (women: GGS Beauty, men: barber).
swap("onClick={() => openGgsWhatsApp(pricelistWaText(section.title, name, price))}",
  "onClick={() => openGgsOrder({ kind: 'layanan', studio: 'wanita', item: name, category: section.title, price: `Rp${price}`, source: 'Pricelist Wanita' })}");
swap("onClick={() => openGgsPriaWhatsApp(pricelistPriaWaText(section.title, name, price))}",
  "onClick={() => openGgsOrder({ kind: 'layanan', studio: 'pria', item: name, category: section.title, price: `Rp${price}`, source: 'Pricelist Pria' })}");
swap("onClick={() => openGgsWhatsApp('Halo GGS Hair Studio, saya ingin booking dari Pricelist Wanita. Layanan yang saya inginkan: ')}",
  "onClick={() => openGgsOrder({ kind: 'layanan', studio: 'wanita', source: 'Pricelist Wanita' })}");
swap("onClick={() => openGgsPriaWhatsApp('Halo GGS Hair Studio, saya ingin booking dari Pricelist Pria. Layanan yang saya inginkan: ')}",
  "onClick={() => openGgsOrder({ kind: 'layanan', studio: 'pria', source: 'Pricelist Pria' })}");

// One form for the whole site.
swap("      <nav className=\"clearer-mobile-tabbar\"", "      <GgsOrderSheet />\n      <nav className=\"clearer-mobile-tabbar\"");
fs.writeFileSync(file, s);

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS order form (patch-order-form.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `
${marker}
.ggs-order { --order-accent: var(--clearer-accent, #c2185b); position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgb(17 17 19 / 55%); animation: ggs-order-dim .18s ease-out; }
.ggs-order[data-studio="pria"] { --order-accent: #a87b2a; }
.ggs-order__sheet { width: min(560px, 100%); max-height: calc(100dvh - 40px); overflow-y: auto; overscroll-behavior: contain; border-radius: 22px; background: var(--clearer-paper, #fff); color: var(--clearer-ink, #111); padding: 22px 22px 18px; box-shadow: 0 24px 60px rgb(0 0 0 / 28%); animation: ggs-order-up .22s ease-out; }
.ggs-order__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.ggs-order__kicker { margin: 0 0 4px; color: var(--order-accent); font-size: 11px; font-weight: 800; letter-spacing: .12em; }
.ggs-order__head h2 { margin: 0; font: 500 30px/1 'Cormorant Garamond', serif; letter-spacing: -.02em; }
.ggs-order__close { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid var(--clearer-line, #ddd); border-radius: 999px; background: transparent; color: inherit; cursor: pointer; }
.ggs-order__item { display: grid; gap: 3px; margin-bottom: 14px; border-left: 3px solid var(--order-accent); border-radius: 10px; background: var(--clearer-paper-deep, #f6f1ec); padding: 11px 14px; }
.ggs-order__item strong { font-size: 16px; }
.ggs-order__item span { color: var(--clearer-muted, #666); font-size: 13px; }
.ggs-order__item small { color: var(--order-accent); font-size: 12px; font-weight: 700; }
.ggs-order form { display: grid; gap: 12px; }
.ggs-order__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ggs-order label { display: grid; gap: 5px; min-width: 0; font-size: 12px; font-weight: 700; letter-spacing: .02em; }
.ggs-order label .ggs-order__opt { color: var(--clearer-muted, #666); font-weight: 500; }
.ggs-order input:not([type="radio"]), .ggs-order select, .ggs-order textarea { width: 100%; min-width: 0; min-height: 44px; border: 1px solid var(--clearer-line, #ddd); border-radius: 12px; background: #fff; padding: 10px 12px; color: inherit; font: 500 16px/1.3 inherit; font-family: inherit; }
.ggs-order textarea { resize: vertical; }
.ggs-order input:focus, .ggs-order select:focus, .ggs-order textarea:focus { outline: 2px solid var(--order-accent); outline-offset: 1px; border-color: transparent; }
.ggs-order__choice { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ggs-order__choice label { position: relative; }
.ggs-order__choice input { position: absolute; opacity: 0; pointer-events: none; }
.ggs-order__choice span { display: grid; place-items: center; min-height: 44px; border: 1px solid var(--clearer-line, #ddd); border-radius: 12px; color: inherit !important; font-size: 13px; font-weight: 700 !important; cursor: pointer; }
.ggs-order__choice input:checked + span { border-color: var(--order-accent); background: var(--order-accent); color: #fff !important; }
.ggs-order__choice input:focus-visible + span { outline: 2px solid var(--order-accent); outline-offset: 2px; }
.ggs-order__hint { color: var(--order-accent); font-weight: 600; }
.ggs-order__error { margin: 0; border-radius: 10px; background: #fdecec; padding: 9px 12px; color: #a3172b; font-size: 13px; font-weight: 600; }
.ggs-order__send { justify-content: center; width: 100%; min-height: 50px; background: var(--order-accent) !important; border-color: var(--order-accent) !important; gap: 8px; }
.ggs-order__note { margin: 0; color: var(--clearer-muted, #666); font-size: 12px; line-height: 1.5; text-align: center; }
@keyframes ggs-order-dim { from { background: rgb(17 17 19 / 0%); } }
@keyframes ggs-order-up { from { transform: translateY(28px); } }
@media (max-width: 599px) {
  .ggs-order { align-items: flex-end; padding: 0; }
  .ggs-order__sheet { width: 100%; max-height: 92dvh; border-radius: 22px 22px 0 0; padding: 18px 16px calc(16px + env(safe-area-inset-bottom)); }
}
@media (max-width: 379px) { .ggs-order__grid { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .ggs-order, .ggs-order__sheet { animation: none; } }
`);
console.log("GGS booking buttons open the order form");
