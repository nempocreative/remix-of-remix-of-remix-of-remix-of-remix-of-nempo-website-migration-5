// Owner request: "Temui orang di balik gaya" is split into the men's team (GGS Barber Studio) and the
// women's team (GGS Beauty) from team-data.ts. The home page shows one swipeable row per team (barber, then beauty)
// with "Lihat lainnya" beside the heading (no bottom link); /our-team lists both teams with booking
// on each studio's own WhatsApp. Runs after patch-whatsapp.mjs.
// Usage: node patch-team.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const app = process.argv[2];
const here = new URL(".", import.meta.url);
fs.copyFileSync(new URL("./team-data.ts", here), path.join(app, "src/ggs-team.ts"));
fs.copyFileSync(new URL("./team-autoplay.ts", here), path.join(app, "src/ggs-team-autoplay.ts"));
for (const f of fs.readdirSync(new URL("./team/", here))) {
  fs.copyFileSync(new URL(`./team/${f}`, here), path.join(app, "public/team", f));
}
const file = path.join(app, "src/App.tsx");
let s = fs.readFileSync(file, "utf8");
const start = s.indexOf("const teamMembers = [");
const end = s.indexOf("function OurTeamPage() {");
if (start < 0 || end < start) throw new Error("patch-team: team section not found");
if (!s.includes("whatsappFor")) throw new Error("patch-team: run patch-whatsapp.mjs first");
s = s.slice(0, start) + `const teamImage = (image: string) => \`\${import.meta.env.BASE_URL}\${image.replace(/^\\//, '')}\`;

function OurTeamShowcase({ variant }: { variant: 'home' | 'page' }) {
  const isHome = variant === 'home';
  const autoplayRef = useTeamAutoplay<HTMLElement>();

  return (
    <section
      ref={autoplayRef}
      className={\`ggs-team-showcase ggs-crew\${isHome ? ' ggs-team-showcase-home' : ' ggs-team-showcase-page'}\`}
      aria-labelledby={isHome ? 'home-team-title' : 'our-team-title'}
      data-testid={isHome ? 'section-home-our-team' : 'section-our-team'}
    >
      <div className="ggs-team-heading ggs-crew-heading">
        <div className="ggs-team-heading-copy">
          <h2 id={isHome ? 'home-team-title' : 'our-team-title'}>
            {isHome ? <>Temui orang<br /><em>di balik gaya.</em></> : <>Kenali<br /><em>tim kami.</em></>}
          </h2>
        </div>
        <div className="ggs-team-intro">
          <p>
            {isHome
              ? 'Dua tim, satu perhatian yang sama pada setiap detail. Tim GGS Barber dan Tim GGS Beauty siap merawatmu.'
              : 'Setiap kunjungan dimulai dengan mendengarkan. Pilih tim yang sesuai kebutuhanmu, lalu booking langsung lewat WhatsApp studionya.'}
          </p>
          {isHome && (
            <Link href="/our-team" className="ggs-team-link ggs-crew-more" data-testid="link-home-our-team">
              Lihat lainnya <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      {isHome ? (
        <div className="ggs-crew-rows">
          {TEAM_GROUPS.map((group) => (
            <div className={\`ggs-crew-row ggs-crew-row-\${group.id}\`} key={group.id} data-testid={\`home-team-row-\${group.id}\`}>
              <p className="ggs-crew-row__label"><span>{group.label}</span><small>{group.studio}</small></p>
              <div className="ggs-crew-strip" role="list" aria-label={group.label}>
                {[0, 1].flatMap((copy) => group.members.map((member, index) => (
                  <Link
                    href="/our-team"
                    role="listitem"
                    className={\`ggs-crew-chip ggs-crew-\${group.id}\`}
                    key={\`\${member.id}-\${copy}\`}
                    data-team-index={index}
                    data-team-copy={copy ? '' : undefined}
                    aria-hidden={copy ? true : undefined}
                    tabIndex={copy ? -1 : undefined}
                    data-testid={copy ? undefined : \`card-home-team-\${member.id}\`}
                  >
                    <img src={teamImage(member.image)} alt="" loading="lazy" draggable={false} />
                    <strong>{member.name ?? member.role}</strong>
                    <small>{member.name ? member.role : group.studio}</small>
                  </Link>
                )))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        TEAM_GROUPS.map((group) => (
          <section className={\`ggs-crew-group ggs-crew-\${group.id}\`} key={group.id} aria-labelledby={\`team-group-\${group.id}\`} data-testid={\`team-group-\${group.id}\`}>
            <div className="ggs-crew-group__head">
              <p className="clearer-kicker">{group.studio.toUpperCase()}</p>
              <h3 id={\`team-group-\${group.id}\`}>{group.label}</h3>
              <p>{group.intro}</p>
            </div>
            <div className="ggs-team-grid ggs-crew-grid" role="list" aria-label={\`\${group.label} \${group.studio}\`}>
              {[0, 1].flatMap((copy) => group.members.map((member, index) => (
                <article className="ggs-team-card" key={\`\${member.id}-\${copy}\`} role="listitem" data-team-index={index} data-team-copy={copy ? '' : undefined} aria-hidden={copy ? true : undefined} data-testid={copy ? undefined : \`card-team-profile-\${member.id}\`}>
                  <div className="ggs-team-image">
                    <img src={teamImage(member.image)} alt="" loading="lazy" />
                  </div>
                  <div className="ggs-team-profile">
                    <p className="ggs-team-profile__eyebrow">{group.studio.toUpperCase()}{member.name ? \` · \${member.role.toUpperCase()}\` : ''}</p>
                    <h4 className="ggs-crew-member-name">{member.name ?? member.role}</h4>
                    <div className="ggs-team-profile__rule" aria-hidden="true" />
                    <p className="ggs-team-profile__note">{member.note}</p>
                    <a
                      href="#"
                      tabIndex={copy ? -1 : undefined}
                      className="clearer-primary-button ggs-team-book-link"
                      onClick={(event) => { event.preventDefault(); openGgsWhatsApp(teamWaText(group, member), whatsappFor({ audience: group.id })); }}
                      data-testid={\`link-team-booking-\${member.id}\`}
                    >
                      Booking via WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              )))}
            </div>
          </section>
        ))
      )}
      {!isHome && (
        <div className="ggs-team-page-note">
          <p>Masih bingung memilih layanan? Ceritakan kebutuhanmu lewat WhatsApp, tim kami siap membantu.</p>
          <Link href="/" className="clearer-text-link" data-testid="link-our-team-home">
            Kembali ke beranda <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}

` + s.slice(end);
s = s.replace("import { useQueryClient }", "import { TEAM_GROUPS, teamWaText } from './ggs-team';\nimport { useTeamAutoplay } from './ggs-team-autoplay';\nimport { useQueryClient }");
fs.writeFileSync(file, s);

