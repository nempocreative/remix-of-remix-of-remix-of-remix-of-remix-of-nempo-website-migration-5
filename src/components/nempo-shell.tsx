import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { ClientOnly } from "@tanstack/react-router";
import { LogoLoader } from "@/components/logo-loader";

const NempoApp = lazyWithRetry(() => import("@/nempo-app"));

function Loader() {
  return <LogoLoader />;
}

export function NempoShell() {
  // Files that fail to load after an update are retried, then reloaded once, by lazyWithRetry.
  // Never preventDefault Vite's "vite:preloadError" here: that makes the import resolve empty and blanks the page.
  return (
    <div id="root">
      <ClientOnly fallback={<Loader />}>
        <Suspense fallback={<Loader />}>
          <NempoApp />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
