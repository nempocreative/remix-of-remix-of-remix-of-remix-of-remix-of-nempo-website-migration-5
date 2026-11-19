// Team card rows scroll by themselves (owner request), copied into the GGS app by patch-team.mjs.
// Pauses while a visitor touches or hovers a row, and never runs when the device asks for reduced motion.
import { useEffect, useRef } from "react";

export const TEAM_AUTOPLAY_MS = 3000;
export const TEAM_AUTOPLAY_PAUSE_MS = 6000;

/** The second identical set makes this reset visually indistinguishable from moving forward. */
export function loopTeamPosition(position: number, distance: number): number {
  if (distance <= 0) return 0;
  return ((position % distance) + distance) % distance;
}

export function focusedTeamIndex(position: number, step: number, width: number, count: number): number {
  if (step <= 0 || count <= 0) return 0;
  return Math.floor((position + width / 2) / step) % count;
}

type RowAutoplayOptions = {
  /** Cards in these rows carry data-team-copy on duplicates and data-team-index on every card. */
  rowSelector: string;
  /** When set, the card nearest the center gets this class; omit for plain continuous scrolling. */
  featuredClass?: string;
  /** Re-runs the effect when these change, for rows that mount after the first paint. */
  deps?: readonly unknown[];
};

/** Dispatch this event on a row to pause it, e.g. from a button that sits outside the row. */
export const ROW_AUTOPLAY_PAUSE_EVENT = "ggs-autoplay-pause";

/** Scrolls matching card rows forward forever; pauses on touch/hover/focus and under reduced motion. */
export function useRowAutoplay<T extends HTMLElement>({ rowSelector, featuredClass, deps }: RowAutoplayOptions) {
  const ref = useRef<T | null>(null);
  const depsKey = JSON.stringify(deps ?? []);
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof window === "undefined") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rows = Array.from(root.querySelectorAll<HTMLElement>(rowSelector));
    const pausedUntil = new Map<HTMLElement, number>();
    const held = new Set<HTMLElement>();
    let lastTime = 0;
    let frame = 0;
    const cleanups = rows.map((row) => {
      const pause = () => pausedUntil.set(row, Date.now() + TEAM_AUTOPLAY_PAUSE_MS);
      const hold = () => { held.add(row); pause(); };
      const release = () => { held.delete(row); pause(); };
      const events: [string, () => void][] = [["pointerdown", pause], ["touchstart", pause], ["wheel", pause], ["mouseenter", hold], ["mouseleave", release], ["focusin", hold], ["focusout", release], [ROW_AUTOPLAY_PAUSE_EVENT, pause]];
      events.forEach(([event, handler]) => row.addEventListener(event, handler, { passive: true }));
      return () => events.forEach(([event, handler]) => row.removeEventListener(event, handler));
    });
    const animate = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, 50) : 0;
      lastTime = time;
      for (const row of rows) {
        if (motion.matches || document.hidden || held.has(row) || (pausedUntil.get(row) ?? 0) > Date.now()) continue;
        const cards = Array.from(row.children).filter((node): node is HTMLElement => node instanceof HTMLElement);
        const originals = cards.filter((card) => !card.hasAttribute("data-team-copy"));
        const first = originals[0];
        if (!first) continue;
        const rect = row.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
        const step = first.offsetWidth + gap;
        const copy = cards.find((card) => card.hasAttribute("data-team-copy"));
        const distance = copy && copy.offsetWidth ? copy.offsetLeft - first.offsetLeft : 0;
        const scrolling = distance > 0 && row.scrollWidth > row.clientWidth;
        if (scrolling) row.scrollLeft = loopTeamPosition(row.scrollLeft + step * delta / TEAM_AUTOPLAY_MS, distance);
        if (featuredClass) {
          const active = scrolling
            ? focusedTeamIndex(row.scrollLeft, step, row.clientWidth, originals.length)
            : Math.floor(time / TEAM_AUTOPLAY_MS) % originals.length;
          let selected: HTMLElement | undefined;
          let nearest = Infinity;
          for (const card of cards) {
            if (Number(card.dataset.teamIndex) !== active || !card.offsetWidth) continue;
            const center = card.offsetLeft - first.offsetLeft - row.scrollLeft + card.offsetWidth / 2;
            const difference = Math.abs(center - row.clientWidth / 2);
            if (difference < nearest) { selected = card; nearest = difference; }
          }
          cards.forEach((card) => card.classList.toggle(featuredClass, card === selected));
        }
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => { window.cancelAnimationFrame(frame); cleanups.forEach((c) => c()); };
  }, [rowSelector, featuredClass, depsKey]);
  return ref;
}

export function useTeamAutoplay<T extends HTMLElement>() {
  return useRowAutoplay<T>({ rowSelector: ".ggs-crew-strip, .ggs-crew-grid", featuredClass: "ggs-team-featured" });
}
