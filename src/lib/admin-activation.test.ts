import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = readFileSync(resolve(process.cwd(), "docs/schema-baseline/0000_nempo_garut_schema.sql"), "utf8");

const loginPage = readFileSync(resolve(process.cwd(), "src/apps/cms/pages/Login.tsx"), "utf8");

describe("verified CMS admin activation", () => {
  it("offers the activation entry from the sign-in screen", () => {
    expect(loginPage).toMatch(/\{mode!=='activate'&&<button type="button" onClick=\{\(\)=>switchMode\('activate'\)\}[^>]*>Aktifkan akun<\/button>/);
  });

  it("restores the role-granting trigger on email confirmation", () => {
    expect(baseline).toMatch(/CREATE TRIGGER on_auth_user_confirmed_grant_admin\s+AFTER INSERT OR UPDATE OF email_confirmed_at ON auth\.users\s+FOR EACH ROW EXECUTE FUNCTION public\.grant_allowlisted_admin\(\)/);
  });

  it("requires both verified email ownership and an allowlist entry", () => {
    const grant = baseline.slice(baseline.indexOf("CREATE OR REPLACE FUNCTION public.grant_allowlisted_admin()"), baseline.indexOf("CREATE TRIGGER on_auth_user_confirmed_grant_admin"));
    expect(grant).toMatch(/IF NEW\.email_confirmed_at IS NOT NULL AND NEW\.email IS NOT NULL\s+AND EXISTS \(SELECT 1 FROM public\.admin_allowlist WHERE email = lower\(NEW\.email\)\) THEN\s+INSERT INTO public\.user_roles/);
  });
});