const css = path.join(app, "src/homepage.css");
const marker = "/* GGS two teams (patch-team.mjs) */";
const c = fs.readFileSync(css, "utf8");
if (!c.includes(marker)) fs.writeFileSync(css, c + `
${marker}
.ggs-crew .ggs-crew-more { margin-top: 14px; }
.ggs-crew-rows { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1fr); gap: 26px; }
.ggs-crew-row { min-width: 0; }
.ggs-crew-row__label { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; max-width: 1260px; margin: 0 auto 12px; font: 11px 'Space Mono', monospace; letter-spacing: .14em; text-transform: uppercase; }
.ggs-crew-row__label span { color: var(--team-pink); font-weight: 700; }
.ggs-crew-row__label small { color: var(--team-muted); font-size: 10px; }
.ggs-crew-row-pria .ggs-crew-row__label span { color: #a8841f; }
.ggs-crew-strip { display: flex; gap: 14px; overflow-x: auto; margin: 0 calc(-1 * var(--ggs-gutter, 20px)); padding: 0 var(--ggs-gutter, 20px) 6px; scroll-padding-inline: var(--ggs-gutter, 20px); scroll-snap-type: x mandatory; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y pinch-zoom; scrollbar-width: none; }
.ggs-crew-strip::-webkit-scrollbar { display: none; }
@media (min-width: 1100px) { .ggs-crew-strip { max-width: 1260px; margin: 0 auto; padding: 0 0 6px; scroll-padding-inline: 0; } }
/* Three cards per view at every size, styled like the service cards below (owner request). */
.ggs-crew-chip { display: flex; min-width: 0; flex: 0 0 calc((100% - 28px) / 3); scroll-snap-align: start; flex-direction: column; overflow: hidden; border: 1px solid #cec3b3; border-radius: 5px; background: #f7f3eb; box-shadow: 0 8px 24px rgb(54 43 33 / 5%); color: var(--team-ink); text-decoration: none; transition: border-color .25s, box-shadow .25s, transform .25s; }
.ggs-crew-chip:hover { transform: translateY(-4px); border-color: #b49a84; box-shadow: 0 16px 34px rgb(54 43 33 / 12%); }
.ggs-crew-chip img { transition: transform .65s cubic-bezier(.2,.7,.25,1); }
.ggs-crew-chip:hover img { transform: scale(1.04); }
.ggs-crew-chip img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: center 30%; }
.ggs-crew-chip strong { margin: 12px 14px 0; font: 500 26px/1.05 'Cormorant Garamond', serif; letter-spacing: -.02em; }
.ggs-crew-chip small { margin: 4px 14px 14px; color: var(--team-muted); font-size: 12px; }
.ggs-crew-chip.ggs-crew-pria { border-color: #2a2420; background: #171412; color: #f4e7c8; }
.ggs-crew-chip.ggs-crew-pria small { color: #bfae8a; }
.ggs-crew-group { position: relative; z-index: 1; max-width: 1260px; margin: 0 auto 46px; }
.ggs-crew-group__head { margin-bottom: 20px; }
.ggs-crew-group__head h3 { margin: 4px 0 8px; font: 500 clamp(34px, 4.4vw, 52px)/1 'Cormorant Garamond', serif; letter-spacing: -.03em; }
.ggs-crew-group__head > p:last-child { max-width: 560px; margin: 0; color: var(--team-muted); font-size: 15px; line-height: 1.7; }
.ggs-crew-group.ggs-crew-pria .ggs-team-profile__eyebrow { color: #a8841f; }
.ggs-crew-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.ggs-crew-pria .ggs-crew-grid { max-width: 860px; margin-left: 0; }
.ggs-crew-grid .ggs-team-book-link { width: 100%; justify-content: center; margin-top: auto; white-space: nowrap; }
.ggs-crew-grid .ggs-crew-member-name { margin: 0; font: 500 30px/1.1 'Cormorant Garamond', serif; }
@media (min-width: 1100px) { .ggs-crew-wanita .ggs-crew-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.ggs-crew-grid .ggs-team-image { aspect-ratio: 3 / 4; }
.ggs-crew-grid .ggs-team-image img { object-position: center top; }
.ggs-crew-grid .ggs-team-profile__note { display: block; overflow: visible; -webkit-line-clamp: unset; line-clamp: unset; text-overflow: clip; max-height: none; margin-bottom: 18px; }
@media (max-width: 640px) { .ggs-crew-grid, .ggs-crew-pria .ggs-crew-grid { display: flex; gap: 12px; overflow-x: auto; max-width: none; margin: 0 calc(-1 * var(--ggs-gutter, 20px)); padding: 0 var(--ggs-gutter, 20px) 6px; scroll-padding-inline: var(--ggs-gutter, 20px); scroll-snap-type: x mandatory; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y pinch-zoom; scrollbar-width: none; } .ggs-crew-grid::-webkit-scrollbar { display: none; } .ggs-crew-grid > .ggs-team-card { flex: 0 0 min(80vw, 320px); min-width: 0; scroll-snap-align: start; } .ggs-crew-strip { gap: 10px; } .ggs-crew-chip { flex-basis: calc((100% - 20px) / 3); } .ggs-crew-chip strong { margin: 9px 10px 0; font-size: 19px; } .ggs-crew-chip small { margin: 3px 10px 11px; font-size: 10.5px; } }
/* Duplicate sets keep forward motion seamless; transforms never change the three-card tracks. */
.ggs-crew-strip, .ggs-crew-grid { position: relative; scroll-snap-type: none; scroll-behavior: auto; }
.ggs-crew-strip { padding-top: 24px; padding-bottom: 24px; }
.ggs-crew-chip, .ggs-crew-grid > .ggs-team-card { transform-origin: center; transition: transform .75s cubic-bezier(.22,.68,.25,1); }
.ggs-crew-chip.ggs-team-featured, .ggs-crew-grid > .ggs-team-featured { transform: translateY(-6px) scale(1.08); z-index: 2; }
@media (min-width: 641px) { .ggs-crew-grid > [data-team-copy] { display: none; } }
@media (max-width: 640px) { .ggs-crew-grid, .ggs-crew-pria .ggs-crew-grid { padding-top: 28px; padding-bottom: 28px; } }
@media (prefers-reduced-motion: reduce) { .ggs-crew-chip, .ggs-crew-grid > .ggs-team-card { transition: none; transform: none; } .ggs-crew-strip > [data-team-copy], .ggs-crew-grid > [data-team-copy] { display: none; } }
`);
console.log("GGS team split into Tim GGS Barber and Tim GGS Beauty");
