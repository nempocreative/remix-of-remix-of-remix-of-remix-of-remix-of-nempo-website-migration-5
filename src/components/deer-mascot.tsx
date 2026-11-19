import React from "react";

/* ══════════════════════════════════════════════════════════════
   RUSA MASCOT — maskot NEMPO yang memeluk tepi atas ikon menu.
   Digambar tangan (bukan foto/AI), palet sama dengan ilustrasi
   ikon layanan: garis coklat, krem, pipi pink.
   viewBox 0 0 64 44 — garis "tepi ikon" berada di y = 26, dan
   badan rusa berhenti rata di garis itu supaya terlihat mengintip
   dari balik kartu.

   Susunan tanduk meniru foto rujukan: balok naik ke luar, dua
   cabang dari sisi dalam, lalu balok berakhir jadi garpu "Y" —
   empat ujung tiap sisi, semua runcing. Kepala sengaja dibuat
   besar (SKALA_KEPALA) supaya wajahnya jelas terbaca di ukuran
   ikon menu yang kecil.
   ══════════════════════════════════════════════════════════════ */

const BULU = "#A9713F";
const BULU_KEPALA = "#B67D49";
const KREM = "#FFF8E9";
const MONCONG = "#F8EBD4";
const GARIS = "#5A3A28";
const PIPI = "#F0A79E";
const HIDUNG = "#2E1A10";
const MATA = "#2E1A10";
const KUKU = "#8A5A31";
const TANDUK = "#EFB43A";
const TANDUK_MUDA = "#FFEFBE";
const TANDUK_TUA = "#7C4822";
const KILAU = "#FFFFFF";

/** Tebal tepi stiker krem — juga batas aman ujung tanduk dari tepi kanvas. */
const TEPI_STIKER = 1.1;

export type DeerPose = "intip" | "lambaian" | "tidur" | "cengkeram";

const POSIS: DeerPose[] = ["intip", "lambaian", "tidur", "cengkeram"];

/** Pose maskot untuk ikon menu ke-`index` (berulang, jadi tiap tile beda). */
export function deerPose(index: number): DeerPose {
  return POSIS[Math.abs(Math.trunc(index)) % POSIS.length]!;
}

/** Semua pose yang dipakai menu grid — dipakai juga oleh uji. */
export const DEER_POSIS = POSIS;

/** Garis tepi kartu dalam koordinat viewBox. */
export const DEER_TEPI_Y = 26;

/* ── Tanduk mewah ─────────────────────────────────────────────
   Satu sisi saja yang ditulis; sisi kanan hasil cerminan.
   `tebal` = garis luar coklat, `emas` = batang emas di dalamnya.
   `u` = ujung cabang: titik, arah keluar (sudah dinormalkan), dan
   panjang runcingannya — tiap cabang berakhir tajam. */
type Ujung = { x: number; y: number; dx: number; dy: number; p: number };
type Batang = { d: string; tebal: number; emas: number; u?: Ujung };

const TANDUK_KIRI: Batang[] = [
  // balok utama: naik ke luar dari pangkal, berakhir di garpu
  { d: "M28.5 16C24.6 13.8 20.8 11.4 18 8.8C16.4 7.4 15 6.5 13.8 5.8", tebal: 4, emas: 2.8 },
  // cabang dalam terbawah (dahi) — mendongak ke tengah
  { d: "M24.2 13.4C25.4 12.4 26.4 11.2 27.4 9.8", tebal: 3.4, emas: 2.4, u: { x: 27.4, y: 9.8, dx: 0.55, dy: -0.83, p: 2 } },
  // cabang dalam tengah — lebih tinggi
  { d: "M19.8 10.2C20.9 8.8 22 7.3 23 5.8", tebal: 3.4, emas: 2.4, u: { x: 23, y: 5.8, dx: 0.42, dy: -0.91, p: 2 } },
  // garpu atas: cabang ke dalam
  { d: "M13.8 5.8C14.6 5 15.4 4.2 16.2 3.4", tebal: 3.4, emas: 2.4, u: { x: 16.2, y: 3.4, dx: 0.6, dy: -0.8, p: 0.8 } },
  // garpu atas: cabang ke luar
  { d: "M13.8 5.8C12.6 5.3 11.3 4.8 10.2 4.2", tebal: 3.4, emas: 2.4, u: { x: 10.2, y: 4.2, dx: -0.8, dy: -0.6, p: 1.8 } },
];

