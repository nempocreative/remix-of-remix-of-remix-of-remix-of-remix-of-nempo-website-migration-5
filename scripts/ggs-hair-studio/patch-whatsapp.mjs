// Owner request: no cart and no online booking form; every booking, product order and promo
// goes straight to the studio's WhatsApp with a prefilled text naming what the visitor asked for.
// Usage: node patch-whatsapp.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
const helper = path.join(app, "src/ggs-whatsapp.ts");
fs.writeFileSync(helper, fs.readFileSync(new URL("./ggs-whatsapp.ts", import.meta.url), "utf8"));

const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
const swap = (from, to, all = false) => {
  if (!s.includes(from)) throw new Error(`patch-whatsapp: "${from.slice(0, 60)}" not found`);
  s = all ? s.split(from).join(to) : s.replace(from, to);
};
swap("import { useQueryClient }", "import { openGgsWhatsApp, openServiceWhatsApp, whatsappFor, productWaText, bookingWaText, homeServiceWaText } from './ggs-whatsapp';\nimport { useQueryClient }");
// Service cards: open WhatsApp directly with that service (barber number for men's services).
swap("onClick={() => openBooking(service.id)}", "onClick={(event) => { event.preventDefault(); openServiceWhatsApp(service); }}", true);
swap("onClick={() => openBooking(undefined, homeServiceBookingNote)}", "onClick={(event) => { event.preventDefault(); openGgsWhatsApp(homeServiceWaText()); }}", true);
// Products: ordering opens WhatsApp; nothing goes into a cart.
swap("const addProductToCart = (product: GgsProduct) => {\n    if (!product.active || product.stock < 1) return;",
  "const addProductToCart = (product: GgsProduct) => {\n    if (!product.active || product.stock < 1) return;\n    openGgsWhatsApp(productWaText(product));\n    return;");
swap("setProductCartNotice(`${product.name} ditambahkan ke keranjang.`);", "setProductCartNotice(`Membuka WhatsApp untuk memesan ${product.name}.`);");
swap("aria-label={canAddToCart ? `Tambahkan ${product.name} ke keranjang`", "aria-label={canAddToCart ? `Pesan ${product.name} lewat WhatsApp`");
swap("{canAddToCart ? 'Tambah' : available", "{canAddToCart ? 'Pesan' : available");
swap("quantity ? `${quantity} di keranjang · Tambah` : 'Tambah ke keranjang'", "'Pesan via WhatsApp'");
swap("aria-label={`Tambah ${product.name} ke keranjang`}", "aria-label={`Pesan ${product.name} lewat WhatsApp`}");
swap("inCart ? `+ ${inCart}` : 'Tambah'", "'Pesan'");
swap("Lihat produk yang tersedia dan masukkan pilihanmu ke keranjang. Keranjang menampilkan total sementara; belum ada checkout atau pembayaran online.",
  "Lihat produk yang tersedia, lalu pesan langsung lewat WhatsApp GGS. Tim GGS akan membalas untuk ketersediaan dan pembayaran.");
// Booking form: sends the request as a WhatsApp message instead of saving it online.
swap("    setNotesError('');\n    appointment.mutate(",
  "    setNotesError('');\n    const chosen = services.find((service) => String(service.id) === fields.serviceId);\n    openGgsWhatsApp(bookingWaText({ name: fields.customerName.trim(), service: chosen, date: fields.appointmentDate, time: fields.appointmentTime, notes }), whatsappFor(chosen));\n    return;\n    appointment.mutate(");
swap("Formulir ini mengirim permintaan; tim GGS akan menghubungi untuk membahas detail dan mengonfirmasi.",
  "Formulir ini membuka WhatsApp GGS dengan pesan yang sudah terisi; tim GGS akan membalas untuk mengonfirmasi.");
swap("'Kirim permintaan'", "'Kirim lewat WhatsApp'");
fs.writeFileSync(file, s);

// The booking form no longer needs an email; WhatsApp is the contact.
s = fs.readFileSync(file, "utf8");
swap('<label className="clearer-form-wide">Email<input required type="email"', '<label className="clearer-form-wide">Email <span>(opsional)</span><input type="email"');
fs.writeFileSync(file, s);

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS WhatsApp ordering (patch-whatsapp.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `\n${marker}\n[data-testid="link-my-ggs-cart"], [data-testid="products-cart-summary"] { display: none !important; }\n`);
console.log("GGS orders now go to WhatsApp");
