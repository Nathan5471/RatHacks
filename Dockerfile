FROM node:22 AS frontend
WORKDIR /frontend
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apt-get update && apt-get install -y chromium --no-install-recommends && rm -rf /var/lib/apt/lists/*
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install
COPY frontend/ ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN pnpm run build

FROM node:22 AS backend
WORKDIR /backend
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml ./
RUN pnpm install
COPY backend/ ./
COPY --from=frontend /frontend/dist ./public
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    tzdata \
    gnupg2 \
    wget \
    && ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata \
    && mkdir -p /etc/apt/keyrings \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/keyrings/postgresql.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get install -y postgresql-client-18 \
    && rm -rf /var/lib/apt/lists/*
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate
RUN pnpm run build

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]