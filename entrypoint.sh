#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  echo "PostgreSQL is still starting..."
  sleep 2
done
echo "PostgreSQL is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting backend server..."
node dist/index.js