/** Segitiga runcing di ujung cabang; `lebar` = setengah tebal pangkal. */
function runcing(u: Ujung, lebar: number, tambah: number) {
  const px = -u.dy;
  const py = u.dx;
  const tx = u.x + u.dx * (u.p + tambah);
  const ty = u.y + u.dy * (u.p + tambah);
  return `M${u.x + px * lebar} ${u.y + py * lebar}L${tx} ${ty}L${u.x - px * lebar} ${u.y - py * lebar}Z`;
}

function TandukSisi({ emas }: { emas: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* garis luar coklat: batang lalu runcingan */}
      <g stroke={GARIS}>
        {TANDUK_KIRI.map((b) => (
          <path key={`l${b.d}`} d={b.d} strokeWidth={b.tebal} />
        ))}
      </g>
      <g fill={GARIS} stroke="none">
        {TANDUK_KIRI.filter((b) => b.u).map((b) => (
          <path key={`lo${b.d}`} d={runcing(b.u!, b.tebal / 2, 0.6)} />
        ))}
      </g>
      {/* batang emas: terang di ujung, tua di pangkal */}
      <g stroke={`url(#${emas})`}>
        {TANDUK_KIRI.map((b) => (
          <path key={`g${b.d}`} d={b.d} strokeWidth={b.emas} />
        ))}
      </g>
      <g fill={`url(#${emas})`} stroke="none">
        {TANDUK_KIRI.filter((b) => b.u).map((b) => (
          <path key={`go${b.d}`} d={runcing(b.u!, b.emas / 2, 0)} />
        ))}
      </g>
      {/* kilau: lapis lembut lalu garis tipis di sisi atas setiap cabang */}
      <g stroke={TANDUK_MUDA} strokeWidth="1.8" opacity=".8" transform="translate(-1.1 -1.1)">
        {TANDUK_KIRI.map((b) => (
          <path key={`m${b.d}`} d={b.d} />
        ))}
      </g>
      <g stroke={KILAU} strokeWidth=".85" opacity=".9" transform="translate(-1.3 -1.3)">
        {TANDUK_KIRI.map((b) => (
          <path key={`s${b.d}`} d={b.d} />
        ))}
      </g>
    </g>
  );
}

function Tanduk({ emas }: { emas: string }) {
  return (
    <g>
      <TandukSisi emas={emas} />
      <g transform="translate(64,0) scale(-1,1)">
        <TandukSisi emas={emas} />
      </g>
    </g>
  );
}

/** Bahu yang berhenti rata di tepi kartu (tanpa garis bawah). */
function Badan() {
  return (
    <g>
      <path d="M17 26C17 21.4 23.4 18.6 32 18.6s15 2.8 15 7.4Z" fill={BULU} />
      <path d="M17 26C17 21.4 23.4 18.6 32 18.6s15 2.8 15 7.4" stroke={GARIS} strokeWidth="2" strokeLinecap="round" />
      {/* dada lebih terang */}
      <path d="M27.4 26c0-3 2-4.8 4.6-4.8s4.6 1.8 4.6 4.8Z" fill={MONCONG} opacity=".85" />
      {/* bintik rusa muda */}
      <g fill={KREM} opacity=".5">
        <ellipse cx="21" cy="23.4" rx="1.5" ry="1" />
        <ellipse cx="24" cy="21.4" rx="1.2" ry=".85" />
        <ellipse cx="43" cy="23.4" rx="1.5" ry="1" />
        <ellipse cx="40" cy="21.4" rx="1.2" ry=".85" />
      </g>
    </g>
  );
}



