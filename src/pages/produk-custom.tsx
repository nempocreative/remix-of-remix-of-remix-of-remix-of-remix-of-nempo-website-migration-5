import { useState } from "react";
import { ArrowRight, ArrowUpRight, CupSoda, Gift, MessageCircle } from "lucide-react";
import kaosGarut from "@/assets/kaos-garut-belakang.jpg";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { customCategories, customProducts, customConsultUrl, productsInCategory } from "@/data/produk-custom";

const categoryIcons = { tumbler: CupSoda, "oleh-oleh": Gift } as const;

export default function ProdukCustomPage() {
  const [product, setProduct] = useState(customProducts[0] ? `[${customProducts[0].code}] ${customProducts[0].name}` : "");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const choose = (name: string) => { setProduct(name); document.getElementById("konsultasi")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <Layout>
    <main className="pc-page bg-background text-foreground">
      <section className="pc-hero border-b border-border">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14">
          <p className="text-xs font-bold tracking-wide text-primary">NEMPO · DIBUAT UNTUKMU</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Produk Custom</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Barang dengan desain pilihanmu dan buah tangan khas Garut. Untuk tim, komunitas, acara, atau hadiah personal.</p>
          <nav aria-label="Kategori produk" className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {customCategories.map(category => {
              const Icon = categoryIcons[category.id];
              const count = productsInCategory(category.id).length;
              return <a key={category.id} href={`#${category.id}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-card-foreground transition-colors hover:border-primary hover:text-primary">
                <Icon className="size-4" />{category.label}
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">{count ? `${count} produk` : "Segera"}</span>
              </a>;
            })}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Link href="/custom-garut" className="pc-card group flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 text-card-foreground transition-colors hover:border-primary sm:p-4">
          <img src={kaosGarut} alt="Contoh kaos Custom Garut sablon belakang" width={1024} height={1024} loading="lazy" className="size-24 shrink-0 rounded-xl bg-card object-contain sm:size-28" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-wide text-primary">BARU · KHAS GARUT</p>
            <h2 className="mt-1 text-xl font-bold">Custom Garut</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Kaos polos dengan desain khas Garut, sablon depan dan belakang.</p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {customCategories.map(category => {
        const items = productsInCategory(category.id);
        const Icon = categoryIcons[category.id];
        return <section key={category.id} id={category.id} className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold"><Icon className="size-5 text-primary" />{category.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            {items.length ? <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map(item => <article key={item.id} className="pc-card group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
                <div className="pc-photo relative aspect-square overflow-hidden">
                  <img src={item.image} alt={item.colors ? `${item.name} polos dalam warna ${item.colors.join(", ")}` : `Contoh desain ${item.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                  <p className="text-xs font-semibold text-muted-foreground">Kode: {item.code}</p>
                  <h3 className="text-base font-bold leading-5">{item.name}</h3>
                  <p className="line-clamp-3 text-xs leading-5 text-muted-foreground sm:text-sm">{item.description}</p>
                  {item.colors && <p className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">{item.colors.length} warna:</span> {item.colors.join(", ")}</p>}
                  {item.href ? <Button asChild size="sm" className="mt-auto w-full"><Link href={item.href}>Lihat desain<ArrowRight /></Link></Button> : <Button size="sm" className="mt-auto w-full" onClick={() => choose(`[${item.code}] ${item.name}`)}>Konsultasi<ArrowRight /></Button>}
                </div>
              </article>)}
            </div> : <div className="mt-6 flex flex-col items-start gap-3 rounded-xl border border-dashed border-input bg-secondary p-6 text-secondary-foreground sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">Segera hadir</p>
                <p className="mt-1 text-sm text-muted-foreground">Pilihan {category.label.toLowerCase()} sedang kami siapkan. Mau tanya lebih dulu?</p>
              </div>
              <Button variant="outline" onClick={() => choose(category.label)}>Tanya tim Nempo<ArrowRight /></Button>
            </div>}
          </div>
        </section>;
      })}

      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs leading-5 text-muted-foreground sm:px-6">Foto merupakan contoh desain Nempo; desain akhir disesuaikan dengan kebutuhan pesanan.</p>

      <section id="konsultasi" className="scroll-mt-24 border-t border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2">
          <div><p className="text-xs font-bold tracking-wide text-primary">MULAI DARI IDEMU</p><h2 className="mt-3 text-3xl font-bold">Bikin versi kamu.</h2><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">Ceritakan kebutuhanmu. Pilihan bahan, detail desain, harga, dan waktu pengerjaan dibicarakan bersama tim Nempo.</p><Button asChild variant="link" className="mt-4 px-0"><Link href="/merchandise">Lihat koleksi Nempo × Kala Muda <ArrowUpRight /></Link></Button></div>
          <form onSubmit={event => { event.preventDefault(); window.open(customConsultUrl(product, quantity, details), "_blank", "noopener,noreferrer"); }} className="space-y-4">
            <div><label htmlFor="pc-product" className="mb-2 block text-sm font-semibold">Produk</label>
              <select id="pc-product" value={product} onChange={event => setProduct(event.target.value)} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-foreground">
                {customCategories.map(category => <optgroup key={category.id} label={category.label}>
                  {productsInCategory(category.id).map(item => <option key={item.id} value={`[${item.code}] ${item.name}`}>{item.code} · {item.name}</option>)}
                  {!productsInCategory(category.id).length && <option value={category.label}>{category.label} (tanya dulu)</option>}
                </optgroup>)}
              </select>
            </div>
            <div><label htmlFor="pc-quantity" className="mb-2 block text-sm font-semibold">Perkiraan jumlah <span className="font-normal text-muted-foreground">(opsional)</span></label><input id="pc-quantity" value={quantity} onChange={event => setQuantity(event.target.value)} placeholder="Contoh: 30 buah" maxLength={80} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-foreground" /></div>
            <div><label htmlFor="pc-details" className="mb-2 block text-sm font-semibold">Detail kebutuhan <span className="font-normal text-muted-foreground">(opsional)</span></label><textarea id="pc-details" value={details} onChange={event => setDetails(event.target.value)} placeholder="Logo, warna, bahan, atau tanggal acara…" maxLength={2000} rows={4} className="w-full resize-y rounded-md border border-input bg-background p-3 text-foreground" /></div>
            <Button type="submit" size="lg" className="w-full"><MessageCircle />Konsultasi via WhatsApp</Button>
          </form>
        </div>
      </section>
    </main>
  </Layout>;
}
