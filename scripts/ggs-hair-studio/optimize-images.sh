#!/usr/bin/env bash
# Owner request: GGS photos and icons are shrunk so the site loads light. Runs on the built copy
# (public/ggs-hair-studio) after every rebuild; names and formats stay the same, so no link changes.
# A file is only replaced when the smaller copy is actually smaller.
# Usage: bash optimize-images.sh <built site dir>
set -euo pipefail
DIR="$1"
TMP="$(mktemp -d)"
before=$(du -sb "$DIR" | cut -f1)
keep_smaller() { # <new> <original>
  if [ -s "$1" ] && [ "$(stat -c%s "$1")" -lt "$(stat -c%s "$2")" ]; then mv "$1" "$2"; else rm -f "$1"; fi
}
while IFS= read -r -d '' f; do
  out="$TMP/o.jpg"
  # Team portraits show at most ~360px wide (3 per row); 720px stays sharp on phone screens.
  case "$f" in */team/*) size='720x>' ;; *) size='1400x1400>' ;; esac
  magick "$f" -auto-orient -strip -resize "$size" -sampling-factor 4:2:0 -interlace JPEG -quality 76 "$out"
  keep_smaller "$out" "$f"
done < <(find "$DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) -print0)
while IFS= read -r -d '' f; do
  out="$TMP/o.webp"
  h=$(identify -format '%h' "$f[0]")
  # Menu icons render ~64px wide: 160px retains detail on high-density screens.
  case "$f" in */menu-icons/*) limit=160; quality=72 ;; *) limit=320; quality=80 ;; esac
  if [ "$h" -gt "$limit" ]; then cwebp -quiet -q "$quality" -alpha_q 85 -m 6 -resize 0 "$limit" "$f" -o "$out"; else cwebp -quiet -q "$quality" -alpha_q 85 -m 6 "$f" -o "$out"; fi
  keep_smaller "$out" "$f"
done < <(find "$DIR" -type f -iname '*.webp' -print0)
while IFS= read -r -d '' f; do
  out="$TMP/o.png"
  magick "$f" -strip -define png:compression-level=9 -define png:compression-filter=5 "$out"
  keep_smaller "$out" "$f"
done < <(find "$DIR" -type f -iname '*.png' -print0)
rm -rf "$TMP"
after=$(du -sb "$DIR" | cut -f1)
echo "GGS images: $((before / 1024)) KB -> $((after / 1024)) KB"
