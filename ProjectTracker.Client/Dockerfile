# ProjectTracker.Client/Dockerfile

# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL=/api        # relative path — nginx handles routing
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Output Stage ----
# Just expose the built files — nginx picks them up via a shared volume
FROM alpine AS export
COPY --from=build /app/dist /dist