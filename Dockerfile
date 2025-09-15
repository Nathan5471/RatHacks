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
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]