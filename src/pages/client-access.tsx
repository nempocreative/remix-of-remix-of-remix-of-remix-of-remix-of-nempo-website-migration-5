import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, ExternalLink, Lock, MapPin, Store } from "lucide-react";
import { KLIEN_TAMPIL, type KlienNempo } from "@/data/client-access";

function KartuKlien({ k, tunggal }: { k: KlienNempo; tunggal: boolean }) {
  return (
    <a
      href={k.tautan}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      className={`group grid min-w-0 shrink-0 snap-start grid-cols-[minmax(0,1fr)] overflow-hidden rounded-lg bg-card text-card-foreground shadow-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] ${
        tunggal ? "w-full" : "w-[90%] md:w-full"
      }`}
    >
      <div className="relative aspect-[2/1] min-w-0 overflow-hidden bg-slate-900 md:aspect-auto">
        <img
          src={k.sampul}
          alt={k.nama}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover transition duration-700 md:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        {k.pakaiKataSandi && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
            <Lock className="h-3 w-3" /> Pakai kata sandi
          </span>
        )}
        <div className="absolute bottom-4 left-5 right-5 md:bottom-6 md:left-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pink-200">{k.bidang}</p>
          <p className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">{k.nama}</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-4 border border-t-0 border-border p-4 sm:p-7 md:border-t md:border-l-0">
        <p className="text-sm leading-6 text-muted-foreground">{k.ringkas}</p>
        <ul className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2">
          {k.sorotan.map((s) => (
            <li key={s} className="flex min-w-0 items-start gap-1.5 text-[13px] font-medium leading-5">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#9D174D]/10 text-[#9D174D]">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">{s}</span>
            </li>
          ))}
        </ul>
        <dl className="grid grid-cols-2 gap-2">
          {[
            { Icon: Store, label: "Bidang", value: k.bidang },
            { Icon: MapPin, label: "Lokasi", value: k.lokasi },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="min-w-0 rounded-md bg-muted px-2.5 py-2.5 sm:px-3">
              <dt className="flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground">
                <Icon className="h-3 w-3 shrink-0" /> {label}
              </dt>
              <dd className="mt-1 text-[13px] font-semibold leading-snug [overflow-wrap:anywhere]">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-border pt-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#9D174D] px-4 py-2.5 text-sm font-bold text-white transition group-hover:bg-[#831843] sm:px-5">
            Buka web <ExternalLink className="h-4 w-4 shrink-0" />
          </span>
          <span className="text-xs text-muted-foreground">{k.pakaiKataSandi ? "Kata sandi diberikan oleh tim Nempo · " : ""}terbuka di tab baru</span>
        </div>
      </div>
    </a>
  );
}

/** Swipeable row of client cards: native touch scrolling with snap, plus dots and arrows when there is more than one. */
function GeserKlien() {
  const jalur = useRef<HTMLDivElement>(null);
  const [aktif, setAktif] = useState(0);
  const tunggal = KLIEN_TAMPIL.length < 2;

  useEffect(() => {
    const el = jalur.current;
    if (!el || tunggal) return;
    const onScroll = () => {
      const kartu = Array.from(el.children) as HTMLElement[];
      const kiri = el.scrollLeft + parseFloat(getComputedStyle(el).scrollPaddingLeft);
      let terdekat = 0;
      let jarak = Infinity;
      kartu.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - kiri);
        if (d < jarak) {
          jarak = d;
          terdekat = i;
        }
      });
      setAktif(terdekat);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [tunggal]);

  const keKartu = (i: number) => {
    const el = jalur.current;
    const c = el?.children[i] as HTMLElement | undefined;
    if (!el || !c) return;
    c.scrollIntoView({ block: "nearest", inline: "start" });
  };

  if (KLIEN_TAMPIL.length === 0) {
    return (
      <section className="mx-auto -mt-12 max-w-6xl px-4 sm:-mt-14 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
          <Store className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-lg font-bold">Belum ada web klien yang ditampilkan</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Web klien yang sedang disembunyikan akan muncul lagi di sini setelah dibuka kembali oleh tim Nempo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto -mt-12 max-w-6xl sm:-mt-14" aria-roledescription="carousel" aria-label="Web klien Nempo">
      <div
        ref={jalur}
        className={`relative px-4 pb-2 sm:px-6 lg:px-8 ${tunggal ? "" : "scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 sm:gap-6 motion-safe:scroll-smooth"}`}
      >
        {KLIEN_TAMPIL.map((k) => (
          <KartuKlien key={k.slug} k={k} tunggal={tunggal} />
        ))}
      </div>
      {!tunggal && (
        <div className="mt-5 flex items-center justify-center gap-4 px-4">
          <button
            type="button"
            onClick={() => keKartu(Math.max(0, aktif - 1))}
            disabled={aktif === 0}
            aria-label="Kartu sebelumnya"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#17233a] disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {KLIEN_TAMPIL.map((k, i) => (
              <button
                key={k.slug}
                type="button"
                onClick={() => keKartu(i)}
                aria-label={`Lihat ${k.nama}`}
                aria-current={i === aktif}
                className={`h-2 rounded-full transition-all ${i === aktif ? "w-6 bg-[#9D174D]" : "w-2 bg-slate-300"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => keKartu(Math.min(KLIEN_TAMPIL.length - 1, aktif + 1))}
            disabled={aktif === KLIEN_TAMPIL.length - 1}
            aria-label="Kartu berikutnya"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#17233a] disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}

export default function ClientAccessPage() {
  return (
    <Layout>
      <SEO
        title="Client Access — Web Klien Nempo"
        description="Akses web klien yang dibuat Nempo, seperti GGS Hair Studio."
        keywords="client access Nempo, web klien Nempo, GGS Hair Studio"
        path="/client-access"
      />
      <main className="min-h-screen bg-slate-50/60 pb-24 text-[#17233a]">
        <section className="text-white" style={{ background: "linear-gradient(145deg, #831843 0%, #DB2777 100%)" }}>
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Nempo Organizer</p>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">Client Access</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Web yang kami bangun untuk klien. Pilih web klienmu.
            </p>
          </div>
        </section>
        <GeserKlien />
      </main>
    </Layout>
  );
}
