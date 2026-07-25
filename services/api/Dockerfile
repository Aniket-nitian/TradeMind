# Build context is the repo root (needed for pnpm workspace files).
# docker build -f services/api/Dockerfile .

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY services/api/package.json services/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile --filter api...

COPY services/api services/api
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build

# Keep the full install (including devDependencies) in the runtime image:
# `prisma migrate deploy` needs the `prisma` CLI package at container start,
# and it's a devDependency, not a prod one.
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/services/api/node_modules ./services/api/node_modules
COPY --from=build /repo/services/api/dist ./services/api/dist
COPY --from=build /repo/services/api/package.json ./services/api/package.json
COPY --from=build /repo/services/api/prisma.config.ts ./services/api/prisma.config.ts
COPY --from=build /repo/services/api/prisma ./services/api/prisma

WORKDIR /repo/services/api
EXPOSE 5000

COPY infrastructure/scripts/api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
RUN chmod +x /usr/local/bin/api-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/api-entrypoint.sh"]
