import { useEffect, useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";
import laguUrl from "@/assets/lomba/jaipong-keser-bojong.mp3";

/** Soundtrack halaman Lomba: mulai saat pengunjung pertama kali menyentuh halaman, bisa dijeda kapan saja. */
export function LombaSoundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [main, setMain] = useState(false);
  const dijedaRef = useRef(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.6;
    const mulai = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.(".lmb-musik")) return;
      if (!dijedaRef.current && a.paused) a.play().catch(() => {});
      lepas();
    };
    const lepas = () => {
      window.removeEventListener("pointerdown", mulai);
      window.removeEventListener("keydown", mulai);
    };
    window.addEventListener("pointerdown", mulai);
    window.addEventListener("keydown", mulai);
    return () => { lepas(); a.pause(); };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { dijedaRef.current = false; a.play().catch(() => {}); }
    else { dijedaRef.current = true; a.pause(); }
  };

  return (
    <>
      <audio ref={audioRef} src={laguUrl} loop preload="none" onPlay={() => setMain(true)} onPause={() => setMain(false)} />
      <button type="button" className={`lmb-musik${main ? " main" : ""}`} onClick={toggle} aria-label={main ? "Jeda musik" : "Putar musik"}>
        {main ? <Pause size={20} /> : <Music2 size={20} />}
      </button>
    </>
  );
}
