# Multi-stage Dockerfile for Next.js Web Storefront
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Enable pnpm (matching lockfile version)
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy workspace definitions, config, and Web source
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY apps/web ./apps/web

# Install dependencies with hoisting enabled
RUN pnpm install --frozen-lockfile

# Build Next.js application via workspace filter
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm --filter @impextech/web build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 4000

CMD ["node", "apps/web/server.js"]
