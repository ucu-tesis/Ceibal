#!/bin/sh
set -e

# /app/backend/wait-for-it.sh db:5432 -t 15 -- echo "Database ready!"

npm install
if [ "$DEBUG_INIT" != "true" ]; then
  npx prisma migrate deploy
  npx prisma generate
fi

if [ "$SEED_DATABASE" == "true" ]; then
  echo "Seeding database"
  npx prisma db seed
fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
