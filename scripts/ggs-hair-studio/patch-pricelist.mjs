// Adds the owner's women's price list (from GGS-Price-List-A4_PRINT_2.pdf) as /pricelist-wanita
// and points the "Pricelist Wanita" menu item there. Every row books through WhatsApp.
// The page follows the printed A4 design: pink gradient hero, sticky category chips,
// price cards per category, and a "Booking Now" bar with the studio's contacts.
// Usage: node patch-pricelist.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
const data = fs.readFileSync(new URL("./pricelist-wanita.json", import.meta.url), "utf8");
const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
const swap = (from, to, all = false) => {
  if (!s.includes(from)) throw new Error(`patch-pricelist: "${from.slice(0, 60)}" not found`);
  s = all ? s.split(from).join(to) : s.replace(from, to);
};
swap("{ label: 'Pricelist Wanita', href: '/style-gallery'", "{ label: 'Pricelist Wanita', href: '/pricelist-wanita'");
// Keep the women's gallery icon for the menu item at its new address.
swap("item.href === '/style-gallery' ?", "(item.href === '/style-gallery' || item.href === '/pricelist-wanita') ?", true);
swap("item.href === '/style-gallery' ||", "item.href === '/style-gallery' || item.href === '/pricelist-wanita' ||", true);
swap('        <Route path="/book">', '        <Route path="/pricelist-wanita">\n          <PricelistWanitaPage />\n        </Route>\n        <Route path="/book">');
s += `
const pricelistWanita: { group: string; title: string; items: [string, string][] }[] = ${data.trim()};

type PricelistSection = (typeof pricelistWanita)[number];

function pricelistChip(section: PricelistSection): string {
  if (section.group === 'Nail Art') return 'Nail Art';
  if (section.group === 'Body') return 'Body';
  if (section.group === 'Kids') return 'Anak';
  if (section.group === 'Massage') return 'Massage & Spa';
  if (section.title.startsWith('Colouring')) return 'Colouring';
  if (section.title === 'Haircuts & Styling') return 'Hair & Style';
  return 'Treatment';
}

const pricelistChips = ['Semua', 'Nail Art', 'Hair & Style', 'Colouring', 'Treatment', 'Massage & Spa', 'Body', 'Anak'];

function PricelistWanitaPage() {
  const [chip, setChip] = useState('Semua');
  const sections = chip === 'Semua' ? pricelistWanita : pricelistWanita.filter((section) => pricelistChip(section) === chip);
  return (
    <div className="inner-page ggs-pl" data-testid="page-pricelist-wanita">
      <section className="ggs-pl-hero">
        <p className="ggs-pl-kicker">GGS BEAUTY / PRICELIST WANITA</p>
        <h1>Grooming is better<br /><em>your style, your crown.</em></h1>
        <p className="ggs-pl-intro">Harga dalam Rupiah. Ketuk layanan yang kamu mau untuk langsung booking lewat WhatsApp GGS.</p>
      </section>
      <nav className="ggs-pl-chips" aria-label="Kategori pricelist">
        {pricelistChips.map((name) => (
          <button key={name} type="button" className={name === chip ? 'is-active' : ''} onClick={() => setChip(name)} aria-pressed={name === chip}>
            {name}
          </button>
        ))}
      </nav>
      <div className="inner-page-content">
        <div className="ggs-pricelist">
          {sections.map((section) => (
            <section className="ggs-pricelist-card" key={section.title}>
              <p className="ggs-pl-card-kicker">{pricelistChip(section)}</p>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map(([name, price]) => (
                  <li key={name}>
                    <button type="button" onClick={() => openGgsWhatsApp(pricelistWaText(section.title, name, price))} aria-label={\`Booking \${name}, \${price}, lewat WhatsApp\`}>
                      <span className="ggs-pricelist-name">{name}</span>
                      <strong>{price}</strong>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="ggs-pricelist-note">Harga dengan rentang menyesuaikan panjang dan ketebalan rambut. Tim GGS akan mengonfirmasi harga akhir lewat WhatsApp.</p>
        <div className="ggs-pl-booking">
          <div className="ggs-pl-booking-info">
            <p className="ggs-pl-card-kicker">BOOKING NOW</p>
            <p className="ggs-pl-booking-contact"><Instagram size={16} aria-hidden="true" /> @ggsbeauty.hair.co</p>
            <p className="ggs-pl-booking-contact"><Phone size={16} aria-hidden="true" /> 0823-4277-7723</p>
          </div>
          <button type="button" className="ggs-pl-booking-cta" onClick={() => openGgsWhatsApp('Halo GGS Hair Studio, saya ingin booking dari Pricelist Wanita. Layanan yang saya inginkan: ')}>
            <MessageCircle size={18} aria-hidden="true" /> Booking via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
`;
swap("import { openGgsWhatsApp,", "import { pricelistWaText, openGgsWhatsApp,");
fs.writeFileSync(file, s);

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS pricelist (patch-pricelist.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `
${marker}
.ggs-pl-hero { margin: 0 calc(50% - 50vw); padding: 56px max(24px, calc(50vw - 560px)) 40px; background: linear-gradient(135deg, #fce4ef 0%, #f8bbd9 45%, #f48fb8 100%); color: #4a0d27; }
.ggs-pl-kicker { margin: 0 0 10px; font-size: 12px; font-weight: 700; letter-spacing: .18em; color: #a3134f; }
.ggs-pl-hero h1 { margin: 0; font-size: clamp(34px, 6vw, 56px); line-height: 1.05; letter-spacing: -.01em; }
.ggs-pl-hero h1 em { font-style: italic; color: #c2185b; }
.ggs-pl-intro { margin: 14px 0 0; max-width: 46ch; font-size: 15px; color: #6d1f3e; }
.ggs-pl-chips { position: sticky; top: 0; z-index: 30; display: flex; gap: 8px; overflow-x: auto; padding: 12px max(24px, calc(50vw - 560px)); margin: 0 calc(50% - 50vw); background: rgba(255, 241, 247, .92); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(194, 24, 91, .15); scrollbar-width: none; }
.ggs-pl-chips::-webkit-scrollbar { display: none; }
.ggs-pl-chips button { flex: none; border: 1px solid rgba(194, 24, 91, .35); background: #fff; color: #a3134f; border-radius: 999px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
.ggs-pl-chips button.is-active { background: #c2185b; border-color: #c2185b; color: #fff; }
.ggs-pl-chips button:focus-visible { outline: 2px solid #c2185b; outline-offset: 2px; }
.ggs-pricelist { display: grid; gap: 20px; grid-template-columns: 1fr; }
@media (min-width: 700px) { .ggs-pricelist { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items: start; } }
@media (min-width: 1100px) { .ggs-pricelist { gap: 28px; } }
.ggs-pricelist-card { background: #fff; border: 1px solid rgba(194, 24, 91, .14); border-radius: 18px; padding: 22px 20px 12px; box-shadow: 0 14px 30px -24px rgba(194, 24, 91, .4); }
@media (min-width: 1100px) { .ggs-pricelist-card { padding: 28px 28px 16px; } }
.ggs-pl-card-kicker { margin: 0 0 6px; font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #c2185b; }
.ggs-pricelist-card h2 { margin: 0 0 10px; font-size: clamp(24px, 2.4vw, 30px); line-height: 1.1; }
.ggs-pricelist-card ul { list-style: none; margin: 0; padding: 0; }
.ggs-pricelist-card li + li { border-top: 1px dashed rgba(194, 24, 91, .18); }
.ggs-pricelist-card li button { all: unset; box-sizing: border-box; display: flex; align-items: baseline; gap: 10px; width: 100%; padding: 12px 4px; cursor: pointer; border-radius: 8px; font-size: 15px; }
.ggs-pricelist-card li button:hover, .ggs-pricelist-card li button:focus-visible { background: rgba(194, 24, 91, .06); }
.ggs-pricelist-card li button:focus-visible { outline: 2px solid #c2185b; outline-offset: 2px; }
.ggs-pricelist-name { flex: 1 1 auto; min-width: 0; }
.ggs-pricelist-card strong { flex: none; color: #c2185b; font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }
.ggs-pricelist-note { margin: 24px 0 0; font-size: 14px; opacity: .75; }
.ggs-pl-booking { margin: 28px 0 8px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; background: linear-gradient(135deg, #c2185b, #8e0f42); color: #fff; border-radius: 20px; padding: 24px; }
.ggs-pl-booking .ggs-pl-card-kicker { color: #ffd3e6; }
.ggs-pl-booking-contact { display: flex; align-items: center; gap: 8px; margin: 6px 0 0; font-size: 15px; font-weight: 600; }
.ggs-pl-booking button.ggs-pl-booking-cta { display: inline-flex; align-items: center; gap: 10px; border: 0; border-radius: 999px; background: #fff; color: #a3134f; font-size: 15px; font-weight: 700; padding: 14px 22px; cursor: pointer; }
.ggs-pl-booking button.ggs-pl-booking-cta:hover { background: #ffe3ef; color: #a3134f; }
.ggs-pl-booking button.ggs-pl-booking-cta:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`);
console.log("GGS women's price list added");
