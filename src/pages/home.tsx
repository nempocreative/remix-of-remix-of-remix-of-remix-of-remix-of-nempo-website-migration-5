import React, { useEffect, useState, useRef } from "react";
import { SEO } from "@/components/seo";
import musicomedyPoster from "@/assets/musicomedy-night-poster.webp";
import { Layout } from "@/components/layout";
import { PlacePhoto } from "@/components/place-photo";
import { usePortfolioEvents } from "@/hooks/use-portfolio-events";
import { Search, MapPin, MapPinned, Route, TrainFront, ChevronRight, ArrowRight, Flame, ThumbsUp, Info, Map, CalendarDays, Users, Building2, Ticket, Award, Gift, TreePine, Heart, Mountain, Compass, Droplets, Wind, Eye, Thermometer, Newspaper, Clock, Radio, History, UtensilsCrossed, UserPlus, Star, Shield, Crown, Coffee, Music, Tv, Mic, BookOpen, Instagram, GraduationCap } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link, useLocation } from "@/lib/wouter";
import { CategoryGrid } from "@/components/icons3d";
import { DeerMascot } from "@/components/deer-mascot";
import { useCityFilter } from "@/contexts/city-filter-context";
import { HOME_SERVICE_BANNERS } from "@/data/home-service-banners";
import { MomenDigitalShowcase } from "@/components/momen-digital-showcase";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { NempoFactsSection } from "@/components/nempo-facts-section";
import { NempoHomeCtaBanner } from "@/components/nempo-home-cta-banner";
import { LombaHomeCta } from "@/components/lomba-home-cta";
import { NempoOrganizerVideo } from "@/components/nempo-organizer-video";
import comingSoonVideo from "@/assets/videos/pasar-seni-coming-soon.mp4";
import comingSoonPoster from "@/assets/videos/pasar-seni-coming-soon-poster.jpg";
import welcomeVideoUrl from "@/assets/videos/kala-muda-welcome-hd.mp4";
import { KALA_MUDA_WELCOME_SLIDE, type KalaMudaWelcomeSlide } from "@/data/kala-muda-welcome";
import { NempoPartnershipCarousel } from "@/components/nempo-partnership-carousel";
import { NempoCreatorTeamCard } from "@/components/nempo-creator-team-card";
import kalaMudaHeroImage from "@/assets/94d218d05080a6554bc7214283cb8a88_1789408730013.jpg";
import digitalGrowthBannerImage from "@/assets/nempo-team-banner.jpg";
import posterCarouselLomba from "@/assets/lomba/poster-carousel-lomba.webp";
import posterCarouselPasarSeni from "@/assets/lomba/poster-carousel-pasar-seni.webp";

type HeroBanner = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  btn_text: string;
  link: string;
  image: string;
  accent: string;
  sort_order: number;
  active: boolean;
  instagramHandle?: string;
};


function promoColors(type: string): { from: string; to: string; shadow: string } {
  const map: Record<string, { from: string; to: string; shadow: string }> = {
    new_user:     { from: "#0194f3", to: "#0172B1", shadow: "#003d8f" },
    point_reward: { from: "#D97706", to: "#B45309", shadow: "#78350f" },
  };
  return map[type] ?? { from: "#0194f3", to: "#0172B1", shadow: "#003d8f" };
}

const HOME_PROMO_CARDS = [
  {
    id: "promo-wedding-organizer",
    colorType: "new_user",
    badge: "PROMO WEDDING",
    kind: "bonus",
    amount: "BONUS",
    amountLabel: "WEDDING",
    title: "Wedding Organizer",
    description: "Bonus undangan digital + WCC (Wedding Content Creator).",
    ctaLabel: "Tanya Promo",
  },
  {
    id: "promo-first-service",
    colorType: "point_reward",
    badge: "PROMO NEMPO",
    kind: "discount",
    amount: "50",
    amountLabel: "DISKON",
    title: "Layanan Pertama",
    description: "Berlaku untuk semua layanan Nempo Organizer.",
    ctaLabel: "Tanya Promo",
  },
] as const;

type HeroCopy = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  place: string;
};

type DigitalServiceHero = {
  kind: "digital-service";
  title: string;
  description: string;
  label: string;
  link: string;
  image: string;
};

type KalaMudaHero = {
  kind: "kala-muda";
  title: string;
  description: string;
  label: string;
  link: string;
  image: string;
};

type WelcomeHero = KalaMudaWelcomeSlide;
type HeroSlide = HeroBanner | DigitalServiceHero | KalaMudaHero | WelcomeHero;

const kalaMudaSlide: KalaMudaHero = {
  kind: "kala-muda",
  title: "Temui ruangmu di Kala Muda",
  description: "Komunitas anak muda Garut untuk berkarya, berbagi cerita, dan tumbuh bersama.",
  label: "KOMUNITAS ANAK MUDA GARUT",
  link: "/komunitas",
  image: kalaMudaHeroImage,
};

const PASAR_SENI_HERO_SLIDE: HeroBanner = {
  id: 101,
  title: "Pasar Seni Garut",
  subtitle: "Coming Soon",
  description: "30 - 31 Desember 2026 · Garut, Jawa Barat",
  category: "Coming Soon",
  btn_text: "Lihat acaranya",
  link: "/pasar-seni-garut-2026",
  image: posterCarouselPasarSeni,
  accent: "#8C1D18",
  sort_order: 0,
  active: true,
};

const LOMBA_HERO_SLIDE: HeroBanner = {
  id: 100,
  title: "Pasanggiri Jaipong",
  subtitle: "Lomba",
  description: "30 Desember 2026 · TK sampai SMP–SMA · Kuota 25 tiap kategori",
  category: "Road to Pasar Seni 2027 · Pasar Seni Garut 2026",
  btn_text: "Daftar lomba",
  link: "/lomba",
  image: posterCarouselLomba,
  accent: "#B7791F",
  sort_order: 0,
  active: true,
};

type CafeBadge = { label: string; color: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> };

function detectCafeBadge(title: string): CafeBadge {
  const t = (title || "").toLowerCase();
  if (t.includes("nobar"))                                       return { label: "Nobar",      color: "#c2410c", Icon: Tv };
  if (t.includes("live") || t.includes("musik") || t.includes("acoustic")) return { label: "Live Music", color: "#7c3aed", Icon: Music };
  if (t.includes("workshop"))                                    return { label: "Workshop",   color: "#0172B1", Icon: BookOpen };
  if (t.includes("arisan"))                                      return { label: "Arisan",     color: "#b45309", Icon: Users };
  if (t.includes("talkshow") || t.includes("talk show"))         return { label: "Talkshow",   color: "#16a34a", Icon: Mic };
  if (t.includes("komunitas"))                                   return { label: "Komunitas",  color: "#0ea5e9", Icon: Users };
  return { label: "Event Cafe", color: "#92400e", Icon: Coffee };
}

