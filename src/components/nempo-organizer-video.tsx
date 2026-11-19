import { useCallback, useEffect, useRef, useState } from "react";

/** Shown in place of a video that cannot open, so the frame never stays blank. */
export const NEMPO_VIDEO_FALLBACK_SERVICES = [
  "Wedding Organizer",
  "Event Organizer",
  "Undangan Digital",
  "Desain & Sosmed",
  "Website & Sistem",
  "Talent",
] as const;

/** A visible video that has not started after this long is treated as not opening. */
export const VIDEO_OPEN_TIMEOUT_MS = 12000;

interface NempoOrganizerVideoProps {
  src: string;
  poster: string;
  /** Spoken name of the video for screen readers. */
  label?: string;
  sectionLabel?: string;
  className?: string;
  active?: boolean;
  videoClassName?: string;
  controls?: boolean;
  soundOnInteraction?: boolean;
  /** Tells the page when the fallback panel is showing so it can hide its own caption. */
  onIssueChange?: (hasIssue: boolean) => void;
}

export function NempoOrganizerVideo({
  src,
  poster,
  label = "NEMPO Organizer — dari ide menjadi karya nyata",
  sectionLabel = "Video NEMPO Organizer",
  className = "home-section-organizer-video",
  active = true,
  videoClassName = "block aspect-video w-full bg-muted object-contain",
  controls = false,
  soundOnInteraction = true,
  onIssueChange,
}: NempoOrganizerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);
  const [autoplayAllowed, setAutoplayAllowed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const playAttempt = useRef(0);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [started, setStarted] = useState(false);

  // A video that never starts (very slow or unreachable file) gets the same
  // branded fallback as a load error instead of an empty frame.
  useEffect(() => {
    if (started || failed || blocked || !visible || !inView || !active || !autoplayAllowed) return;
    const timer = window.setTimeout(() => setFailed(true), VIDEO_OPEN_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [started, failed, blocked, visible, inView, active, autoplayAllowed]);

  // Report the fallback state so a page can hide its own caption while the
  // NEMPO services panel is on screen.
  const issueChangeRef = useRef(onIssueChange);
  useEffect(() => {
    issueChangeRef.current = onIssueChange;
  });
  useEffect(() => {
    issueChangeRef.current?.(failed || blocked);
  }, [failed, blocked]);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || !active || !inView || !visible || !autoplayAllowed) return;
    video.defaultPlaybackRate = 1;
    video.playbackRate = 1;
    video.muted = !soundEnabled;
    const attempt = ++playAttempt.current;
    video.play().catch(() => {
      if (attempt !== playAttempt.current) return;
      // A browser can still reject sound; retain silent autoplay in that case.
      video.muted = true;
      video.play().then(() => setBlocked(false)).catch(() => {
        if (attempt === playAttempt.current) setBlocked(true);
      });
    });
  }, [active, inView, visible, autoplayAllowed, soundEnabled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAutoplayAllowed(!reducedMotion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) {
        setVisible(true);
      } else {
        playAttempt.current += 1;
        video.pause();
      }
    }, { threshold: 0.35 });
    observer.observe(video);
    return () => { observer.disconnect(); playAttempt.current += 1; video.pause(); };
  }, []);

  // The file address is only attached once the section is on screen, so start
  // playback after that render — calling play() before the address exists does
  // nothing and the video would sit on its poster forever.
  useEffect(() => {
    if (!visible) return;
    const video = videoRef.current;
    if (!video) return;
    if (!active) {
      playAttempt.current += 1;
      video.pause();
      video.currentTime = 0;
      return;
    }
    if (!inView) { playAttempt.current += 1; video.pause(); return; }
    playVideo();
  }, [visible, active, inView, playVideo]);

  useEffect(() => {
    if (!soundOnInteraction) return;
    const enableSound = () => {
      setSoundEnabled(true);
      const video = videoRef.current;
      if (!video || !active || !inView || !autoplayAllowed) return;
      // Run within the gesture, not only the next render, to unlock mobile audio.
      video.muted = false;
      const attempt = ++playAttempt.current;
      video.play().catch(() => {
        if (attempt !== playAttempt.current) return;
        video.muted = true;
        video.play().catch(() => undefined);
      });
    };
    document.addEventListener("pointerdown", enableSound);
    document.addEventListener("touchend", enableSound);
    document.addEventListener("keydown", enableSound);
    return () => {
      document.removeEventListener("pointerdown", enableSound);
      document.removeEventListener("touchend", enableSound);
      document.removeEventListener("keydown", enableSound);
    };
  }, [soundOnInteraction, active, inView, autoplayAllowed]);

  return (
    <section className={`${className} relative`} aria-label={sectionLabel}>
      <video
        ref={videoRef}
        src={visible ? src : undefined}
        poster={poster}
        aria-label={label}
        className={videoClassName}
        muted={!soundEnabled}
        autoPlay={visible && active && inView && autoplayAllowed}
        playsInline
        controls={controls}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture={!controls}
        loop
        preload="none"
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (!video) return;
          video.defaultPlaybackRate = 1;
          video.playbackRate = 1;
        }}
        onCanPlay={playVideo}
        onPlaying={() => { setStarted(true); setBlocked(false); setFailed(false); }}
        onError={() => { if (visible) setFailed(true); }}
      />
      {failed ? (
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            setFailed(false);
            video.load();
            video.muted = true;
            video.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
          }}
          aria-label="Video belum bisa dibuka. Ketuk untuk mencoba lagi."
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden bg-primary px-4 py-3 text-center text-primary-foreground"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-80">NEMPO Organizer</span>
          <span className="text-base font-bold leading-tight sm:text-xl">Dari ide menjadi acara yang berkesan</span>
          <span className="flex max-w-md flex-wrap justify-center gap-1.5">
            {NEMPO_VIDEO_FALLBACK_SERVICES.map((service) => (
              <span key={service} className="rounded-full border border-primary-foreground/40 px-2 py-0.5 text-[0.65rem] font-medium sm:text-xs">
                {service}
              </span>
            ))}
          </span>
          <span className="text-[0.65rem] opacity-80 sm:text-xs">Ketuk untuk memutar video lagi</span>
        </button>
      ) : visible && !autoplayAllowed && !started ? (
        <button
          type="button"
          onClick={() => setAutoplayAllowed(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-foreground/40 px-4 text-center text-background"
        >
          <span className="text-sm font-semibold">Ketuk untuk memutar video</span>
          <span className="text-xs opacity-90">{label}</span>
        </button>
      ) : blocked ? (
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            video.muted = true;
            video.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
          }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-foreground/55 px-4 text-center text-background"
        >
          <span className="text-sm font-semibold">Ketuk untuk memutar video</span>
          <span className="text-xs opacity-90">{label}</span>
        </button>
      ) : null}
    </section>
  );
}