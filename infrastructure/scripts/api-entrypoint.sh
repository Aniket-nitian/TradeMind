#!/bin/sh
set -e

pnpm exec prisma migrate deploy

exec node dist/server.js
