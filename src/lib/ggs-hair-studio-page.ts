import { GGS_HTML } from "@/lib/ggs-hair-studio-shell";

/** Link-preview tags that need the site's own address (absolute image and page URLs). */
export function ggsShareTags(request: Request): string {
  const url = new URL(request.url);
  const origin = url.origin;
  const page = `${origin}${url.pathname}`;
  const image = `${origin}/ggs-hair-studio/og-image.jpg`;
  return [
    `<link rel="canonical" href="${page}" />`,
    `<meta property="og:url" content="${page}" />`,
    `<meta property="og:site_name" content="GGS Hair Studio" />`,
    `<meta property="og:locale" content="id_ID" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Logo GGS Hair Studio — Sebelum gunting, kita ngobrol." />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n    ");
}

/**
 * Serves the GGS Hair Studio page shell; its own router then shows the right screen for
 * any /ggs-hair-studio/* path. Open to every visitor (no access code).
 */
export async function ggsHairStudioPage(request: Request): Promise<Response> {
  const html = GGS_HTML.replace("</head>", `  ${ggsShareTags(request)}\n  </head>`);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
  });
}
