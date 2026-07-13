# syntax=docker/dockerfile:1
#
# CEO-pro — Next.js 16 (standalone) + Prisma 7 (Postgres, pg adapter) + sharp.
# Multi-stage build producing a lean runtime image. Uploads live in Postgres,
# so the image is stateless.
#

# ---- Base: Node 20 (Debian slim) + openssl (Prisma schema engine) ----
FROM node:20-slim AS base
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- Dependencies (cached layer) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder: generate the Prisma client, then build Next (standalone) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate \
 && npm run build

# ---- Migrator deps: a small, self-contained Prisma CLI closure used only to
#      run `prisma migrate deploy` at container start (kept out of the app bundle) ----
FROM base AS migrator
WORKDIR /m
RUN npm init -y >/dev/null 2>&1 \
 && npm install --omit=dev --no-audit --no-fund \
      prisma@7.8.0 @prisma/adapter-pg@7.8.0 dotenv@17.4.2

# ---- Runner: production image ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next standalone server + assets (self-contained; minimal node_modules).
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prisma migration toolchain (merged into node_modules) + schema/config, so the
# entrypoint can run `prisma migrate deploy`. Also ensure the generated client
# and sharp binaries are present for the runtime.
COPY --from=migrator /m/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder /app/node_modules/@img ./node_modules/@img
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Entrypoint (normalise line endings in case of a CRLF checkout on Windows).
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs \
 && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
