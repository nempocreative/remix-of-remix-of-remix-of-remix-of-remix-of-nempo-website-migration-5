import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft, CalendarDays, CheckCircle2, Crown, Drama, ImagePlus, LoaderCircle, MapPin, MessageCircle, Music2, Send,
  Tag, Ticket, Trophy, Users,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { sisaWaktu } from "@/data/pasar-seni-garut-2026";
import {
  ALAMAT_MAX, ASAL_MAX, BELUM_DIUMUMKAN, NAMA_MAX, USIA_MAX, USIA_MIN, biayaGelombang, labelTanggal, lombaList,
  rentangGelombang, rupiah, statusPendaftaran, tanggalWib, validasiFoto, validasiMusik, validasiPendaftar, type Lomba,
  type StatusPendaftaran,
} from "@/data/lomba";
import { daftarLomba } from "@/lib/lomba.functions";
import { LombaSoundtrack } from "@/components/lomba-soundtrack";
import selempangMerah from "@/assets/lomba/selempang-merah.webp";
import selempangMerahDipakai from "@/assets/lomba/selempang-merah-dipakai.webp";
import selempangHitam from "@/assets/lomba/selempang-hitam.webp";
import selempangHitamDipakai from "@/assets/lomba/selempang-hitam-dipakai.webp";

import pialaJuara1 from "@/assets/lomba/piala-juara-1.webp";
import pialaJuara2 from "@/assets/lomba/piala-juara-2.webp";
import pialaJuara3 from "@/assets/lomba/piala-juara-3.webp";
import pialaPeserta from "@/assets/lomba/piala-peserta.webp";

/** Satu desain piala untuk semua; yang beda hanya tulisan di plat nama. */
const PIALA = [
  { id: "juara-1", nama: "Juara 1", foto: pialaJuara1 },
  { id: "juara-2", nama: "Juara 2", foto: pialaJuara2 },
  { id: "juara-3", nama: "Juara 3", foto: pialaJuara3 },
  { id: "peserta", nama: "Juara Harapan 1", foto: pialaPeserta },
];

/** Dua pilihan warna selempang Juara 1 (Duta Pasar Seni). */
const SELEMPANG = [
  { id: "merah", nama: "Merah Marun", untuk: "TK · SD 1–3 · SD 4–6", strip: selempangMerah, foto: selempangMerahDipakai },
  { id: "hitam", nama: "Hitam Emas", untuk: "SMP–SMA", strip: selempangHitam, foto: selempangHitamDipakai },
];

/** Elemen ber-atribut data-reveal muncul pelan saat masuk layar (langsung tampil bila gerak dikurangi). */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const diam = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (diam || typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("is-tampil"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-tampil");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function HitungMundur({ target }: { target: Date }) {
  const [sisa, setSisa] = useState(() => sisaWaktu(target));
  useEffect(() => {
    const t = window.setInterval(() => setSisa(sisaWaktu(target)), 1000);
    return () => window.clearInterval(t);
  }, [target]);
  if (sisa.lewat) return null;
  const isi: Array<[number, string]> = [
    [sisa.hari, "Hari"], [sisa.jam, "Jam"], [sisa.menit, "Menit"], [sisa.detik, "Detik"],
  ];
  return (
    <div className="lmb-mundur" aria-label={`${sisa.hari} hari lagi menuju hari lomba`}>
      {isi.map(([n, l]) => (
        <div key={l}>
          <strong>{String(n).padStart(2, "0")}</strong>
          <small>{l}</small>
        </div>
      ))}
    </div>
  );
}

/** Perkecil foto ke JPEG maks 1600px agar cepat terkirim (juga mengubah foto HEIC iPhone). */
async function siapkanFoto(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const skala = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(bmp.width * skala));
    c.height = Math.max(1, Math.round(bmp.height * skala));
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.88));
    if (blob) return new File([blob], "foto-terbaik.jpg", { type: "image/jpeg" });
  } catch {
    /* pakai file asli bila browser tidak bisa membacanya */
  }
  return file;
}

