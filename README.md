# TradeMind AI

A production-grade AI-powered trading journal for Indian traders. TradeMind AI helps traders log and analyze their trades, surface behavioral mistakes, manage strategies, and get AI-driven coaching grounded in their own trading history — with broker sync, portfolio tracking, and Razorpay-backed subscriptions built in.

## Features

- **Trading journal** — trade CRUD, journal notes, checklists, emotion tagging, image attachments, CSV import (Groww/Zerodha/Fyers/Angel One + generic fallback)
- **Analytics dashboard** — win rate, PnL, expectancy, equity curve, drawdown, calendar heatmap, streaks, and more
- **AI coaching** (Gemini + LangGraph) — daily brief, trade review, psychology coach, strategy advisor, performance coach, journal insights, conversational chat assistant with long-term memory and RAG over your own journal entries
- **Broker integration** — live trade sync (Dhan, with a modular provider architecture for adding more)
- **Portfolio tracking** — capital ledger, holdings, daily snapshots, allocation analytics
- **Subscriptions** — Razorpay-backed Premium plan with usage gating
- **Notifications** — in-app + email, daily/weekly summaries

## Tech stack

| Layer      | Stack                                                              |
| ---------- | ------------------------------------------------------------------- |
| Frontend   | React, TypeScript, Vite, Tailwind CSS                                |
| Backend    | Node.js, Express, TypeScript, PostgreSQL, Prisma                    |
| AI service | Python, FastAPI, LangGraph, LangChain, Google Gemini                |
| Infra      | Docker, Docker Compose, GitHub Actions                              |

## Monorepo layout

```
apps/
  web/            React frontend (Vite)
services/
  api/            Express + Prisma backend
  ai/             FastAPI AI service (LangGraph agents)
infrastructure/
  docker/         Dockerfiles referenced by docker-compose
  nginx/          nginx config for the web container
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
pnpm --filter api dev      # http://localhost:5000
pnpm --filter web dev      # http://localhost:5173

cd services/ai
python -m venv .venv && .venv/Scripts/activate  # or source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Running with Docker

```bash
docker compose up --build
```

Brings up Postgres, the API, the AI service, and the frontend together. See `docker-compose.yml` for service wiring and required environment variables.

## Deployment

See `render.yaml` for the deployment blueprint (Render for the API/AI services and static frontend hosting, Neon for managed Postgres).
