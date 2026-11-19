import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { isPosterFileName, POSTER_BUCKET } from "@/lib/portfolio-events";

// Poster acara yang diunggah admin. Folder penyimpanannya tertutup, jadi situs
// ini yang mengantarkan gambarnya — hanya dari folder poster acara.
const TYPES: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

export const Route = createFileRoute("/api/public/event-poster/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const name = params._splat ?? "";
        if (!isPosterFileName(name)) return new Response("Not found", { status: 404 });
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return new Response("Not found", { status: 404 });
        const sb = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });
        const { data, error } = await sb.storage.from(POSTER_BUCKET).download(name);
        if (error || !data) return new Response("Not found", { status: 404 });
        const ext = name.split(".").pop()!;
        return new Response(data, {
          headers: {
            "content-type": TYPES[ext] ?? "application/octet-stream",
            // Nama file selalu baru untuk tiap unggahan, jadi aman disimpan lama.
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
