# Build context is the repo root (needed for pnpm workspace files).
# docker build -f apps/web/Dockerfile --build-arg VITE_API_URL=... --build-arg VITE_AI_URL=... .
#
# Mirrors production (render.yaml): serves the built SPA and proxies /api/*
# to the API service through this same origin (see server.js), so the API's
# refreshToken cookie is first-party instead of a cross-site cookie browsers
# can block or clear on restart.

FROM node:22-alpine
RUN corepack enable
WORKDIR /repo

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY services/api/package.json services/api/package.json
RUN pnpm install --frozen-lockfile --filter web...

COPY apps/web apps/web

ARG VITE_API_URL
ARG VITE_AI_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_AI_URL=${VITE_AI_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

RUN pnpm --filter web build

WORKDIR /repo/apps/web
EXPOSE 10000
CMD ["node", "server.js"]
