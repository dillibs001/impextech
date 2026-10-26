# Multi-stage Dockerfile for Vendure Backend API
FROM node:20-alpine AS builder

WORKDIR /app

# Install native build tools for sharp, bcrypt, better-sqlite3
RUN apk add --no-cache python3 make g++ libc6-compat

# Enable pnpm (matching lockfile version)
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy workspace definitions, config, and API source
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/
COPY apps/api ./apps/api

# Install monorepo dependencies with hoisting enabled
RUN pnpm install --frozen-lockfile

# Build API TypeScript to dist via workspace filter
RUN pnpm --filter @impextech/api build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV PORT=4001

# Copy compiled artifacts and production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/static ./apps/api/static

WORKDIR /app/apps/api

EXPOSE 4001

CMD ["node", "dist/index.js"]
