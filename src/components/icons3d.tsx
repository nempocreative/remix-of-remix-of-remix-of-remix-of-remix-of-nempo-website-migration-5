import React from "react";
import { Link } from "@/lib/wouter";
import { mainNavItems } from "@/data/main-nav-items";
import { HomeServiceIcon } from "@/components/home-service-icons";
import { DeerMascot, deerPose } from "@/components/deer-mascot";

export function CategoryGrid() {
  const serviceTrackRef = React.useRef<HTMLDivElement>(null);
  const [servicePage, setServicePage] = React.useState(0);
  const servicePages: (typeof mainNavItems)[number][][] = [];
  for (let i = 0; i < mainNavItems.length; i += 8) servicePages.push(mainNavItems.slice(i, i + 8));
  return (
    <>
      <style>{`
        .nempo-service__tile { transition: transform 180ms ease, box-shadow 180ms ease; }
        .nempo-service:hover .nempo-service__tile,
        .nempo-service:focus-visible .nempo-service__tile {
          transform: translateY(-3px);
          box-shadow: 0 6px 0 rgba(55,45,87,.23), 0 11px 17px -10px rgba(38,39,68,.38), inset 0 1px 0 rgba(255,255,255,.58) !important;
        }
        /* cahaya berjalan mengelilingi bentuk menu */
        @keyframes nempo-ring-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes nempo-ring-glow { 0%,100% { opacity: .3; } 50% { opacity: .75; } }
        @keyframes nempo-tile-shine { 0%, 72% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(230%) skewX(-18deg); } }
        .nempo-service__ring {
          position: absolute; inset: -4px -4px -6px; border-radius: 21px; overflow: hidden; pointer-events: none;
          filter: drop-shadow(0 0 5px var(--ring-color)) saturate(1.2);
        }
        .nempo-service__ring::before {
          content: ""; position: absolute; left: 50%; top: 50%; width: 180%; height: 180%;
          background: conic-gradient(from 0deg, transparent 0deg 190deg, var(--ring-tail) 250deg, var(--ring-color) 320deg, #fff 352deg, transparent 360deg);
          animation: nempo-ring-spin 2.6s linear infinite; animation-delay: var(--ring-delay);
          transform: translate(-50%, -50%);
        }
        .nempo-service__glow {
          position: absolute; inset: -9px; border-radius: 26px; pointer-events: none;
          background: radial-gradient(circle, var(--ring-color) 0%, transparent 70%);
          filter: blur(8px); animation: nempo-ring-glow 3.2s ease-in-out infinite; animation-delay: var(--ring-delay);
        }
        .nempo-service__shine {
          position: absolute; inset: 0; width: 45%; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
          animation: nempo-tile-shine 4.8s ease-in-out infinite; animation-delay: var(--ring-delay);
        }
        .nempo-service:hover .nempo-service__ring::before { animation-duration: 1.4s; }
        /* maskot rusa bertanduk emas memeluk tepi ikon — sedikit bangkit saat disentuh */
        .rusa-mascot { transition: transform 200ms ease; transform-origin: 50% 60%; }
        .nempo-service:hover .rusa-mascot,
        .nempo-service:focus-visible .rusa-mascot { transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) {
          .nempo-service__tile { transition: none; }
          .nempo-service__ring::before, .nempo-service__glow, .nempo-service__shine { animation: none; }
          .nempo-service__shine { display: none; }
          .rusa-mascot { transition: none; }
        }
      `}</style>
      <div
        ref={serviceTrackRef}
        onScroll={(e) => { const el = e.currentTarget; setServicePage(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))); }}
        className="mx-auto flex w-full max-w-4xl snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {servicePages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="grid w-full shrink-0 snap-start grid-cols-4 content-start gap-x-2 gap-y-7 pb-2 pt-8 sm:gap-x-5 sm:gap-y-9">
        {pageItems.map((item, itemIndex) => {
          const index = pageIndex * 8 + itemIndex;
          const [firstWord, ...remainingWords] = item.label.split(" ");
          return (
            <Link
              key={item.id}
              href={item.href}
              data-testid={`category-${item.id}`}
              aria-label={item.label}
              className="nempo-service group flex min-w-0 flex-col items-center gap-2.5 rounded-2xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[5px] focus-visible:outline-[#243D70]"
            >
              <span
                className="relative inline-flex"
                style={{ "--ring-color": item.color, "--ring-tail": `color-mix(in srgb, ${item.color} 35%, transparent)`, "--ring-delay": `${-index * 0.4}s` } as React.CSSProperties}
              >
                <span aria-hidden="true" className="nempo-service__glow" />
                <span aria-hidden="true" className="nempo-service__ring" />
              <span
                className="nempo-service__tile relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] sm:h-[62px] sm:w-[62px]"
                style={{
                  background: `linear-gradient(148deg, color-mix(in srgb, ${item.color} 55%, white) 0%, ${item.color} 58%, color-mix(in srgb, ${item.color} 72%, black) 100%)`,
                  boxShadow: `0 4px 0 color-mix(in srgb, ${item.color} 82%, black), 0 8px 13px -9px ${item.color}88, inset 0 1px 0 rgba(255,255,255,.54)`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_27%_17%,rgba(255,255,255,.42),transparent_56%)]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[1px] rounded-[16px] border border-white/20"
                />
                <span aria-hidden="true" className="nempo-service__shine" />
                <HomeServiceIcon className="relative z-10 h-[46px] w-[46px] drop-shadow-[0_1px_0_rgba(255,255,255,.2)] sm:h-[49px] sm:w-[49px]" id={item.id} />
              </span>
              {/* maskot memeluk tepi atas kartu; ikon di dalamnya tidak diubah */}
              <DeerMascot
                pose={deerPose(index)}
                className="rusa-mascot pointer-events-none absolute inset-x-0 top-[-21px] z-20 mx-auto h-9 w-[52px] sm:top-[-23px] sm:h-[39px] sm:w-[57px]"
              />
              </span>
              <span className="w-full text-center text-[9px] font-bold leading-[1.15] tracking-[-.015em] text-[#383A4A] sm:text-[11px]">
                <span className="block sm:inline">{firstWord}</span>{" "}
                <span className="block sm:inline">{remainingWords.join(" ")}</span>
              </span>
            </Link>
          );
        })}
        </div>
        ))}
      </div>
      {servicePages.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {servicePages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Halaman layanan ${i + 1}`}
              onClick={() => serviceTrackRef.current?.scrollTo({ left: i * serviceTrackRef.current.clientWidth, behavior: "smooth" })}
              className={`h-1.5 rounded-full transition-all ${servicePage === i ? "w-5 bg-[#243D70]" : "w-1.5 bg-[#243D70]/25"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
