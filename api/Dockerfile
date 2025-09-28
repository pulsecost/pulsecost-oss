# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api/package.json ./api/
COPY model/package.json ./model/
COPY common/package.json ./common/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN pnpm --filter @pulsecost-oss/model build
RUN pnpm --filter @pulsecost-oss/common build
RUN pnpm --filter @pulsecost-oss/api build

# Run stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Copy built packages
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/package.json ./api/
COPY --from=builder /app/model/dist ./model/dist
COPY --from=builder /app/model/package.json ./model/
COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/common/package.json ./common/

# Install dependencies to set up workspace
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "api/dist/main.js"]
