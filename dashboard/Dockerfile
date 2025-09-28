# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY dashboard/package.json ./dashboard/
COPY model/package.json ./model/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN pnpm --filter @pulsecost-oss/model build
RUN pnpm --filter @pulsecost-oss/dashboard build

# Run stage
FROM nginx:alpine AS runner

# Copy built files
COPY --from=builder /app/dashboard/dist /usr/share/nginx/html

# Copy nginx config
COPY dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
