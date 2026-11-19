// Owner request: every card row on the GGS site can be swiped with a finger on phones and iPads.
// - The big home banner changes slide on a left/right swipe (it only had arrows and dots).
// - The men's and women's hair style cards become a swipeable row on phones instead of a 2-column grid.
// Team rows are made swipeable by patch-team.mjs; the Embla rows (services, products, vouchers) already drag.
// Usage: node patch-swipe.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
if (!s.includes("heroTouch")) {
  const refLine = "  const menuTouchStart = useRef<{ identifier: number; x: number; y: number } | null>(null);\n";
  const stage = '        <div className="ggs-carousel-stage">';
  if (!s.includes(refLine) || !s.includes(stage)) throw new Error("patch-swipe: home banner not found");
  s = s.replace(refLine, refLine + "  const heroTouch = useRef<{ x: number; y: number } | null>(null);\n");
  s = s.replace(stage, `        <div
          className="ggs-carousel-stage"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            heroTouch.current = touch && event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
            setPaused(true);
          }}
          onTouchEnd={(event) => {
            const start = heroTouch.current;
            heroTouch.current = null;
            setPaused(false);
            const touch = event.changedTouches[0];
            if (!start || !touch) return;
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            setActive((index) => (index + (dx < 0 ? 1 : -1) + slides.length) % slides.length);
          }}
          onTouchCancel={() => { heroTouch.current = null; setPaused(false); }}
        >`);
  fs.writeFileSync(file, s);
}

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS finger swipe (patch-swipe.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `
${marker}
.ggs-carousel-stage { touch-action: pan-y pinch-zoom; -webkit-user-select: none; user-select: none; }
.ggs-carousel-stage img { -webkit-user-drag: none; }
@media (max-width: 680px) {
  .clearer-page .home-style-model-grid {
    display: flex; gap: 10px; overflow-x: auto;
    margin: 0 calc(-1 * var(--ggs-gutter, 20px)); padding: 0 var(--ggs-gutter, 20px) 6px;
    scroll-padding-inline: var(--ggs-gutter, 20px); scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y pinch-zoom; scrollbar-width: none;
  }
  .clearer-page .home-style-model-grid::-webkit-scrollbar { display: none; }
  .clearer-page .home-style-model-card { flex: 0 0 min(62vw, 240px); min-width: 0; scroll-snap-align: start; }
}
`);
console.log("GGS banner and card rows swipe with a finger");
