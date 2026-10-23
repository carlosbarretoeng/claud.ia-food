# Imagem de desenvolvimento: Node 24 LTS + pnpm (via corepack). O código entra por volume.
FROM node:24.22.1-bookworm-slim

RUN corepack enable \
    && mkdir -p /pnpm /pnpm-store /app \
    && chown node:node /pnpm /pnpm-store /app
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_HOME=/pnpm/corepack \
    CI=true

# Roda como o usuário "node" (uid 1000, o mesmo do usuário do WSL): arquivos criados
# no repositório ficam com o dono certo, não com root.
USER node
RUN pnpm config set store-dir /pnpm-store --global

WORKDIR /app
