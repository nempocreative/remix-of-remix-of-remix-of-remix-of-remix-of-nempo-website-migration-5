<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Architecture rules
- Custom-product browsing uses browser-safe catalog data (tumblers grouped by model, each design page such as `/tumbler-custom` and `/custom-garut` with its own data module), a metadata leaf route mounting NempoShell, and the existing official consultation contact; tumbler examples are printed by script onto unbranded blank bodies; why: examples and WhatsApp requests stay consistent without implying checkout or fixed pricing.
- Organization moment portfolios keep fictional content in browser-safe data, use a scoped global theme and a metadata leaf route mounting NempoShell, give each member their own standalone AI portrait (generated with their group-photo likeness as reference), and reuse the shared session-only wall validator; why: keep identity, category navigation, and honest message behavior consistent.
- Event moment portfolios follow the same pattern (browser-safe data, scoped `.me-page` theme, metadata leaf route mounting NempoShell, shared session-only wall validator) and present the after-movie as a photo slideshow driven by a tested wrap-around helper that never autoplays under reduced motion; committee members get standalone AI portraits; why: no real event footage exists and motion must respect user settings.
- Community moment portfolios follow the same pattern (browser-safe data, scoped `.mkt-page` theme, metadata leaf route mounting NempoShell, shared session-only wall validator); the member-growth chart and current member count derive from the yearly data through tested helpers, and each organizer has a standalone AI portrait; why: the headline numbers must always agree with the year-by-year story.
- Ucapan Spesial portfolios keep all greeting variants in one browser-safe data module with tested age/candle/wall helpers, theme via `data-tema` on `.mus-page`, behind an envelope; the 3-slide feed takes text from `src/data/ucapan-feed.ts`, drawn by lazy `src/lib/ucapan-feed-canvas.ts` (PNG = preview = download); why: no duplicated layout, slides match the letter, age never drifts.
- Public community applications and brand partnership proposals (the "Ajukan Kerja Sama" form on `/program`) must pass database-side field validation; site settings are admin-only, and public ticket reads require both an active ticket and an active parent event; why: direct Data API requests must not bypass form validation or reveal unpublished records.
- Friendship moment portfolios use browser-safe data, a scoped global CSS theme, a dedicated metadata leaf route mounting NempoShell, and the shared wall-message validator with session-only messages; scene variations use the same generated group photo as an edit reference and each member has a standalone AI portrait made from their likeness, never a crop; why: category content stays consistent, faces remain recognizable, and previews never pretend to save messages publicly.
- Interactive yearbook memories use a focused browser-only UI and shared tested helpers; time capsules persist only in local device storage with downloadable backups, and sample farewell video uses the existing AI school photos; why: examples must work without pretending to send private letters or provide real class footage.
- Personal yearbook features use shared tested voting and quiz helpers; demo votes stay device-local, dream groups reference existing student aspirations, and Story cards are drawn on a canvas (`src/lib/story-card-canvas.ts`, loaded lazily) whose PNG is both the preview and the download; why: keep sample content honest, keep browser-only code out of SSR, and make the saved file match the preview on every browser including iOS.
- The whole NEMPO site (main pages and `/cms`; the Nempo Feed tool was later removed at the owner's request so the project holds only the organizer site) was migrated from nempocreative/nempo-web (originally nempocreative/remix-of-remix-of-remix-of-remix-of-nempo-feed-migration-4); its schema was rebuilt from the old generated types and is recorded in `docs/schema-baseline/` (0000 full schema, 0001 visitor privileges, 0002 yearbook photo submissions, 0003 selected public-access policy fixes, 0004 partnership proposals); why: the source repo carried no migrations, so those files are the schema of record.
- Migrated from nempocreative/nempo-web-15 (earlier nempo-web-13/14): migration `0000_nempo_baseline` is the full baseline (database/nempo-database.sql + lomba + portfolio_events); buckets via storage tool; later migrations only add/change; anon policies never call `has_role`; why: re-running baseline fails and anon cannot run `has_role`.
- CMS admin is granted only by the `on_auth_user_confirmed_grant_admin` trigger (verified email in `admin_allowlist`) or an existing admin; login takes email or admin alias (`src/apps/cms/lib/admin-login.ts`); why: migrated admins get new auth IDs and must prove email ownership.
- Media pointers under `src/assets/` must be this project's own storage (re-upload via `lovable-assets create`); why: foreign pointers break once published.
- Page-level routing inside the NEMPO app goes through `src/lib/wouter.tsx`, a wouter-compatible API backed by TanStack Router; why: keeps one router without rewriting every page. New pages are added to the `Switch` in `src/nempo-app.tsx`.
- tsconfig strict extras (noUncheckedIndexedAccess, exactOptionalPropertyTypes, etc.) are off; why: the imported code was written without them.
- Lazily loaded pages and apps use `lazyWithRetry` from `src/lib/lazy-with-retry.ts` instead of React `lazy`; why: a page file that fails to load after an update otherwise blanks the whole screen — it retries once, then reloads once. Do not call preventDefault on Vite's `vite:preloadError`; it makes the import resolve empty and React crashes with a blank screen.
- The back-office is mounted at `/admin` (canonical, reachable on the owner's own domain) and legacy `/cms`, both through `src/apps/cms/lib/base.ts` which derives the router base from the address; the old `/cms`, `/backup` and `/api/backup` addresses answer 404 on published domains via `src/lib/hosting-lock.ts` wired into Start `requestMiddleware` in `src/start.ts`; why: the owner wants one clean admin address while keeping the rest of the tooling preview-only.
- Program proposals (`/program/<slug>`) list in browser-safe `src/data/program.ts`; each deck's slides live under `src/program/<slug>/` sized with container units (cqw/cqh) inside a 16:9 `.psg-stage`, load lazily only after the access code is accepted by a server function (kept in page memory only, so leaving or reloading asks again) whose codes stay in `src/lib/program-access.server.ts`; why: imported Replit slide decks keep their exact layout at any screen size and the code never ships to browsers (the slide files themselves are still public, so this is a light lock, not strong secrecy).
- Some subdirectories have their own `AGENTS.md` (`src/apps/`, `scripts/ggs-hair-studio/`); read the nearest one before changing files there; why: those rules are scoped to that folder.
- Garut Beans (G-Beans) is a static app from nempocreative/Garut-Coffee-166, rebuilt by `scripts/garut-beans/build.sh` into `public/garut-beans/` (never hand-edit) and served at `/garut-beans/*` from generated `src/lib/garut-beans-shell.ts`; Clerk accounts are guest-only shims; upstream is unreachable here, so later additions (swaying sheep from `public/garut-beans-patch/`, card swipe) are injected by `src/lib/garut-beans-patch.ts`; why: no host of its own, deep links survive refresh, rebuilds keep the additions.
- Garut Beans layout patches live in the rebuild scripts (quick access in the footer); why: rebuilds must keep the tidy layout.
- New cultural proposal decks keep editorial content in a browser-safe module with scoped theme tokens, reuse the tested slide navigation and server-only proposal lock, and mark unconfirmed logistics as proposals; why: cards and slides stay consistent without claiming an event is already confirmed.
- Cultural proposal budget totals and funding targets derive from typed estimates in their content module, and listed slide counts derive from the deck data; why: sponsorship, costs, and cover counts must agree when the proposal changes.
- The owner removed the old tourism-portal features (wisata, kuliner/cafe, penginapan, transportasi, vouchers and points, merchant/mitra accounts and shopping, influencer hub, kamus Sunda, visitor login/accounts and wishlist) from pages, CMS and the public API, while their database tables stay; `src/apps/cms/lib/removed-features.test.ts` guards the CMS; why: the site is an organizer site only, and the tables are kept in case the data is wanted later.
- Nempo's own events live in `portfolio_events` (admin `/admin/acara`, uploads: private bucket `event-posters` served by `/api/public/event-poster/<file>`, seeds keyed by `builtin_poster` into `src/data/event-portfolio.ts`, merged unless a row covers/hides them) and feed Beranda, Portofolio and Riwayat (merged with past ticketed `events` in `src/lib/event-history.ts`, as 4:5 post cards); why: owner edits events sans code; public buckets blocked.
- Photos shown small on the home page use pre-shrunk WebP copies (`src/assets/home-thumbs/`, `src/assets/momen-digital/`) while detail pages keep the full files, and large site photos are kept at most 1600px; why: the home page must not download full-size photos for ~190px cards.
- Beranda explainer video plays from an effect keyed to its on-screen state (not the observer callback) and site videos are 720p H.264 (CRF ~27, faststart, about 1-2 Mbps); why: early play() freezes on the poster, big files stall the page and lower resolutions look pixelated.
- Scroll deer pair: math in `src/lib/scroll-deer-path.ts` (tested), rAF sleeps when settled, idle CSS, perch on the search bar top edge; why: smooth, deer sit above search.
- Carousel player tracks visibility, resets inactive slides and unlocks sound on gestures; why: clean autoplay resumes on every return.
- Page changes show `LogoLoader` via `RouteTransition` in `__root.tsx`, also used as the NEMPO page loader; tested `shouldShowTransition` decides when; why: one brand moment, never stacked on the home splash.
- Install prompts share `src/lib/install-app.ts` (manifest-only, no service worker); why: one install offer, same behavior.
