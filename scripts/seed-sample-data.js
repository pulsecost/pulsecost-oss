#!/usr/bin/env node

/**
 * Sample data generation script for OptiLM Dashboard
 * This script generates sample API usage data to populate the dashboard charts
 */

const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'opti_lm',
  user: 'opti_lm',
  password: 'opti_lm',
};

// Sample API keys
const sampleApiKeys = [
  { id: 'key-001', key_prefix: 'sk-abc123', description: 'Development Key' },
  { id: 'key-002', key_prefix: 'sk-def456', description: 'Production Key' },
  { id: 'key-003', key_prefix: 'sk-ghi789', description: 'Testing Key' },
];

// Sample models
const models = [
  'gpt-4',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'claude-3-sonnet',
];

// Generate sample data for the last 30 days
function generateSampleData() {
  const data = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate 5-15 calls per day
    const numCalls = Math.floor(Math.random() * 11) + 5;

    for (let j = 0; j < numCalls; j++) {
      const apiKey =
        sampleApiKeys[Math.floor(Math.random() * sampleApiKeys.length)];
      const model = models[Math.floor(Math.random() * models.length)];

      // Generate random token counts
      const promptTokens = Math.floor(Math.random() * 2000) + 100;
      const completionTokens = Math.floor(Math.random() * 1000) + 50;
      const totalTokens = promptTokens + completionTokens;

      // Generate cost based on model and tokens
      let costPerToken = 0.00003; // Default for GPT-3.5
      if (model === 'gpt-4') costPerToken = 0.00006;
      if (model === 'claude-3-sonnet') costPerToken = 0.000015;

      const cost = totalTokens * costPerToken;

      // Generate random latency
      const latency = Math.floor(Math.random() * 2000) + 500;

      // Random cache hit
      const cacheHit = Math.random() < 0.3;

      data.push({
        id: `call-${dateStr}-${j}`,
        ts: new Date(date.getTime() + j * 60000).toISOString(),
        model,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost,
        cache_hit: cacheHit,
        latency_ms: latency,
        api_key_id: apiKey.id,
      });
    }
  }

  return data;
}

async function seedDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log('Clearing existing data...');
    await client.query('DELETE FROM call_logs');
    await client.query('DELETE FROM api_keys');

    console.log('Inserting sample API keys...');
    for (const key of sampleApiKeys) {
      await client.query(
        `
        INSERT INTO api_keys (id, key_prefix, created_at, is_active, description)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          key.id,
          key.key_prefix,
          new Date().toISOString(),
          true,
          key.description,
        ]
      );
    }

    console.log('Generating sample call logs...');
    const callLogs = generateSampleData();

    console.log(`Inserting ${callLogs.length} call logs...`);
    for (const log of callLogs) {
      await client.query(
        `
        INSERT INTO call_logs (
          id, ts, model, prompt_tokens, completion_tokens, 
          total_tokens, cost, cache_hit, latency_ms, api_key_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
        [
          log.id,
          log.ts,
          log.model,
          log.prompt_tokens,
          log.completion_tokens,
          log.total_tokens,
          log.cost,
          log.cache_hit,
          log.latency_ms,
          log.api_key_id,
        ]
      );
    }

    console.log('✅ Sample data generated successfully!');
    console.log(
      `📊 Generated ${callLogs.length} call logs across ${sampleApiKeys.length} API keys`
    );
    console.log('🌐 You can now view the dashboard at http://localhost:3001');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, generateSampleData };
