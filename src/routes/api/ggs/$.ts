import { createFileRoute } from "@tanstack/react-router";
import { jawabanGgs } from "@/lib/ggs-hair-studio-api";

const balas = (request: Request, splat: string | undefined) => {
  const { status, body } = jawabanGgs(request.method, splat ?? "");
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
};

// Read-only stand-in for the GGS Hair Studio server used by /ggs-hair-studio.
export const Route = createFileRoute("/api/ggs/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => balas(request, params._splat),
      POST: async ({ request, params }) => balas(request, params._splat),
      PATCH: async ({ request, params }) => balas(request, params._splat),
      DELETE: async ({ request, params }) => balas(request, params._splat),
    },
  },
});
