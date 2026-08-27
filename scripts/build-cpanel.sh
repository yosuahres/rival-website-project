#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

: "${NEXT_PUBLIC_SITE_URL:=https://arek.its.ac.id/rival}"
: "${NEXT_PUBLIC_BASE_PATH:=/rival}"
export NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_BASE_PATH
echo "==> Building for ${NEXT_PUBLIC_SITE_URL}"

rm -rf out rival-site.zip
pnpm build

cp deploy/.htaccess out/.htaccess

(cd out && zip -qr ../rival-site.zip . -x '.DS_Store' -x '__MACOSX/*')

echo "==> $(du -h rival-site.zip | cut -f1) -> rival-site.zip"
echo "    Upload to public_html/ in cPanel File Manager, then Extract."
