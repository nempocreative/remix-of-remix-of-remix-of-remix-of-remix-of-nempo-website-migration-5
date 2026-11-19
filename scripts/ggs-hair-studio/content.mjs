// Pulls the default site, services and products out of the original GGS server file.
import fs from "node:fs";
import { servicesFromPricelists } from "./pricelist-services.ts";
const [src, out] = process.argv.slice(2);
const text = fs.readFileSync(src, "utf8");
const grab = (name) => {
  const start = text.indexOf(`const ${name} =`);
  const end = text.indexOf("\n};", start) > -1 && name === "defaultSite" ? text.indexOf("\n};", start) + 3 : text.indexOf("\n];", start) + 3;
  return text.slice(start, end).replace(`const ${name} =`, "return");
};
const site = new Function(grab("defaultSite"))();
const services = new Function(grab("defaultServices"))();
const products = new Function(grab("defaultProducts"))();
const readList = (file) => JSON.parse(fs.readFileSync(new URL(`./${file}`, import.meta.url), "utf8"));
const img = (u) => (u && u.startsWith("/") ? `/ggs-hair-studio${u}` : u ?? null);
const order = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name);
const data = {
  site: { brandName: site.brandName, tagline: site.tagline, introduction: site.introduction, phone: site.phone, address: site.address, openingHours: site.openingHours, instagramHandle: site.instagramHandle, heroImageUrl: img(site.heroImageUrl) },
  // Services come from the owner's men's and women's price lists, not the original sample services.
  services: servicesFromPricelists(readList("pricelist-pria.json"), readList("pricelist-wanita.json")),
  products: products.filter((p) => p.active !== false).sort(order).map((p, i) => ({ id: i + 1, name: p.name, category: p.category ?? "", description: p.description ?? "", price: p.price, stock: p.stock ?? 0, active: true, imageUrl: img(p.imageUrl) })),
  vouchers: [],
};
fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
console.log(`content: ${data.services.length} services, ${data.products.length} products`);
