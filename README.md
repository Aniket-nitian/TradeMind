# TradeMind AI

TradeMind AI is a trading journal built for Indian traders — the kind of tool I wanted myself: log trades, see where the money is actually being lost or made, and get coaching that's grounded in your own history instead of generic advice. It handles broker sync, portfolio tracking, and subscriptions through Razorpay.

## Live application

| Service            | URL                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------- |
| Web app            | [trademind-web-y2om.onrender.com](https://trademind-web-y2om.onrender.com)             |
| API (Swagger docs) | [trademind-api-y2om.onrender.com/docs](https://trademind-api-y2om.onrender.com/docs)   |
| AI service (docs)  | [trademind-ai-y2om.onrender.com/docs](https://trademind-ai-y2om.onrender.com/docs)     |

Hosted on Render's free tier, so the API and AI service spin down when idle. If nobody's hit them in a while, the first request wakes the container back up and can take 30-50 seconds — the app shows a "waking up the server" message in that window instead of just hanging.

Payments run in Razorpay Test Mode (no business KYC behind this project), so Upgrade to Premium works end to end with the test card `4718 6091 0820 4366` and any future expiry/CVV.

## What it does

The core is a trading journal: full trade CRUD, notes, checklists, emotion tagging on each trade, image attachments, and CSV import for Groww, Zerodha, Fyers and Angel One (plus a generic fallback for anything else). On top of that sits an analytics dashboard covering win rate, PnL, expectancy, equity curve, drawdown, a calendar heatmap and streaks.

The part I spent the most time on is the AI layer — a set of Gemini/LangGraph agents that actually look at a user's own trades rather than giving canned answers: a daily brief, a trade review agent, a psychology coach that flags behavioral patterns, a strategy advisor, a performance coach, journal insight generation, and a conversational assistant that keeps long-term memory and does RAG over the user's journal entries.

Beyond that: live broker sync (currently Dhan, built with a provider interface so more brokers can be added), portfolio tracking with a capital ledger and daily snapshots, Razorpay subscriptions with usage gating on the free plan, in-app and email notifications, and auth via email/password or Google OAuth with refresh handled through httpOnly cookies.

## Tech stack

| Layer      | Stack                                                          |
| ---------- | ----------------------------------------------------------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand |
| Backend    | Node.js, Express, TypeScript, PostgreSQL, Prisma               |
| AI service | Python, FastAPI, LangGraph, LangChain, Google Gemini            |
| Infra      | Docker, Docker Compose, GitHub Actions, Render, Neon            |

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

One detail worth explaining: the web app proxies API calls through its own origin instead of the browser hitting `trademind-api` directly. `trademind-web` and `trademind-api` are separate Render services on different subdomains, and browsers treat different `onrender.com` subdomains as different sites — so the login session's refresh-token cookie would be third-party and browsers routinely clear those on a restart. Routing `/api/*` through the same origin (a rewrite rule in `render.yaml`) keeps the cookie first-party. Locally, `infrastructure/nginx/nginx.conf` does the same job.

## Monorepo layout

```
apps/
  web/            React frontend (Vite)
services/
  api/            Express + Prisma backend
  ai/             FastAPI AI service (LangGraph agents)
infrastructure/
  docker/         Dockerfiles referenced by docker-compose
  nginx/          nginx config for the local web container
  scripts/        container entrypoint scripts
```

pnpm workspace (`apps/*`, `services/*`, `packages/*`), built with Turborepo.

## Local development

You'll need Node 22+, pnpm 10, Python 3.13, and PostgreSQL.

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

Brings up Postgres, the API, the AI service and the frontend together at `http://localhost:3000`. Check `docker-compose.yml` for service wiring and the env vars each one expects.

## Deployment

`render.yaml` is the deployment blueprint:

- `trademind-api` — Node/Express backend (Docker)
- `trademind-ai` — FastAPI AI service (Docker)
- `trademind-web` — static site serving the built frontend, with a rewrite rule proxying `/api/*` to `trademind-api`

Postgres runs on a separate free [Neon](https://neon.tech) project rather than Render's own Postgres, since Neon doesn't expire after 30 days.
