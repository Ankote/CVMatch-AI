# frontend/Dockerfile
FROM node:18 AS build

WORKDIR /app
COPY frontend/ ./

RUN npm install
RUN npm run build
