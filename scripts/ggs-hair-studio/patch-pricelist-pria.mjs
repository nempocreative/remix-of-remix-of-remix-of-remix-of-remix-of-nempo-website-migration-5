// Adds the owner's men's barber price list (black-and-gold poster) as /pricelist-pria and points
// the "Pricelist Pria" menu item there. Every row books through the barber's own WhatsApp.
// Runs after patch-pricelist.mjs and reuses its page layout with a dark gold theme.
// Usage: node patch-pricelist-pria.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
const data = fs.readFileSync(new URL("./pricelist-pria.json", import.meta.url), "utf8");
const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
const swap = (from, to, all = false) => {
  if (!s.includes(from)) throw new Error(`patch-pricelist-pria: "${from.slice(0, 60)}" not found`);
  s = all ? s.split(from).join(to) : s.replace(from, to);
};
swap("{ label: 'Pricelist Pria', href: '/hair-self-care'", "{ label: 'Pricelist Pria', href: '/pricelist-pria'");
// Keep the menu item's icon and style at its new address.
swap("item.href === '/hair-self-care'", "(item.href === '/hair-self-care' || item.href === '/pricelist-pria')", true);
swap('        <Route path="/pricelist-wanita">', '        <Route path="/pricelist-pria">\n          <PricelistPriaPage />\n        </Route>\n        <Route path="/pricelist-wanita">');
swap("import { pricelistWaText,", "import { pricelistWaText, pricelistPriaWaText, openGgsPriaWhatsApp,");
s += `
const pricelistPria: { group: string; title: string; note?: string; items: [string, string, string?][] }[] = ${data.trim()};

const pricelistPriaChips = ['Semua', ...pricelistPria.map((section) => section.group)];

function PricelistPriaPage() {
  const [chip, setChip] = useState('Semua');
  const sections = chip === 'Semua' ? pricelistPria : pricelistPria.filter((section) => section.group === chip);
  return (
    <div className="inner-page ggs-pl ggs-pl-pria" data-testid="page-pricelist-pria">
      <section className="ggs-pl-hero">
        <p className="ggs-pl-kicker">GGS HAIR STUDIO / PRICELIST PRIA</p>
        <h1>Barber Shop<br /><em>grooming is better.</em></h1>
        <p className="ggs-pl-intro">Harga dalam Rupiah. Ketuk layanan yang kamu mau untuk langsung booking lewat WhatsApp barber GGS.</p>
      </section>
      <nav className="ggs-pl-chips" aria-label="Kategori pricelist pria">
        {pricelistPriaChips.map((name) => (
          <button key={name} type="button" className={name === chip ? 'is-active' : ''} onClick={() => setChip(name)} aria-pressed={name === chip}>
            {name}
          </button>
        ))}
      </nav>
      <div className="inner-page-content">
        <div className="ggs-pricelist">
          {sections.map((section) => (
            <section className="ggs-pricelist-card" key={section.title}>
              <p className="ggs-pl-card-kicker">Pricelist Pria</p>
              <h2>{section.title}</h2>
              {section.note ? <p className="ggs-pl-section-note">{section.note}</p> : null}
              <ul>
                {section.items.map(([name, price, detail]) => (
                  <li key={name}>
                    <button type="button" onClick={() => openGgsPriaWhatsApp(pricelistPriaWaText(section.title, name, price))} aria-label={\`Booking \${name}, \${price}, lewat WhatsApp\`}>
                      <span className="ggs-pricelist-name">{name}{detail ? <small className="ggs-pl-item-detail">{detail}</small> : null}</span>
                      <strong>{price}</strong>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="ggs-pricelist-note">Tim barber GGS akan mengonfirmasi jadwal lewat WhatsApp.</p>
        <div className="ggs-pl-booking">
          <div className="ggs-pl-booking-info">
            <p className="ggs-pl-card-kicker">BOOKING NOW</p>
            <p className="ggs-pl-booking-contact"><Instagram size={16} aria-hidden="true" /> @hairstudio.ggs.grt</p>
            <p className="ggs-pl-booking-contact"><Phone size={16} aria-hidden="true" /> 0813-3335-9200</p>
          </div>
          <button type="button" className="ggs-pl-booking-cta" onClick={() => openGgsPriaWhatsApp('Halo GGS Hair Studio, saya ingin booking dari Pricelist Pria. Layanan yang saya inginkan: ')}>
            <MessageCircle size={18} aria-hidden="true" /> Booking via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(file, s);

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS men's pricelist (patch-pricelist-pria.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `
${marker}
.ggs-pl-pria { --pria-gold: #d4a84b; --pria-gold-soft: #f1d58f; --pria-ink: #0f0d0a; }
.ggs-pl-pria .ggs-pl-hero { background: radial-gradient(120% 140% at 100% 0%, #3a2c12 0%, #17130c 45%, var(--pria-ink) 100%); color: #f6efe0; border-bottom: 2px solid var(--pria-gold); }
.ggs-pl-pria .ggs-pl-kicker { color: var(--pria-gold); }
.ggs-pl-pria .ggs-pl-hero h1 { text-transform: uppercase; letter-spacing: .01em; }
.ggs-pl-pria .ggs-pl-hero h1 em { color: var(--pria-gold-soft); text-transform: none; }
.ggs-pl-pria .ggs-pl-intro { color: #d9cfbc; }
.ggs-pl-pria .ggs-pl-chips { background: rgba(15, 13, 10, .94); border-bottom-color: rgba(212, 168, 75, .35); }
.ggs-pl-pria .ggs-pl-chips button { background: transparent; border-color: rgba(212, 168, 75, .55); color: var(--pria-gold-soft); }
.ggs-pl-pria .ggs-pl-chips button.is-active { background: var(--pria-gold); border-color: var(--pria-gold); color: var(--pria-ink); }
.ggs-pl-pria .ggs-pl-chips button:focus-visible { outline-color: var(--pria-gold); }
.ggs-pl-pria .ggs-pricelist-card { background: #16130e; color: #f6efe0; border-color: rgba(212, 168, 75, .35); box-shadow: 0 18px 34px -26px rgba(0, 0, 0, .8); }
.ggs-pl-pria .ggs-pl-card-kicker { color: var(--pria-gold); }
.ggs-pl-pria .ggs-pricelist-card h2 { color: var(--pria-gold-soft); text-transform: uppercase; letter-spacing: .02em; }
.ggs-pl-pria .ggs-pricelist-card li + li { border-top-color: rgba(212, 168, 75, .22); }
.ggs-pl-pria .ggs-pricelist-card li button:hover, .ggs-pl-pria .ggs-pricelist-card li button:focus-visible { background: rgba(212, 168, 75, .1); }
.ggs-pl-pria .ggs-pricelist-card li button:focus-visible { outline-color: var(--pria-gold); }
.ggs-pl-pria .ggs-pricelist-card strong { color: var(--pria-gold); }
.ggs-pl-pria .ggs-pl-section-note { margin: -4px 0 8px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--pria-gold); }
.ggs-pl-pria .ggs-pl-item-detail { display: block; margin-top: 4px; font-size: 13px; color: #cbbf9f; }
.ggs-pl-pria .ggs-pl-booking { background: linear-gradient(135deg, #1d1810, var(--pria-ink)); border: 1px solid var(--pria-gold); color: #f6efe0; }
.ggs-pl-pria .ggs-pl-booking .ggs-pl-card-kicker { color: var(--pria-gold); }
.ggs-pl-pria .ggs-pl-booking button.ggs-pl-booking-cta { background: var(--pria-gold); color: var(--pria-ink); }
.ggs-pl-pria .ggs-pl-booking button.ggs-pl-booking-cta:hover { background: var(--pria-gold-soft); color: var(--pria-ink); }
.ggs-pl-pria .ggs-pl-booking button.ggs-pl-booking-cta:focus-visible { outline-color: var(--pria-gold); }
`);
console.log("GGS men's price list added");
