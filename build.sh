#!/usr/bin/env sh
# Une los archivos de src/ en una sola página: index.html
set -e
cd "$(dirname "$0")"
{
  echo '<!doctype html>'
  echo '<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'
  cat src/head.html
  echo '<script>'
  cat src/data.js src/ui.js src/landing.js src/public.js src/community.js src/sections.js src/gamification.js src/app.js
  echo '</script>'
  echo '</body></html>'
} > index.html
echo "index.html generado"
