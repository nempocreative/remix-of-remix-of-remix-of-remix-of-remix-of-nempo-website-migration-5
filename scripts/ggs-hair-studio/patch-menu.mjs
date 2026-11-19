// Removes menu shortcuts the owner does not want (Cabang, Kelas, Event) before the visitor app is built.
// Usage: node patch-menu.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const p = path.join(process.argv[2], "src/App.tsx");
let s = fs.readFileSync(p, "utf8");
for (const label of ["Cabang", "Kelas", "Event"]) {
  s = s.replace(new RegExp(`\\n  \\{ label: '${label}', href: '[^']*'[^\\n]*\\},`), "");
}
fs.writeFileSync(p, s);
console.log("GGS menu trimmed");
// Owner's menu names.
{
  let t = fs.readFileSync(p, "utf8");
  const names = [
    ["Men's Grooming", "Model Rambut Pria"],
    ["Women's Hair", "Model Rambut Wanita"],
    ["Hair & Self Care", "Pricelist Pria"],
    ["Galeri Gaya", "Pricelist Wanita"],
    ["Voucher", "Promo"],
  ];
  for (const [from, to] of names) {
    const q = from.includes("'") ? `"${from}"` : `'${from}'`;
    const re = new RegExp(`(\\{ label: )${q.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&")}(, href:)`);
    if (!re.test(t) && !t.includes(`label: '${to}'`)) throw new Error(`patch-menu: ${from} not found`);
    t = t.replace(re, `$1'${to}'$2`);
  }
  fs.writeFileSync(p, t);
}
