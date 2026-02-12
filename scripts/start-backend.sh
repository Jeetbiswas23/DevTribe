#!/usr/bin/env bash
# Helper to start backend from repo root. Copies .env.example to .env if missing (prompt) and runs dev server.
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR/backend"

if [ ! -f .env ]; then
  echo "\n⚠️  backend/.env not found. Please copy .env.example to .env and set MONGODB_URI and JWT_SECRET.\n"
  echo "You can do: cp .env.example .env && code .env"
  exit 1
fi

npm run dev
