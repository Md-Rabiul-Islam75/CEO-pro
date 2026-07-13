#!/bin/sh
set -e

# Apply any pending database migrations before the app accepts traffic.
# Prisma reads the connection from prisma.config.ts (DATABASE_URL or DB_* env).
echo "→ Applying database migrations (prisma migrate deploy)…"
npx prisma migrate deploy

echo "→ Starting Next.js on port ${PORT:-8011}…"
# Next standalone server (built with output: "standalone").
exec node server.js
