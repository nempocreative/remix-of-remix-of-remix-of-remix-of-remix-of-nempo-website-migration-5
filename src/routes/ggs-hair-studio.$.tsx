import { createFileRoute } from "@tanstack/react-router";
import { ggsHairStudioPage } from "@/lib/ggs-hair-studio-page";

// Deep links like /ggs-hair-studio/book load the same page so a refresh never 404s.
export const Route = createFileRoute("/ggs-hair-studio/$")({
  server: { handlers: { GET: async ({ request }) => ggsHairStudioPage(request) } },
});
