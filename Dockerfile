FROM node:22 AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:22 AS backend
WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
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
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]