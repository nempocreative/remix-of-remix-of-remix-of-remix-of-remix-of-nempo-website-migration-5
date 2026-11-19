import { useState } from "react";
import { ArrowLeft, Check, CupSoda, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { tumblerColors, tumblerConsultUrl, tumblerCustomizable, tumblerDesigns, type TumblerColorSlug, type TumblerSide } from "@/data/tumbler-custom";
import { cn } from "@/lib/utils";

export default function TumblerCustomPage() {
  const design = tumblerDesigns[0]!;
  const [side, setSide] = useState<TumblerSide>("foto");
  const [colorSlug, setColorSlug] = useState<TumblerColorSlug>(tumblerColors[0].slug);
  const color = tumblerColors.find(item => item.slug === colorSlug) ?? tumblerColors[0];
  const images = design.images[color.slug];
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const active = design.sides.find(item => item.id === side) ?? design.sides[0]!;

  return <Layout>
    <main className="pc-page bg-background text-foreground">
      <section className="pc-hero border-b border-border">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-12">
          <Link href="/produk-custom" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />Produk Custom</Link>
          <p className="mt-2 text-xs font-bold tracking-wide text-primary">TUMBLER CUSTOM · {design.model.toUpperCase()}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">{design.name}</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{design.description}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-12">
        <div>
          <div className="pc-card pc-photo relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
            {design.sides.map(item => <img key={`${color.slug}-${item.id}`} src={images[item.id]} alt={`${design.name} warna ${color.name.toLowerCase()} — ${item.label.toLowerCase()}: ${item.print.toLowerCase()}`} width={610} height={1416} loading={item.id === "foto" ? "eager" : "lazy"} className={cn("absolute inset-0 h-full w-full object-contain p-6 transition-opacity duration-300", item.id === side ? "opacity-100" : "opacity-0")} aria-hidden={item.id !== side} />)}
            <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-bold text-foreground">{active.label}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3" role="group" aria-label="Warna tumbler">
            {tumblerColors.map(item => <button key={item.slug} type="button" aria-pressed={item.slug === color.slug} aria-label={`Warna ${item.name}`} title={item.name} onClick={() => setColorSlug(item.slug)} className={cn("size-9 rounded-full border border-border transition", item.slug === color.slug ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-75 hover:opacity-100")} style={{ backgroundColor: item.hex }} />)}
          </div>
          <p className="mt-2 text-center text-sm font-semibold">Warna: {color.name}</p>
          <div role="tablist" aria-label="Sisi tumbler" className="mt-3 grid grid-cols-2 gap-3">
            {design.sides.map(item => <button key={item.id} type="button" role="tab" aria-selected={item.id === side} onClick={() => setSide(item.id)} className={cn("flex items-center gap-3 rounded-xl border bg-card p-2 text-left text-card-foreground transition-colors", item.id === side ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary")}>
              <img src={images[item.id]} alt="" width={610} height={1416} loading="lazy" className="h-16 w-10 shrink-0 object-contain" />
              <span><span className="block text-sm font-bold">{item.label}</span><span className="block text-xs text-muted-foreground">{item.print}</span></span>
            </button>)}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><CupSoda className="size-4" />Contoh desain: {design.design}</p>
          <h2 className="mt-2 text-3xl font-bold">Cetak dua sisi</h2>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">Kode produk: {design.code}</p>

          <dl className="mt-5 divide-y divide-border rounded-xl border border-border bg-card text-card-foreground">
            {design.sides.map(item => <div key={item.id} className="flex gap-3 p-4">
              <dt className="w-24 shrink-0 text-sm font-bold">{item.label}</dt>
              <dd className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">{item.print}.</span> {item.detail}</dd>
            </div>)}
            <div className="flex gap-3 p-4"><dt className="w-24 shrink-0 text-sm font-bold">Tumbler</dt><dd className="text-sm leading-6 text-muted-foreground">{design.model}, tersedia {tumblerColors.length} warna: {tumblerColors.map(item => item.name).join(", ")}.</dd></div>
          </dl>

          <form id="konsultasi" onSubmit={event => { event.preventDefault(); window.open(tumblerConsultUrl(color.name, quantity, details, design), "_blank", "noopener,noreferrer"); }} className="mt-6 space-y-4">
            <div><label htmlFor="tc-quantity" className="mb-2 block text-sm font-semibold">Jumlah <span className="font-normal text-muted-foreground">(opsional)</span></label><input id="tc-quantity" value={quantity} onChange={event => setQuantity(event.target.value)} placeholder="Contoh: 2 buah (sepasang)" maxLength={80} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-foreground" /></div>
            <div><label htmlFor="tc-details" className="mb-2 block text-sm font-semibold">Nama, tanggal, dan kata-kata <span className="font-normal text-muted-foreground">(opsional)</span></label><textarea id="tc-details" value={details} onChange={event => setDetails(event.target.value)} placeholder="Contoh: Dimas & Sari, 20.08.2023, kata-kata pilihan kalian…" maxLength={2000} rows={3} className="w-full resize-y rounded-md border border-input bg-background p-3 text-foreground" /></div>
            <Button type="submit" size="lg" className="w-full"><MessageCircle />Konsultasi via WhatsApp</Button>
            <p className="text-xs leading-5 text-muted-foreground">Foto kalian dikirim langsung di chat WhatsApp. Harga dan waktu pengerjaan dibicarakan bersama tim Nempo.</p>
          </form>
        </div>
      </section>

      <section className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-2xl font-bold">Bisa disesuaikan</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tumblerCustomizable.map(item => <li key={item} className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-semibold text-card-foreground"><Check className="size-4 shrink-0 text-primary" />{item}</li>)}
          </ul>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">Foto, nama, dan kata-kata di atas hanya contoh; desain akhir memakai foto dan tulisan dari kalian.</p>
        </div>
      </section>
    </main>
  </Layout>;
}
