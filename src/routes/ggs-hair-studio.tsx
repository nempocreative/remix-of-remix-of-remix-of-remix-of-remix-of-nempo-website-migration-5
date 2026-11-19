import { createFileRoute } from "@tanstack/react-router";
import { ggsHairStudioPage } from "@/lib/ggs-hair-studio-page";

// GGS Hair Studio is a separate static web app built into public/ggs-hair-studio/.
export const Route = createFileRoute("/ggs-hair-studio")({
  server: { handlers: { GET: async ({ request }) => ggsHairStudioPage(request) } },
});