function CafeEventCard({ ev }: { ev: Record<string, any> }) {
  const { label: badgeLabel, color: badgeColor, Icon: BadgeIcon } = detectCafeBadge(ev.title || ev.name || "");
  const dateStr = ev.date
    ? new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <Link
      href={`/event/${ev.slug || ev.id}`}
      className="shrink-0 snap-center block group"
      style={{ width: "min(58vw, 220px)", minWidth: 170 }}
    >
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{ aspectRatio: "9 / 16", boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
      >
        {/* Full-bleed photo */}
        {(ev.banner_image || ev.image)
          ? <img src={ev.banner_image || ev.image} alt={ev.title || ev.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #78350f 0%, #92400e 35%, #b45309 65%, #d97706 100%)" }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Coffee className="w-20 h-20 text-white" strokeWidth={1} />
              </div>
            </div>
          )
        }
        {/* Gradient overlay bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.05) 62%, rgba(0,0,0,0) 100%)" }} />

        {/* Badge pill — top left */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white leading-none"
          style={{ background: badgeColor, boxShadow: "0 2px 8px rgba(0,0,0,0.28)" }}
        >
          <BadgeIcon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
          {badgeLabel}
        </div>

        {/* Unggulan badge — top right */}
        {ev.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-amber-900 leading-none">
            <Star className="w-2.5 h-2.5 shrink-0 fill-amber-900" strokeWidth={0} />
            Unggulan
          </div>
        )}

        {/* Text block over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h3 className="font-extrabold text-white text-[16px] leading-snug line-clamp-2 mb-2">
            {ev.title || ev.name}
          </h3>
          <div className="flex items-center gap-1.5 min-w-0 mb-1">
            <MapPin className="h-3 w-3 shrink-0 text-white/75" strokeWidth={2} />
            <span className="text-[11px] text-white/85 font-medium truncate">{ev.location}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 mb-2">
            <CalendarDays className="h-3 w-3 shrink-0 text-white/75" strokeWidth={2} />
            <span className="text-[11px] text-white/85 font-medium truncate">{dateStr}</span>
          </div>
          <p className="font-black text-base leading-none" style={{ color: "#fbbf24" }}>
            {ev.price === 0 ? "Gratis" : `Rp ${Number(ev.price).toLocaleString("id")}`}
          </p>
        </div>
      </div>
    </Link>
  );
}

const INFO_BANNERS = [
  {
    id: "layanan",
    image: digitalGrowthBannerImage,
    alt: "Tim kreatif NEMPO berdiskusi konsep wedding, event, dan konten",
    title: "Tumbuh bersama NEMPO Organizer.",
    description: "Acara, wedding, sosmed, desain, sampai talent — semua ada di satu tim.",
    cta: "Lihat layanan & harga",
  },

] as const;

function InfoPhotoBanner({ banner }: { banner: (typeof INFO_BANNERS)[number] }) {
  return (
    <>
      <img
        src={banner.image}
        alt={banner.alt}
        className="absolute inset-0 h-full w-full object-cover object-[center_47%] transition-transform duration-700 group-hover:scale-[1.025]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061b2c]/90 via-[#061b2c]/55 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex max-w-[84%] items-center px-4 py-3 md:max-w-[78%] md:px-5">
        <div>
          <h2 className="max-w-[340px] text-[15px] font-black leading-[1.08] text-white md:text-[18px]">
            {banner.title}
          </h2>
          <p className="mt-1.5 max-w-[330px] text-[10px] font-medium leading-relaxed text-white/75 md:mt-2 md:text-[11px]">
            {banner.description}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-white md:mt-3 md:text-[11px]">
            {banner.cta}
            <ArrowRight className="h-3 w-3" strokeWidth={2.7} />
          </span>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const isAppFrame = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("app") === "1";
  const { matchesCity } = useCityFilter();
  const [activeHero, setActiveHero] = useState(0);
  const [welcomeVideoIssue, setWelcomeVideoIssue] = useState(false);
  const [activeEvent, setActiveEvent] = useState(0);
  const [activeDiskon, setActiveDiskon] = useState(0);
  const diskonTouchX = useRef(0);
  const [infoBannerIdx, setInfoBannerIdx] = useState(0);
  const infoBannerTouchX = useRef(0);
  const bpTrackRef = useRef<HTMLDivElement>(null);
  const bpDrag = useRef({ x: 0, offset: 0, dragging: false });
  const [showCafeModal, setShowCafeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [factIdx, setFactIdx] = useState(0);
  const [heroHeight, setHeroHeight] = useState(280);
  const [heroCardWidth, setHeroCardWidth] = useState("56%");
  const [isMobile, setIsMobile] = useState(false);
  const [partnersDb, setPartnersDb] = useState<{ id: number; name: string; color: string }[]>([]);
  const heroSlides: HeroSlide[] = [
    KALA_MUDA_WELCOME_SLIDE,
    PASAR_SENI_HERO_SLIDE,
    LOMBA_HERO_SLIDE,
    ...HOME_SERVICE_BANNERS,
  ];
  const total = heroSlides.length;
  const [autoAdvanceKey, setAutoAdvanceKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ApiItem = Record<string, any>;
  const [eventItems, setEventItems] = useState<ApiItem[] | null>(null);


  useEffect(() => {
    const timer = window.setInterval(() => {
      setInfoBannerIdx((current) => (current + 1) % INFO_BANNERS.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  // Brand-partner marquee: auto-scrolls, and can be dragged/swiped on touch.
  useEffect(() => {
    const track = bpTrackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (!bpDrag.current.dragging && !reduceMotion) bpDrag.current.offset += dt * 0.045;
        bpDrag.current.offset = ((bpDrag.current.offset % half) + half) % half;
        track.style.transform = `translateX(${-bpDrag.current.offset}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [partnersDb]);

  useEffect(() => {
    const load = (path: string, setter: (d: ApiItem[]) => void) =>
      fetch(`/api${path}`)
        .then(r => r.ok ? r.json() : [])
        .then((data: ApiItem[]) => setter(Array.isArray(data) ? data : []))
        .catch(() => setter([]));

    const fetchAll = () => {
      load("/events", setEventItems);

      fetch("/api/partners")
        .then(r => r.ok ? r.json() : [])
        .then(data => { if (Array.isArray(data) && data.length > 0) setPartnersDb(data); })
        .catch(() => {});
    };

    fetchAll();
    const interval = setInterval(fetchAll, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Responsive hero sizing: 16:9 on mobile, fixed on desktop
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        const cardWidth = isAppFrame ? 0.88 : 0.93;
        const h = Math.round(window.innerWidth * cardWidth * (9 / 16));
        setHeroHeight(h);
        setHeroCardWidth(isAppFrame ? "88%" : "93%");
      } else {
        setHeroHeight(280);
        setHeroCardWidth("56%");
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isAppFrame]);

  // Typewriter effect for search placeholder
  useEffect(() => {
    const phrases = [
      "Event organizer untuk acaramu...",
      "Wedding organizer hari istimewamu...",
      "Konten kreatif untuk brand...",
      "Kelola media sosial bisnismu...",
      "Undangan digital yang personal...",
      "Website profesional untuk bisnis...",
      "Talenta lokal siap berkolaborasi...",
      "Sistem digital untuk operasional...",
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx === current.length) {
          deleting = true;
          timeout = setTimeout(tick, 1400);
          return;
        }
        timeout = setTimeout(tick, 50);
      } else {
        charIdx--;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 28);
      }
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, []);

  // Reset ke slide 0 saat banner utama selesai dimuat
  useEffect(() => {
    if (total > 0) setActiveHero(0);
  }, [total]);

  // Auto-advance hero — reset timer when user manually swipes (autoAdvanceKey)
  useEffect(() => {
    if (total === 0) return;
    const interval = setInterval(() => {
      setActiveHero((prev) => {
        const next = (prev + 1) % total;
        return Number.isNaN(next) ? 0 : next;
      });
    }, activeHero === 0 ? 10000 : 5000);
    return () => clearInterval(interval);
  }, [total, autoAdvanceKey, activeHero]);

  // Touch swipe handlers for hero banner
  const handleHeroTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };
  const handleHeroTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleHeroTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveHero((prev) => (prev + 1) % total);
      } else {
        setActiveHero((prev) => (prev - 1 + total) % total);
      }
      setAutoAdvanceKey(k => k + 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-advance fact cards slider
  useEffect(() => {
    const t = setInterval(() => setFactIdx(i => (i + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  // Filter event yang belum selesai (today atau upcoming)
  const activeEventItems = (eventItems ?? []).filter(ev => {
    const t   = new Date().toISOString().slice(0, 10);
    const end = ev.date_end && ev.date_end > ev.date ? ev.date_end : ev.date;
    return end >= t && matchesCity(ev.location, "Garut");
  });

  // Event yang sudah berlalu otomatis pindah ke card Riwayat
  const spotlight = (eventItems ?? []).find(ev => ev.slug === "musicomedy-night")
    ?? { slug: "musicomedy-night", date: "2026-11-04", date_end: undefined as string | undefined, dateEnd: undefined as string | undefined };
  const today = new Date().toISOString().slice(0, 10);
  const spotlightDateEndRaw: string | undefined = spotlight.date_end ?? spotlight.dateEnd;
  const spotlightEndDate = spotlightDateEndRaw && spotlightDateEndRaw > spotlight.date ? spotlightDateEndRaw : spotlight.date;
  const eventFinished = spotlightEndDate < today;

  // Auto-advance event fan carousel
  useEffect(() => {
    const len = activeEventItems.length || 1;
    const interval = setInterval(() => {
      setActiveEvent((prev) => (prev + 1) % len);
    }, 3000);
    return () => clearInterval(interval);
  }, [eventItems?.length]);

  const prevIndex = (activeHero - 1 + total) % total;
  const nextIndex = (activeHero + 1) % total;

  const getSlideStyle = (i: number): React.CSSProperties => {
    if (i === activeHero) {
      return {
        transform: "translateX(0%) scale(1)",
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 20,
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }
    if (i === prevIndex) {
      return {
        transform: "translateX(-76%) scale(0.82)",
        opacity: 0.55,
        filter: "blur(2px)",
        zIndex: 10,
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }
    if (i === nextIndex) {
      return {
        transform: "translateX(76%) scale(0.82)",
        opacity: 0.55,
        filter: "blur(2px)",
        zIndex: 10,
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }
    return {
      transform: "translateX(0%) scale(0.7)",
      opacity: 0,
      zIndex: 0,
      transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  // Acara diatur admin di /cms/acara; beranda pakai poster versi kecil.
  const { items: portfolioEvents } = usePortfolioEvents();
  const eventPortfolioItems = portfolioEvents.map((event) => ({
    id: event.id,
    name: event.name,
    image: event.thumb,
    location: event.location,
    date: event.date,
    badge: event.badge,
  }));
  const [eventRowEl, eventRowRef] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = eventRowEl;
    if (!el) return;
    let raf = 0;
    let pausedUntil = 0;
    let pos = el.scrollLeft;
    const pause = () => { pausedUntil = Date.now() + 2500; };
    const tick = () => {
      if (Date.now() > pausedUntil) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          pos = Math.abs(el.scrollLeft - pos) > 2 ? el.scrollLeft : pos;
          pos += 0.5;
          if (pos >= max) pos = 0;
          el.scrollLeft = pos;
        }
      } else {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("pointerdown", pause);
    el.addEventListener("wheel", pause, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
    };
  }, [eventRowEl]);
  // Auto-scroll cafe carousel — CSS animation (iOS Safari compatible)
  // requestAnimationFrame + scrollLeft is ignored on iOS when WebkitOverflowScrolling:touch is set;
  // CSS translateX animation works reliably on all platforms including iOS Safari.

  const modalCafeEvents = activeEventItems;
  const modalHasCafe = modalCafeEvents.length > 0;

  return (
    <>
    <Layout>
      <SEO
          title="Event, Wedding & Jasa Kreatif Garut"
          description="NEMPO Organizer Garut — event organizer, wedding organizer, sosmed management, undangan digital, web development, dan design creative untuk acara dan bisnismu."
          keywords="event organizer garut, wedding organizer garut, sosmed management, undangan digital, web development, design creative"
        path="/"
      />
      {/* ══ HERO — 3-Card Coverflow ══════════════════════════════════════════ */}
      <section className="w-full bg-white overflow-hidden pt-4 pb-3 md:pt-6 md:pb-4 mt-2 md:mt-0" style={{ contain: "layout paint", isolation: "isolate" }}>
        {/* Coverflow track — overflow:hidden + translate3d forces iOS to clip transforms */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{ maxWidth: 1100, height: heroHeight, transform: "translateZ(0)" }}
          onTouchStart={handleHeroTouchStart}
          onTouchMove={handleHeroTouchMove}
          onTouchEnd={handleHeroTouchEnd}
        >

          {heroSlides.map((slide, i) => {
            const isActive = i === activeHero;
            const isPrev  = i === prevIndex;
            const isNext  = i === nextIndex;
            const isDigitalService = "kind" in slide && slide.kind === "digital-service";
            const isKalaMuda = "kind" in slide && slide.kind === "kala-muda";
            const isWelcomeVideo = "kind" in slide && slide.kind === "welcome-video";
            const instagramHandle = "instagramHandle" in slide && slide.instagramHandle
              ? slide.instagramHandle
              : "nempo.id";
            const copy: { eyebrow: string; title: string; description: string; cta: string; place: string; href: string } = isWelcomeVideo
              ? {
                  eyebrow: "Kala Muda",
                  title: slide.title,
                  description: slide.description,
                  cta: slide.cta,
                  place: slide.label,
                  href: slide.href,
                }
              : isKalaMuda
              ? {
                  eyebrow: "Kala Muda",
                  title: "Temui Kala Muda",
                  description: slide.description,
                  cta: "Kenali Kala Muda",
                  place: slide.label,
                  href: slide.link,
                }
              : isDigitalService
              ? {
                  eyebrow: "Digi Nempo",
                  title: slide.title,
                  description: slide.description,
                  cta: "Jelajahi Digi Nempo",
                  place: slide.label,
                  href: slide.link,
                }
              : {
                  eyebrow: "Cerita pilihan Nempo",
                  title: (slide as HeroBanner).title || "Layanan Nempo Organizer",
                  description: (slide as HeroBanner).description || "",
                  cta: (slide as HeroBanner).btn_text || "Lihat selengkapnya",
                  place: (slide as HeroBanner).category || (slide as HeroBanner).subtitle || "Layanan Nempo Organizer",
                  href: (slide as HeroBanner).link,
                };
            const smoothTransition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease, filter 0.55s ease, box-shadow 0.55s ease";

            const cardStyle: React.CSSProperties = isActive ? {
              transform: "translateX(-50%) scale(1)",
              opacity: 1,
              zIndex: 20,
              filter: "blur(0px) brightness(1)",
              boxShadow: "none",
              transition: smoothTransition,
              willChange: "transform",
             } : isPrev ? {
               transform: isMobile ? "translateX(-50%) translateX(-120%) scale(0.84)" : "translateX(-50%) translateX(-46%) scale(0.84)",
              opacity: isMobile ? 0 : 0.65,
               zIndex: 10,
              filter: "blur(1.5px) brightness(0.65)",
               boxShadow: "none",
               transition: smoothTransition,
               willChange: "transform",
               pointerEvents: isMobile ? "none" : "auto",
             } : isNext ? {
               transform: isMobile ? "translateX(-50%) translateX(120%) scale(0.84)" : "translateX(-50%) translateX(46%) scale(0.84)",
              opacity: isMobile ? 0 : 0.65,
               zIndex: 10,
              filter: "blur(1.5px) brightness(0.65)",
               boxShadow: "none",
               transition: smoothTransition,
               willChange: "transform",
               pointerEvents: isMobile ? "none" : "auto",
             } : {
               transform: "translateX(-50%) scale(0.72)",
               opacity: 0,
               zIndex: 0,
               boxShadow: "none",
               transition: smoothTransition,
            };

            return (
              <div
                key={i}
                onClick={() => {
                  if (isPrev) { setActiveHero(prevIndex); return; }
                  if (isNext) { setActiveHero(nextIndex); return; }
                  if (isActive && slide.link) navigate(slide.link);
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: heroCardWidth,
                  height: "100%",
                  borderRadius: 24,
                  overflow: "hidden",
                  cursor: "pointer",
                  ...cardStyle,
                }}
              >
                {isWelcomeVideo ? (
                  <>
                    <NempoOrganizerVideo
                      src={welcomeVideoUrl}
                      poster={KALA_MUDA_WELCOME_SLIDE.image}
                      label="Video selamat datang Kala Muda Community"
                      sectionLabel="Video sambutan dalam carousel Beranda"
                      className="h-full w-full"
                      videoClassName="block h-full w-full bg-muted object-cover"
                      active={isActive}
                      controls={false}
                      soundOnInteraction={false}
                      onIssueChange={setWelcomeVideoIssue}
                    />
                    {!welcomeVideoIssue && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: isActive
                            ? "linear-gradient(90deg, rgba(4,30,67,.9) 0%, rgba(5,59,120,.6) 38%, rgba(5,59,120,.1) 78%, transparent 100%), linear-gradient(0deg, rgba(4,30,67,.5) 0%, transparent 45%)"
                            : "linear-gradient(90deg, rgba(4,30,67,.25), transparent 65%)",
                        }}
                      />
                    )}
                  </>
                ) : isKalaMuda ? (
                  <div
                    className="absolute inset-0 overflow-hidden"
                  >
                    <img
                      src={kalaMudaSlide.image}
                      alt="Anak muda sedang berkolaborasi"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, rgba(4,30,67,.9) 0%, rgba(5,59,120,.68) 42%, rgba(5,59,120,.2) 100%), linear-gradient(0deg, rgba(4,30,67,.42), transparent 55%)",
                      }}
                    />
                    <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/15" />
                    <div className="absolute -right-2 top-4 h-28 w-28 rounded-full border border-white/15" />
                    <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-7 right-8 flex items-end gap-1.5 opacity-80">
                      <span className="h-16 w-2 rounded-full bg-white/35" />
                      <span className="h-24 w-2 rounded-full bg-white/55" />
                      <span className="h-11 w-2 rounded-full bg-[#9ddcff]" />
                      <span className="h-20 w-2 rounded-full bg-white/30" />
                      <span className="h-14 w-2 rounded-full bg-white/45" />
                    </div>
                    <div className="absolute bottom-7 right-20 text-right text-white/90">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em]">Kala</p>
                      <p className="text-4xl font-black leading-[0.8] tracking-[-0.08em]">Muda</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={"image" in slide ? slide.image : ""}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, rgba(7,18,35,.88) 0%, rgba(7,18,35,.56) 36%, rgba(7,18,35,.08) 78%, rgba(7,18,35,.02) 100%), linear-gradient(0deg, rgba(7,18,35,.44) 0%, transparent 42%)"
                          : "linear-gradient(90deg, rgba(7,18,35,.15), transparent 65%)",
                      }}
                    />
                  </>
                )}
                {(!isWelcomeVideo || !welcomeVideoIssue) && <div
                  className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between p-4 md:p-7"
                  style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.45s ease" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={`https://instagram.com/${instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold text-white/80 transition-colors hover:text-white"
                      aria-label={`Instagram @${instagramHandle}`}
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      @{instagramHandle}
                    </a>
                  </div>
                  <div className="max-w-[480px]">
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-white/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ffc300]" aria-hidden="true" />
                      {copy.place}
                    </p>
                    <h2 className="max-w-[440px] text-balance text-[20px] min-[400px]:text-[22px] md:text-[26px] lg:text-[36px] font-black leading-[1.06] tracking-[-0.045em] text-white">
                      {copy.title}
                    </h2>
                    <p className="mt-2 max-w-[390px] text-[11px] md:text-[13px] leading-relaxed text-white/80">
                      {copy.description}
                    </p>
                    <Link
                      href={copy.href}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-3 inline-flex self-start shrink-0 whitespace-nowrap items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[10px] md:text-[11px] font-extrabold text-slate-900 shadow-xl shadow-black/15"
                    >
                      {copy.cta}
                      <ArrowRight className="h-3.5 w-3.5 text-[#0194f3]" />
                    </Link>
                  </div>
                </div>}
              </div>
            );
          })}

          {/* Prev / Next arrows */}
          {heroSlides.length > 1 && <>
          <button
            onClick={() => setActiveHero(prevIndex)}
            className="hidden md:flex absolute z-30 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white items-center justify-center transition-all text-xl font-bold shadow-lg"
            style={{ left: "calc(22% - 20px)", top: "50%", transform: "translateY(-50%)" }}
          >‹</button>
          <button
            onClick={() => setActiveHero(nextIndex)}
            className="hidden md:flex absolute z-30 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white items-center justify-center transition-all text-xl font-bold shadow-lg"
            style={{ right: "calc(22% - 20px)", top: "50%", transform: "translateY(-50%)" }}
          >›</button>
          </>}

        </div>

        {/* Dots — outside overflow:hidden so they're never clipped */}
        {heroSlides.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3 mb-1">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveHero(i)}
                style={{
                  height: 5,
                  width: i === activeHero ? 22 : 5,
                  background: i === activeHero ? "#0194f3" : "#cbd5e1",
                  borderRadius: 9999,
                  transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease",
                }}
              />
            ))}
          </div>
        )}
        <div className="h-2" />
      </section>

      {/* Search bar — straddling hero bottom & content top */}
      <div className="relative z-20 px-4 md:px-8 mt-3 overflow-visible">
        <div className="max-w-3xl mx-auto overflow-visible home-search-anchor">

          {/* ── Search box with bird inside ── */}
          <style>{`
            @keyframes birdBob { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
            @keyframes searchPop { from{transform:scale(0.95) translateY(8px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
          `}</style>
          <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center pr-1.5 overflow-visible"
            style={{ animation:"searchPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" }}
          >
            {/* Bird — smaller on mobile, normal on md+ */}
            <div style={{ animation:"birdBob 2.4s ease-in-out infinite", flexShrink:0, marginLeft:2, marginTop:4 }}>
              <DotLottieReact
                src={`${import.meta.env.BASE_URL}animations/bird.json`}
                loop
                autoplay
                className="w-10 h-10 md:w-14 md:h-14"
              />
            </div>

            {/* Divider */}
            <div className="w-px self-stretch my-2 mx-1.5 shrink-0" style={{ background:"#E5E7EB" }} />

            {/* Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder={typedPlaceholder || "Cari layanan yang kamu butuhkan..."}
              className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
            />

            {/* Button: icon-only on mobile, text on md+ */}
            <button
              onClick={() => {
                if (searchQuery.trim()) navigate(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
              }}
              className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
              style={{ background:"#22c55e", color:"#fff", boxShadow:"0 4px 12px rgba(34,197,94,0.35)", padding:"10px 12px" }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-sm font-bold">Cari</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════════════ */}
      <style>{`
        .home-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .home-section-categories { order: 10; }
        .home-section-tagline { order: 15; }
        .home-section-organizer-video { order: 14; }
        .home-section-recommendations { order: 30; }
        .home-section-itineraries { order: 40; }
        .home-section-creator-team { order: 18; }
        .home-section-promo { order: 51; }
        .home-section-cafe { order: 52; }
        .home-section-events { order: 50; }
        .home-section-momen-digital { order: 45; }
        .home-section-service-promos { order: 20; }
        .home-section-facts { order: 11; }
        .home-section-upcoming { order: 12; }
        .home-section-partnership { order: 90; }
        .home-section-organizer { order: 110; }
        .home-section-partners { order: 120; }
        .home-section-lomba { order: 130; }
      `}</style>
      <div className="home-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 md:pb-10 overflow-x-hidden">

        {/* ── Categories ── */}
        <section className="home-section-categories">
          <CategoryGrid />
        </section>

        {/* ── Nempo introduction and service CTA ── */}
        <NempoOrganizerVideo
          src={comingSoonVideo}
          poster={comingSoonPoster}
          label="Video coming soon Pasar Seni Garut 2026 dan Pasanggiri Jaipong se-Jawa Barat"
          sectionLabel="Video coming soon Pasar Seni Garut"
          className="home-section-organizer-video overflow-hidden rounded-[2rem] border border-border bg-background shadow-xl"
        />
        <div className="home-section-tagline mt-4">
          <NempoHomeCtaBanner />
        </div>

        {/* ── Tahukah Anda ── */}
        <NempoFactsSection factIdx={factIdx} onFactChange={setFactIdx} />

        {/* ── Event Mendatang spotlight ── */}
        <section className="home-section-upcoming relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
              <CalendarDays className="w-5 h-5" strokeWidth={1.75} />
              <DeerMascot pose="intip" className="pointer-events-none absolute left-1/2 top-[-13px] z-20 h-[22px] w-8 -translate-x-1/2" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-foreground font-black text-base leading-tight">{eventFinished ? "Segera Hadir" : "Event Mendatang"}</h2>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.08em] mt-0.5 truncate sm:whitespace-normal">{eventFinished ? "Acara berikutnya dari NEMPO, nantikan ya!" : "Catat tanggalnya, ayo datang bareng!"}</p>
            </div>
          </div>
          {!eventFinished && (
          <Link
            href="/event/musicomedy-night"
            className="group block w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
          >
            <div className="flex sm:h-[360px]">
              <div className="relative aspect-[3/4] w-[42%] max-w-[180px] shrink-0 self-start overflow-hidden sm:h-full sm:w-auto sm:max-w-none sm:self-auto sm:aspect-auto">
                <img
                  src={musicomedyPoster}
                  srcSet="/images/events/musicomedy-night-poster-540.webp 540w, /images/events/musicomedy-night-poster-810.webp 810w, /images/events/musicomedy-night-poster-1080.webp 1080w"
                  sizes="(min-width: 640px) 270px, 420px"
                  alt="Poster MusiComedy Night"
                  width={1440}
                  height={1920}
                  className="relative h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-3 sm:gap-3 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <p className="w-full text-[10px] font-bold uppercase tracking-wider text-primary sm:w-auto sm:text-xs"><span className="sm:hidden">Rabu, 4 Nov 2026</span><span className="hidden sm:inline">Rabu, 4 November 2026</span></p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary sm:px-2.5 sm:text-[11px]">Gratis</span>
                  {eventFinished && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground sm:px-2.5 sm:text-[11px]">
                      <History className="h-3 w-3" strokeWidth={2} /> Selesai
                    </span>
                  )}
                </div>
                <h3 className="text-[17px] font-black leading-tight text-foreground sm:text-3xl lg:text-4xl">MusiComedy Night</h3>
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 py-0.5 pl-1 pr-2.5 sm:gap-2 sm:py-1 sm:pl-1.5 sm:pr-3.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:h-6 sm:w-6">
                    <Mic className="h-3 w-3" strokeWidth={2} />
                  </span>
                  <p className="text-[11px] font-bold leading-tight text-foreground sm:text-[13px]">
                    <span className="hidden sm:inline">bersama </span><span className="font-black">Saduli Ragap</span>
                  </p>
                </div>

                <p className="hidden max-w-lg text-sm leading-relaxed text-muted-foreground sm:block lg:text-base">
                  Malam musik dan komedi bareng NEMPO.ID × Kala Muda di Good Story Cafe.
                </p>
                <span className="mt-1 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-[12px] font-bold text-primary-foreground sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm">
                  <span className="sm:hidden">Lihat detail</span><span className="hidden sm:inline">Lihat detail event</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
              <aside className="hidden w-[290px] shrink-0 flex-col justify-center gap-5 border-l border-border bg-muted/30 p-8 lg:flex">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Tanggal</p>
                    <p className="text-sm font-bold leading-snug text-foreground">Rabu, 4 November 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Lokasi</p>
                    <p className="text-sm font-bold leading-snug text-foreground">Good Story Cafe, Jl. Sudirman Copong No. 11, Garut</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mic className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Bintang Tamu</p>
                    <p className="text-sm font-bold leading-snug text-foreground">bersama Saduli Ragap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">

                  <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Harga</p>
                    <p className="text-sm font-bold leading-snug text-foreground">Gratis, langsung datang aja</p>
                  </div>
                </div>
              </aside>
            </div>
          </Link>
          )}

          {/* ── Coming Soon: Pasar Seni Garut 2026 ── */}
          <Link
            href="/pasar-seni-garut-2026"
            className={`${eventFinished ? "" : "mt-3 "}flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-dashed border-primary/40 bg-card p-3 shadow-sm sm:gap-4 sm:p-4`}
          >
            <img
              src="/media/pasar-seni-garut/cover-hero.webp"
              alt="Contoh suasana Pasar Seni Garut 2026"
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
            />
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                <Clock className="h-3 w-3" strokeWidth={2} /> Coming Soon
              </span>
              <h3 className="mt-1 truncate text-[15px] font-black leading-tight text-foreground sm:text-xl">
                Pasar Seni Garut 2026
              </h3>
              <p className="truncate text-[11px] font-semibold text-muted-foreground sm:text-[13px]">
                30 &amp; 31 Desember 2026 · Garut, Jawa Barat
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
          </Link>

        </section>



        <section className="home-section-service-promos mt-2 sm:mt-0">
          <NempoPartnershipCarousel />
        </section>

        {/* ── Kuliner Populer ── */}
        {eventPortfolioItems.length > 0 && (
          <div className="home-section-cafe">
          <style>{`
            @keyframes cafe-badge-pulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(251,146,60,0.55); }
              50% { box-shadow: 0 0 0 6px rgba(251,146,60,0); }
            }
            @keyframes cafe-shine {
              0% { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
            @keyframes cafe-icon-spin {
              0% { transform: rotate(-10deg) scale(1); }
              50% { transform: rotate(10deg) scale(1.15); }
              100% { transform: rotate(-10deg) scale(1); }
            }
            @keyframes cafe-dot-blink {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.7); }
            }
            .cafe-title-shine {
              background: linear-gradient(105deg, #92400e 0%, #d97706 30%, #f97316 50%, #fbbf24 65%, #d97706 80%, #92400e 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: cafe-shine 3s linear infinite;
            }
          `}</style>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)", animation: "cafe-badge-pulse 2s ease-in-out infinite" }}>
                  <Coffee className="h-4 w-4 text-white" strokeWidth={2}
                    style={{ animation: "cafe-icon-spin 3s ease-in-out infinite" }} />
                  <DeerMascot pose="lambaian" className="pointer-events-none absolute left-1/2 top-[-12px] z-20 h-[20px] w-[30px] -translate-x-1/2" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"
                  style={{ animation: "cafe-dot-blink 1.5s ease-in-out infinite" }} />
              </div>
              <div>
                <h2 className="cafe-title-shine font-black text-base leading-none">Event Kami</h2>
                 <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mt-0.5">
                   Portofolio
                 </p>
              </div>
            </div>
            <Link href="/event" className="flex items-center gap-0.5 text-[#f97316] text-xs font-bold hover:underline">
              Semua <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
           <section ref={eventRowRef} className="touch-card-row relative -mx-4 overflow-x-auto scrollbar-hide px-4 md:mx-0 md:px-0">
            <div
               className="flex items-end gap-3"
              style={{
                width: "max-content",
                 paddingLeft: 2,
                 paddingTop: 16,
                 paddingBottom: 56,
              }}
            >
              {eventPortfolioItems.map((event, idx) => (
                <Link key={event.id} href="/event"
                   className="cafe-card-snap shrink-0 rounded-3xl overflow-hidden relative active:scale-95 transition-transform"
                   style={(() => {
                     const progress = eventPortfolioItems.length > 1
                       ? idx / (eventPortfolioItems.length - 1)
                       : 0.5;
                     const arcOffset = Math.round(34 - Math.sin(Math.PI * progress) * 34);
                     const arcRotation = (0.5 - progress) * 2.2;
                     const seed = idx * 17;
                     const direction = seed % 2 === 0 ? 1 : -1;
                     const zigzagY = 5 + (seed % 8);
                     const zigzagX = direction * (2 + (seed % 5));
                     const zigzagRotation = direction * (0.7 + (seed % 5) * 0.22);
                     const zigzagDuration = 3.2 + (seed % 5) * 0.42;
                     return {
                       width: "clamp(148px, 42vw, 184px)",
                       aspectRatio: "4 / 5",
                       boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                       willChange: "transform",
                       animation: `cafe-zigzag ${zigzagDuration}s ease-in-out infinite`,
                       animationDelay: `${-(seed % 11) * 0.24}s`,
                       "--cafe-arc-y": `${arcOffset}px`,
                       "--cafe-arc-r": `${arcRotation}deg`,
                       "--cafe-zigzag-y": `${zigzagY}px`,
                       "--cafe-zigzag-x": `${zigzagX}px`,
                       "--cafe-zigzag-x-negative": `${-zigzagX}px`,
                       "--cafe-zigzag-r": `${zigzagRotation}deg`,
                       "--cafe-zigzag-r-negative": `${-zigzagRotation}deg`,
                     } as React.CSSProperties;
                   })()}>
                  <PlacePhoto
                    kind="cafe"
                    src={event.image}
                    alt={event.name}
                    className="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                   <span
                     className="absolute top-2 left-0 z-10 flex items-center gap-1 text-[10px] font-bold text-white"
                     style={{
                       borderRadius: "0 6px 6px 0",
                       padding: "4px 10px",
                       boxShadow: "1px 2px 6px rgba(0,0,0,0.25)",
                       background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                     }}
                   >
                     {event.badge}
                   </span>
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                    <h3 className="font-bold text-white text-[11px] line-clamp-3 leading-tight">{event.name}</h3>
                    <div className="flex items-center gap-0.5 text-white/70 text-[9px] mt-1">
                      <MapPin className="h-2 w-2 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-white/70 text-[9px] mt-0.5">
                      <CalendarDays className="h-2 w-2 shrink-0" />
                      <span className="truncate">{event.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </section>
          </div>
        )}

        {/* ── Momen Digital ── */}
        <section className="home-section-momen-digital mt-4">
          <MomenDigitalShowcase />
        </section>

        {/* ── Promo ── */}
        {(() => {
          const pair = HOME_PROMO_CARDS;
          const mobilePages = [HOME_PROMO_CARDS];
          return (
            <section className="home-section-promo pt-2">
              <style>{`
                @keyframes promoShine { 0%{background-position:-300% 0} 100%{background-position:300% 0} }
                .promo-shine::after { content:''; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.14) 50%,transparent 70%); background-size:300% 100%; animation:promoShine 4s linear infinite; pointer-events:none; }
                .promo-card { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease; }
                .promo-card:hover { transform: translateY(-3px); }
                .promo-card:active { transform: scale(0.98); }
              `}</style>

              {/* ── Mobile: two compact cards per frame with touch ── */}
              <div className="md:hidden">
                <div
                  className="overflow-hidden rounded-2xl"
                  onTouchStart={(e) => { diskonTouchX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const dx = e.changedTouches[0].clientX - diskonTouchX.current;
                    if (Math.abs(dx) > 40) {
                      setActiveDiskon(i =>
                        dx < 0
                          ? (i + 1) % mobilePages.length
                          : (i - 1 + mobilePages.length) % mobilePages.length
                      );
                    }
                  }}
                >
                  <div
                    className="flex"
                    style={{ transform: `translateX(-${activeDiskon * 100}%)`, transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)" }}
                  >
                    {mobilePages.map((page, pageIndex) => (
                      <div key={pageIndex} className="flex w-full flex-shrink-0 items-stretch gap-2">
                        {page.map((c) => {
                      const clr = promoColors(c.colorType);
                      const isBonusPromo = c.kind === "bonus";
                      return (
                         <div key={c.id} className="promo-card promo-shine relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] ring-1 ring-white/15 cursor-pointer select-none"
                          style={{ background:`linear-gradient(145deg,${clr.from} 0%,${clr.to} 100%)` }}>
                           <div aria-hidden="true" className="pointer-events-none absolute -left-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                           <div aria-hidden="true" className="pointer-events-none absolute -right-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                           <div className="absolute -right-1 -bottom-2 font-black text-white/[0.07] leading-none select-none pointer-events-none" style={{ fontSize:68, fontFamily:"system-ui" }}>{c.amount}</div>
                          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none" style={{ background:"rgba(255,255,255,0.07)" }} />
                          <div className="relative flex flex-1 flex-col p-2.5" style={{ zIndex:2, minHeight:150 }}>
                            <span className="inline-flex h-5 max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider" style={{ background:"rgba(255,255,255,0.22)", color:"white" }}>
                              {c.colorType === "new_user" ? <UserPlus className="w-2.5 h-2.5" strokeWidth={2.5} /> : <Award className="w-2.5 h-2.5" strokeWidth={2.5} />}
                              {c.badge}
                            </span>
                            <div className="flex h-8 items-end gap-1">
                              {isBonusPromo ? (
                                <div className="flex flex-col">
                                  <span className="text-white font-black leading-none" style={{ fontSize:16 }}>{c.amount}</span>
                                  <span className="text-white/50 text-[7px] font-bold uppercase">{c.amountLabel}</span>
                                </div>
                              ) : (
                                <>
                                  <span className="font-black text-white leading-none" style={{ fontSize:26, lineHeight:1 }}>{c.amount}</span>
                                  <div className="flex flex-col mb-0.5 ml-1">
                                    <span className="text-white/90 font-black text-sm leading-none">%</span>
                                    <span className="text-white/50 text-[8px] font-bold uppercase">{c.amountLabel}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <p className="h-8 overflow-hidden text-white font-extrabold text-[11px] leading-snug line-clamp-2">{c.title}</p>

                            <div className="flex min-h-7 w-full min-w-0 items-center gap-0.5 overflow-hidden">
                              <p className="line-clamp-2 text-white/85 text-[8px] font-semibold leading-snug">
                                {c.description}
                              </p>
                            </div>

                             <div className="relative -mx-2.5 mb-2 h-3">
                               <div aria-hidden="true" className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/35" />
                               <div aria-hidden="true" className="absolute -left-2 top-0 h-3 w-3 rounded-full bg-white/95" />
                               <div aria-hidden="true" className="absolute -right-2 top-0 h-3 w-3 rounded-full bg-white/95" />
                             </div>
                            <a
                              href={NEMPO_CONSULT_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-7 w-full items-center justify-center rounded-xl text-xs font-extrabold no-underline transition-all active:scale-95"
                              style={{ background:"rgba(255,255,255,0.95)", color:clr.to }}
                            >
                              {c.ctaLabel} →
                            </a>
                            <div className="mt-1.5 h-3.5" />
                          </div>
                        </div>
                      );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Dots indicator */}
                {mobilePages.length > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-3">
                    {mobilePages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDiskon(i)}
                        style={{ transition: "all 0.3s ease" }}
                        className={`rounded-full ${i === activeDiskon ? "w-5 h-2 bg-blue-500" : "w-2 h-2 bg-gray-300"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Desktop: compact horizontal cards ── */}
              <div className="hidden md:grid grid-cols-2 gap-3">
                {pair.map((c) => {
                  const clr = promoColors(c.colorType);
                  const isBonusPromo = c.kind === "bonus";

                  return (
                    <div key={`d-${c.id}`} className="promo-card promo-shine relative overflow-hidden rounded-[1.35rem] ring-1 ring-white/15 cursor-pointer select-none"
                      style={{ background:`linear-gradient(135deg,${clr.from} 0%,${clr.to} 100%)` }}>

                      {/* Decorative blobs */}
                      <div aria-hidden="true" className="pointer-events-none absolute -left-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                      <div aria-hidden="true" className="pointer-events-none absolute -right-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background:"rgba(255,255,255,0.06)" }} />
                      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none" style={{ background:"rgba(255,255,255,0.05)" }} />

                      {/* Horizontal inner layout */}
                      <div className="relative flex items-center gap-0" style={{ zIndex:2 }}>

                        {/* Left: discount display */}
                           <div className="flex flex-col items-center justify-center px-4 py-4 shrink-0 border-r border-dashed border-white/25" style={{ minWidth:80 }}>
                            {isBonusPromo ? (
                             <>
                                <span className="text-white font-black leading-none" style={{ fontSize:18 }}>{c.amount}</span>
                                <span className="text-white/60 text-[8px] font-black uppercase tracking-widest mt-1">{c.amountLabel}</span>
                             </>
                           ) : (
                             <>
                               <div className="flex items-start leading-none">
                                 <span className="font-black text-white/80 text-base mt-0.5 mr-0.5">%</span>
                                  <span className="font-black text-white leading-none" style={{ fontSize:42 }}>{c.amount}</span>
                               </div>
                                <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-0.5">{c.amountLabel}</span>
                             </>
                           )}
                        </div>

                        {/* Middle: content */}
                        <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0 gap-1">
                          {/* Type badge */}
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full self-start whitespace-nowrap" style={{ background:"rgba(255,255,255,0.2)", color:"white" }}>
                            {c.colorType === "new_user" ? <UserPlus className="w-2.5 h-2.5" strokeWidth={2.5} /> : <Award className="w-2.5 h-2.5" strokeWidth={2.5} />}
                            {c.badge}
                          </span>

                          {/* Title — 2 lines max */}
                          <h3 className="text-white font-black text-sm leading-tight line-clamp-2">{c.title}</h3>

                          <p className="text-white/80 text-[10px] font-semibold leading-snug line-clamp-2">
                            {c.description}
                          </p>
                        </div>

                        {/* Right: CTA */}
                         <div className="flex flex-col items-center justify-center px-4 py-4 shrink-0 border-l border-dashed border-white/25 gap-1.5">
                          <a
                            href={NEMPO_CONSULT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap no-underline transition-all hover:scale-105 active:scale-95"
                            style={{ background:"rgba(255,255,255,0.97)", color:clr.to, boxShadow:"0 3px 12px rgba(0,0,0,0.18)" }}
                          >
                            {c.ctaLabel}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* ── AI photo banners ── */}
        <div className="home-section-partnership">
        <div
          className="relative overflow-hidden rounded-2xl md:hidden"
          style={{ height: 130 }}
          onTouchStart={(event) => { infoBannerTouchX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            const distance = event.changedTouches[0].clientX - infoBannerTouchX.current;
            if (Math.abs(distance) > 40) {
              setInfoBannerIdx((current) =>
                distance < 0
                  ? (current + 1) % INFO_BANNERS.length
                  : (current - 1 + INFO_BANNERS.length) % INFO_BANNERS.length,
              );
            }
          }}
        >
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${infoBannerIdx * 100}%)`,
              transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {INFO_BANNERS.map((banner) => (
              <Link
                key={banner.id}
                href="/price-list"
                aria-label={banner.title}
                className="group relative block h-full w-full shrink-0 overflow-hidden rounded-2xl shadow-sm"
              >
                <InfoPhotoBanner banner={banner} />
              </Link>
            ))}
          </div>
          {INFO_BANNERS.length > 1 && <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {INFO_BANNERS.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Tampilkan banner ${index + 1}`}
                onClick={() => setInfoBannerIdx(index)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: index === infoBannerIdx ? 18 : 5,
                  height: 5,
                  background: index === infoBannerIdx
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>}
        </div>

        <div className="hidden gap-3 md:grid">
          {INFO_BANNERS.map((banner) => (
            <Link
              key={banner.id}
              href="/price-list"
              aria-label={banner.title}
              className="group relative block h-[180px] overflow-hidden rounded-2xl shadow-sm"
            >
              <InfoPhotoBanner banner={banner} />
            </Link>
          ))}
        </div>
        </div>

        {/* ── Creator Team ── */}
        <section className="home-section-creator-team">
          <NempoCreatorTeamCard />
        </section>

        {/* ── Kuliner Paling Populer — dihapus ── */}

        {/* ── Event Organizer CTA ── */}
        <section className="home-section-organizer border border-[#bae6fd] bg-[linear-gradient(135deg,#e0f2fe_0%,#dbeafe_100%)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0" style={{ background: "#0194f3", boxShadow: "0 8px 20px rgba(1,148,243,0.30)" }}>
              <Ticket className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg mb-0.5">Ingin Mengadakan Event?</h2>
              <p className="text-gray-600 text-sm">Konsultasikan kebutuhan event Anda bersama tim kami dan dapatkan penawaran terbaik.</p>
            </div>
          </div>
          <a
            href={NEMPO_CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-md text-white"
            style={{ background: "#0194f3", boxShadow: "0 4px 12px rgba(1,148,243,0.35)" }}
          >
            Hubungi Tim via DM Instagram
          </a>
        </section>

        {/* ══ BRAND PARTNERS ══════════════════════════════════════════════════════ */}
        {(() => {
          const brands = partnersDb.length > 0 ? partnersDb : [
            { name: "Good Story Cafe", color: "#c8a24a" },
            { name: "Temu Tarung",  color: "#e63946" },
            { name: "Kopi Jaya",    color: "#c77c3c" },
            { name: "Domusa",       color: "#7b61ff" },
            { name: "Biang Coffee", color: "#a0522d" },
            { name: "Nazumi Cafe",  color: "#2a9d8f" },
            { name: "GGS Beauty",   color: "#d6336c" },
          ];
          const items = [...brands, ...brands];
          return (
            <div className="home-section-partners relative overflow-hidden py-2">
              <style>{`
                .bp-track { will-change: transform; }
                .bp-viewport { touch-action: pan-y; cursor: grab; }
                .bp-viewport:active { cursor: grabbing; }
                .bp-brand {
                  display: inline-flex;
                  align-items: baseline;
                  gap: 5px;
                  cursor: default;
                  white-space: nowrap;
                  transition: opacity 0.3s ease;
                  opacity: 0.5;
                }
                .bp-brand:hover { opacity: 1; }
                .bp-brand:hover .bp-word-accent {
                  text-shadow: 0 0 28px color-mix(in srgb, var(--bc) 70%, transparent);
                }
                .bp-word-thin {
                  font-size: 11px;
                  font-weight: 400;
                  letter-spacing: 0.25em;
                  text-transform: uppercase;
                  color: #475569;
                  align-self: center;
                  padding-top: 2px;
                }
                .bp-word-accent {
                  font-size: 20px;
                  font-weight: 900;
                  letter-spacing: 0.04em;
                  text-transform: uppercase;
                  font-style: italic;
                  color: var(--bc);
                  transition: text-shadow 0.3s ease;
                  line-height: 1;
                }
              `}</style>

              {/* label */}
              <div className="flex items-center justify-center pt-4 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Mitra Kami</span>
              </div>

              {/* marquee — auto-scrolls, swipeable on touch */}
              <div
                className="bp-viewport relative overflow-hidden py-3"
                onPointerDown={(e) => {
                  bpDrag.current.dragging = true;
                  bpDrag.current.x = e.clientX;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!bpDrag.current.dragging) return;
                  const dx = e.clientX - bpDrag.current.x;
                  bpDrag.current.x = e.clientX;
                  bpDrag.current.offset -= dx;
                }}
                onPointerUp={() => { bpDrag.current.dragging = false; }}
                onPointerCancel={() => { bpDrag.current.dragging = false; }}
              >
                <div
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
                  style={{ background: "linear-gradient(to right, white, transparent)" }}
                />
                <div
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
                  style={{ background: "linear-gradient(to left, white, transparent)" }}
                />

                <div ref={bpTrackRef} className="bp-track flex items-center px-4" style={{ width: "max-content", gap: "36px" }}>
                  {items.map((b, i) => {
                    const parts = b.name.split(" ");
                    const thin = parts.length > 1 ? parts.slice(0, -1).join(" ") : null;
                    const bold = parts[parts.length - 1];
                    return (
                      <span key={i} className="flex items-center shrink-0" style={{ gap: "36px" }}>
                        <span
                          className="bp-brand select-none"
                          style={{ "--bc": b.color } as React.CSSProperties}
                        >
                          {thin && <span className="bp-word-thin">{thin}</span>}
                          <span className="bp-word-accent">{bold}</span>
                        </span>
                        <span style={{ color: "#cbd5e1", fontSize: 10, letterSpacing: "0.1em" }}>◆</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Ajakan daftar lomba (permanent, above the footer) ── */}
        <LombaHomeCta className="home-section-lomba mx-auto w-full max-w-xl" />

      </div>

    </Layout>

    {showCafeModal && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        onClick={() => setShowCafeModal(false)}
      >
        <div
          className="relative flex flex-col overflow-hidden"
          style={{
            width: "min(88vw, 360px)",
            maxHeight: "78vh",
            borderRadius: 28,
            background: "linear-gradient(160deg, #fffbf5 0%, #fef3e2 60%, #fef9ee 100%)",
            border: "1.5px solid rgba(251,191,36,0.45)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #92400e, transparent)" }} />
          <div className="pointer-events-none absolute -bottom-10 -left-6 w-36 h-36 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #d97706, transparent)" }} />

          <button
            onClick={() => setShowCafeModal(false)}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(146,64,14,0.12)", color: "#92400e" }}
            aria-label="Tutup"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 55%, #d97706 100%)", boxShadow: "0 4px 14px rgba(180,83,9,0.36)" }}>
              <Coffee className="w-5 h-5 text-white" strokeWidth={2} />
              <DeerMascot pose="tidur" className="pointer-events-none absolute left-1/2 top-[-14px] z-20 h-[24px] w-[34px] -translate-x-1/2" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-gray-900 font-black text-base leading-tight">Upcoming Event</h2>
              <p className="text-amber-600/80 text-[10px] font-bold uppercase tracking-[0.10em] mt-0.5">Jangan sampai ketinggalan</p>
            </div>
          </div>

          <div className="mx-5 border-t border-amber-100" />

          <div className="px-5 pt-4 pb-5 overflow-y-auto flex-1">
            {modalHasCafe ? (
              <div className="flex flex-col gap-3">
                {modalCafeEvents.slice(0, 4).map(ev => <CafeEventCard key={ev.id} ev={ev} />)}
                <Link href="/event" onClick={() => setShowCafeModal(false)}
                  className="w-full flex items-center justify-center gap-1 py-2.5 rounded-2xl text-xs font-bold"
                  style={{ background: "rgba(146,64,14,0.09)", color: "#92400e" }}>
                  Semua Event <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #fef3e2, #fde68a40)" }}>
                  <Coffee className="w-8 h-8 text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-sm leading-snug mb-2">Belum ada acara aktif saat ini</p>
                  <p className="text-gray-500 text-[11.5px] leading-relaxed">
                    Nobar Persib, live acoustic, arisan komunitas, talkshow — jadwalkan acaramu bersama kami!
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #b45309, #d97706)", boxShadow: "0 4px 14px rgba(180,83,9,0.30)" }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Jadwalkan Acara
                  </a>
                  <Link href="/event" onClick={() => setShowCafeModal(false)}
                    className="inline-flex items-center justify-center gap-1 w-full py-2.5 rounded-2xl text-xs font-semibold"
                    style={{ background: "rgba(146,64,14,0.09)", color: "#92400e" }}>
                    Event Lainnya <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
