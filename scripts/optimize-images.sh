#!/usr/bin/env bash
# Re-encodes the heavyweight photography in public/images as WebP sized for
# how it is actually displayed.
#
# The originals were camera/export resolution — team cut-outs at 2828x4000 for
# a 256px circle, sponsor logos at 3072x3072 for a 250px slot. next/image will
# resize those on request, but it still has to decode the full original once
# per variant, which is what made the first paint of /teams crawl.
#
# Targets carry roughly 3-4x headroom over the largest rendered size, so they
# stay sharp on high-density screens. Alpha is preserved; logos get a higher
# quality because flat colour and hard type show WebP artefacts sooner than
# photographs do.
#
# Requires macOS `sips` and `cwebp` (brew install webp). Writes .webp beside
# each source and deletes the original — re-run only after restoring sources.
set -euo pipefail

cd "$(dirname "$0")/.."

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# path glob : longest edge : cwebp quality
JOBS=(
  "public/images/teams/*/*.png:1024:82"          # roster cut-outs, shown <=256px
  "public/images/teams/hero-background.png:1920:80"
  "public/images/partners/*/*.png:800:90"        # sponsor logos, shown <=250px
  "public/images/partners/divider-*.jp*g:1920:80"
  "public/images/partners/hero-background.jpg:1920:80"
)

before=0
after=0
for job in "${JOBS[@]}"; do
  glob=${job%%:*}
  rest=${job#*:}
  edge=${rest%%:*}
  quality=${rest##*:}

  for src in $glob; do
    [ -f "$src" ] || continue
    out="${src%.*}.webp"
    before=$((before + $(stat -f%z "$src")))

    sips -Z "$edge" "$src" --out "$TMP/resized.png" >/dev/null 2>&1
    cwebp -q "$quality" -m 6 -quiet "$TMP/resized.png" -o "$out"

    after=$((after + $(stat -f%z "$out")))
    [ "$src" = "$out" ] || rm "$src"
    printf "%-52s -> %s\n" "$src" "$(du -h "$out" | cut -f1 | tr -d ' ')"
  done
done

printf "\n%s MB -> %s MB\n" $((before / 1048576)) $((after / 1048576))
