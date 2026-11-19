import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { NEMPO_CONSULT_URL, NEMPO_INSTAGRAM_URL } from "@/lib/contact";
import {
  PSG26,
  berkasKalender,
  sisaWaktu,
  statusAcara,
  tanggalRentang,
} from "@/data/pasar-seni-garut-2026";

const TARGET = new Date(2026, 11, 30, 0, 0, 0, 0);

const PESAN_WA =
  "Halo Nempo, saya mau tanya soal Pasar Seni Garut 2026 (30–31 Desember 2026). " +
  "Boleh info terbaru soal tempat, jam, dan cara ikut (UMKM / lapak / pengunjung)?";

function HitungMundur() {
  const [sekarang, setSekarang] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setSekarang(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const sisa = useMemo(() => sisaWaktu(TARGET, sekarang), [sekarang]);
  const status = statusAcara(sekarang);

  if (status !== "coming-soon") {
    return (
      <p className="psg26-count-habis">
        {status === "berlangsung"
          ? "Sedang berlangsung — sampai 31 Desember 2026."
          : "Sudah lewat — terima kasih untuk semua yang datang."}
      </p>
    );
  }

  const kotak = [
    { nilai: sisa.hari, ket: "Hari" },
    { nilai: sisa.jam, ket: "Jam" },
    { nilai: sisa.menit, ket: "Menit" },
    { nilai: sisa.detik, ket: "Detik" },
  ];

  return (
    <div className="psg26-count" role="timer" aria-live="off">
      {kotak.map((k) => (
        <div key={k.ket}>
          <strong>{String(k.nilai).padStart(2, "0")}</strong>
          <small>{k.ket}</small>
        </div>
      ))}
    </div>
  );
}

function UnduhKalender() {
  function simpan() {
    const isi = berkasKalender();
    const blob = new Blob([isi], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pasar-seni-garut-2026.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  return (
    <button type="button" className="psg26-btn psg26-btn-garis" onClick={simpan}>
      <Download className="h-4 w-4" aria-hidden="true" />
      Simpan tanggal
    </button>
  );
}

export default function PasarSeniGarut2026Page() {
  return (
    <Layout minimalChrome hideBottomNav>
      <SEO
        title="Pasar Seni Garut 2026 — Segera"
        description="Pasar Seni Garut 2026 segera hadir: 30 dan 31 Desember 2026 di Garut, Jawa Barat. Detail acara diumumkan menyusul."
        path={PSG26.halaman}
        image="/media/pasar-seni-garut/cover-hero.webp"
      />
      <main className="psg26-page min-h-screen overflow-x-clip">
        {/* ── Buka ── */}
        <section className="psg26-hero" data-no-deer>
          <img
            src={PSG26.poster}
            alt="Suasana pasar rakyat bernuansa tempo dulu dengan gerbang bambu dan lapak karya"
            width={1024}
            height={1024}
            fetchPriority="high"
          />
          <div className="psg26-wrap psg26-hero-inner">
            <Link
              href="/event"
              className="psg26-badge"
              style={{ marginBottom: 4, textDecoration: "none" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Coming Soon
            </Link>
            <h1>
              Pasar Seni Garut
              <span>{PSG26.tagline}</span>
            </h1>
            <p className="psg26-tagline">Segera hadir. Catat tanggalnya dulu, detailnya menyusul.</p>
            <div className="psg26-meta">
              <span><b>{tanggalRentang()}</b></span>
              <span>{PSG26.lokasiUmum}</span>
            </div>

            <HitungMundur />

            <div className="psg26-cta">
              <a
                className="psg26-btn psg26-btn-emas"
                href={`${NEMPO_CONSULT_URL}?text=${encodeURIComponent(PESAN_WA)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Tanya lewat WhatsApp
              </a>
              <UnduhKalender />
            </div>
          </div>
        </section>

        <section className="psg26-section">
          <div className="psg26-wrap">
            <p className="psg26-kecil">
              Detail acara akan diumumkan di halaman ini. Ikuti{" "}
              <a href={NEMPO_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@nempo.id</a>{" "}
              untuk kabar terbarunya.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
