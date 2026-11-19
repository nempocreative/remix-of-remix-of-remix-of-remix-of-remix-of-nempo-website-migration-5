// Puts the real GGS logo into the visitor app before it is built (header, sign-in page, footer, tab icon).
// Usage: node patch-logo.mjs <ggs-visit app dir> <brand dir>
import fs from "node:fs";
import path from "node:path";
const [app, brand] = process.argv.slice(2);
for (const f of fs.readdirSync(brand)) fs.copyFileSync(path.join(brand, f), path.join(app, "public", f));

const swap = (file, pairs) => {
  const p = path.join(app, file);
  let s = fs.readFileSync(p, "utf8");
  for (const [from, to] of pairs) {
    if (s.includes(to)) continue;
    if (!s.includes(from)) throw new Error(`patch-logo: "${from.slice(0, 50)}" not found in ${file}`);
    s = s.replace(from, to);
  }
  fs.writeFileSync(p, s);
};
const img = (cls, file = "ggs-logo-192.png") =>
  `<img className="${cls}" src={\`\${import.meta.env.BASE_URL}${file}\`} alt="" width={96} height={96} />`;

swap("src/App.tsx", [
  ['<span className="clearer-mark">G</span>', img("clearer-mark ggs-logo-img")],
  ['<span className="ggs-auth-page__mark" aria-hidden="true">G</span>', img("ggs-auth-page__mark ggs-logo-img")],
  [
    '<footer className="clearer-footer">\n        <p>',
    '<footer className="clearer-footer">\n        ' + img("ggs-footer-logo") + "\n        <p>",
  ],
]);
swap("index.html", [
  [
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/ggs-hair-studio/favicon-32.png?v=ggs-2" />\n    <link rel="icon" type="image/png" sizes="64x64" href="/ggs-hair-studio/favicon.png?v=ggs-2" />\n    <link rel="icon" type="image/png" sizes="192x192" href="/ggs-hair-studio/ggs-logo-192.png?v=ggs-2" />\n    <link rel="apple-touch-icon" sizes="180x180" href="/ggs-hair-studio/apple-touch-icon.png?v=ggs-2" />',
  ],
]);
const css = path.join(app, "src/homepage.css");
const extra = `
/* GGS logo (patch-logo.mjs) */
.ggs-logo-img.clearer-mark, .ggs-logo-img.ggs-auth-page__mark { display: block; flex: none; width: 56px; height: 56px; padding: 0; border: 0; border-radius: 50%; object-fit: contain; background: transparent; box-shadow: 0 4px 12px -6px rgba(26,20,18,.35); }
.ggs-logo-img.ggs-auth-page__mark { width: 46px; height: 46px; }
.ggs-footer-logo { display: block; width: 96px; height: 96px; margin: 0 0 14px; border-radius: 50%; object-fit: contain; }
@media (max-width: 640px) { .ggs-logo-img.clearer-mark { width: 48px; height: 48px; } .ggs-footer-logo { width: 84px; height: 84px; } }
`;
const c = fs.readFileSync(css, "utf8");
if (!c.includes("patch-logo.mjs")) fs.writeFileSync(css, c + extra);
console.log("GGS logo patched in");
