# Imagem de desenvolvimento: Node 24 LTS + pnpm (via corepack). O código entra por volume.
FROM node:24.22.1-bookworm-slim

RUN corepack enable
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    CI=true
RUN pnpm config set store-dir /pnpm-store --global

WORKDIR /app
