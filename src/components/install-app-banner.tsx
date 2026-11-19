import React, { useEffect, useState } from "react";
import { Trophy, X } from "lucide-react";
import { Link, useLocation } from "@/lib/wouter";
import { isBannerSnoozed } from "@/lib/install-app";

const LOMBA_BANNER_KEY = "nempo-lomba-banner-dismissed-at";

/** Bottom strip inviting visitors to register for the Pasanggiri Jaipong competition. Sits just above the bottom menu. */
export function InstallAppBanner() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissedAt: number | null = null;
    try {
      const raw = localStorage.getItem(LOMBA_BANNER_KEY);
      dismissedAt = raw ? Number(raw) : null;
    } catch { /* storage blocked: still show */ }
    if (isBannerSnoozed(dismissedAt, Date.now())) return;
    // Wait for the opening splash to finish before sliding in.
    const t = window.setTimeout(() => setVisible(true), 2800);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(LOMBA_BANNER_KEY, String(Date.now())); } catch { /* ignore */ }
  };

  if (!visible || location.startsWith("/lomba")) return null;

  return (
    <div
      role="region"
      aria-label="Daftar Lomba Pasanggiri Jaipong"
      className="install-app-banner mx-auto mb-2 flex max-w-md md:max-w-xl items-center gap-3 rounded-[20px] py-2 pl-2 pr-2.5 shadow-[0_10px_28px_rgba(21,48,74,0.16)] backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tutup"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full install-app-banner-muted transition-colors"
      >
        <X className="h-4 w-4" strokeWidth={2.25} />
      </button>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center install-app-banner-icon rounded-[12px] install-app-banner-title">
        <Trophy className="h-6 w-6" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate install-app-banner-title text-[13px] font-black">Pasanggiri Jaipong 2026</p>
        <p className="truncate install-app-banner-muted text-[11px] font-medium">30 Desember · kuota terbatas</p>
      </div>
      <Link
        href="/lomba"
        className="shrink-0 rounded-full install-app-banner-cta px-4 py-2 text-[12px] font-black shadow-sm transition-transform active:scale-95"
      >
        Daftar
      </Link>
    </div>
  );
}
