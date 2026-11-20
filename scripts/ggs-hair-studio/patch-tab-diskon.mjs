// Owner request: the phone bottom bar gets a fourth tab "Diskon" that opens /diskon, a page listing
// every discount running today (the same torn-ticket cards as the home page, laid out as a grid).
// Runs after patch-diskon.mjs and patch-my-ggs.mjs.
// Usage: node patch-tab-diskon.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const src = path.join(process.argv[2], "src");
const edit = (file, pairs) => {
  const p = path.join(src, file);
  let s = fs.readFileSync(p, "utf8");
  for (const [from, to] of pairs) {
    if (!s.includes(from)) throw new Error(`patch-tab-diskon: ${file}: not found: ${from.slice(0, 70)}`);
    s = s.split(from).join(to);
  }
  fs.writeFileSync(p, s);
};
edit("App.tsx", [
  [
    `            { href: '/book', label: 'Booking', icon: CalendarDays },\n`,
    `            { href: '/book', label: 'Booking', icon: CalendarDays },\n            { href: '/diskon', label: 'Diskon', icon: TicketPercent },\n`,
  ],
  [`        <Route path="/voucher">`, `        <Route path="/diskon">\n          <HomeDiscounts page />\n        </Route>\n        <Route path="/voucher">`],
  ["function HomeDiscounts() {", "function HomeDiscounts({ page = false }: { page?: boolean }) {"],
  [
    `rowSelector: ".ggs-deals__row", deps: [list.length]`,
    `rowSelector: page ? ".ggs-deals__row--autoplay-off" : ".ggs-deals__row", deps: [list.length, page]`,
  ],
  [
    "  if (!list.length) return null;",
    `  if (!list.length) return page ? (
    <section className="ggs-deals ggs-deals--page" data-testid="section-diskon-empty">
      <div className="ggs-deals__head">
        <div className="ggs-deals__head-text">
          <p className="clearer-kicker">PROMO BERLAKU</p>
          <h2>Belum ada diskon<br /><em>yang aktif.</em></h2>
          <p>Promo baru akan muncul di sini. Cek lagi nanti, ya.</p>
        </div>
      </div>
    </section>
  ) : null;`,
  ],
  [`<section className="ggs-deals" ref={dealsRef}`, `<section className={page ? "ggs-deals ggs-deals--page" : "ggs-deals"} ref={dealsRef}`],
  [`<div className="ggs-deals__row" role="list"`, `<div className={page ? "ggs-deals__row ggs-deals__row--grid" : "ggs-deals__row"} role="list"`],
  ["{[0, 1].flatMap((copy) => list.map(", "{(page ? [0] : [0, 1]).flatMap((copy) => list.map("],
]);
edit("homepage.css", [
  [
    `    width: min(100%, 420px);\n    grid-template-columns: repeat(3, minmax(0, 1fr));`,
    `    width: min(100%, 420px);\n    grid-template-columns: repeat(4, minmax(0, 1fr));`,
  ],
]);
fs.appendFileSync(
  path.join(src, "homepage.css"),
  `
/* /diskon page (patch-tab-diskon.mjs): every active discount at once, no auto-scroll. */
.ggs-deals--page { min-height: 70vh; padding-top: 40px; padding-bottom: calc(110px + env(safe-area-inset-bottom, 0px)); }
.ggs-deals--page .ggs-deals__nav { display: none !important; }
.ggs-deals__row--grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); overflow: visible; padding-right: 14px; }
.ggs-deals__row--grid .ggs-deal { flex: none; width: auto; }
`,
);
console.log("GGS bottom bar: Diskon tab added");
