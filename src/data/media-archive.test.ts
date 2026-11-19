import { describe, expect, it } from "vitest";
import {
  MEDIA_ARCHIVE_ENTRIES,
  MEDIA_ARCHIVE_ID,
  mediaArchiveByFilename,
  mediaArchiveUpsertSql,
} from "./media-archive";

describe("media archive manifest", () => {
  it("keeps all 11 media files that have a storage pointer", () => {
    expect(MEDIA_ARCHIVE_ENTRIES).toHaveLength(11);
  });

  it("records a checksum, a size and a pointer for every file", () => {
    for (const entry of MEDIA_ARCHIVE_ENTRIES) {
      expect(entry.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(entry.size).toBeGreaterThan(0);
      expect(entry.pointer).toMatch(/^src\/assets\/.+\.asset\.json$/);
      expect(entry.url).toMatch(/^\/__l5e\/assets-v1\/.+/);
    }
  });

  it("never repeats a filename", () => {
    const names = MEDIA_ARCHIVE_ENTRIES.map((entry) => entry.filename);
    expect(new Set(names).size).toBe(names.length);
  });

  it("finds the basecamp community photo by filename", () => {
    const entry = mediaArchiveByFilename("kalamuda-kegiatan-basecamp.jpg");
    expect(entry?.content_type).toBe("image/jpeg");
  });

  it("writes one re-runnable database record", () => {
    const sql = mediaArchiveUpsertSql();
    expect(sql).toContain("public.media_archive");
    expect(sql).toContain(MEDIA_ARCHIVE_ID);
    expect(sql).toContain("on conflict (id) do update");
    expect(sql).toContain("864dfc215a7efefc9bd6c7f36fd46cc9873c6cdf54c477eb51bf4fbd39093c51");
  });
});
