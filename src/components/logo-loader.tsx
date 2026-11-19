import { TandukBersinar } from "@/components/tanduk-bersinar";

const LOGO_SRC = `${import.meta.env.BASE_URL}Assets/Logo/nempo-new.webp`;

const GAYA = `
@keyframes llMasuk { from { transform: translateY(-14px) scale(.92); opacity: 0 } to { transform: none; opacity: 1 } }
@keyframes llCincin { from { transform: translate(-50%,-50%) scale(.7); opacity: .55 } to { transform: translate(-50%,-50%) scale(1.8); opacity: 0 } }
.ll-layar { position: fixed; inset: 0; z-index: 9998; display: flex; align-items: center; justify-content: center;
  /* dvh = tinggi layar yang benar-benar terlihat, jadi tanda tidak bergeser ke atas
     saat bar browser di ponsel muncul/hilang; vh tetap dipakai browser lama. */
  height: 100dvh; min-height: 100vh; box-sizing: border-box;
  padding: calc(16px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom));
  background: linear-gradient(170deg, #0172B1 0%, #0194f3 55%, #1BA0E2 100%);
  transition: opacity .35s cubic-bezier(.4,0,.2,1); overflow: hidden; }
.ll-layar[data-pudar="true"] { opacity: 0; pointer-events: none; }
.ll-isi { position: relative; display: flex; flex-direction: column; align-items: center; animation: llMasuk .45s cubic-bezier(.34,1.3,.64,1) both; }
/* Cincin sepusat dengan logo n, bukan dengan seluruh rombongan. */
.ll-cincin { position: absolute; top: 70%; left: 50%; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.18); animation: llCincin 2.2s ease-out infinite; }
.ll-logo { position: relative; z-index: 1; width: 92px; height: 92px; }
.ll-logo img { width: 92px; height: 92px; object-fit: contain; display: block; filter: brightness(0) invert(1); }
@media (prefers-reduced-motion: reduce) { .ll-isi, .ll-cincin { animation: none !important; } }
`;

/** Layar biru dengan tanduk menyala dan logo n, dipakai saat pindah halaman dan saat halaman dimuat. */
export function LogoLoader({ pudar = false }: { pudar?: boolean }) {
  return (
    <div className="ll-layar" data-pudar={pudar} role="status" aria-label="Memuat halaman">
      <style>{GAYA}</style>
      <div className="ll-isi">
        {[0, 1].map((i) => (
          <span key={i} className="ll-cincin" style={{ width: 120 + i * 56, height: 120 + i * 56, animationDelay: `${i * 0.6}s` }} />
        ))}
        <div style={{ marginBottom: "calc(92px * -0.14)" /* 14% of the logo: stays inside the top arch of the n */, position: "relative", zIndex: 0 }}>
          <TandukBersinar lebar="min(190px, 18vh)" langsung />
        </div>
        <div className="ll-logo">
          <img src={LOGO_SRC} alt="" decoding="async" />
        </div>
      </div>
    </div>
  );
}
