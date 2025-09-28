# OptiLM - Minimal Makefile
.PHONY: help install dev build start lint format clean docker-dev docker-dev-no-cache docker-dev-with-ui docker-db-ui docker-prod docker-prod-no-cache docker-stop

help: ## Show available commands
	@echo "OptiLM - Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm dev

build: ## Build all packages
	pnpm build

start: ## Start production server
	pnpm start

lint: ## Run linting
	pnpm lint

format: ## Format code
	pnpm format

clean: ## Clean build artifacts
	rm -rf dist/ api/dist/ dashboard/dist/ model/dist/ common/dist/

check: ## Run all checks
	pnpm type-check && pnpm lint && pnpm build

docker-dev: ## Start development with Docker + Database UIs
	docker-compose -f docker/compose.dev.yml --profile all --profile db-ui up

docker-dev-no-cache: ## Start development with Docker + Database UIs (no cache)
	docker-compose -f docker/compose.dev.yml --profile all --profile db-ui build --no-cache
	docker-compose -f docker/compose.dev.yml --profile all --profile db-ui up

docker-db-ui: ## Start only database UIs (PostgreSQL + MySQL)
	docker-compose -f docker/compose.dev.yml --profile postgres --profile mysql --profile db-ui up

docker-prod: ## Start production with Docker
	docker-compose -f docker/compose.prod.yml --profile all up -d

docker-prod-no-cache: ## Start production with Docker (no cache)
	docker-compose -f docker/compose.prod.yml --profile all build --no-cache
	docker-compose -f docker/compose.prod.yml --profile all up -d

docker-stop: ## Stop all Docker containers and remove volumes
	docker-compose -f docker/compose.dev.yml down --volumes
	docker-compose -f docker/compose.prod.yml down --volumes