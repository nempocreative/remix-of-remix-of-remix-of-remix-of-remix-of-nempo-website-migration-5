import { useEffect, useState, type ReactNode } from 'react';
import SlideFooter from './SlideFooter';
import SlideHeader from './SlideHeader';

export const base = '/media/pasar-seni-garut/';

/** Shared look for the Pasanggiri Jaipong slides: batik backdrop, gold accent bar, staggered entrance. */
export default function PasanggiriFrame({
  label,
  judul,
  latar = 'batik-texture.webp',
  children,
}: {
  label: string;
  judul: ReactNode;
  latar?: string;
  children: (go: boolean) => ReactNode;
}) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGo(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pjg relative w-full h-full overflow-hidden bg-psg-bg flex flex-col px-[5cqw] pt-[8.5cqh] pb-[7.5cqh]">
      <style>{`
        @keyframes pjgDrift { 0%,100% { transform:scale(1.06) translate(0,0); } 50% { transform:scale(1.1) translate(-1cqw,-1cqh); } }
        @keyframes pjgUp { from { opacity:0; transform:translateY(3cqh); } to { opacity:1; transform:none; } }
        @keyframes pjgPop { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:none; } }
        @keyframes pjgGrow { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        @keyframes pjgBar { 0%,100% { opacity:1; } 50% { opacity:.45; } }
        @keyframes pjgShine { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
        @keyframes pjgFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-0.8cqh); } }
        .pjg-emas {
          background: linear-gradient(90deg,#fffbe8 0%,#D4A017 25%,#f5c842 50%,#c8860a 75%,#fffbe8 100%);
          background-size: 250% 250%;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation: pjgShine 5s ease infinite;
        }
        .pjg-kartu {
          background: linear-gradient(135deg,#2A1408 0%,#1A0D06 100%);
          border: 0.06cqw solid rgba(212,160,23,.22);
          transition: transform .28s cubic-bezier(.22,1,.36,1), border-color .28s, box-shadow .28s;
        }
        .pjg-kartu:hover { transform: translateY(-0.6cqh); border-color: rgba(212,160,23,.6); box-shadow: 0 1.5cqh 3cqw rgba(0,0,0,.45); }
        .pjg-melayang { animation: pjgFloat 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pjg *, .pjg *::before { animation: none !important; transition: none !important; }
        }
      `}</style>

      <img
        src={`${base}${latar}`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: latar === 'batik-texture.webp' ? 0.09 : 0.16, animation: 'pjgDrift 24s ease-in-out infinite' }}
        alt=""
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-[0.5cqh] z-10"
        style={{
          background: 'linear-gradient(to right, transparent, #D4A017 20%, #fffbe8 50%, #D4A017 80%, transparent)',
          animation: 'pjgBar 4.5s ease-in-out infinite',
        }}
      />

      <div className="relative z-20 flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-[1.5cqw] mb-[1.2cqh]">
          <span className="font-psg-body text-psg-accent uppercase" style={{ fontSize: '0.9cqw', letterSpacing: '0.32em' }}>
            {label}
          </span>
          <div
            className="flex-1 h-[0.12cqh] origin-left"
            style={{
              background: 'linear-gradient(to right, rgba(212,160,23,.45), transparent)',
              animation: go ? 'pjgGrow .8s cubic-bezier(.22,1,.36,1) .2s both' : 'none',
            }}
          />
        </div>
        <h2
          className="font-psg-display font-bold mb-[2.6cqh]"
          style={{
            fontSize: '3.4cqw', lineHeight: 1.08, color: 'rgba(245,230,195,.97)',
            opacity: go ? 1 : 0, animation: go ? 'pjgUp .65s cubic-bezier(.22,1,.36,1) .12s both' : 'none',
          }}
        >
          {judul}
        </h2>
        <div className="min-h-0 flex-1">{children(go)}</div>
      </div>

      <SlideHeader />
      <SlideFooter slide={27} />
    </div>
  );
}

/** Entrance style for an element, delayed by `d` seconds. */
export function masuk(go: boolean, d: number, jenis: 'up' | 'pop' = 'up') {
  return {
    opacity: go ? undefined : 0,
    animation: go ? `${jenis === 'pop' ? 'pjgPop' : 'pjgUp'} .6s cubic-bezier(.22,1,.36,1) ${d}s both` : 'none',
  } as const;
}
