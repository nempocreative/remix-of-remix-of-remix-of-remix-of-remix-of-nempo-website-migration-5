import welcomeVideoPosterUrl from "@/assets/videos/kala-muda-welcome-poster.webp";

/**
 * Beranda carousel slide that plays the Kala Muda welcome video.
 * The copy sits on top of the video like every other banner slide.
 */
export interface KalaMudaWelcomeSlide {
  kind: "welcome-video";
  title: string;
  description: string;
  label: string;
  cta: string;
  /** Where the call-to-action button goes. */
  href: string;
  instagramHandle: string;
  image: string;
  /** Left empty on purpose: tapping the video must not navigate away. */
  link: string;
}

export const KALA_MUDA_WELCOME_SLIDE: KalaMudaWelcomeSlide = {
  kind: "welcome-video",
  title: "Ayo gabung komunitas anak muda",
  description: "Kumpul, berkarya, dan tumbuh bareng Kala Muda — komunitas anak muda Garut.",
  label: "KOMUNITAS ANAK MUDA GARUT",
  cta: "Gabung sekarang",
  href: "/recruitment",
  instagramHandle: "kalamudacom",
  image: welcomeVideoPosterUrl,
  link: "",
};
