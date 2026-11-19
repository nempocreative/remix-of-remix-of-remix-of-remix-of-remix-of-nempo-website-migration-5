/**
 * Small runtime additions for the Garut Beans sub-site, added to its page shell on the
 * server (see garut-beans-page.ts). They live here, outside the generated build, so a
 * rebuild from upstream never drops them:
 * - the home-page sheep mascot is swapped for a new drawing that sways with CSS;
 * - the coffee and product card carousels can be swiped with a finger (or dragged).
 */

/** Image used for the swaying sheep; kept outside public/garut-beans so rebuilds keep it. */
export const DOMBA_GOYANG = "/garut-beans-patch/domba-goyang.webp";

/** The "G" logo shown on the loading screen instead of the plain coffee bean. */
export const LOGO_G = "/garut-beans/assets/kopi-garut-logo.webp";

/**
 * Which carousel dot a swipe should pick. Returns null when the movement is too short
 * or mostly vertical (the visitor is scrolling the page). Swiping left shows the next card.
 * Must stay self-contained: its source is copied into the page script.
 */
export function pilihGeser(dx: number, dy: number, aktif: number, jumlah: number): number | null {
  if (jumlah < 2 || aktif < 0) return null;
  if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.2) return null;
  const arah = dx < 0 ? 1 : -1;
  return (((aktif + arah) % jumlah) + jumlah) % jumlah;
}

const GAYA = `
/* The loading emblem shows the G logo: drop the bean's brightening filter so its colours stay true. */
#gb-initial-loader .gb-loader-bean {
  filter: drop-shadow(0 7px 12px rgba(15, 9, 7, .3));
}
.gb-home-mascot-stage { touch-action: manipulation; }
.gb-home-mascot-stage::after {
  content: ""; position: absolute; left: 50%; bottom: 4%; width: 46%; height: 7%;
  transform: translateX(-50%); border-radius: 50%; background: rgba(58, 36, 23, .16);
  filter: blur(3px); z-index: 0; pointer-events: none;
}
#root img.gb-home-mascot-video.gb-domba-goyang {
  position: relative; z-index: 1; width: auto; aspect-ratio: 480 / 642;
  height: clamp(150px, 26vw, 300px); max-height: none; min-height: 0; object-fit: contain;
  transform-origin: 50% 96%; animation: gb-domba-goyang 1.8s ease-in-out infinite !important;
  will-change: transform;
}
#root .gb-home-mascot-stage.is-playing img.gb-domba-goyang { animation-duration: .9s !important; }
.gb-home-mascot-stage.is-playing::after { animation: gb-domba-bayang .9s ease-in-out infinite; }
@media (max-width: 699px) {
  #root img.gb-home-mascot-video.gb-domba-goyang { height: min(44vw, 172px); }
}
@keyframes gb-domba-goyang {
  0%, 100% { transform: rotate(0deg) translateY(0) scale(1, 1); }
  20% { transform: rotate(-6deg) translateY(-3%) scale(1.01, .99); }
  45% { transform: rotate(0deg) translateY(0) scale(1.03, .96); }
  70% { transform: rotate(6deg) translateY(-3%) scale(1.01, .99); }
  90% { transform: rotate(0deg) translateY(0) scale(1.02, .97); }
}
@keyframes gb-domba-bayang {
  0%, 100% { transform: translateX(-50%) scaleX(1); }
  50% { transform: translateX(-50%) scaleX(.8); }
}
.gb-coffee-carousel-stage, .gb-diversified-carousel-stage { touch-action: pan-y; user-select: none; -webkit-user-select: none; }
.gb-coffee-carousel-stage img, .gb-diversified-carousel-stage img { -webkit-user-drag: none; }
@media (prefers-reduced-motion: reduce) {
  #root img.gb-home-mascot-video.gb-domba-goyang, .gb-home-mascot-stage::after { animation: none !important; }
}
`;

const SKRIP = `(function () {
  var DOMBA = ${JSON.stringify(DOMBA_GOYANG)};
  var LOGO = ${JSON.stringify(LOGO_G)};
  var pilihGeser = (${pilihGeser.toString()});
  // The loading screen opens with the G logo, not the plain coffee bean.
  var bijiLoading = document.querySelector("#gb-initial-loader img[data-initial-loader-bean]");
  if (bijiLoading) {
    bijiLoading.removeAttribute("srcset");
    bijiLoading.setAttribute("src", LOGO);
    bijiLoading.setAttribute("alt", "Logo G Garut Beans");
  }
  function gantiDomba() {
    var imgs = document.querySelectorAll("img.gb-home-mascot-video");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.getAttribute("src") === DOMBA) continue;
      img.removeAttribute("srcset");
      img.setAttribute("src", DOMBA);
      img.setAttribute("width", "480");
      img.setAttribute("height", "642");
      img.setAttribute("alt", "Domba Garut Beans bergoyang sambil memegang secangkir kopi");
      img.classList.add("gb-domba-goyang");
    }
  }
  new MutationObserver(gantiDomba).observe(document.documentElement, { childList: true, subtree: true });
  gantiDomba();

  var SELEKTOR = ".gb-coffee-carousel-stage, .gb-diversified-carousel-stage";
  var mulai = null;
  var baruDigeser = false;
  document.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    var panggung = e.target && e.target.closest ? e.target.closest(SELEKTOR) : null;
    mulai = panggung ? { x: e.clientX, y: e.clientY, panggung: panggung, id: e.pointerId } : null;
  }, true);
  function selesai(e) {
    if (!mulai || e.pointerId !== mulai.id) return;
    var awal = mulai; mulai = null;
    var wadah = awal.panggung.parentElement;
    if (!wadah) return;
    var titik = wadah.querySelectorAll(".gb-coffee-dot");
    var aktif = -1;
    for (var i = 0; i < titik.length; i++) if (titik[i].classList.contains("active")) aktif = i;
    var tujuan = pilihGeser(e.clientX - awal.x, e.clientY - awal.y, aktif, titik.length);
    if (tujuan === null) return;
    baruDigeser = true;
    setTimeout(function () { baruDigeser = false; }, 350);
    titik[tujuan].click();
  }
  document.addEventListener("pointerup", selesai, true);
  document.addEventListener("pointercancel", function () { mulai = null; }, true);
  // A drag that changed the card must not also open the card under the finger or mouse.
  document.addEventListener("click", function (e) {
    if (!baruDigeser || !e.target || !e.target.closest || !e.target.closest(SELEKTOR)) return;
    e.preventDefault(); e.stopPropagation(); baruDigeser = false;
  }, true);
  document.addEventListener("dragstart", function (e) {
    if (e.target && e.target.closest && e.target.closest(SELEKTOR)) e.preventDefault();
  }, true);
})();`;

/** Adds the sheep and swipe additions to the Garut Beans page shell. */
export function tambahPatchGarutBeans(html: string): string {
  const gaya = `<style data-nempo-patch>${GAYA}</style>`;
  const skrip = `<script data-nempo-patch>${SKRIP}</script>`;
  const denganGaya = html.includes("</head>") ? html.replace("</head>", `${gaya}</head>`) : gaya + html;
  return denganGaya.includes("</body>") ? denganGaya.replace("</body>", `${skrip}</body>`) : denganGaya + skrip;
}
