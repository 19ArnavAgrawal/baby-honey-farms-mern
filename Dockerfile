# Multi-stage production build for Baby Honey Farms MERN Application
FROM node:22-alpine AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend/ ./backend/
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

# Express serves frontend static assets in production if desired
EXPOSE 8080

CMD ["node", "backend/src/server.js"]
