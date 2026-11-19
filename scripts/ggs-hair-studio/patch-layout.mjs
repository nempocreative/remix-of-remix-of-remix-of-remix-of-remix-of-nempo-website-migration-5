// Evens out the GGS visitor app's side spacing on phone, iPad and desktop before it is built.
// One shared side gutter for header, sections, inner pages and footer; wide screens centre the content.
// Usage: node patch-layout.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const css = path.join(process.argv[2], "src/homepage.css");
const marker = "/* GGS layout polish (patch-layout.mjs) */";
const extra = `
${marker}
.clearer-page { --ggs-gutter: 20px; }
@media (min-width: 700px) { .clearer-page { --ggs-gutter: 40px; } }
@media (min-width: 1100px) { .clearer-page { --ggs-gutter: max(64px, min(6vw, 96px), calc((100vw - 1320px) / 2)); } }
.clearer-page > .clearer-header,
.clearer-page > .clearer-footer,
.clearer-page > section:not(.ggs-carousel):not(.ggs-quick-menu),
.clearer-page .inner-page-hero,
.clearer-page .inner-page-content { padding-left: var(--ggs-gutter) !important; padding-right: var(--ggs-gutter) !important; }
.clearer-page .inner-page-hero,
.clearer-page .inner-page-content { max-width: none !important; }
.clearer-page .inner-page-stamp { right: var(--ggs-gutter) !important; }
.clearer-home-menu.ggs-quick-menu { max-width: 1080px !important; margin-left: auto !important; margin-right: auto !important; padding-left: var(--ggs-gutter) !important; padding-right: var(--ggs-gutter) !important; }
@media (min-width: 700px) {
  .ggs-quick-menu-icon { --quick-menu-icon-size: 66px; }
  .ggs-quick-menu-item { font-size: 14px; }
}
.clearer-footer { gap: 16px 24px; }
.clearer-footer .ggs-footer-logo { margin: 0; }
@media (min-width: 700px) {
  .clearer-page > .clearer-footer { display: grid !important; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; }
}
`;
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + extra);
console.log("GGS layout evened out");

// Second pass: one shared top/bottom spacing for every home section, and a full-width quick menu band.
const marker2 = "/* GGS vertical rhythm (patch-layout.mjs) */";
const extra2 = `
${marker2}
.clearer-page { --ggs-section-y: 56px; }
@media (min-width: 700px) { .clearer-page { --ggs-section-y: 72px; } }
@media (min-width: 1100px) { .clearer-page { --ggs-section-y: 96px; } }
.clearer-page > section:not(.ggs-carousel):not(.ggs-quick-menu) { padding-top: var(--ggs-section-y) !important; padding-bottom: var(--ggs-section-y) !important; }
.clearer-home-menu.ggs-quick-menu { max-width: none !important; padding-top: 16px !important; padding-bottom: 24px !important; }
.clearer-home-menu.ggs-quick-menu > * { max-width: 1080px; margin-left: auto; margin-right: auto; }
`;
const c2 = fs.readFileSync(css, "utf8");
if (!c2.includes(marker2)) fs.writeFileSync(css, c2 + extra2);

// Owner request: pink only behind the quick menu grid; the rest of the page is neutral cream.
const marker4 = "/* GGS pink menu band only (patch-layout.mjs) */";
const extra4 = `
${marker4}
.clearer-page:has(.ggs-carousel) {
  --clearer-menu-band: #f8e8ef;
  --clearer-paper: #f8f5ee;
  --clearer-paper-deep: #f3efe7;
  --clearer-line: #e6dfd5;
}
.clearer-page:has(.ggs-carousel) .clearer-home-menu.ggs-quick-menu { background: var(--clearer-menu-band); }
.clearer-page:has(.ggs-carousel) .ggs-team-showcase-home { background: var(--clearer-paper); }
.clearer-page:has(.ggs-carousel) .ggs-team-showcase-home::before { background: none; }
.clearer-page:has(.ggs-carousel) .ggs-team-showcase-home .ggs-crew-wanita { background: var(--clearer-paper); }
`;
const c4 = fs.readFileSync(css, "utf8");
if (!c4.includes(marker4)) fs.writeFileSync(css, c4 + extra4);

// Owner request: no cart icon in the GGS header.
const marker3 = "/* GGS no cart icon (patch-layout.mjs) */";
const c3 = fs.readFileSync(css, "utf8");
if (!c3.includes(marker3)) fs.writeFileSync(css, c3 + `\n${marker3}\n[data-testid="button-header-cart"], #header-cart-panel { display: none !important; }\n`);
