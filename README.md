# TradeMind AI

A production-grade AI-powered trading journal for Indian traders. TradeMind AI helps traders log and analyze their trades, surface behavioral mistakes, manage strategies, and get AI-driven coaching grounded in their own trading history — with broker sync, portfolio tracking, and Razorpay-backed subscriptions built in.

## Live application

| Service            | URL                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| Web app            | [trademind-web-y2om.onrender.com](https://trademind-web-y2om.onrender.com)      |
| API (Swagger docs) | [trademind-api-y2om.onrender.com/docs](https://trademind-api-y2om.onrender.com/docs) |
| AI service (docs)  | [trademind-ai-y2om.onrender.com/docs](https://trademind-ai-y2om.onrender.com/docs) |

> Hosted on Render's free tier — the API and AI service spin down after periods of inactivity, so the first request after a while can take up to ~30s to wake up.
>
> Payments run in Razorpay **Test Mode** (no real business KYC on this project) — the Upgrade to Premium flow works end-to-end with Razorpay's test card `4718 6091 0820 4366` (any future expiry, any CVV).

## Features

- **Trading journal** — trade CRUD, journal notes, checklists, emotion tagging, image attachments, CSV import (Groww/Zerodha/Fyers/Angel One + generic fallback)
- **Analytics dashboard** — win rate, PnL, expectancy, equity curve, drawdown, calendar heatmap, streaks, and more
- **AI coaching** (Gemini + LangGraph) — daily brief, trade review, psychology coach, strategy advisor, performance coach, journal insights, conversational chat assistant with long-term memory and RAG over your own journal entries
- **Broker integration** — live trade sync (Dhan, with a modular provider architecture for adding more)
- **Portfolio tracking** — capital ledger, holdings, daily snapshots, allocation analytics
- **Subscriptions** — Razorpay-backed Premium plan with usage gating
- **Notifications** — in-app + email, daily/weekly summaries
- **Auth** — email/password and Google OAuth, with session refresh via httpOnly cookies

## Tech stack

| Layer      | Stack                                                              |
| ---------- | ------------------------------------------------------------------- |
| Frontend   | React, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand       |
| Backend    | Node.js, Express, TypeScript, PostgreSQL, Prisma                    |
| AI service | Python, FastAPI, LangGraph, LangChain, Google Gemini                |
| Infra      | Docker, Docker Compose, GitHub Actions, Render, Neon                 |

## Architecture

```
Browser
  │
  ├─▶ trademind-web (static site)
  │     serves the built React SPA
  │     rewrites /api/*  ──▶ trademind-api
  │
  └─▶ trademind-ai (FastAPI, called directly with a Bearer token)

trademind-api ──▶ Neon Postgres (pooled connection for queries,
                   direct connection for `prisma migrate deploy`)
trademind-api ──▶ Razorpay (subscriptions), Cloudinary (images), SMTP (email)
```

The web app rewrites API calls through its own origin (a Render static-site rewrite rule, see `render.yaml`) rather than the browser calling `trademind-api` directly. This keeps the login session's refresh-token cookie first-party — `trademind-web` and `trademind-api` are separate Render services on different subdomains, which browsers treat as different *sites*, and a cross-site cookie is routinely blocked or cleared by browsers on a full restart. Locally, `infrastructure/nginx/nginx.conf` does the same thing via an nginx `proxy_pass`.

## Monorepo layout

```
apps/
  web/            React frontend (Vite)
services/
  api/            Express + Prisma backend
  ai/             FastAPI AI service (LangGraph agents)
infrastructure/
  docker/         Dockerfiles referenced by docker-compose
  nginx/          nginx config for the local web container (mirrors the Render rewrite rule)
  scripts/        container entrypoint scripts
```

Managed as a pnpm workspace (`apps/*`, `services/*`, `packages/*`) orchestrated with Turborepo.

## Local development

Requirements: Node 22+, pnpm 10, Python 3.13, PostgreSQL.

```bash
pnpm install

cp services/api/.env.example services/api/.env
cp services/ai/.env.example services/ai/.env
cp apps/web/.env.example apps/web/.env
# fill in the values in each .env

pnpm --filter api exec prisma migrate deploy
pnpm --filter api dev      # http://localhost:5000  (Swagger: /docs)
pnpm --filter web dev      # http://localhost:5173

cd services/ai
python -m venv .venv && .venv/Scripts/activate  # or source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000  # http://localhost:8000 (Swagger: /docs)
```

## Running with Docker

```bash
docker compose up --build
```

Brings up Postgres, the API, the AI service, and the frontend together at `http://localhost:3000`. See `docker-compose.yml` for service wiring and required environment variables.

## Deployment

See `render.yaml` for the deployment blueprint:

- `trademind-api` — Node/Express backend (Docker)
- `trademind-ai` — FastAPI AI service (Docker)
- `trademind-web` — static site serving the built frontend, with a rewrite rule proxying `/api/*` to `trademind-api`

Postgres is a separate free [Neon](https://neon.tech) project (not declared in `render.yaml`) — Neon doesn't expire after 30 days the way Render's free Postgres does.
