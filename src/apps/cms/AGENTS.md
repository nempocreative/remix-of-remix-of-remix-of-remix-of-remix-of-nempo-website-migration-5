# Rules for `src/apps/cms/` (the back-office at `/admin`, legacy `/cms`)

- The back-office reads and writes Lovable Cloud tables directly through `src/apps/cms/lib/api.ts`, signs in with email/password, and only admits users with an `admin` row in `user_roles` (enforced by RLS via `has_role`); why: the old external Garut API no longer exists and client-side gates cannot protect data.
- Never hardcode the mount address: take it from `cmsBase()` in `src/apps/cms/lib/base.ts`, which returns `/admin` (canonical) or `/cms` (legacy) from the browser address; why: the same app must work under both addresses.
