FROM node:lts-alpine AS base

# Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat 
WORKDIR /app
ARG NEXT_PUBLIC_APP_URL
ARG GITLAB_ACCESS_TOKEN
COPY ./package*.json ./
COPY ./.npmrc ./

RUN npm i

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm install -g json
RUN json -I -f package.json -e "this.homepage=\"$NEXT_PUBLIC_APP_URL\""
RUN npm i sharp

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]