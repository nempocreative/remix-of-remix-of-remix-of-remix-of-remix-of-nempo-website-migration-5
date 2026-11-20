// Owner request: the "si teteh naik motor" nail art video (NEMPO asset, served on the same site)
// plays on the GGS home page and on the Home Service page, with a GGS Beauty WhatsApp button.
// Runs after patch-tab-home-service.mjs.
// Usage: node patch-nail-art-video.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
const swap = (from, to) => {
  if (!s.includes(from)) throw new Error(`patch-nail-art-video: not found: ${from.slice(0, 70)}`);
  s = s.replace(from, to);
};
const VIDEO = "/__l5e/assets-v1/6f141b2d-8bd2-4c62-9795-b51d7a5939d1/nail-art-teteh-motor.mp4";
const POSTER = "/__l5e/assets-v1/e8258222-58e3-4368-aeef-1c1498f84148/nail-art-teteh-motor-poster.webp";

swap("import { GgsBookingForm } from './ggs-booking-page';\n",
  "import { GgsBookingForm } from './ggs-booking-page';\nimport { ggsWhatsAppUrl as nailArtWaUrl } from './ggs-whatsapp';\n");

const component = `
const NAIL_ART_WA_TEXT = 'Halo GGS Beauty, saya ingin pesan *Nail Art Panggilan* (Home Service). Alamat saya: ';

function GgsNailArtVideo({ page = false }: { page?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setNeedsTap(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) video.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
      else video.pause();
    }, { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().then(() => setNeedsTap(false)).catch(() => undefined);
  };
  return (
    <section className={page ? 'ggs-nailart ggs-nailart--page' : 'ggs-nailart'} aria-labelledby={page ? 'nailart-title-page' : 'nailart-title'} data-testid={page ? 'section-nail-art-video-page' : 'section-nail-art-video'}>
      <div className="ggs-nailart__frame">
        <video ref={videoRef} src="${VIDEO}" poster="${POSTER}" muted loop playsInline preload="metadata" aria-label="Animasi si teteh nail art naik motor membawa tas nail art" data-testid="video-nail-art" />
        {needsTap && (
          <button type="button" className="ggs-nailart__play" onClick={play} data-testid="button-nail-art-play">
            <span aria-hidden="true">▶</span> Ketuk untuk memutar video
          </button>
        )}
      </div>
      <div className="ggs-nailart__copy">
        <p className="clearer-kicker">GGS BEAUTY · HOME SERVICE</p>
        <h2 id={page ? 'nailart-title-page' : 'nailart-title'}>Nail Art<br /><em>Panggilan.</em></h2>
        <p>Si teteh datang ke rumah naik motor, lengkap dengan tas nail art. Kuku cantik tanpa perlu keluar rumah.</p>
        <a href={nailArtWaUrl(NAIL_ART_WA_TEXT)} target="_blank" rel="noreferrer" className="clearer-primary-button" data-testid="link-nail-art-whatsapp">
          Panggil Sekarang <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function HomeServicePage(`;
swap("\nfunction HomeServicePage(", component);

// Home: right after the quick menu and vouchers, before the discounts.
swap("      <HomeDiscounts />\n", "      <GgsNailArtVideo />\n\n      <HomeDiscounts />\n");
// Home Service page: above the how-to panel.
swap("      <div className=\"home-service-detail-panel\" data-testid=\"home-service-detail-panel\">",
  "      <GgsNailArtVideo page />\n      <div className=\"home-service-detail-panel\" data-testid=\"home-service-detail-panel\">");
fs.writeFileSync(file, s);

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS nail art video (patch-nail-art-video.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `
${marker}
.ggs-nailart { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 520px); justify-content: center; align-items: center; gap: clamp(24px, 5vw, 72px); border-top: 1px solid var(--clearer-line); background: var(--clearer-paper-deep); }
.ggs-nailart--page { margin: 0 0 40px; border: 0; background: none; justify-content: start; }
.ggs-nailart__frame { position: relative; width: 100%; aspect-ratio: 9 / 16; overflow: hidden; border-radius: 22px; background: var(--clearer-ink); box-shadow: 0 18px 44px rgb(194 24 91 / 18%); }
.ggs-nailart__frame video { display: block; width: 100%; height: 100%; object-fit: cover; }
.ggs-nailart__play { position: absolute; left: 50%; bottom: 18px; display: inline-flex; align-items: center; gap: 8px; transform: translateX(-50%); border: 0; border-radius: 999px; background: rgb(17 17 19 / 72%); padding: 10px 16px; color: #fff; font-size: 13px; font-weight: 700; white-space: nowrap; cursor: pointer; }
.ggs-nailart__copy .clearer-kicker { margin: 0 0 14px; color: var(--clearer-accent); }
.ggs-nailart__copy h2 { margin: 0; font: 500 clamp(44px, 6vw, 76px)/.86 'Cormorant Garamond', serif; letter-spacing: -.04em; }
.ggs-nailart__copy h2 em { color: var(--clearer-accent); font-weight: 400; }
.ggs-nailart__copy > p:not(.clearer-kicker) { margin: 18px 0 24px; color: var(--clearer-muted); font-size: 15px; line-height: 1.6; max-width: 420px; }
@media (max-width: 699px) {
  .ggs-nailart { grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .ggs-nailart__frame { max-width: 270px; }
  .ggs-nailart__copy > p:not(.clearer-kicker) { margin-left: auto; margin-right: auto; }
}
`);
console.log("GGS nail art video on home and Home Service");
