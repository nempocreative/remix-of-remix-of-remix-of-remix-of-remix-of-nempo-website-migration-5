import React from "react";

/* ══════════════════════════════════════════════════════════════
   OTTER MASCOT — maskot NEMPO yang memeluk tepi atas ikon menu.
   Digambar tangan (bukan foto/AI) dengan palet yang sama dengan
   ilustrasi ikon layanan: garis coklat, krem, pipi pink.
   viewBox 0 0 64 44 — garis "tepi ikon" berada di y = 26, dan
   badan berang-berang berhenti rata di garis itu supaya terlihat
   mengintip dari balik kartu.
   ══════════════════════════════════════════════════════════════ */

const BULU = "#8B5E3C";
const BULU_KEPALA = "#94653F";
const KREM = "#FFF8E9";
const MUKA = "#EBD3AE";
const MONCONG = "#F8EBD4";
const GARIS = "#5A3A28";
const PIPI = "#F0A79E";
const HIDUNG = "#2E1A10";
const MATA = "#2E1A10";
const TELAPAK = "#7A4F33";
const TOPI = "#2695F2";
const TOPI_GELAP = "#1A6FC0";

export type OtterPose = "intip" | "lambaian" | "tidur" | "cengkeram";

const POSIS: OtterPose[] = ["intip", "lambaian", "tidur", "cengkeram"];

/** Pose maskot untuk ikon menu ke-`index` (berulang, jadi tiap tile beda). */
export function otterPose(index: number): OtterPose {
  return POSIS[Math.abs(Math.trunc(index)) % POSIS.length]!;
}

/** Semua pose yang dipakai menu grid — dipakai juga oleh uji. */
export const OTTER_POSIS = POSIS;

/** Garis tepi kartu dalam koordinat viewBox. */
export const OTTER_TEPI_Y = 26;

/** Kemiringan kepala per pose — dibuat kecil supaya tetap rapi. */
function kepala(pose: OtterPose): string | undefined {
  switch (pose) {
    case "lambaian":
      return "rotate(5 32 18)";
    case "tidur":
      return "rotate(-9 32 20) translate(0 1.4)";
    default:
      return undefined;
  }
}

