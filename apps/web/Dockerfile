# Build context is the repo root (needed for pnpm workspace files).
# docker build -f apps/web/Dockerfile --build-arg VITE_API_URL=... --build-arg VITE_AI_URL=... .
#
# This image is for local/self-host parity (docker-compose). The actual free-tier
# production deploy serves the same build output as a Render Static Site instead
# (see render.yaml) rather than running this nginx container.

FROM node:22-alpine AS build
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

FROM nginx:alpine
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
COPY infrastructure/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
