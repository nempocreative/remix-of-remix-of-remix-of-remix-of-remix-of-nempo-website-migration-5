import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { approach, bolehBertengger, deerGroundTarget, deerSpotX, faceToward, hopPose, hopStep, jepitSeretan, parkirBerlaku, partnerSpotX, rapikanJangkar, type DeerAnchor, type DeerSpot } from "@/lib/scroll-deer-path";

/** Calon pijakan di halaman selain Beranda. */
const PIJAKAN_UMUM = "section, h1, h2, h3, [data-deer-spot]";

/** Bentuk di menu, kepala/kaki halaman, jendela sembul, atau yang melayang tidak dipijak. */
function bisaDipijak(el: HTMLElement): boolean {
  if (el.closest('header, nav, footer, [role="dialog"], [aria-hidden="true"], .scroll-deer, [data-no-deer]')) return false;
  return !melayang(el);
}

function melayang(el: HTMLElement): boolean {
  for (let n: HTMLElement | null = el; n && n !== document.body; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (cs.position === "fixed" || cs.position === "sticky" || cs.display === "none" || cs.visibility === "hidden") return true;
  }
  return false;
}

/** Kaki halaman (footer) yang lebar jadi pijakan terakhir, supaya rusa tetap terlihat di ujung halaman. */
function kakiHalaman(vw: number): HTMLElement | null {
  for (const f of Array.from(document.querySelectorAll<HTMLElement>("footer"))) {
    if (f.getBoundingClientRect().width >= vw * 0.6 && !melayang(f)) return f;
  }
  return null;
}

/**
 * Rusa hiasan mengalah: kalau tubuhnya menimpa konten yang minta tidak ditutupi
 * ([data-no-deer], mis. kartu ajakan daftar lomba di Beranda), rusa fade out.
 * Dipanggil tiap bingkai selama rusa bergerak dan sekali saat ia berhenti.
 */
function tertimpaKonten(el: HTMLElement | null): boolean {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return false;
  for (const guard of Array.from(document.querySelectorAll<HTMLElement>("[data-no-deer]"))) {
    const g = guard.getBoundingClientRect();
    if (g.width < 2 || g.height < 2) continue;
    if (r.right > g.left && r.left < g.right && r.bottom > g.top && r.top < g.bottom) return true;
  }
  return false;
}

/* ══════════════════════════════════════════════════════════════
   RUSA PENGIKUT GULIR — sepasang rusa NEMPO (jantan bertanduk dan
   betina berpita) berdiri di tepi atas tiap bagian Beranda dan
   lompat-lompat ke bagian berikutnya saat digulir; si betina
   mengekor di belakang. Saat berhenti mereka saling berhadapan,
   bergantian melompat kecil, dan muncul hati kecil di antaranya.
   Palet sama dengan maskot rusa di ikon menu (deer-mascot.tsx).
   Tidak tampil untuk pengunjung yang memilih minim gerakan.
   ══════════════════════════════════════════════════════════════ */

const BULU = "#A9713F";
const BULU_JAUH = "#8C5A30";
const BULU_KEPALA = "#B67D49";
const KREM = "#FFF8E9";
const MONCONG = "#F8EBD4";
const GARIS = "#5A3A28";
const PIPI = "#F0A79E";
const HIDUNG = "#2E1A10";
const TANDUK = "#EFB43A";
const TANDUK_MUDA = "#FFEFBE";

/* viewBox 0 0 80 64 — kaki menapak di y = 62, titik tengah kaki x = 40 */
const PINGGUL_BELAKANG = { x: 25, y: 43 };
const BAHU_DEPAN = { x: 46, y: 43 };
const JAUH_GESER = 3;
const PERIODE_LOMPAT = 0.42;

