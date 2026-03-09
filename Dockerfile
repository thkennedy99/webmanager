# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Force development mode so all deps (including devDependencies) are installed
ENV NODE_ENV=development

COPY package.json package-lock.json* .npmrc* ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Payload needs DATABASE_URL at build time for schema introspection
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build in production mode (deps already installed with devDependencies above)
ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove this line if you do not have this folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
ENV HOSTNAME="0.0.0.0"
