import { Trophy } from "lucide-react";
import { Link } from "@/lib/wouter";
import { cariLomba } from "@/data/lomba";
import { LOMBA_HOME_SLUG, lombaCtaBaris, lombaCtaSubjudul } from "@/lib/lomba-home-cta";

/**
 * Permanent "daftar lomba" card near the bottom of the home page — the slot the
 * old "pasang aplikasi" strip used to hold. Copy comes from the lomba data so
 * the card can never disagree with the registration page.
 */
export function LombaHomeCta({ className = "" }: { className?: string }) {
  const lomba = cariLomba(LOMBA_HOME_SLUG);
  if (!lomba) return null;

  return (
    <section aria-labelledby="lomba-home-cta-title" data-no-deer className={`lomba-home-cta ${className}`}>
      <div className="flex items-center gap-4">
        <span className="install-app-banner-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] shadow-sm">
          <Trophy className="h-8 w-8 install-app-banner-title" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="install-app-banner-muted text-[10px] font-bold uppercase tracking-[0.22em]">Lomba</p>
          <h2 id="lomba-home-cta-title" className="install-app-banner-title mt-0.5 text-lg font-black leading-tight">
            {lomba.judul}
          </h2>
          <p className="install-app-banner-muted mt-1 text-xs leading-snug">{lombaCtaSubjudul(lomba)}</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-1.5 text-[12px] font-semibold install-app-banner-muted">
        {lombaCtaBaris(lomba).map((baris) => (
          <li key={baris}>{baris}</li>
        ))}
      </ul>
      <Link
        href="/lomba"
        className="install-app-banner-cta mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black shadow-md transition-transform active:scale-[0.98]"
      >
        Daftar sekarang
      </Link>
    </section>
  );
}
