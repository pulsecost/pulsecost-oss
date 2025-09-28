# pulsecost-oss

**pulsecost-oss** · Proxy + Dashboard for **optimizing LLM usage costs**

[![CI](https://github.com/pulsecost/pulsecost-oss/actions/workflows/ci.yml/badge.svg)](https://github.com/pulsecost/pulsecost-oss/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-v0.2.0-blue)](https://github.com/pulsecost/pulsecost-oss/releases)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](./LICENSE)

## 📋 Table of Contents

- [📌 About](#-about)
- [✨ Features (Phase-1)](#-features-phase-1)
- [🚀 Quickstart (Local Dev)](#-quickstart-local-dev)
  - [Database UIs](#database-uis)
- [🖥️ Dashboard](#-dashboard)
  - [📸 Screenshots](#-screenshots)
  - [🎯 Key Features](#-key-features)
  - [📊 Dashboard Sections](#-dashboard-sections)
  - [🚀 Running the Dashboard](#-running-the-dashboard)
  - [🎨 UI Features](#-ui-features)
  - [📱 Navigation](#-navigation)
- [🔐 API Key Management](#-api-key-management)
  - [🔒 Hash-Based Lookup System](#-hash-based-lookup-system)
  - [🎯 Key Features](#-key-features-1)
  - [📊 API Key Analytics](#-api-key-analytics)
- [🧪 Test the Proxy](#-test-the-proxy)
- [🔧 Technical Implementation](#-technical-implementation)
  - [API Key Security](#api-key-security)
- [🏗️ Architecture](#️-architecture)
- [🤝 Contributing](#-contributing)
- [🔒 Security](#-security)
- [⚖️ License](#️-license)

---

## 📌 About

LLM costs can spiral quickly. **pulsecost-oss** helps you take control:

- Logs every call (tokens, latency, cost, cache hit/miss)
- Adds caching to avoid duplicate spend
- Estimates savings vs baseline
- Provides a simple dashboard with KPIs, charts, and logs
- Works with multiple databases (Postgres)

Built with a clean **hexagonal architecture**, so you can swap storage, cache, or provider backends easily.

---

## ✨ Features (Phase-1)

- Proxy for `/v1/chat/completions` and `/v1/embeddings`
- Minimal cost tracking
- Dashboard with KPIs, charts, logs, and config view
- Dev/prod Docker Compose setup

---

## 🚀 Quickstart (Local Dev)

Clone and install:

```bash
git clone https://github.com/pulsecost/pulsecost-oss.git
cd pulsecost-oss
pnpm install
```

Copy env template (no server-side API key required):

```bash
cp .env.example .env
# No server-side API key required - clients provide their own keys
```

Run API + Dashboard with Docker Compose (SQLite default):

```bash
docker compose -f docker/compose.dev.yml --profile all up --build
```

### Database UIs

The development environment now includes database inspection UIs by default:

```bash
# Start development with database UIs (default)
make docker-dev

# Start development with database UIs (no cache)
make docker-dev-no-cache

# Start only database UIs
make docker-db-ui
```

**Available UIs:**

- **pgAdmin** (PostgreSQL): http://localhost:5050
  - Email: `admin@example.com`
  - Password: `admin`
- **phpMyAdmin** (MySQL): http://localhost:8080
  - User: `pulsecost`
  - Password: `pulsecost`

API: [http://localhost:3000](http://localhost:3000)  
Dashboard: [http://localhost:3001](http://localhost:3001)

Health check:

```bash
curl http://localhost:3000/health
```

Version endpoint:

```bash
curl http://localhost:3000/version
```

---

## 🖥️ Dashboard

The PulseCost dashboard provides a comprehensive view of your LLM usage, costs, and performance metrics with a clean, modern interface.

### 📸 Screenshots

#### Main Dashboard Overview

![PulseCost Dashboard](screenshots/dashboard.png)

#### Logs

![Logs](screenshots/logs.png)

#### API Key Analytics

![API Key Analytics](screenshots/api-key-analytics.png)

### 🎯 Key Features

- **Real-time Analytics**: Live tracking of token usage and costs
- **Interactive Charts**: Visualize usage patterns with AmCharts-powered graphs
- **API Key Management**: Track usage and costs per API key with hash-based identification
- **Cost Management**: Monitor spending with detailed cost breakdowns
- **Model Insights**: Track usage across different AI models (GPT-4, GPT-3.5, Claude)
- **Activity Logs**: Detailed logs of all API calls and responses with key attribution
- **Responsive Design**: Clean, modern UI that works on all devices

### 📊 Dashboard Sections

#### Key Performance Indicators (KPIs)

- **Total Tokens**: Aggregate token usage over selected time period
- **Total Cost**: Total spending in your preferred currency
- **Average Daily**: Daily token consumption average
- **Cost Efficiency**: Cost per 1K tokens for optimization insights

#### Usage Analytics

- **Interactive Line Chart**: Visualize token usage and costs over time
- **Dual Y-Axis**: Separate scales for tokens (left) and costs (right)
- **Hover Details**: Detailed tooltips on chart interaction
- **Date Range Filtering**: Switch between 7-day and 30-day views

#### Recent Activity

- **Daily Summary**: Last 5 days of usage with token counts and costs
- **Quick Overview**: At-a-glance recent performance metrics

#### Model Distribution

- **Usage Breakdown**: Percentage of requests per AI model
- **Performance Tracking**: Monitor which models are most used

#### Cost Trends

- **Weekly/Monthly/Quarterly**: Track cost changes over different time periods
- **Trend Indicators**: Visual indicators for cost increases/decreases

#### API Key Analytics

- **Usage by Key**: Track token consumption and costs per API key
- **Key Performance**: Monitor response times and success rates per key
- **Cost Attribution**: See spending breakdown by individual API keys
- **Key Management**: View and manage all active API keys

### 🚀 Running the Dashboard

**Development (hot reload):**

```bash
cd dashboard
pnpm dev
```

**Production (Docker):**

```bash
docker build -t pulsecost-oss-dashboard ./dashboard
docker run -p 8080:80 pulsecost-oss-dashboard
```

**With Docker Compose:**

```bash
# Development with hot reload
docker compose -f docker/compose.dev.yml up dashboard

# Production
docker compose -f docker/compose.prod.yml up dashboard
```

### 🎨 UI Features

- **Modern Design**: Clean, professional interface inspired by community dashboard designs
- **Light Theme**: Optimized for readability and reduced eye strain
- **Responsive Layout**: Adapts to different screen sizes
- **Collapsible Sidebar**: Space-efficient navigation
- **Interactive Elements**: Hover effects and smooth transitions
- **Google Fonts**: Professional typography with Inter font family

### 📱 Navigation

- **Dashboard**: Main overview with KPIs and charts
- **Analytics**: Detailed usage analytics and trends
- **Activity**: Comprehensive logs of all API calls
- **Settings**: Configuration and system settings

The dashboard is served via Nginx with SPA route fallback for seamless navigation.

---

## 🔐 Client API Key Management

PulseCost operates as a **transparent proxy** where each client provides their own OpenAI API key:

### 🔒 Client-Driven Authentication

- **Authorization Header**: Clients pass their API key via `Authorization: Bearer <key>`
- **Per-Request Keys**: Each API call uses the client's provided key
- **No Server Storage**: PulseCost never stores or manages API keys
- **True Proxy Behavior**: Direct pass-through to OpenAI with usage tracking

### 🎯 Key Features

- **Client Isolation**: Each client uses their own OpenAI account and billing
- **Usage Tracking**: Monitor usage patterns per client API key
- **Cost Attribution**: Track costs and savings per client
- **Hash-Based Identification**: Secure key identification without storing keys

### 📊 API Key Analytics

The dashboard provides detailed insights into client API key usage:

- **Usage by Key**: Track token consumption per client API key
- **Cost Attribution**: See spending breakdown by client
- **Performance Metrics**: Monitor response times and success rates
- **Activity Logs**: Detailed logs of all API calls with client key identification

![API Key Management](screenshots/api-key-management.png)

---

## 🧪 Test the Proxy

**Important**: You must provide your own OpenAI API key via the `Authorization` header.

Chat completions:

```bash
curl -s http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-openai-api-key" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      { "role": "user", "content": "Hello, test proxy!" }
    ],
    "temperature": 0
  }' | jq
```

Embeddings:

```bash
curl -s http://localhost:3000/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-openai-api-key" \
  -d '{
    "model": "text-embedding-3-small",
    "input": "hello world"
  }' | jq
```

**Error Examples**:

Without API key:

```bash
curl -s http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4", "messages": [{"role": "user", "content": "Hello"}]}'
# Returns: {"error": "API key is required"}
```

With invalid API key:

```bash
curl -s http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-invalid-key" \
  -d '{"model": "gpt-4", "messages": [{"role": "user", "content": "Hello"}]}'
# Returns: {"error": "Invalid OpenAI API key: Incorrect API key provided: sk-inval*********-key"}
```

---

## 🔧 Technical Implementation

### Client API Key Security

PulseCost implements a secure client-driven API key system:

#### Authorization Header Processing

```typescript
// Extract client API key from Authorization header
private extractApiKey(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
}

// Pass client key to OpenAI gateway
const response = await this.inferenceGateway.chatCompletion(request, apiKey);
```

#### Hash-Based Tracking (for Analytics)

```typescript
// Deterministic hash generation for consistent lookup
static async createDeterministicHash(apiKey: string): Promise<string> {
  const fixedSalt = Buffer.from('api-key-lookup-salt', 'utf8');
  return await argon2.hash(apiKey, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
    salt: fixedSalt,
  });
}
```

#### Database Schema

```sql
CREATE TABLE api_keys (
  id VARCHAR(255) PRIMARY KEY,
  key_prefix VARCHAR(8) NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,  -- Deterministic hash for lookup
  salt VARCHAR(64) NOT NULL,      -- Random salt for compatibility
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_used TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT
);
```

#### Security Features

- **Client-Provided Keys**: Each request uses the client's own OpenAI API key
- **No Server Storage**: PulseCost never stores or manages API keys
- **Hash-Based Tracking**: Uses deterministic hashing for usage analytics
- **Transparent Proxy**: Direct pass-through to OpenAI with original error responses
- **Client Isolation**: Each client's usage is tracked separately

#### Key Benefits

- **True Proxy Behavior**: Clients use their own OpenAI accounts and billing
- **Security**: No server-side API key management reduces attack surface
- **Performance**: Direct hash lookup for analytics is O(1) operation
- **Deduplication**: Same client API key creates only one database entry for tracking

---

## 🏗️ Architecture

```
                  +-------------------+
                  |   Dashboard (UI)  |
                  +---------+---------+
                            |
                            v
+------------+      +-------+-------+       +-------------+
|   Client   | ---> |   pulsecost-oss     | --->  |   Provider  |
| (your app) |      |   Proxy API   |       |  (OpenAI)   |
+------------+      +-------+-------+       +-------------+
                            |
                  +---------+---------+
                  |  Database (logs)  |
                  +-------------------+
```

- **api/** → proxy service (Express, hexagonal architecture)
- **dashboard/** → Vite + React UI
- **model/** → Zod schemas (shared contracts)
- **common/** → utilities (logger, etc.)
- **docker/** → dev & prod Compose configs

---

## 🤝 Contributing

1. Fork and clone
2. `pnpm install`
3. `docker compose -f docker/compose.dev.yml --profile all up`
4. Make changes in a feature branch
5. Open a PR 🚀

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more.

---

## 🔒 Security

If you find a vulnerability, please read [SECURITY.md](./SECURITY.md) and report it responsibly.

---

## ⚖️ License

This project is licensed under the [AGPL v3](./LICENSE).

In short:

- ✅ Free to use and self-host
- ✅ Changes to the source must be shared under AGPL
- ✅ Prevents closed-source SaaS forks
