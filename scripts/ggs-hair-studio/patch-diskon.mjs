// Owner request: the GGS home page shows the discounts running today as torn-ticket cards
// (data in diskon.json, rules in diskon.ts), each booking on its own studio's WhatsApp.
// The section hides itself when no discount is running. Runs after patch-whatsapp.mjs.
// Usage: node patch-diskon.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
const here = new URL(".", import.meta.url);
fs.copyFileSync(new URL("./diskon.ts", here), path.join(app, "src/ggs-diskon.ts"));
fs.copyFileSync(new URL("./diskon.json", here), path.join(app, "src/ggs-diskon.json"));
// The same frame-driven scroller the team rows use (patch-team.mjs re-copies the identical file).
fs.copyFileSync(new URL("./team-autoplay.ts", here), path.join(app, "src/ggs-team-autoplay.ts"));
const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
if (!s.includes("whatsappFor")) throw new Error("patch-diskon: run patch-whatsapp.mjs first");
const anchor = '      <section className="clearer-promise" data-testid="section-why-ggs">';
if (!s.includes(anchor)) throw new Error("patch-diskon: home anchor not found");
s = s.replace(anchor, `      <HomeDiscounts />

${anchor}`);
const fnAnchor = "function HomePage(";
s = s.replace(fnAnchor, `function HomeDiscounts() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(jakartaToday()), []);
  const list = today ? activeDiscounts(ggsDiscounts as GgsDiscount[], today) : [];
  // The row scrolls by itself (owner request); deps re-arms it once the cards actually mount.
  const dealsRef = useRowAutoplay<HTMLElement>({ rowSelector: ".ggs-deals__row", deps: [list.length] });
  const scrollDeals = (dir: number) => {
    const row = document.querySelector<HTMLElement>(".ggs-deals__row");
    if (!row) return;
    row.dispatchEvent(new Event(ROW_AUTOPLAY_PAUSE_EVENT));
    row.scrollBy({ left: dir * Math.max(240, row.clientWidth * 0.8), behavior: "smooth" });
  };
  if (!list.length) return null;
  return (
    <section className="ggs-deals" ref={dealsRef} aria-labelledby="home-deals-title" data-testid="section-home-discounts">
      <div className="ggs-deals__head">
        <div className="ggs-deals__head-text">
          <p className="clearer-kicker">PROMO BERLAKU</p>
          <h2 id="home-deals-title">Diskon<br /><em>yang sedang aktif.</em></h2>
          <p>Sobek tiketnya: tekan kartu untuk booking promo langsung lewat WhatsApp studionya.</p>
        </div>
        <div className="ggs-deals__nav">
          <button type="button" className="ggs-deals__arrow" aria-label="Geser daftar diskon ke kiri" onClick={() => scrollDeals(-1)} data-testid="btn-home-discounts-prev">&larr;</button>
          <button type="button" className="ggs-deals__arrow" aria-label="Geser daftar diskon ke kanan" onClick={() => scrollDeals(1)} data-testid="btn-home-discounts-next">&rarr;</button>
        </div>
      </div>
      <div className="ggs-deals__row" role="list" aria-label="Diskon aktif">
        {[0, 1].flatMap((copy) => list.map((deal, index) => (
          <button
            type="button"
            role="listitem"
            key={\`\${deal.id}-\${copy}\`}
            className={\`ggs-deal ggs-deal--\${deal.audience}\`}
            onClick={() => openGgsWhatsApp(discountWaText(deal), whatsappFor({ audience: deal.audience }))}
            data-team-index={index}
            data-team-copy={copy ? '' : undefined}
            aria-hidden={copy ? true : undefined}
            tabIndex={copy ? -1 : undefined}
            data-testid={copy ? undefined : \`card-home-discount-\${deal.id}\`}
          >
            <span className="ggs-deal__main">
              <span className="ggs-deal__studio">{discountStudio(deal).toUpperCase()}</span>
              <strong className="ggs-deal__title">{deal.title}</strong>
              <span className="ggs-deal__price">{deal.normalPrice ? <s>{discountPrice(deal.normalPrice)}</s> : <small>Harga promo</small>} <b>{discountPrice(deal.promoPrice)}</b></span>
              <span className="ggs-deal__terms">{deal.terms}</span>
              <span className="ggs-deal__until">Berlaku s/d {discountEndLabel(deal.end)}</span>
            </span>
            <span className="ggs-deal__stub" aria-hidden="true">
              <small>{discountIsPercent(deal) ? 'DISKON' : 'SPESIAL'}</small>
              <span className={discountIsPercent(deal) ? 'ggs-deal__pct' : 'ggs-deal__pct ggs-deal__pct--word'}>{deal.label}</span>
              <small className="ggs-deal__cta">Booking</small>
            </span>
          </button>
        )))}
      </div>
    </section>
  );
}

${fnAnchor}`);
s = s.replace("import { useQueryClient }", "import ggsDiscounts from './ggs-diskon.json';\nimport { activeDiscounts, discountEndLabel, discountIsPercent, discountPrice, discountStudio, discountWaText, jakartaToday, type GgsDiscount } from './ggs-diskon';\nimport { ROW_AUTOPLAY_PAUSE_EVENT, useRowAutoplay } from './ggs-team-autoplay';\nimport { useQueryClient }");
fs.writeFileSync(file, s);

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS active discounts as torn tickets (patch-diskon.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `
${marker}
.ggs-deals { --deal-bg: #f3ebe0; --deal-paper: #fffaf3; --deal-ink: #2d2520; --deal-line: #c9b9a2; background: var(--deal-bg); padding: 56px var(--ggs-gutter, 20px); }
.ggs-deals__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; max-width: 1260px; margin: 0 auto 26px; }
.ggs-deals__head-text { min-width: 0; }
.ggs-deals__head h2 { margin: 6px 0 10px; color: var(--deal-ink); font: 500 clamp(34px, 5vw, 52px)/1 'Cormorant Garamond', serif; }
.ggs-deals__head h2 em { color: var(--clearer-accent, #b0466a); }
.ggs-deals__head-text > p:last-child { max-width: 520px; margin: 0; color: #6d6156; font-size: 14px; line-height: 1.55; }
.ggs-deals__nav { display: none; flex: 0 0 auto; gap: 10px; padding-bottom: 4px; }
.ggs-deals__arrow { width: 46px; height: 46px; border: 1px solid var(--deal-line); border-radius: 999px; background: var(--deal-paper); color: var(--deal-ink); font: 500 20px/1 'Cormorant Garamond', serif; cursor: pointer; transition: background 200ms ease, color 200ms ease, transform 200ms ease; }
.ggs-deals__arrow:hover { background: var(--deal-ink); color: var(--deal-paper); transform: translateY(-2px); }
.ggs-deals__arrow:focus-visible { outline: 2px solid var(--clearer-accent, #b0466a); outline-offset: 3px; }
.ggs-deals__row { display: flex; gap: 18px; max-width: 1260px; margin: 0 auto; overflow-x: auto; padding: 6px 4px 18px; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.ggs-deals__row::-webkit-scrollbar { display: none; }
.ggs-deal { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 104px; flex: 0 0 min(86vw, 380px); min-height: 178px; padding: 0; border: 0; background: none; color: var(--deal-ink); text-align: left; cursor: pointer; filter: drop-shadow(0 10px 14px rgb(55 40 28 / 16%)); transition: transform 220ms ease; font: inherit; }
.ggs-deal:hover, .ggs-deal:focus-visible { transform: translateY(-3px) rotate(-.4deg); }
.ggs-deal:focus-visible { outline: 2px solid var(--clearer-accent, #b0466a); outline-offset: 4px; }
/* Paper with round punch-outs where the ticket tears. */
.ggs-deal__main, .ggs-deal__stub { position: relative; background: var(--deal-paper); }
.ggs-deal__main { display: flex; flex-direction: column; gap: 6px; padding: 18px 18px 16px 20px; border-radius: 6px 0 0 6px;
  -webkit-mask: radial-gradient(circle 10px at 100% 0, #0000 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 10px at 100% 100%, #0000 98%, #000) bottom / 100% 51% no-repeat;
          mask: radial-gradient(circle 10px at 100% 0, #0000 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 10px at 100% 100%, #0000 98%, #000) bottom / 100% 51% no-repeat; }
.ggs-deal__stub { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-left: 2px dashed var(--deal-line); background: #2b2420; color: #f6e7c8; transform: rotate(2.5deg) translate(4px, 3px); transform-origin: left center;
  -webkit-mask: radial-gradient(circle 10px at 0 0, #0000 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 10px at 0 100%, #0000 98%, #000) bottom / 100% 51% no-repeat;
          mask: radial-gradient(circle 10px at 0 0, #0000 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 10px at 0 100%, #0000 98%, #000) bottom / 100% 51% no-repeat; }
/* Ragged torn edge on the stub's outer side. */
.ggs-deal__stub::after { content: ''; position: absolute; top: 0; right: -1px; bottom: 0; width: 9px; background: linear-gradient(135deg, var(--deal-bg) 50%, transparent 50%) 0 0 / 9px 12px repeat-y, linear-gradient(45deg, transparent 50%, var(--deal-bg) 50%) 0 6px / 9px 12px repeat-y; }
.ggs-deal--wanita .ggs-deal__stub { background: #b0466a; color: #fff3f7; }
.ggs-deal__studio { color: #8a7b6c; font-size: 9px; font-weight: 700; letter-spacing: .18em; }
.ggs-deal__title { font: 500 26px/1.02 'Cormorant Garamond', serif; }
.ggs-deal__price { display: flex; align-items: baseline; gap: 8px; margin-top: 2px; }
.ggs-deal__price s, .ggs-deal__price small { color: #9a8d80; font-size: 13px; }
.ggs-deal__price b { color: var(--clearer-accent, #b0466a); font-size: 20px; }
.ggs-deal--pria .ggs-deal__price b { color: #8b6a2b; }
.ggs-deal__terms { color: #5f544a; font-size: 12.5px; line-height: 1.4; }
.ggs-deal__until { margin-top: auto; padding-top: 8px; border-top: 1px dashed var(--deal-line); color: #7b6e62; font-size: 11px; font-weight: 600; letter-spacing: .04em; }
.ggs-deal__stub small { font-size: 9px; font-weight: 700; letter-spacing: .2em; opacity: .85; }
.ggs-deal__pct { font: 600 38px/1 'Cormorant Garamond', serif; }
.ggs-deal__pct--word { font-size: 17px; letter-spacing: .03em; }
.ggs-deal__cta { margin-top: 6px; padding: 4px 8px; border: 1px solid currentColor; border-radius: 999px; letter-spacing: .12em !important; }
@media (min-width: 1100px) { .ggs-deals__nav { display: flex; } .ggs-deal { flex-basis: 340px; } }
@media (max-width: 380px) { .ggs-deal { grid-template-columns: minmax(0, 1fr) 88px; } .ggs-deal__title { font-size: 22px; } .ggs-deal__pct { font-size: 32px; } .ggs-deal__pct--word { font-size: 14px; } }
@media (prefers-reduced-motion: reduce) { .ggs-deal { transition: none; } .ggs-deal:hover, .ggs-deal:focus-visible { transform: none; } }
`);
console.log("GGS home page shows active discounts");