function Kaki({ x, y, warna, legRef }: { x: number; y: number; warna: string; legRef: (el: SVGGElement | null) => void }) {
  return (
    <g ref={legRef}>
      <path d={`M${x} ${y}L${x} 57`} stroke={GARIS} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x} ${y}L${x} 57`} stroke={warna} strokeWidth="4.4" strokeLinecap="round" />
      <path d={`M${x} 57.6L${x} 59.4`} stroke={HIDUNG} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function Tanduk({ d, cabang }: { d: string; cabang: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={GARIS} strokeWidth="3.6" />
      <path d={cabang} stroke={GARIS} strokeWidth="3.2" />
      <path d={d} stroke={TANDUK} strokeWidth="2.1" />
      <path d={cabang} stroke={TANDUK} strokeWidth="1.8" />
      <path d={d} stroke={TANDUK_MUDA} strokeWidth=".8" transform="translate(-.5 -.5)" />
    </g>
  );
}

type Bulu = { badan: string; jauh: string; kepala: string };
const BULU_JANTAN: Bulu = { badan: BULU, jauh: BULU_JAUH, kepala: BULU_KEPALA };
const BULU_BETINA: Bulu = { badan: "#C48A55", jauh: "#A06C3D", kepala: "#CF9862" };
const PITA = "#EC6F93";
const PITA_TUA = "#B8436A";

function Pita() {
  return (
    <g transform="translate(51.6 11.4) rotate(-18)">
      <path d="M0 0L-5.4 -3.6L-5.2 3.4Z" fill={PITA} stroke={PITA_TUA} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M0 0L5.4 -3.6L5.2 3.4Z" fill={PITA} stroke={PITA_TUA} strokeWidth="1.1" strokeLinejoin="round" />
      <circle r="1.9" fill={PITA} stroke={PITA_TUA} strokeWidth="1" />
    </g>
  );
}

function RusaBadanUtuh({ legs, betina = false }: { legs: React.MutableRefObject<(SVGGElement | null)[]>; betina?: boolean }) {
  const set = (i: number) => (el: SVGGElement | null) => {
    legs.current[i] = el;
  };
  const b = betina ? BULU_BETINA : BULU_JANTAN;
  return (
    <svg viewBox="0 0 80 64" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      {/* kaki sisi jauh (lebih gelap, di belakang badan) */}
      <Kaki x={PINGGUL_BELAKANG.x + JAUH_GESER} y={PINGGUL_BELAKANG.y - 1} warna={b.jauh} legRef={set(0)} />
      <Kaki x={BAHU_DEPAN.x + JAUH_GESER} y={BAHU_DEPAN.y - 1} warna={b.jauh} legRef={set(1)} />

      {/* ekor */}
      <g className="sd-ekor">
        <ellipse cx="19.5" cy="31.5" rx="3.2" ry="4.8" transform="rotate(-38 19.5 31.5)" fill={b.badan} stroke={GARIS} strokeWidth="1.8" />
        <ellipse cx="18.6" cy="32.4" rx="1.5" ry="2.6" transform="rotate(-38 18.6 32.4)" fill={KREM} />
      </g>

      {/* leher + badan */}
      <path d="M47 36L55 24" stroke={GARIS} strokeWidth="12.4" strokeLinecap="round" />
      <ellipse cx="36" cy="38" rx="17" ry="10.5" fill={b.badan} stroke={GARIS} strokeWidth="2.2" />
      <path d="M47 36L55 24" stroke={b.badan} strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="37" cy="43.6" rx="11" ry="3.4" fill={MONCONG} opacity=".85" />
      <g fill={KREM} opacity=".6">
        <ellipse cx="29" cy="32.6" rx="1.6" ry="1.1" />
        <ellipse cx="34.5" cy="30.8" rx="1.4" ry="1" />
        <ellipse cx="40" cy="32" rx="1.6" ry="1.1" />
        <ellipse cx="32.6" cy="35.8" rx="1.3" ry=".9" />
        <ellipse cx="26" cy="36.6" rx="1.2" ry=".85" />
      </g>

      {/* kaki sisi dekat */}
      <Kaki x={PINGGUL_BELAKANG.x} y={PINGGUL_BELAKANG.y} warna={b.badan} legRef={set(2)} />
      <Kaki x={BAHU_DEPAN.x} y={BAHU_DEPAN.y} warna={b.badan} legRef={set(3)} />

      {/* kepala besar, gaya maskot */}
      <g className="sd-kepala">
        {betina ? (
          <ellipse cx="63.6" cy="9.6" rx="5.6" ry="2.6" transform="rotate(-62 63.6 9.6)" fill={b.jauh} stroke={GARIS} strokeWidth="1.6" />
        ) : (
          <Tanduk d="M60.5 12C61 8 62.6 5.2 65.6 3.2" cabang="M62.1 7.4C64.3 7.2 66 6.4 67.4 5.2" />
        )}
        <ellipse cx="47.4" cy="14.6" rx={betina ? 7.4 : 6.4} ry={betina ? 3.3 : 2.9} transform="rotate(-26 47.4 14.6)" fill={b.badan} stroke={GARIS} strokeWidth="1.8" />
        <ellipse cx="47.8" cy="14.8" rx="3.4" ry="1.3" transform="rotate(-26 47.8 14.8)" fill={PIPI} opacity=".55" />
        <ellipse cx="57" cy="20" rx="10.5" ry="9.5" fill={b.kepala} stroke={GARIS} strokeWidth="2" />
        <ellipse cx="66" cy="24" rx="6.4" ry="4.8" fill={MONCONG} stroke={GARIS} strokeWidth="1.4" />
        <ellipse cx="70.6" cy="22.6" rx="2.1" ry="1.7" fill={HIDUNG} />
        <ellipse cx="70" cy="22" rx=".7" ry=".35" fill="#fff" opacity=".5" />
        <path d="M65.6 27.2q1.5.9 3 0" stroke={GARIS} strokeWidth="1" strokeLinecap="round" fill="none" />
        <g className="sd-mata">
          <circle cx="59.6" cy="18.4" r={betina ? 2.8 : 2.6} fill={HIDUNG} />
          <circle cx="58.8" cy="17.5" r=".95" fill="#fff" />
          {betina && (
            <path d="M61.4 16.2l1.7-1.3M60 15.6l.7-1.8M62.2 17.6l1.9-.6" stroke={HIDUNG} strokeWidth=".9" strokeLinecap="round" />
          )}
        </g>
        <ellipse cx="60.4" cy="24.4" rx={betina ? 2.6 : 2.1} ry={betina ? 1.5 : 1.2} fill={PIPI} opacity={betina ? 0.75 : 0.5} />
        {betina ? (
          <Pita />
        ) : (
          <Tanduk d="M55.4 11.6C54.4 7.6 52.4 4.6 49.4 2.6" cabang="M53.3 6.7C55.4 5.3 56.5 3.7 56.9 1.9" />
        )}
      </g>
    </svg>
  );
}

const PERIODE_LOMPAT_BETINA = 0.36;
const SKALA_BETINA = 0.86;

type Rusa = {
  root: HTMLDivElement;
  body: HTMLDivElement;
  shadow: HTMLDivElement;
  dust: HTMLDivElement | null;
  legs: (SVGGElement | null)[];
  gx: number;
  gy: number;
  phase: number;
  facing: number;
  w: number;
  tinggi: number;
};

function renderRusa(r: Rusa) {
  const pose = hopPose(r.phase);
  const lift = pose.lift * r.w * r.tinggi;
  const sx = 1 + 0.08 * pose.squash;
  const sy = 1 - 0.12 * pose.squash;
  r.root.style.transform = `translate3d(${r.gx}px, ${r.gy}px, 0)`;
  r.body.style.transform = `translate3d(0, ${-lift}px, 0) scale(${r.facing * sx}, ${sy}) rotate(${pose.tilt}deg)`;
  r.shadow.style.transform = `translateX(-50%) scale(${1 - 0.45 * pose.lift})`;
  r.shadow.style.opacity = String(0.9 - 0.5 * pose.lift);
  const [bj, dj, bd, dd] = r.legs;
  const jx = JAUH_GESER;
  bj?.setAttribute("transform", `rotate(${pose.back * 0.8} ${PINGGUL_BELAKANG.x + jx} ${PINGGUL_BELAKANG.y - 1})`);
  dj?.setAttribute("transform", `rotate(${pose.front * 0.8} ${BAHU_DEPAN.x + jx} ${BAHU_DEPAN.y - 1})`);
  bd?.setAttribute("transform", `rotate(${pose.back} ${PINGGUL_BELAKANG.x} ${PINGGUL_BELAKANG.y})`);
  dd?.setAttribute("transform", `rotate(${pose.front} ${BAHU_DEPAN.x} ${BAHU_DEPAN.y})`);
}

/** Gerakkan satu rusa ke target; kembalikan true bila ia sudah diam. */
function stepRusa(r: Rusa, tx: number, ty: number, dt: number, rate: number, period: number) {
  const nx = approach(r.gx, tx, dt, rate);
  const ny = approach(r.gy, ty, dt, rate);
  const vx = (nx - r.gx) / dt;
  const speed = Math.hypot(vx, (ny - r.gy) / dt);
  r.gx = nx;
  r.gy = ny;
  const moving = speed > 12;
  if (Math.abs(vx) > 10) r.facing = vx > 0 ? 1 : -1;
  const sebelum = r.phase;
  r.phase = hopStep(r.phase, dt, moving, period);
  // kepulan debu kecil tiap kaki menapak setelah lompatan
  if (sebelum > 0.7 && r.phase < sebelum && r.dust) {
    r.dust.classList.remove("aktif");
    void r.dust.offsetWidth;
    r.dust.classList.add("aktif");
  }
  return !moving && r.phase === 0 && Math.abs(tx - r.gx) < 0.5 && Math.abs(ty - r.gy) < 0.5;
}

function RusaDom({
  betina,
  size,
  refs,
}: {
  betina?: boolean;
  size: number;
  refs: {
    root: React.RefObject<HTMLDivElement | null>;
    body: React.RefObject<HTMLDivElement | null>;
    shadow: React.RefObject<HTMLDivElement | null>;
    dust: React.RefObject<HTMLDivElement | null>;
    legs: React.MutableRefObject<(SVGGElement | null)[]>;
  };
}) {
  return (
    <div ref={refs.root} className={betina ? "scroll-deer scroll-deer-betina" : "scroll-deer"} aria-hidden="true">
      <div ref={refs.dust} className="scroll-deer-debu" style={{ width: size * 0.9 }}>
        <span />
        <span />
        <span />
      </div>
      <div ref={refs.shadow} className="scroll-deer-bayang" style={{ width: size * 0.55 }} />
      <div ref={refs.body} className="scroll-deer-badan" style={{ width: size, height: size * 0.8, left: -size / 2 }}>
        <div className="sd-main">
          <RusaBadanUtuh legs={refs.legs} betina={betina} />
        </div>
      </div>
    </div>
  );
}

function useRusaRefs() {
  return {
    root: useRef<HTMLDivElement>(null),
    body: useRef<HTMLDivElement>(null),
    shadow: useRef<HTMLDivElement>(null),
    dust: useRef<HTMLDivElement>(null),
    legs: useRef<(SVGGElement | null)[]>([]),
  };
}

function ScrollDeerRunner() {
  const jantanRefs = useRusaRefs();
  const betinaRefs = useRusaRefs();
  const hatiRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(68);

  useEffect(() => {
    const jr = jantanRefs;
    const br = betinaRefs;
    const hati = hatiRef.current;
    if (!jr.root.current || !jr.body.current || !jr.shadow.current) return;
    if (!br.root.current || !br.body.current || !br.shadow.current || !hati) return;

    const lebar = () => (window.innerWidth < 640 ? 68 : 84);
    const jantan: Rusa = {
      root: jr.root.current,
      body: jr.body.current,
      shadow: jr.shadow.current,
      dust: jr.dust.current,
      legs: jr.legs.current,
      gx: NaN,
      gy: NaN,
      phase: 0,
      facing: 1,
      w: lebar(),
      tinggi: 0.5,
    };
    const betina: Rusa = {
      root: br.root.current,
      body: br.body.current,
      shadow: br.shadow.current,
      dust: br.dust.current,
      legs: br.legs.current,
      gx: NaN,
      gy: NaN,
      phase: 0,
      facing: 1,
      w: lebar() * SKALA_BETINA,
      tinggi: 0.6,
    };

    let spots: DeerSpot[] = [];
    let tengger: DeerSpot | null = null;
    let minX = 0;
    let maxX = 0;
    let raf = 0;
    let last = 0;
    // halaman sampul (undangan/amplop) bisa terisi setelah efek jalan, jadi
    // pijakan dicari ulang sampai ada, lalu berhenti kalau memang tak ada
    const mulai = performance.now();
    let cekTerakhir = 0;
    // pengunjung bisa menyeret sepasang rusa (jari atau tetikus) ke tempat
    // yang tidak menutupi isi; mereka diam di sana sampai halaman digulir jauh
    let seret: { id: number; dx: number; dy: number } | null = null;
    let parkir: { x: number; y: number; scrollY: number } | null = null;

    const measure = () => {
      const w = lebar();
      jantan.w = w;
      betina.w = w * SKALA_BETINA;
      setSize(w);
      const vw = document.documentElement.clientWidth || window.innerWidth;
      // jangkar = tepi atas tiap bagian (dan bilah pencarian di Beranda), supaya
      // sepasang rusa berdiri DI ATAS bentuk, bukan di bawahnya
      const jangkar: DeerAnchor[] = [];
      const box = document.querySelector<HTMLElement>(".home-content");
      if (box) {
        const rect = box.getBoundingClientRect();
        const cs = getComputedStyle(box);
        const padL = parseFloat(cs.paddingLeft) || 0;
        const padR = parseFloat(cs.paddingRight) || 0;
        const left = rect.left + window.scrollX + padL;
        const width = rect.width - padL - padR;
        for (const el of Array.from(box.children)) {
          if (!(el instanceof HTMLElement) || !el.className.includes("home-section-")) continue;
          // hormati juga pengecualian yang sama seperti halaman lain (mis. [data-no-deer])
          if (!bisaDipijak(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.height < 40 || r.width < 40) continue;
          jangkar.push({ top: r.top + window.scrollY, left, width });
        }
        const cari = document.querySelector<HTMLElement>(".home-search-anchor");
        if (cari) {
          const r = cari.getBoundingClientRect();
          if (r.height > 20) jangkar.push({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, cari: true });
        }
      } else {
        // halaman lain: berdiri di tepi atas tiap bagian dan judul halaman
        const minW = w * 2.2;
        for (const el of Array.from(document.querySelectorAll<HTMLElement>(PIJAKAN_UMUM))) {
          if (!bisaDipijak(el)) continue;
          // judul yang sempit (mis. di dalam kartu): berdiri di atas kartunya
          let bentuk: HTMLElement = el;
          for (let i = 0; i < 5 && bentuk.getBoundingClientRect().width < minW && bentuk.parentElement && bentuk.parentElement !== document.body; i++) {
            bentuk = bentuk.parentElement;
          }
          const r = bentuk.getBoundingClientRect();
          if (r.height < 20) continue;
          jangkar.push({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width });
        }
      }
      const kaki = kakiHalaman(vw);
      if (kaki) {
        const r = kaki.getBoundingClientRect();
        jangkar.push({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width });
      }
      const rapi = rapikanJangkar(jangkar, vw, w * 2.2);
      minX = 8 + betina.w / 2;
      maxX = vw - 8 - betina.w / 2;
      const titik = rapi.map((j, i) => ({
        cari: !!j.cari,
        spot: {
          x: deerSpotX(i, j.left, j.width, w),
          // kuku menapak tepat di garis atas bilah, bukan menggantung di atasnya
          y: j.top + (j.cari ? 4 : -2),
          minX: j.left + betina.w / 2,
          maxX: j.left + j.width - betina.w / 2,
        },
      }));
      spots = titik.map((t) => t.spot);
      tengger = titik.find((t) => t.cari)?.spot ?? null;
    };

    const setIdle = (on: boolean) => {
      jantan.root.toggleAttribute("data-idle", on);
      betina.root.toggleAttribute("data-idle", on);
      hati.toggleAttribute("data-idle", on);
    };

    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
      last = t;
      // selama bilah pencarian masih terlihat penuh, rusa bertengger di atasnya
      if (parkir && !seret && !parkirBerlaku(parkir.scrollY, window.scrollY, window.innerHeight)) parkir = null;
      const bertengger = tengger && bolehBertengger(tengger.y, window.scrollY, jantan.w * 0.9);
      const target: DeerSpot | null = parkir
        ? { x: parkir.x, y: parkir.y, minX, maxX }
        : bertengger
          ? tengger
          : deerGroundTarget(spots, window.scrollY + window.innerHeight * 0.5, window.innerHeight);
      if (!target) {
        jantan.root.style.visibility = "hidden";
        betina.root.style.visibility = "hidden";
        hati.style.visibility = "hidden";
        // isi halaman masih dimuat: cari pijakan lagi tiap 0,4 dtk, jangan matikan loop
        if (t - mulai > 12000) { raf = 0; return; }
        if (t - cekTerakhir > 400) { cekTerakhir = t; measure(); }
        raf = requestAnimationFrame(tick);
        return;
      }
      jantan.root.style.visibility = "visible";
      betina.root.style.visibility = "visible";
      hati.style.visibility = "visible";
      const gap = jantan.w * 0.8;
      // rusa hanya boleh bergeser sejauh bentuk tempat ia berdiri (bilah
      // pencarian lebih sempit dari isi halaman)
      const bmin = target.minX ?? minX;
      const bmax = target.maxX ?? maxX;
      if (Number.isNaN(jantan.gx)) {
        jantan.gx = target.x;
        jantan.gy = target.y;
        betina.gx = partnerSpotX(target.x, target.x, gap, bmin, bmax);
        betina.gy = target.y;
      }
      // saat diseret rusa menempel erat di jari
      const diamJ = stepRusa(jantan, target.x, target.y, dt, seret ? 28 : 6, PERIODE_LOMPAT);
      // betina mengekor si jantan (bukan langsung ke target) supaya terlihat kejar-kejaran
      const bx = partnerSpotX(target.x, jantan.gx, gap, bmin, bmax);
      const diamB = stepRusa(betina, bx, jantan.gy, dt, seret ? 9 : 4.5, PERIODE_LOMPAT_BETINA);
      const settled = diamJ && diamB && !seret;
      if (settled) {
        // berhenti: saling berhadapan lalu bermain
        jantan.facing = faceToward(jantan.gx, betina.gx, jantan.facing);
        betina.facing = faceToward(betina.gx, jantan.gx, betina.facing);
      }
      renderRusa(jantan);
      renderRusa(betina);
      hati.style.transform = `translate3d(${(jantan.gx + betina.gx) / 2}px, ${Math.min(jantan.gy, betina.gy) - jantan.w * 0.78}px, 0)`;
      setIdle(settled);
      // rusa hiasan fade out bila tubuhnya sedang menimpa konten yang dilindungi
      const tertutup = tertimpaKonten(jantan.body) || tertimpaKonten(betina.body);
      jantan.root.toggleAttribute("data-tertimpa", tertutup);
      betina.root.toggleAttribute("data-tertimpa", tertutup);
      hati.toggleAttribute("data-tertimpa", tertutup);
      if (settled) {
        raf = 0;
        last = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    let tinggiTerukur = 0;
    const wake = () => {
      // halaman bertambah panjang (isi baru dimuat) → ukur ulang pijakan
      const h = document.documentElement.scrollHeight;
      if (h !== tinggiTerukur) {
        tinggiTerukur = h;
        measure();
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const remeasure = () => {
      tinggiTerukur = document.documentElement.scrollHeight;
      measure();
      wake();
    };

    const posisiJari = (e: PointerEvent) => ({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
    const taruh = (e: PointerEvent) => {
      if (!seret) return;
      const p = posisiJari(e);
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const j = jepitSeretan(p.x + seret.dx, p.y + seret.dy, window.scrollY, vw, window.innerHeight, jantan.w);
      parkir = { x: j.x, y: j.y, scrollY: window.scrollY };
    };
    const tekan = (e: PointerEvent) => {
      if (!e.isPrimary || seret || Number.isNaN(jantan.gx)) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      const p = posisiJari(e);
      seret = { id: e.pointerId, dx: jantan.gx - p.x, dy: jantan.gy - p.y };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      jantan.root.toggleAttribute("data-seret", true);
      betina.root.toggleAttribute("data-seret", true);
      taruh(e);
      wake();
    };
    const geser = (e: PointerEvent) => {
      if (!seret || e.pointerId !== seret.id) return;
      e.preventDefault();
      taruh(e);
      wake();
    };
    const lepas = (e: PointerEvent) => {
      if (!seret || e.pointerId !== seret.id) return;
      taruh(e);
      seret = null;
      if (parkir) parkir.scrollY = window.scrollY;
      jantan.root.toggleAttribute("data-seret", false);
      betina.root.toggleAttribute("data-seret", false);
      wake();
    };
    const pegangan = [jantan.body, betina.body];
    for (const el of pegangan) {
      el.addEventListener("pointerdown", tekan);
      el.addEventListener("pointermove", geser);
      el.addEventListener("pointerup", lepas);
      el.addEventListener("pointercancel", lepas);
    }

    measure();
    wake();
    // isi halaman dimuat bertahap (halaman lazy, foto, data), jadi ukur ulang
    // setiap kali tinggi halaman berubah dan beberapa saat setelah dibuka
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    ro.observe(document.documentElement);
    const cariEl = document.querySelector(".home-search-anchor");
    if (cariEl) ro.observe(cariEl);
    const tunda = [250, 900, 2000, 4500].map((ms) => window.setTimeout(remeasure, ms));
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      tunda.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", remeasure);
      for (const el of pegangan) {
        el.removeEventListener("pointerdown", tekan);
        el.removeEventListener("pointermove", geser);
        el.removeEventListener("pointerup", lepas);
        el.removeEventListener("pointercancel", lepas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RusaDom size={size * SKALA_BETINA} refs={betinaRefs} betina />
      <RusaDom size={size} refs={jantanRefs} />
      <div ref={hatiRef} className="scroll-deer-hati" aria-hidden="true">
        <svg viewBox="0 0 24 22" width={size * 0.22} height={size * 0.2}>
          <path d="M12 20.5C5 15.4 1.5 11.6 1.5 7.2 1.5 4 4 1.5 7 1.5c2.1 0 3.9 1.1 5 2.9 1.1-1.8 2.9-2.9 5-2.9 3 0 5.5 2.5 5.5 5.7 0 4.4-3.5 8.2-10.5 13.3Z" fill={PITA} stroke={PITA_TUA} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <svg viewBox="0 0 24 22" width={size * 0.15} height={size * 0.14}>
          <path d="M12 20.5C5 15.4 1.5 11.6 1.5 7.2 1.5 4 4 1.5 7 1.5c2.1 0 3.9 1.1 5 2.9 1.1-1.8 2.9-2.9 5-2.9 3 0 5.5 2.5 5.5 5.7 0 4.4-3.5 8.2-10.5 13.3Z" fill={PITA} stroke={PITA_TUA} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}

/** Sepasang rusa NEMPO yang ikut lompat-lompat antarbagian saat halaman digulir. */
export function ScrollDeer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;
  return createPortal(<ScrollDeerRunner />, document.body);
}
