# PulseCost - Run Guide

## Prerequisites

- Node.js 22.12+ (use `nvm use` to switch to correct version)
- pnpm 8+
- Docker & Docker Compose (for containerized deployment)

## Quick Start

### Using Make (Recommended)

```bash
# Complete development setup
make dev-setup

# Quick start (install + create env + start dev)
make quick-start

# Show all available commands
make help
```

### Using pnpm directly

```bash
# Install dependencies
pnpm install

# Run in development
pnpm dev

# Run in production
pnpm build && pnpm start
```

## Development Environment

### Option 1: Full Stack (API + Dashboard)

```bash
# Start both API and Dashboard
pnpm dev

# Or start individually
pnpm --filter @pulsecost-oss/api dev      # API on :3000
pnpm --filter @pulsecost-oss/dashboard dev # Dashboard on :3001
```

### Option 2: Docker Development

```bash
# Full stack with hot reload
docker-compose -f docker/compose.dev.yml --profile all up

# API only
docker-compose -f docker/compose.dev.yml --profile api up

# Dashboard only
docker-compose -f docker/compose.dev.yml --profile dashboard up
```

### Environment Variables

Create `.env` file in project root:

```bash
# No server-side API key required - clients provide their own keys

# Optional (defaults shown)
PORT=3000
OPENAI_BASE_URL=https://api.openai.com/v1
DB_DRIVER=sqlite
DB_PATH=./data.sqlite

# For MySQL/PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=pulsecost
DB_PASSWORD=pulsecost
DB_NAME=pulsecost
```

### Testing the API

**Important**: You must provide your own OpenAI API key via the `Authorization` header.

```bash
# Test chat completions
curl -s http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-openai-api-key" \
  -d '{"model": "gpt-4", "messages": [{"role": "user", "content": "Hello"}]}'

# Test embeddings
curl -s http://localhost:3000/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-openai-api-key" \
  -d '{"model": "text-embedding-3-small", "input": "hello world"}'
```

## Production Environment

### Option 1: Docker Production

```bash
# Full stack production
docker-compose -f docker/compose.prod.yml --profile all up -d

# API only
docker-compose -f docker/compose.prod.yml --profile api up -d

# Dashboard only
docker-compose -f docker/compose.prod.yml --profile dashboard up -d
```

### Option 2: Local Production

```bash
# Build all packages
pnpm build

# Start API
pnpm --filter @pulsecost-oss/api start

# Start Dashboard (separate terminal)
pnpm --filter @pulsecost-oss/dashboard preview
```

## Database Setup

### PostgreSQL (Default)

- Database created automatically with Docker
- Default credentials: `pulsecost` / `pulsecost`

### MySQL

```bash
# Using Docker
docker-compose -f docker/compose.dev.yml --profile mysql up -d

# Or external MySQL
# Set DB_DRIVER=mysql and configure connection details
```

### PostgreSQL

```bash
# Using Docker
docker-compose -f docker/compose.dev.yml --profile postgres up -d

# Or external PostgreSQL
# Set DB_DRIVER=postgres and configure connection details
```

## API Endpoints

- **Health Check**: `GET /health`
- **Chat Completions**: `POST /v1/chat/completions`
- **Embeddings**: `POST /v1/embeddings`

## Dashboard

- **URL**: http://localhost:3001
- **Features**: Sample Zod schema parsing, cost tracking display

## Available Commands

### Using Make (Recommended)

```bash
# Development
make dev                    # Start API development
make dev-dashboard         # Start Dashboard development
make dev-all               # Start both API and Dashboard

# Building
make build                 # Build all packages
make build-api             # Build API only
make build-dashboard       # Build Dashboard only

# Production
make start                 # Start API production
make start-dashboard       # Start Dashboard production

# Code Quality
make lint                  # Lint all packages
make lint-fix             # Fix linting issues
make format               # Format code with Prettier
make format-check         # Check code formatting
make type-check           # Type check all packages
make check-errors         # Comprehensive error checking
make check-all            # Run all checks

# Docker
make docker-dev           # Full stack dev with Docker
make docker-prod          # Full stack prod with Docker
make docker-stop          # Stop all Docker containers

# Database
make db-setup             # Set up SQLite database
make db-mysql             # Start MySQL with Docker
make db-postgres          # Start PostgreSQL with Docker

# Utilities
make clean                # Clean build artifacts
make health               # Check project health
make info                 # Show project information
make help                 # Show all commands
```

### Using pnpm directly

```bash
# Development
pnpm dev                    # Start API
pnpm --filter @pulsecost-oss/dashboard dev  # Start Dashboard

# Building
pnpm build                  # Build all packages
pnpm --filter @pulsecost-oss/api build      # Build API only
pnpm --filter @pulsecost-oss/dashboard build # Build Dashboard only

# Production
pnpm start                  # Start API production
pnpm --filter @pulsecost-oss/dashboard preview # Preview Dashboard

# Code Quality
pnpm lint                   # Lint all packages
pnpm lint:fix              # Fix linting issues
pnpm format                # Format code with Prettier
pnpm format:check          # Check code formatting
pnpm type-check            # Type check all packages

# Docker
pnpm run docker:dev        # Full stack dev with Docker
pnpm run docker:prod       # Full stack prod with Docker
```

## Troubleshooting

### Common Issues

1. **Module not found errors**: Run `pnpm install` to ensure all dependencies are installed
2. **Port already in use**: Change PORT in `.env` or kill existing processes
3. **Database connection errors**: Check database credentials and ensure database is running
4. **OpenAI API errors**: Verify client API key is provided in Authorization header

### Logs

```bash
# View API logs
pnpm --filter @pulsecost-oss/api dev

# View Docker logs
docker-compose -f docker/compose.dev.yml logs -f api
docker-compose -f docker/compose.dev.yml logs -f dashboard
```

## Git Hooks

The project uses Husky for Git hooks:

- **Pre-commit**: Runs ESLint and Prettier on staged files
- **Commit-msg**: Validates commit messages using conventional commits

### Commit Message Format

Use conventional commit format:

```
type(scope): description

feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## Architecture

- **API**: Express.js with Hexagonal Architecture
- **Dashboard**: React + Vite + TypeScript
- **Database**: SQLite (default), MySQL, PostgreSQL
- **Validation**: Zod schemas
- **Logging**: Winston
- **Containerization**: Docker + Docker Compose
- **Code Quality**: ESLint + Prettier + Husky
