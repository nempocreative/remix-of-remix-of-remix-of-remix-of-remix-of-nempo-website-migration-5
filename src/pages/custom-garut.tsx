import { useState } from "react";
import { ArrowLeft, Check, MessageCircle, Shirt } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { garutTees, garutTeeConsultUrl, garutTeeCustomizable, garutTeeSizes, type GarutTeeSide } from "@/data/custom-garut";
import { cn } from "@/lib/utils";

export default function CustomGarutPage() {
  const [teeId, setTeeId] = useState(garutTees[0]!.id);
  const garutTee = garutTees.find(tee => tee.id === teeId) ?? garutTees[0]!;
  const [side, setSide] = useState<GarutTeeSide>("depan");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const active = garutTee.sides.find(item => item.id === side) ?? garutTee.sides[0];

  return <Layout>
    <main className="pc-page bg-background text-foreground">
      <section className="pc-hero border-b border-border">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-12">
          <Link href="/produk-custom" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />Produk Custom</Link>
          <p className="mt-2 text-xs font-bold tracking-wide text-primary">NEMPO · KHAS GARUT</p>
          <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">Custom Garut</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Barang custom dengan cerita Garut. Dimulai dari kaos polos dengan sablon khas Garut di depan dan belakang.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <h2 className="text-sm font-bold">Pilih desain</h2>
        <div role="tablist" aria-label="Pilih desain kaos" className="mt-3 grid grid-cols-1 gap-3 sm:max-w-3xl sm:grid-cols-3">
          {garutTees.map(tee => <button key={tee.id} type="button" role="tab" aria-selected={tee.id === teeId} onClick={() => { setTeeId(tee.id); setSide("depan"); }} className={cn("flex items-center gap-3 rounded-xl border bg-card p-2 text-left text-card-foreground transition-colors", tee.id === teeId ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary")}>
            <img src={tee.sides[1]!.image} alt="" width={1024} height={1024} loading="lazy" className="size-14 shrink-0 rounded-lg bg-card object-contain" />
            <span className="min-w-0"><span className="block text-xs font-semibold text-muted-foreground">{tee.code}</span><span className="block text-sm font-bold leading-5">{tee.design}</span></span>
          </button>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-12">
        <div>
          <div className="pc-card pc-photo relative aspect-square overflow-hidden rounded-2xl border border-border">
            {garutTee.sides.map(item => <img key={`${garutTee.id}-${item.id}`} src={item.image} alt={`${garutTee.name} tampak ${item.label.toLowerCase()} — ${item.print.toLowerCase()}`} width={1024} height={1024} loading={item.id === "depan" ? "eager" : "lazy"} className={cn("absolute inset-0 h-full w-full object-contain transition-opacity duration-300", item.id === side ? "opacity-100" : "opacity-0")} aria-hidden={item.id !== side} />)}
            <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-bold text-foreground">Tampak {active.label.toLowerCase()}</span>
          </div>
          <div role="tablist" aria-label="Sisi kaos" className="mt-3 grid grid-cols-2 gap-3">
            {garutTee.sides.map(item => <button key={item.id} type="button" role="tab" aria-selected={item.id === side} onClick={() => setSide(item.id)} className={cn("flex items-center gap-3 rounded-xl border bg-card p-2 text-left text-card-foreground transition-colors", item.id === side ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary")}>
              <img src={item.image} alt="" width={1024} height={1024} loading="lazy" className="size-14 shrink-0 rounded-lg bg-card object-contain" />
              <span><span className="block text-sm font-bold">{item.label}</span><span className="block text-xs text-muted-foreground">{item.print}</span></span>
            </button>)}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Shirt className="size-4" />Contoh desain: {garutTee.design}</p>
          <h2 className="mt-2 text-3xl font-bold">{garutTee.name}</h2>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">Kode produk: {garutTee.code}</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{garutTee.description}</p>

          <dl className="mt-5 divide-y divide-border rounded-xl border border-border bg-card text-card-foreground">
            {garutTee.sides.map(item => <div key={item.id} className="flex gap-3 p-4">
              <dt className="w-20 shrink-0 text-sm font-bold">{item.label}</dt>
              <dd className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">{item.print}.</span> {item.detail}</dd>
            </div>)}
            <div className="flex gap-3 p-4"><dt className="w-20 shrink-0 text-sm font-bold">Kaos</dt><dd className="text-sm leading-6 text-muted-foreground">Polos warna {garutTee.color.toLowerCase()} pada contoh ini.</dd></div>
          </dl>

          <form id="konsultasi" onSubmit={event => { event.preventDefault(); window.open(garutTeeConsultUrl(size, quantity, details, garutTee), "_blank", "noopener,noreferrer"); }} className="mt-6 space-y-4">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Ukuran <span className="font-normal text-muted-foreground">(opsional)</span></legend>
              <div className="flex flex-wrap gap-2">
                {garutTeeSizes.map(option => <button key={option} type="button" aria-pressed={size === option} onClick={() => setSize(size === option ? "" : option)} className={cn("min-h-11 min-w-12 rounded-md border px-3 text-sm font-semibold transition-colors", size === option ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-foreground hover:border-primary")}>{option}</button>)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Mau campur beberapa ukuran? Tulis saja di detail.</p>
            </fieldset>
            <div><label htmlFor="cg-quantity" className="mb-2 block text-sm font-semibold">Perkiraan jumlah <span className="font-normal text-muted-foreground">(opsional)</span></label><input id="cg-quantity" value={quantity} onChange={event => setQuantity(event.target.value)} placeholder="Contoh: 24 pcs" maxLength={80} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-foreground" /></div>
            <div><label htmlFor="cg-details" className="mb-2 block text-sm font-semibold">Detail kebutuhan <span className="font-normal text-muted-foreground">(opsional)</span></label><textarea id="cg-details" value={details} onChange={event => setDetails(event.target.value)} placeholder="Warna kaos, tulisan, atau tanggal acara…" maxLength={2000} rows={3} className="w-full resize-y rounded-md border border-input bg-background p-3 text-foreground" /></div>
            <Button type="submit" size="lg" className="w-full"><MessageCircle />Konsultasi via WhatsApp</Button>
            <p className="text-xs leading-5 text-muted-foreground">Bahan, harga, dan waktu pengerjaan dibicarakan bersama tim Nempo.</p>
          </form>
        </div>
      </section>

      <section className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-2xl font-bold">Bisa disesuaikan</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {garutTeeCustomizable.map(item => <li key={item} className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-semibold text-card-foreground"><Check className="size-4 shrink-0 text-primary" />{item}</li>)}
          </ul>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">Foto merupakan contoh desain Nempo; desain akhir disesuaikan dengan kebutuhan pesanan.</p>
        </div>
      </section>
    </main>
  </Layout>;
}