/** Telinga rusa — daun panjang, mendongak ke samping. */
function Telinga() {
  return (
    <g>
      <g>
        <ellipse cx="18" cy="19" rx="6.2" ry="3.3" transform="rotate(-20 18 19)" fill={BULU} stroke={GARIS} strokeWidth="1.8" />
        <ellipse cx="18.4" cy="19.2" rx="3.4" ry="1.6" transform="rotate(-20 18.4 19.2)" fill={PIPI} opacity=".5" />
      </g>
      <g>
        <ellipse cx="46" cy="19" rx="6.2" ry="3.3" transform="rotate(20 46 19)" fill={BULU} stroke={GARIS} strokeWidth="1.8" />
        <ellipse cx="45.6" cy="19.2" rx="3.4" ry="1.6" transform="rotate(20 45.6 19.2)" fill={PIPI} opacity=".5" />
      </g>
    </g>
  );
}

function Kepala({ pose }: { pose: DeerPose }) {
  const tiduran = pose === "tidur";
  const kaget = pose === "cengkeram";

  return (
    <g transform={kepala(pose)}>
      <Telinga />

      {/* kepala besar membulat di dahi, menyempit ke moncong —
          wajah sengaja dominan supaya jelas terbaca di ikon kecil */}
      <path
        d="M32 13.2C37 13.2 41.8 16.2 41.8 20.2C41.8 23.8 37.6 25.4 32 25.4C26.4 25.4 22.2 23.8 22.2 20.2C22.2 16.2 27 13.2 32 13.2Z"
        fill={BULU_KEPALA}
        stroke={GARIS}
        strokeWidth="2"
      />

      {/* mata besar bulat berkilau */}
      {tiduran ? (
        <path
          d="M24.2 18.2c.9-1.2 3-1.2 3.9 0M35.9 18.2c.9-1.2 3-1.2 3.9 0"
          stroke={GARIS}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <>
          <circle cx="26.2" cy="17.8" r={kaget ? 2.8 : 2.4} fill={MATA} />
          <circle cx="37.8" cy="17.8" r={kaget ? 2.8 : 2.4} fill={MATA} />
          <circle cx="25.4" cy="17" r=".85" fill="#fff" />
          <circle cx="37" cy="17" r=".85" fill="#fff" />
        </>
      )}

      {/* moncong krem melebar ke bawah */}
      <path
        d="M32 18.2c3.2 0 5.4 1.8 5.4 4 0 2.3-2.4 3.8-5.4 3.8s-5.4-1.5-5.4-3.8c0-2.2 2.2-4 5.4-4Z"
        fill={MONCONG}
        stroke={GARIS}
        strokeWidth="1.1"
      />

      {/* hidung lebar */}
      <path d="M32 19.6c2.1 0 3.6.8 3.6 2 0 1.5-1.8 2.9-3.6 2.9s-3.6-1.4-3.6-2.9c0-1.2 1.5-2 3.6-2Z" fill={HIDUNG} />
      <ellipse cx="31.1" cy="20.5" rx=".9" ry=".4" fill="#fff" opacity=".5" />

      {/* mulut */}
      {kaget ? (
        <ellipse cx="32" cy="23.6" rx="1.1" ry=".9" fill={HIDUNG} />
      ) : (
        <path d="M30.6 23.4q1.4.9 2.8 0" stroke={GARIS} strokeWidth="1" strokeLinecap="round" />
      )}

      {/* bintik di moncong */}
      <g fill={GARIS} opacity=".45">
        <circle cx="28.8" cy="21.8" r=".45" />
        <circle cx="29.5" cy="22.9" r=".45" />
        <circle cx="35.2" cy="21.8" r=".45" />
        <circle cx="34.5" cy="22.9" r=".45" />
      </g>

      {/* pipi */}
      <ellipse cx="24.2" cy="21.8" rx="1.8" ry="1.1" fill={PIPI} opacity=".45" />
      <ellipse cx="39.8" cy="21.8" rx="1.8" ry="1.1" fill={PIPI} opacity=".45" />
    </g>
  );
}

/** Kemiringan kepala per pose — tanduk tidak ikut berputar. */
function kepala(pose: DeerPose): string | undefined {
  switch (pose) {
    case "lambaian":
      return "rotate(3 32 21)";
    case "tidur":
      return "rotate(-6 32 21) translate(0 1)";
    default:
      return undefined;
  }
}