type Terkirim = { kode: string; url: string; biaya: number; gelombang: number };

function FormDaftar({ lomba, buka }: { lomba: Lomba; buka: StatusPendaftaran }) {
  const kirimServer = useServerFn(daftarLomba);
  const [kategoriId, setKategoriId] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [usia, setUsia] = useState("");
  const [alamat, setAlamat] = useState("");
  const [asal, setAsal] = useState("");
  const [kontak, setKontak] = useState("");
  const [musik, setMusik] = useState<File | null>(null);
  const [musikUrl, setMusikUrl] = useState<string | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const [terkirim, setTerkirim] = useState<Terkirim | null>(null);

  useEffect(() => () => { if (musikUrl) URL.revokeObjectURL(musikUrl); }, [musikUrl]);
  useEffect(() => () => { if (fotoUrl) URL.revokeObjectURL(fotoUrl); }, [fotoUrl]);

  function pilihMusik(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const cek = validasiMusik(f);
    if (!cek.ok) { setGalat(cek.galat); setMusik(null); setMusikUrl(null); e.target.value = ""; return; }
    setGalat(null); setMusik(f); setMusikUrl(URL.createObjectURL(f));
  }

  async function pilihFoto(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!f.type.startsWith("image/") && f.type !== "") { setGalat("Pilih file foto (JPG atau PNG)."); e.target.value = ""; return; }
    const siap = await siapkanFoto(f);
    const cek = validasiFoto(siap);
    if (!cek.ok) { setGalat(cek.galat); setFoto(null); setFotoUrl(null); e.target.value = ""; return; }
    setGalat(null); setFoto(siap); setFotoUrl(URL.createObjectURL(siap));
  }

  async function kirim(e: FormEvent) {
    e.preventDefault();
    const isian = validasiPendaftar(lomba, { kategoriId, namaLengkap, usia, alamat, asal, kontak });
    if (!isian.ok) return setGalat(isian.galat);
    const cekMusik = validasiMusik(musik);
    if (!cekMusik.ok) return setGalat(cekMusik.galat);
    const cekFoto = validasiFoto(foto);
    if (!cekFoto.ok) return setGalat(cekFoto.galat);
    setGalat(null);
    setMengirim(true);
    try {
      const fd = new FormData();
      fd.set("slug", lomba.slug);
      fd.set("kategoriId", kategoriId);
      fd.set("namaLengkap", namaLengkap);
      fd.set("usia", usia);
      fd.set("alamat", alamat);
      fd.set("asal", asal);
      fd.set("kontak", kontak);
      fd.set("musik", musik!, musik!.name);
      fd.set("foto", foto!, foto!.name);
      const hasil = await kirimServer({ data: fd });
      if (!hasil.ok) return setGalat(hasil.galat);
      setTerkirim({ kode: hasil.kode, url: hasil.url, biaya: hasil.biaya, gelombang: hasil.gelombang });
    } catch {
      setGalat("Pendaftaran belum terkirim. Periksa koneksi internet, lalu coba lagi.");
    } finally {
      setMengirim(false);
    }
  }

  if (terkirim) {
    return (
      <div className="lmb-form lmb-sukses" role="status">
        <CheckCircle2 className="lmb-sukses-ikon" aria-hidden="true" />
        <h3>Pendaftaran tersimpan</h3>
        <p>Kode pendaftaran kamu</p>
        <strong className="lmb-kode">{terkirim.kode}</strong>
        <p>
          Langkah terakhir: kirim kode ini ke admin Nempo lewat WhatsApp untuk membayar {rupiah(terkirim.biaya)} (gelombang {terkirim.gelombang}).
          Peserta tercatat setelah pembayaran dikonfirmasi.
        </p>
        <a href={terkirim.url} target="_blank" rel="noopener noreferrer" className="psg26-btn psg26-btn-emas lmb-kirim">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Lanjut bayar lewat WhatsApp
        </a>
      </div>
    );
  }

  if (buka.status !== "buka") {
    return (
      <div className="lmb-form lmb-sukses" role="status">
        <CalendarDays className="lmb-sukses-ikon" aria-hidden="true" />
        <h3>{buka.status === "belum" ? "Pendaftaran segera dibuka" : "Pendaftaran sudah ditutup"}</h3>
        {buka.status === "belum" ? (
          <p>
            Formulir bisa diisi mulai <b>{labelTanggal(buka.berikutnya.mulai)}</b> pukul 00.00 WIB.
            {buka.berikutnya.diskonPersen > 0 && <> Daftar di gelombang {buka.berikutnya.ke} untuk hemat {buka.berikutnya.diskonPersen}%.</>}
          </p>
        ) : (
          <p>Terima kasih atas antusiasmenya. Pantau Instagram @nempo.id untuk kabar lomba berikutnya.</p>
        )}
      </div>
    );
  }

  return (
    <form className="lmb-form" onSubmit={kirim} noValidate aria-busy={mengirim}>
      <p className="lmb-gel-aktif">
        <Tag aria-hidden="true" />
        Gelombang {buka.gelombang.ke} · <b>{rupiah(buka.biaya)}</b>
        {buka.gelombang.diskonPersen > 0 && <s>{rupiah(lomba.biayaPendaftaran)}</s>}
        <small>sampai {labelTanggal(buka.gelombang.selesai, true)}</small>
      </p>
      <fieldset disabled={mengirim}>
        <legend>Kategori</legend>
        <div className="lmb-pilih">
          {lomba.kategori.map((k) => (
            <label key={k.id} className={kategoriId === k.id ? "is-aktif" : undefined}>
              <input type="radio" name={`kategori-${lomba.slug}`} value={k.id} checked={kategoriId === k.id} onChange={() => setKategoriId(k.id)} />
              {k.nama}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset disabled={mengirim} className="lmb-grup">
        <label className="lmb-field lmb-lebar">
          <span>Nama lengkap peserta</span>
          <input value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} maxLength={NAMA_MAX} autoComplete="name" required />
        </label>
        <label className="lmb-field">
          <span>Usia</span>
          <div className="lmb-satuan">
            <input value={usia} onChange={(e) => setUsia(e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" placeholder={`${USIA_MIN}–${USIA_MAX}`} required />
            <b>tahun</b>
          </div>
        </label>
        <label className="lmb-field">
          <span>No. WhatsApp orang tua / pendamping</span>
          <input value={kontak} onChange={(e) => setKontak(e.target.value)} inputMode="tel" maxLength={20} autoComplete="tel" placeholder="08…" required />
        </label>
        <label className="lmb-field lmb-lebar">
          <span>Alamat</span>
          <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} maxLength={ALAMAT_MAX} rows={3} autoComplete="street-address" required />
        </label>
        <label className="lmb-field lmb-lebar">
          <span>Asal sekolah / sanggar <em>(boleh dikosongkan)</em></span>
          <input value={asal} onChange={(e) => setAsal(e.target.value)} maxLength={ASAL_MAX} />
        </label>
      </fieldset>

      <fieldset disabled={mengirim} className="lmb-unggah">
        <label className={`lmb-berkas${musik ? " is-ada" : ""}`}>
          <Music2 aria-hidden="true" />
          <span>
            <b>Musik pengiring</b>
            <small>{musik ? musik.name : "MP3, M4A, atau WAV · maks 20 MB"}</small>
          </span>
          <input type="file" accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg" onChange={pilihMusik} aria-label="Unggah musik pengiring" />
        </label>
        {musikUrl && <audio className="lmb-putar" src={musikUrl} controls preload="metadata" />}

        <label className={`lmb-berkas${foto ? " is-ada" : ""}`}>
          {fotoUrl ? <img src={fotoUrl} alt="Pratinjau foto terbaik" /> : <ImagePlus aria-hidden="true" />}
          <span>
            <b>Foto terbaik</b>
            <small>{foto ? "Foto siap dikirim · ketuk untuk ganti" : "Disarankan memakai atribut tari"}</small>
          </span>
          <input type="file" accept="image/*" onChange={(e) => void pilihFoto(e)} aria-label="Unggah foto terbaik" />
        </label>
      </fieldset>

      {galat && <p className="lmb-galat" role="alert">{galat}</p>}
      <button type="submit" className="psg26-btn psg26-btn-emas lmb-kirim" disabled={mengirim}>
        {mengirim ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        {mengirim ? "Mengirim… jangan tutup halaman" : "Kirim pendaftaran"}
      </button>
      <p className="psg26-kecil" style={{ margin: 0 }}>
        Data dan berkas hanya dibuka panitia Nempo. Setelah terkirim, lanjutkan pembayaran {rupiah(buka.biaya)} lewat WhatsApp.
      </p>
    </form>
  );
}

const TANGGAL_LOMBA = new Date(2026, 11, 30, 0, 0, 0, 0);

function BlokLomba({ lomba }: { lomba: Lomba }) {
  const ref = useReveal();
  const [buka] = useState(() => statusPendaftaran(lomba));
  const hariIni = tanggalWib();
  const pertama = lomba.gelombang[0];
  const terakhir = lomba.gelombang[lomba.gelombang.length - 1];
  const diskonTerbesar = Math.max(...lomba.gelombang.map((g) => g.diskonPersen));
  const info = [
    { ikon: CalendarDays, label: "Hari lomba", nilai: lomba.tanggal ?? BELUM_DIUMUMKAN },
    { ikon: Drama, label: "Acara puncak", nilai: lomba.acaraPuncak ?? BELUM_DIUMUMKAN },
    { ikon: MapPin, label: "Lokasi", nilai: lomba.lokasi ?? BELUM_DIUMUMKAN },
    { ikon: Ticket, label: "Biaya pendaftaran", nilai: `${rupiah(lomba.biayaPendaftaran)} / peserta`, catatan: diskonTerbesar ? `Diskon hingga ${diskonTerbesar}% di gelombang awal` : undefined },
  ];
  const alur = [
    { waktu: pertama && terakhir ? `${labelTanggal(pertama.mulai, true).replace(/ \d{4}$/, "")} – ${labelTanggal(terakhir.selesai, true)}` : "Segera", judul: `Pendaftaran ${lomba.gelombang.length} gelombang`, isi: `Daftar online, kuota ${lomba.kuotaPerKategori} peserta tiap kategori.` },
    { waktu: lomba.tanggal ?? BELUM_DIUMUMKAN, judul: "Pasanggiri Jaipong", isi: "Peserta tampil per kategori di depan dewan juri." },
    { waktu: lomba.acaraPuncak ?? BELUM_DIUMUMKAN, judul: "Acara puncak Pasar Seni", isi: "Juara 1 tiap kategori dinobatkan sebagai Duta Pasar Seni dan berkesempatan tampil." },
  ];
  const pita = [lomba.judul, lomba.subjudul.replace(/^&\s*/, ""), lomba.tanggal, `Kuota ${lomba.kuotaPerKategori} / kategori`].filter(Boolean) as string[];

  return (
    <div ref={ref}>
      <section className="lmb-hero" data-no-deer>
        <img className="lmb-hero-bg" src="/media/pasar-seni-garut/venue-panggung.jpg" alt="" aria-hidden="true" width={1024} height={1280} />
        <div className="lmb-hero-batik" aria-hidden="true" />
        <div className="lmb-kilau" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => <i key={i} style={{ ["--i" as string]: i }} />)}
        </div>
        <div className="psg26-wrap lmb-hero-inner">
          <div className="lmb-hero-teks">
            <Link href="/" className="psg26-badge lmb-masuk" style={{ textDecoration: "none", ["--d" as string]: "0ms" }}>
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Lomba
            </Link>
            <h1>
              <span className="lmb-masuk" style={{ ["--d" as string]: "120ms" }}>{lomba.judul}</span>
              <em className="lmb-masuk" style={{ ["--d" as string]: "260ms" }}>{lomba.subjudul}</em>
            </h1>
            <p className="psg26-tagline lmb-masuk" style={{ ["--d" as string]: "380ms" }}>
              <Crown className="lmb-mahkota" aria-hidden="true" />
              {lomba.ringkas}
            </p>
            <div className="lmb-masuk" style={{ ["--d" as string]: "500ms" }}>
              <HitungMundur target={TANGGAL_LOMBA} />
            </div>
            <div className="psg26-cta lmb-masuk" style={{ ["--d" as string]: "620ms" }}>
              <a href={`#daftar-${lomba.slug}`} className="psg26-btn psg26-btn-emas lmb-cta-utama">
                {buka.status === "buka"
                  ? `Daftar sekarang · ${rupiah(buka.biaya)}`
                  : buka.status === "belum"
                    ? `Daftar mulai ${labelTanggal(buka.berikutnya.mulai, true).replace(/ \d{4}$/, "")}`
                    : "Pendaftaran ditutup"}
              </a>
              <a href={`#hadiah-${lomba.slug}`} className="psg26-btn psg26-btn-garis">
                <Trophy className="h-4 w-4" aria-hidden="true" /> Lihat hadiah
              </a>
            </div>
          </div>
          <div className="lmb-panggung" aria-hidden="true">
            <div className="lmb-halo" />
            <div className="lmb-cincin" />
            <img className="lmb-penari" src={lomba.gambar} alt="" width={844} height={1041} fetchPriority="high" />
          </div>
        </div>
      </section>

      <div className="lmb-pita" aria-hidden="true">
        <div>
          {[0, 1].map((n) => (
            <span key={n}>
              {pita.map((t) => <b key={t}>{t}<i aria-hidden="true" /></b>)}
            </span>
          ))}
        </div>
      </div>

      <section className="psg26-section lmb-section">
        <div className="psg26-wrap">
          <div className="lmb-info">
            {info.map(({ ikon: Ikon, label, nilai, catatan }, i) => (
              <div key={label} className="lmb-info-kartu" data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
                <span className="lmb-info-ikon"><Ikon className="h-5 w-5" aria-hidden="true" /></span>
                <p>{label}</p>
                <strong className={nilai === BELUM_DIUMUMKAN ? "is-menyusul" : undefined}>{nilai}</strong>
                {catatan && <em>{catatan}</em>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="psg26-section lmb-section lmb-garis-atas" id={`gelombang-${lomba.slug}`}>
        <div className="psg26-wrap">
          <p className="psg26-label" data-reveal>Gelombang pendaftaran</p>
          <h2 className="psg26-title" data-reveal>Daftar lebih awal, lebih hemat</h2>
          <div className="lmb-gelombang">
            {lomba.gelombang.map((g, i) => {
              const keadaan = hariIni > g.selesai ? "selesai" : hariIni >= g.mulai ? "berjalan" : "segera";
              return (
                <article key={g.ke} className={`is-${keadaan}`} data-reveal style={{ ["--d" as string]: `${i * 110}ms` }}>
                  <header>
                    <span>Gelombang {g.ke}</span>
                    <i>{keadaan === "berjalan" ? "Sedang berjalan" : keadaan === "selesai" ? "Selesai" : "Segera"}</i>
                  </header>
                  <p className="lmb-gel-tanggal">{rentangGelombang(g)}</p>
                  <div className="lmb-gel-harga">
                    <strong>{rupiah(biayaGelombang(lomba, g))}</strong>
                    {g.diskonPersen > 0 && <s>{rupiah(lomba.biayaPendaftaran)}</s>}
                  </div>
                  <b className="lmb-gel-diskon">{g.diskonPersen > 0 ? `Diskon ${g.diskonPersen}%` : "Harga normal"}</b>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="psg26-section lmb-section lmb-garis-atas">
        <div className="psg26-wrap">
          <p className="psg26-label" data-reveal>Alur acara</p>
          <h2 className="psg26-title" data-reveal>Dari panggung lomba ke acara puncak</h2>
          <ol className="lmb-alur" data-reveal>
            {alur.map((a, i) => (
              <li key={a.judul} style={{ ["--d" as string]: `${200 + i * 160}ms` }}>
                <span className="lmb-alur-titik">{i + 1}</span>
                <small className={a.waktu === BELUM_DIUMUMKAN ? "is-menyusul" : undefined}>{a.waktu}</small>
                <h3>{a.judul}</h3>
                <p>{a.isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="psg26-section lmb-section lmb-garis-atas lmb-batik-latar">
        <div className="psg26-wrap">
          <p className="psg26-label" data-reveal>Kategori</p>
          <h2 className="psg26-title" data-reveal>Empat kategori peserta</h2>
          <div className="lmb-kategori">
            {lomba.kategori.map((k, i) => (
              <article key={k.id} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{k.nama}</h3>
                <p>{k.keterangan}</p>
                <small><Users className="h-3.5 w-3.5" aria-hidden="true" /> Kuota {lomba.kuotaPerKategori} peserta</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id={`hadiah-${lomba.slug}`} className="psg26-section lmb-section lmb-garis-atas">
        <div className="psg26-wrap">
          <p className="psg26-label" data-reveal>Hadiah</p>
          <h2 className="psg26-title" data-reveal>Yang didapatkan</h2>
          <div className="lmb-hadiah">
            <article className="is-utama" data-reveal>
              <header>
                <span className="lmb-piala"><Crown className="h-6 w-6" aria-hidden="true" /></span>
                <div>
                  <small>Duta Pasar Seni</small>
                  <h3>Juara 1 tiap kategori</h3>
                </div>
              </header>
              <ul>
                {lomba.hadiahJuara1.map((h, i) => <li key={h} style={{ ["--d" as string]: `${300 + i * 70}ms` }}>{h}</li>)}
              </ul>
            </article>
            <article data-reveal style={{ ["--d" as string]: "120ms" }}>
              <header>
                <span className="lmb-piala is-perak"><Trophy className="h-6 w-6" aria-hidden="true" /></span>
                <div>
                  <small>Juara 2 &amp; 3</small>
                  <h3>Tiap kategori</h3>
                </div>
              </header>
              <ul>
                {lomba.hadiahJuara23.map((h, i) => <li key={h} style={{ ["--d" as string]: `${420 + i * 70}ms` }}>{h}</li>)}
              </ul>
            </article>
            <article className="is-semua" data-reveal style={{ ["--d" as string]: "240ms" }}>
              <header>
                <span className="lmb-piala is-krem"><Trophy className="h-6 w-6" aria-hidden="true" /></span>
                <div>
                  <small>Semua peserta</small>
                  <h3>Tanpa terkecuali</h3>
                </div>
              </header>
              <ul>
                {lomba.hadiahSemua.map((h, i) => <li key={h} style={{ ["--d" as string]: `${540 + i * 70}ms` }}>{h}</li>)}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="psg26-section lmb-section lmb-garis-atas" aria-labelledby={`piala-${lomba.slug}`} data-no-deer>
        <div className="psg26-wrap">
          <p className="psg26-label" data-reveal>Piala</p>
          <h2 className="psg26-title" id={`piala-${lomba.slug}`} data-reveal>Piala Pasanggiri Jaipong</h2>
          <div className="lmb-piala-grid">
            {PIALA.map((v, i) => (
              <figure key={v.id} data-reveal style={{ ["--d" as string]: `${i * 110}ms` }}>
                <div className="lmb-piala-foto">
                  <img src={v.foto} alt={`Piala ${v.nama} Pasanggiri Jaipong se-Jawa Barat, Pasar Seni Garut 2026`} width={600} height={900} loading="lazy" decoding="async" />
                </div>
                <figcaption><h3>{v.nama}</h3></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="psg26-section lmb-section lmb-garis-atas lmb-batik-latar" aria-labelledby={`selempang-${lomba.slug}`} data-no-deer>
        <div className="psg26-wrap">
          <p className="psg26-label" data-reveal>Selempang Juara 1</p>
          <h2 className="psg26-title" id={`selempang-${lomba.slug}`} data-reveal>Selempang Duta Pasar Seni</h2>
          <div className="lmb-selempang">
            {SELEMPANG.map((v, i) => (
              <figure key={v.id} className={`is-${v.id}`} data-reveal style={{ ["--d" as string]: `${i * 140}ms` }}>
                <div className="lmb-selempang-foto">
                  <img src={v.foto} alt={`Contoh selempang Duta Pasar Seni warna ${v.nama.toLowerCase()} saat dipakai`} width={800} height={1000} loading="lazy" decoding="async" />
                </div>
                <div className="lmb-selempang-strip">
                  <img src={v.strip} alt={`Desain selempang ${v.nama.toLowerCase()}: Duta Pasar Seni 2026, Juara 1 Pasanggiri Jaipong se-Jawa Barat`} width={1600} height={226} loading="lazy" decoding="async" />
                </div>
                <figcaption>
                  <h3>{v.nama}</h3>
                  <small>{v.untuk}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id={`daftar-${lomba.slug}`} className="psg26-section psg26-penutup lmb-section">
        <div className="psg26-wrap lmb-daftar">
          <div data-reveal>
            <p className="psg26-label">Info pendaftaran</p>
            <h2 className="psg26-title">Cara daftar</h2>
            <ol className="lmb-langkah">
              <li>Pilih kategori, isi data peserta, lalu unggah <b>musik pengiring</b> dan <b>foto terbaik</b> (disarankan memakai atribut tari).</li>
              <li>Tekan <b>Kirim pendaftaran</b> untuk mendapat kode pendaftaran.</li>
              <li>Lanjut ke WhatsApp admin Nempo dan bayar sesuai gelombang: <b>{lomba.gelombang.map((g) => rupiah(biayaGelombang(lomba, g))).join(" / ")}</b>.</li>
              <li>Peserta tercatat setelah pembayaran dikonfirmasi. Kuota {lomba.kuotaPerKategori} peserta tiap kategori; pendaftaran tertutup otomatis bila kuota penuh.</li>
            </ol>
          </div>
          <div data-reveal style={{ ["--d" as string]: "120ms" }}>
            <FormDaftar lomba={lomba} buka={buka} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function LombaPage() {
  return (
    <Layout minimalChrome hideBottomNav>
      <SEO
        title="Lomba — Pasanggiri Jaipong se-Jawa Barat & Pemilihan Duta Pasar Seni"
        description="Pasanggiri Jaipong se-Jawa Barat & Pemilihan Duta Pasar Seni, 30 Desember 2026. Kategori TK, SD 1–3, SD 4–6, SMP–SMA. Pendaftaran Rp150.000, maksimal 25 peserta tiap kategori."
        path="/lomba"
        image="/media/pasar-seni-garut/dancer-putri.webp"
      />
      <main className="psg26-page lmb-page min-h-screen overflow-x-clip">
        {lombaList.map((l) => <BlokLomba key={l.slug} lomba={l} />)}
      </main>
      <LombaSoundtrack />
    </Layout>
  );
}
