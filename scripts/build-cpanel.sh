#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

: "${NEXT_PUBLIC_SITE_URL:=https://rival.its.ac.id}"
export NEXT_PUBLIC_SITE_URL
echo "==> Building for ${NEXT_PUBLIC_SITE_URL}"

rm -rf out rival-site.zip
pnpm build

cp deploy/.htaccess out/.htaccess

(cd out && zip -qr ../rival-site.zip . -x '.DS_Store' -x '__MACOSX/*')

echo "==> $(du -h rival-site.zip | cut -f1) -> rival-site.zip"
echo "    Upload to public_html/ in cPanel File Manager, then Extract."
