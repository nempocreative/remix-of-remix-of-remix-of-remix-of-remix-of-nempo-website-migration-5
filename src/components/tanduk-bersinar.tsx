// Inlined so the antler shape never depends on a separate download (mask images need same-origin/CORS).
import tandukUrl from "@/assets/tanduk-rusa-local.png?inline";

/** Ujung-ujung tanduk (persen lebar/tinggi gambar) tempat lampu kecil berkelip. */
const LAMPU_KIRI = [
  { x: 1.5, y: 6 },
  { x: 11, y: 2 },
  { x: 16, y: 10.5 },
  { x: 21.8, y: 31.5 },
  { x: 4, y: 55.5 },
  { x: 46.5, y: 57 },
  { x: 13, y: 40 },
  { x: 33, y: 65 },
];
const LAMPU = [
  ...LAMPU_KIRI,
  ...LAMPU_KIRI.map((l) => ({ x: 100 - l.x, y: l.y })),
];

const GAYA = `
@keyframes tdkNyala { from { clip-path: inset(100% -15% -25% -15%); opacity: .2 } to { clip-path: inset(-25% -15% -25% -15%); opacity: 1 } }
@keyframes tdkDenyut {
  0%,100% { filter: drop-shadow(0 0 4px rgba(255,236,170,.95)) drop-shadow(0 0 14px rgba(255,196,70,.55)) }
  50%     { filter: drop-shadow(0 0 7px rgba(255,244,200,1)) drop-shadow(0 0 26px rgba(255,190,60,.85)) }
}
@keyframes tdkSapu { from { background-position: 0 120% } to { background-position: 0 -120% } }
@keyframes tdkKelip { 0%,100% { opacity: .25; transform: translate(-50%,-50%) scale(.6) } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.15) } }
.tdk-bungkus { position: relative; animation: tdkDenyut 2.2s ease-in-out infinite; }
.tdk-nyala { position: absolute; inset: 0; animation: tdkNyala 1.4s cubic-bezier(.3,.8,.3,1) .2s both; }
.tdk-instan .tdk-nyala { animation: none; }
.tdk-bentuk { position: absolute; inset: 0; -webkit-mask: var(--tdk-mask) center / contain no-repeat; mask: var(--tdk-mask) center / contain no-repeat; }
.tdk-isi { background: linear-gradient(180deg, #fff8dc 0%, #ffe08a 45%, #ffb547 100%); }
.tdk-kilau { background: linear-gradient(0deg, transparent 0%, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%, transparent 100%); background-size: 100% 260%; mix-blend-mode: screen; animation: tdkSapu 1.8s ease-in-out .6s infinite; }
.tdk-lampu { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #fffbe8;
  box-shadow: 0 0 6px 2px rgba(255,236,160,.95), 0 0 14px 4px rgba(255,190,70,.6);
  transform: translate(-50%,-50%); animation: tdkKelip 1.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .tdk-bungkus, .tdk-nyala, .tdk-kilau, .tdk-lampu { animation: none !important; }
  .tdk-bungkus { filter: drop-shadow(0 0 6px rgba(255,236,170,.95)) drop-shadow(0 0 18px rgba(255,196,70,.6)); }
  .tdk-lampu { opacity: .9; }
}
`;

/** Tanduk rusa yang menyala bak lampu, dipakai di layar pembuka. */
/** `langsung` shows the antlers at once (page-change loader is too brief for the slow reveal). */
export function TandukBersinar({ lebar = "220px", langsung = false }: { lebar?: string; langsung?: boolean }) {
  return (
    <div
      className={langsung ? "tdk-bungkus tdk-instan" : "tdk-bungkus"}
      aria-hidden="true"
      style={{ width: lebar, aspectRatio: "640 / 448", ["--tdk-mask" as string]: `url("${tandukUrl}")` }}
    >
      <style>{GAYA}</style>
      {/* The light-up reveal sits inside, so the glow around it is never cut into a box. */}
      <div className="tdk-nyala">
        <div className="tdk-bentuk tdk-isi" />
        <div className="tdk-bentuk tdk-kilau" />
        {LAMPU.map((l, i) => (
          <span
            key={i}
            className="tdk-lampu"
            style={{ left: `${l.x}%`, top: `${l.y}%`, animationDelay: `${(i * 0.23) % 1.6}s` }}
          />
        ))}
      </div>
    </div>
  );
}