/** Kuku bertumpu di tepi kartu (belah tengah seperti kuku rusa). */
function Kuku({ x, mencengkeram = false }: { x: number; mencengkeram?: boolean }) {
  const t = mencengkeram ? 11.2 : 9.8;
  return (
    <g>
      <rect x={x} y="23.2" width="10" height={t} rx="4.6" fill={KUKU} stroke={GARIS} strokeWidth="1.8" />
      <path d={`M${x + 5} ${23.2 + t - 4}v2.6`} stroke={GARIS} strokeWidth="1.2" strokeLinecap="round" />
      <path d={`M${x + 2.6} 26q2.4-1.4 4.8 0`} stroke={KREM} strokeWidth="1" strokeLinecap="round" opacity=".35" />
    </g>
  );
}

/** Kuku dilipat di tepi sebagai bantal — pose tiduran. */
function KukuLipat() {
  return (
    <g>
      <rect x="38.5" y="23.8" width="13" height="6.6" rx="3.3" fill={KUKU} stroke={GARIS} strokeWidth="1.8" />
      <path d="M43 28.2v1.7M47 28.2v1.7" stroke={GARIS} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

/** Tangan diangkat melambai di samping kepala. */
function KukuMelambai() {
  return (
    <g>
      <path d="M45.5 24.6 54 21" stroke={GARIS} strokeWidth="7.6" strokeLinecap="round" />
      <path d="M45.5 24.6 54 21" stroke={BULU} strokeWidth="4" strokeLinecap="round" />
      <g transform="rotate(12 56.8 17.5)">
        <rect x="52" y="11.5" width="9.5" height="12.5" rx="4.6" fill={KUKU} stroke={GARIS} strokeWidth="1.8" />
        <path d="M56.8 20.1v2.6" stroke={GARIS} strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </g>
  );
}

type Props = {
  pose: DeerPose;
  className?: string;
  style?: React.CSSProperties;
};

export function DeerMascot({ pose, className, style }: Props) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const saring = `rusa-stiker-${id}`;
  const emas = `rusa-emas-${id}`;

  return (
    <svg viewBox="0 0 64 44" fill="none" aria-hidden="true" className={className} style={style} data-pose={pose}>
      <defs>
        {/* tepi stiker krem mengikuti bentuk apa pun */}
        <filter id={saring} x="-10%" y="-15%" width="120%" height="130%">
          <feMorphology operator="dilate" radius={TEPI_STIKER} in="SourceAlpha" result="tebal" />
          <feFlood floodColor={KREM} result="krem" />
          <feComposite in="krem" in2="tebal" operator="in" result="tepi" />
          <feMerge>
            <feMergeNode in="tepi" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* emas tanduk: terang di ujung, tua di pangkal */}
        <linearGradient id={emas} gradientUnits="userSpaceOnUse" x1="32" y1="2" x2="32" y2="17">
          <stop offset="0" stopColor="#FFFDF0" />
          <stop offset=".3" stopColor={TANDUK_MUDA} />
          <stop offset=".62" stopColor={TANDUK} />
          <stop offset="1" stopColor={TANDUK_TUA} />
        </linearGradient>
      </defs>

      <g filter={`url(#${saring})`}>
        <Badan />
        {/* tanduk digambar di luar putaran kepala supaya ujungnya tidak
            terangkat sampai terpotong tepi kanvas saat pose miring */}
        <Tanduk emas={emas} />
        <Kepala pose={pose} />
        {pose === "lambaian" ? (
          <>
            <Kuku x={11} />
            <KukuMelambai />
          </>
        ) : pose === "tidur" ? (
          <>
            <Kuku x={12} />
            <KukuLipat />
          </>
        ) : pose === "cengkeram" ? (
          <>
            <Kuku x={15.5} mencengkeram />
            <Kuku x={37.5} mencengkeram />
          </>
        ) : (
          <>
            <Kuku x={11} />
            <Kuku x={42} />
          </>
        )}
      </g>
    </svg>
  );
}
