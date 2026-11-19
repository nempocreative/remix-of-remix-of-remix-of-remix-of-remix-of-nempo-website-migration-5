import fs from 'node:fs';
import path from 'node:path';
const app = process.argv[2];
const file = path.join(app, 'src/App.tsx');
fs.copyFileSync(new URL('./booking-request.ts', import.meta.url), path.join(app, 'src/booking-request.ts'));
fs.copyFileSync(new URL('./team-data.ts', import.meta.url), path.join(app, 'src/team-data.ts'));
fs.copyFileSync(new URL('./ggs-booking-page.tsx', import.meta.url), path.join(app, 'src/ggs-booking-page.tsx'));
let s = fs.readFileSync(file, 'utf8');
s = `import { GgsBookingForm } from './ggs-booking-page';\n` + s;
const bookingStart = s.indexOf('function BookingPage(');
const bookingEnd = s.indexOf('const womenHairStyleChoices', bookingStart);
if (bookingStart < 0 || bookingEnd < 0) throw new Error('Booking page not found');
s = s.slice(0, bookingStart) + `function BookingPage({ services, servicesQuery, fields, selectedHairStyle }: BookingProps) {
  return <PageFrame kicker="GGS / BOOKING" title={<>Booking<br /><em>kunjunganmu.</em></>} testId="page-booking">
    <GgsBookingForm services={services} loading={servicesQuery.isLoading} initialServiceId={fields.serviceId} selectedHairStyle={selectedHairStyle} />
  </PageFrame>;
}

` + s.slice(bookingEnd);
const audienceStart = s.indexOf('function AudienceServicesPage(');
if (audienceStart < 0) throw new Error('Audience pages not found');
const insertAt = s.indexOf('  const page =', audienceStart);
s = s.slice(0, insertAt) + `  if (audience !== 'self-care') {
    const men = audience === 'men';
    const styles = men ? hairStyleChoices : womenHairStyleChoices;
    const studio = men ? 'pria' : 'wanita';
    return <PageFrame kicker={men ? 'GGS BARBER STUDIO' : 'GGS BEAUTY'} title={<>Model rambut<br /><em>{men ? 'pria.' : 'wanita.'}</em></>} testId={\`page-services-\${audience}\`}>
      <section className="gallery-style-picker" aria-label={men ? 'Model rambut pria' : 'Model rambut wanita'}>
        <div className="gallery-style-choice-grid">
          {styles.map((style, index) => <Link className="gallery-style-choice" href={\`/book?studio=\${studio}&model=\${encodeURIComponent(style.label)}\`} key={style.id}>
            <span className="gallery-style-choice-image"><img src={style.image} alt={style.label} loading="lazy" /><span className="gallery-style-number">0{index + 1}</span></span>
            <span className="gallery-style-choice-copy"><strong>{style.label}</strong><small>{style.description}</small><span className="gallery-style-action">Booking model ini <ArrowRight size={15} /></span></span>
          </Link>)}
        </div>
      </section>
      <div className="ggs-model-pricelist"><Link href={men ? '/pricelist-pria' : '/pricelist-wanita'} className="clearer-primary-button">Lihat Pricelist {men ? 'Pria' : 'Wanita'} <ArrowRight size={17} /></Link></div>
    </PageFrame>;
  }
` + s.slice(insertAt);
fs.writeFileSync(file, s);
const css = path.join(app, 'src/homepage.css');
fs.appendFileSync(css, `
/* GGS detailed studio booking and model-only pages */
.ggs-model-pricelist { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--clearer-line); }
.ggs-booking { --team-ink: var(--clearer-ink); --team-muted: var(--clearer-muted); --booking-accent: var(--clearer-accent); color: var(--team-ink); }
.ggs-booking[data-studio="pria"] { --booking-accent: var(--clearer-ink); }
.ggs-booking-studios { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 0 0 32px; }
.ggs-booking-studios label { display: flex; align-items: center; gap: 12px; border: 1px solid var(--team-muted); border-radius: 6px; padding: 18px; cursor: pointer; }
.ggs-booking-studios label:has(input:checked) { border-color: var(--booking-accent); outline: 1px solid var(--booking-accent); }
.ggs-booking-studios input { accent-color: var(--booking-accent); }
.ggs-booking-studios strong, .ggs-booking-studios small { display: block; }
.ggs-booking-studios small { margin-top: 5px; color: var(--team-muted); font-size: 12px; }
.ggs-booking-layout { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr); gap: 40px; align-items: start; }
.ggs-booking fieldset { border: 0; padding: 0; margin: 0 0 28px; min-width: 0; }
.ggs-booking legend { margin-bottom: 18px; color: var(--booking-accent); font-size: 19px; font-weight: 600; }
.ggs-booking-summary { position: sticky; top: 100px; border-top: 2px solid var(--booking-accent); padding-top: 22px; }
.ggs-booking-summary h2 { font: 500 30px 'Cormorant Garamond', serif; margin: 0 0 22px; }
.ggs-booking-summary dl { margin: 0; }
.ggs-booking-summary dl > div { border-bottom: 1px solid var(--team-muted); padding: 12px 0; }
.ggs-booking-summary dt { color: var(--team-muted); font-size: 12px; margin-bottom: 6px; }
.ggs-booking-summary dd { margin: 0; overflow-wrap: anywhere; }
.ggs-booking-staff { display: flex; align-items: center; gap: 14px; margin-top: 15px; }
.ggs-booking-staff img { width: 60px; height: 76px; object-fit: cover; border-radius: 5px; }
.ggs-booking-summary p { font-size: 13px; line-height: 1.65; color: var(--team-muted); }
.ggs-booking .clearer-primary-button { width: 100%; justify-content: center; white-space: normal; text-align: center; }
@media(max-width: 760px) { .ggs-booking-layout { grid-template-columns: minmax(0, 1fr); gap: 20px; } .ggs-booking-studios { gap: 10px; } .ggs-booking-studios label { padding: 14px 10px; gap: 8px; } .ggs-booking-studios strong { font-size: 14px; } .ggs-booking-summary { position: static; } }
`);
console.log('GGS studio booking and model-only pages added');