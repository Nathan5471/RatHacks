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
RUN apt-get update && apt-get install -y netcat-openbsd
RUN apt-get install -y tzdata && ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]