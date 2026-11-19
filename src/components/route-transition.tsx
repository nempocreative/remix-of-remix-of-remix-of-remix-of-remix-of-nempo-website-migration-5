import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { LogoLoader } from "@/components/logo-loader";
import { shouldShowTransition, TRANSITION_FADE_MS, TRANSITION_SHOW_MS } from "@/lib/route-transition";

/** Saat pindah menu, logo n dan tanduk menyala tampil sebentar lalu memudar. */
export function RouteTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prev = useRef(pathname);
  const [fase, setFase] = useState<"tutup" | "tampil" | "pudar">("tutup");

  useEffect(() => {
    const from = prev.current;
    prev.current = pathname;
    if (!shouldShowTransition(from, pathname)) return;
    setFase("tampil");
    const t1 = window.setTimeout(() => setFase("pudar"), TRANSITION_SHOW_MS);
    const t2 = window.setTimeout(() => setFase("tutup"), TRANSITION_SHOW_MS + TRANSITION_FADE_MS);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [pathname]);

  if (fase === "tutup") return null;
  return <LogoLoader pudar={fase === "pudar"} />;
}
