import { useEffect, useState } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

// Catch the browser's install offer as early as possible, before any component mounts.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

export const BANNER_DISMISS_KEY = "nempo-install-banner-dismissed-at";
/** Days the bottom install banner stays hidden after the visitor closes it. */
export const BANNER_SNOOZE_DAYS = 3;

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** True when the banner was closed less than BANNER_SNOOZE_DAYS ago. */
export function isBannerSnoozed(dismissedAt: number | null, now: number): boolean {
  if (!dismissedAt || !Number.isFinite(dismissedAt)) return false;
  return now - dismissedAt < BANNER_SNOOZE_DAYS * 24 * 60 * 60 * 1000;
}

export function useInstallApp() {
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setInstalled(isInstalled());
      setCanPrompt(deferredPrompt !== null);
    };
    sync();
    listeners.add(sync);
    setReady(true);
    return () => { listeners.delete(sync); };
  }, []);

  /** Opens the browser install offer, or the step-by-step guide when the browser has none. */
  const install = async (): Promise<boolean> => {
    if (deferredPrompt) {
      const prompt = deferredPrompt;
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        deferredPrompt = null;
        setInstalled(true);
        notify();
        return true;
      }
      return false;
    }
    setGuideOpen(true);
    return false;
  };

  return { ready, installed, canPrompt, install, guideOpen, setGuideOpen };
}
