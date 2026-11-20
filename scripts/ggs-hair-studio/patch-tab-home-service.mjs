// Owner request: the phone bottom bar's "Services" tab becomes "Home Service" and opens the
// existing /home-service page (a visit-to-home request), instead of the services category list.
// Runs after patch-tab-diskon.mjs.
// Usage: node patch-tab-home-service.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const src = path.join(process.argv[2], "src");
const edit = (file, pairs) => {
  const p = path.join(src, file);
  let s = fs.readFileSync(p, "utf8");
  for (const [from, to] of pairs) {
    if (!s.includes(from)) throw new Error(`patch-tab-home-service: ${file}: not found: ${from.slice(0, 70)}`);
    s = s.split(from).join(to);
  }
  fs.writeFileSync(p, s);
};
edit("App.tsx", [
  [
    `            { href: '/services', label: 'Services', icon: Scissors },\n`,
    `            { href: '/home-service', label: 'Home Service', icon: MapPin },\n`,
  ],
]);
console.log("GGS bottom bar: Services tab replaced by Home Service");
