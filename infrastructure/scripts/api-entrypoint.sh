#!/bin/sh
set -e

# Neon's free-tier compute suspends after inactivity; the first connection
# after a suspend can take longer to wake than migrate's advisory-lock
# timeout allows, so retry a couple of times before giving up.
attempt=1
until pnpm exec prisma migrate deploy; do
  if [ "$attempt" -ge 3 ]; then
    echo "prisma migrate deploy failed after $attempt attempts"
    exit 1
  fi
  attempt=$((attempt + 1))
  echo "prisma migrate deploy failed, retrying ($attempt/3)..."
  sleep 5
done

exec node dist/server.js