/** Bahu yang berhenti rata di tepi kartu (tanpa garis bawah). */
function Badan() {
  return (
    <g>
      <path d="M17 26C17 19.5 23 16 32 16s15 3.5 15 10Z" fill={BULU} />
      <path d="M17 26C17 19.5 23 16 32 16s15 3.5 15 10" stroke={GARIS} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** Topi baseball biru NEMPO — lidah menonjol ke kiri seperti maskot besar. */
function Topi() {
  return (
    <g>
      {/* kubah topi */}
      <path
        d="M20 9.8C20 3.8 25.5 1.6 32 1.6s12 2.2 12 8.2Z"
        fill={TOPI}
        stroke={GARIS}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* garis panel tengah */}
      <path d="M32 2v7.6" stroke={TOPI_GELAP} strokeWidth="1.1" strokeLinecap="round" />
      {/* kancing di puncak */}
      <circle cx="32" cy="1.9" r="1.1" fill={TOPI_GELAP} stroke={GARIS} strokeWidth="1" />
      {/* lidah topi menonjol ke kiri */}
      <ellipse cx="22.5" cy="9.2" rx="9.2" ry="2.4" fill={TOPI_GELAP} stroke={GARIS} strokeWidth="1.6" />
    </g>
  );
}

function Kepala({ pose }: { pose: OtterPose }) {
  const tiduran = pose === "tidur";
  const kaget = pose === "cengkeram";

  return (
    <g transform={kepala(pose)}>
      {/* telinga mungil rendah di samping kepala — ciri otter, bukan beruang */}
      <circle cx="17.2" cy="12.4" r="2.1" fill={BULU} stroke={GARIS} strokeWidth="1.6" />
      <circle cx="46.8" cy="12.4" r="2.1" fill={BULU} stroke={GARIS} strokeWidth="1.6" />

      {/* kepala pipih & lebar, pipi menggembung ke samping */}
      <path
        d="M16.6 14.5C16.6 7 23.5 4 32 4s15.4 3 15.4 10.5c0 5.8-6.6 9.3-15.4 9.3s-15.4-3.5-15.4-9.3Z"
        fill={BULU_KEPALA}
        stroke={GARIS}
        strokeWidth="2"
      />
      {/* muka krem dengan garis coklat turun di dahi, seperti otter besar */}
      <path
        d="M18.4 16.2C18.7 11.8 21.6 9.8 25 9.8c2.9 0 4.9 1.3 7 2.8 2.1-1.5 4.1-2.8 7-2.8 3.4 0 6.3 2 6.6 6.4-.4 4.4-6 6.6-13.6 6.6s-13.2-2.2-13.6-6.6Z"
        fill={MUKA}
      />

      {/* mata bulat berkilau */}
      {tiduran ? (
        <path
          d="M23.2 13.6c.8-1.2 2.9-1.2 3.7 0M37.1 13.6c.8-1.2 2.9-1.2 3.7 0"
          stroke={GARIS}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <>
          <circle cx="25" cy="13.2" r={kaget ? 2.7 : 2.3} fill={MATA} />
          <circle cx="39" cy="13.2" r={kaget ? 2.7 : 2.3} fill={MATA} />
          <circle cx="24.3" cy="12.4" r=".85" fill="#fff" />
          <circle cx="38.3" cy="12.4" r=".85" fill="#fff" />
        </>
      )}

      {/* dua bantalan kumis menggembung — moncong khas otter */}
      <circle cx="29.2" cy="18.6" r="3.3" fill={MONCONG} stroke={GARIS} strokeWidth="1.1" />
      <circle cx="34.8" cy="18.6" r="3.3" fill={MONCONG} stroke={GARIS} strokeWidth="1.1" />
      <path d="M29.4 21.4h5.2" stroke={MONCONG} strokeWidth="2" />

      {/* hidung lebar membulat di atas bantalan */}
      <path d="M28.7 15.6c0-1 1.1-1.6 3.3-1.6s3.3.6 3.3 1.6c0 1.3-1.8 2.6-3.3 2.6s-3.3-1.3-3.3-2.6Z" fill={HIDUNG} />
      <ellipse cx="31" cy="14.9" rx=".9" ry=".4" fill="#fff" opacity=".5" />

      {/* mulut */}
      {kaget ? (
        <ellipse cx="32" cy="22.3" rx="1.2" ry="1" fill={HIDUNG} />
      ) : (
        <path d="M30.4 22.1q1.6 1 3.2 0" stroke={GARIS} strokeWidth="1" strokeLinecap="round" />
      )}

      {/* titik kumis di bantalan */}
      <g fill={GARIS} opacity=".6">
        <circle cx="27.4" cy="18.4" r=".45" />
        <circle cx="28.6" cy="20" r=".45" />
        <circle cx="36.6" cy="18.4" r=".45" />
        <circle cx="35.4" cy="20" r=".45" />
      </g>

      {/* kumis panjang menjulur keluar kepala */}
      <g stroke={GARIS} strokeWidth=".7" strokeLinecap="round" opacity=".7">
        <path d="M26.6 18.2 13 16.4M26.6 19.4 13.4 20.4M27 20.4 15 23.4" />
        <path d="M37.4 18.2 51 16.4M37.4 19.4 50.6 20.4M37 20.4 49 23.4" />
      </g>

      {/* pipi */}
      <ellipse cx="21.4" cy="17.4" rx="1.9" ry="1.1" fill={PIPI} opacity=".45" />
      <ellipse cx="42.6" cy="17.4" rx="1.9" ry="1.1" fill={PIPI} opacity=".45" />

      {/* topi biru di atas kepala */}
      <Topi />
    </g>
  );
}

/** Telapak bertumpu & mengait di tepi kartu. */
function Telapak({ x, cakar = false }: { x: number; cakar?: boolean }) {
  return (
    <g>
      <rect x={x} y="21.4" width="11" height="10" rx="5" fill={TELAPAK} stroke={GARIS} strokeWidth="1.8" />
      <path
        d={`M${x + 3.3} 28.4v1.8M${x + 5.5} 28.8v1.8M${x + 7.7} 28.4v1.8`}
        stroke={MUKA}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {cakar && (
        <path
          d={`M${x + 3.3} 31.6l-.3 1.6M${x + 5.5} 31.8v1.7M${x + 7.7} 31.6l.3 1.6`}
          stroke={GARIS}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

/** Telapak dilipat di tepi sebagai bantal — pose tiduran. */
function TelapakLipat() {
  return (
    <g>
      <rect x="36" y="22.2" width="16" height="7.6" rx="3.8" fill={TELAPAK} stroke={GARIS} strokeWidth="1.8" />
      <path d="M40.5 27.4v1.4M44 27.7v1.4M47.5 27.4v1.4" stroke={MUKA} strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

/** Tangan diangkat melambai di samping kepala. */
function TelapakMelambai() {
  return (
    <g>
      {/* lengan dari bahu ke telapak */}
      <path d="M44.6 23.4 50.4 14" stroke={GARIS} strokeWidth="7.6" strokeLinecap="round" />
      <path d="M44.6 23.4 50.4 14" stroke={BULU} strokeWidth="4" strokeLinecap="round" />
      <g transform="rotate(16 52 15)">
        <rect x="47" y="3.4" width="10" height="13" rx="5" fill={TELAPAK} stroke={GARIS} strokeWidth="1.8" />
        <path d="M49.8 6v1.6M52 5.6v1.6M54.2 6v1.6" stroke={MUKA} strokeWidth="1" strokeLinecap="round" />
      </g>
      <path d="M58.6 3.2q1.6 1.9.4 4.2" stroke={GARIS} strokeWidth="1.1" strokeLinecap="round" opacity=".6" />
    </g>
  );
}

/** Huruf "z" kecil — pose tiduran. */
function Zzz() {
  return (
    <path
      d="M48.6 2.6h3.2l-3.2 3.4h3.2M54 .9h2l-2 2.1h2"
      stroke={GARIS}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity=".7"
    />
  );
}

type Props = {
  pose: OtterPose;
  className?: string;
  style?: React.CSSProperties;
};

export function OtterMascot({ pose, className, style }: Props) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const saring = `otter-stiker-${id}`;

  return (
    <svg viewBox="0 0 64 44" fill="none" aria-hidden="true" className={className} style={style} data-pose={pose}>
      <defs>
        {/* tepi stiker krem mengikuti bentuk apa pun */}
        <filter id={saring} x="-10%" y="-15%" width="120%" height="130%">
          <feMorphology operator="dilate" radius="2.2" in="SourceAlpha" result="tebal" />
          <feFlood floodColor={KREM} result="krem" />
          <feComposite in="krem" in2="tebal" operator="in" result="tepi" />
          <feMerge>
            <feMergeNode in="tepi" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${saring})`}>
        <Badan />
        <Kepala pose={pose} />
        {pose === "lambaian" ? (
          <>
            <Telapak x={11} />
            <TelapakMelambai />
          </>
        ) : pose === "tidur" ? (
          <>
            <Telapak x={12} />
            <TelapakLipat />
            <Zzz />
          </>
        ) : pose === "cengkeram" ? (
          <>
            <Telapak x={15.5} cakar />
            <Telapak x={37.5} cakar />
          </>
        ) : (
          <>
            <Telapak x={11} />
            <Telapak x={42} />
          </>
        )}
      </g>
    </svg>
  );
}

/* ── Ukuran maskot untuk kotak ikon judul ──────────────────────
   Tinggi = lebar × 44/64; tepi kartu (y=26 dari 44) jatuh tepat
   di tepi atas kotak, jadi top = −59% tinggi maskot.
   sm: kotak 32–36px · md: kotak 40px · lg: kotak 44–48px        */
export type OtterUkuran = "sm" | "md" | "lg";

export const OTTER_UKURAN: Record<OtterUkuran, { lebar: number; tinggi: number; atas: number }> = {
  sm: { lebar: 28, tinggi: 19, atas: -11 },
  md: { lebar: 32, tinggi: 22, atas: -13 },
  lg: { lebar: 38, tinggi: 26, atas: -15 },
};

/** Berang-berang yang memeluk tepi atas kotak ikon judul (kotak harus `relative`). */
export function OtterPeluk({ pose, ukuran = "md" }: { pose: OtterPose; ukuran?: OtterUkuran }) {
  const u = OTTER_UKURAN[ukuran];
  return (
    <OtterMascot
      pose={pose}
      className="otter-peluk pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
      style={{ width: u.lebar, height: u.tinggi, top: u.atas }}
    />
  );
}
