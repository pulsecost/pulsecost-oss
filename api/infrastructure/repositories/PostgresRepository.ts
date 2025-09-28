import {
  Repository,
  CallLog,
  ReportDaily,
  ApiKey,
  ApiKeyUsage,
  ApiKeyReport,
} from '../../application/ports/Repository';
import { Pool } from 'pg';
import { ApiKeyManager } from '../../application/utils/ApiKeyManager';

export class PostgresRepository implements Repository {
  private pool: Pool;

  constructor(
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
  ) {
    this.pool = new Pool({
      host,
      port,
      user,
      password,
      database,
    });
  }

  async init(): Promise<void> {
    // Create api_keys table first (needed for foreign key reference)
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id VARCHAR(255) PRIMARY KEY,
        key_prefix VARCHAR(8) NOT NULL,
        key_hash TEXT NOT NULL UNIQUE,
        salt VARCHAR(64) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_used TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        description TEXT
      )
    `);

    // Create call_logs table (references api_keys)
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS call_logs (
        id VARCHAR(255) PRIMARY KEY,
        ts TIMESTAMP NOT NULL,
        model VARCHAR(255) NOT NULL,
        prompt_tokens INTEGER,
        completion_tokens INTEGER,
        total_tokens INTEGER,
        cost DECIMAL(10,6),
        cache_hit BOOLEAN DEFAULT FALSE,
        latency_ms INTEGER,
        api_key_id VARCHAR(255) REFERENCES api_keys(id)
      )
    `);

    // Create index for faster lookups
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix)
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_call_logs_api_key ON call_logs(api_key_id)
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_call_logs_ts ON call_logs(ts)
    `);
  }

  async saveCallLog(log: CallLog): Promise<void> {
    await this.pool.query(
      `INSERT INTO call_logs (id, ts, model, prompt_tokens, completion_tokens, total_tokens, cost, cache_hit, latency_ms, api_key_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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

  async listCallLogs(limit = 100, offset = 0): Promise<CallLog[]> {
    const result = await this.pool.query(
      `SELECT * FROM call_logs ORDER BY ts DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows.map(
      row =>
        ({
          id: row.id,
          ts: row.ts.toISOString(),
          model: row.model,
          prompt_tokens: row.prompt_tokens,
          completion_tokens: row.completion_tokens,
          total_tokens: row.total_tokens,
          cost: row.cost ? parseFloat(row.cost) : undefined,
          cache_hit: row.cache_hit,
          latency_ms: row.latency_ms,
        }) as CallLog
    );
  }

  async getCallLogs(
    from: string,
    to: string,
    model?: string
  ): Promise<CallLog[]> {
    // Convert date strings to full day range (start of day to end of day)
    const fromDate = new Date(from + 'T00:00:00.000Z');
    const toDate = new Date(to + 'T23:59:59.999Z');

    let query = `
      SELECT * FROM call_logs 
      WHERE ts >= $1 AND ts <= $2
    `;
    const params: any[] = [fromDate.toISOString(), toDate.toISOString()];

    if (model) {
      query += ` AND model ILIKE $3`;
      params.push(`%${model}%`);
    }

    query += ` ORDER BY ts DESC`;

    const result = await this.pool.query(query, params);
    return result.rows.map(
      row =>
        ({
          id: row.id,
          ts: row.ts.toISOString(),
          model: row.model,
          prompt_tokens: row.prompt_tokens,
          completion_tokens: row.completion_tokens,
          total_tokens: row.total_tokens,
          cost: row.cost ? parseFloat(row.cost) : undefined,
          cache_hit: row.cache_hit,
          latency_ms: row.latency_ms,
        }) as CallLog
    );
  }

  async getDailyReports(from: string, to: string): Promise<ReportDaily[]> {
    // Convert date strings to full day range (start of day to end of day)
    const fromDate = new Date(from + 'T00:00:00.000Z');
    const toDate = new Date(to + 'T23:59:59.999Z');

    const result = await this.pool.query(
      `
      SELECT 
        DATE(ts) as date,
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        COALESCE(SUM(cost), 0) as cost,
        COALESCE(AVG(CASE WHEN cache_hit THEN 1.0 ELSE 0.0 END), 0) as cache_hit_rate,
        COALESCE(SUM(cost * CASE WHEN cache_hit THEN 0.3 ELSE 0.0 END), 0) as saved_estimate
      FROM call_logs 
      WHERE ts >= $1 AND ts <= $2
      GROUP BY DATE(ts)
      ORDER BY DATE(ts)
    `,
      [fromDate.toISOString(), toDate.toISOString()]
    );

    return result.rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      total_tokens: parseInt(row.total_tokens),
      cost: parseFloat(row.cost),
      cache_hit_rate: parseFloat(row.cache_hit_rate),
      saved_estimate: parseFloat(row.saved_estimate),
    }));
  }

  // API Key Management Methods

  async createApiKeyFromRequest(
    apiKey: string,
    description?: string
  ): Promise<ApiKey> {
    const keyData = await ApiKeyManager.createApiKey(apiKey, description);
    const id = ApiKeyManager.generateKeyId();
    const now = new Date().toISOString();

    await this.pool.query(
      `INSERT INTO api_keys (id, key_prefix, key_hash, salt, created_at, is_active, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        id,
        keyData.key_prefix,
        keyData.key_hash,
        keyData.salt,
        now,
        true,
        description,
      ]
    );

    return {
      id,
      key_prefix: keyData.key_prefix,
      key_hash: keyData.key_hash,
      salt: keyData.salt,
      created_at: now,
      is_active: true,
      description: description || undefined,
    };
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    const result = await this.pool.query(
      `SELECT * FROM api_keys WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      key_prefix: row.key_prefix,
      key_hash: row.key_hash,
      salt: row.salt,
      created_at: row.created_at.toISOString(),
      last_used: row.last_used?.toISOString(),
      is_active: row.is_active,
      description: row.description,
    };
  }

  async listApiKeys(): Promise<ApiKey[]> {
    const result = await this.pool.query(
      `SELECT * FROM api_keys ORDER BY created_at DESC`
    );

    return result.rows.map(row => ({
      id: row.id,
      key_prefix: row.key_prefix,
      key_hash: row.key_hash,
      salt: row.salt,
      created_at: row.created_at.toISOString(),
      last_used: row.last_used?.toISOString(),
      is_active: row.is_active,
      description: row.description,
    }));
  }

  async updateApiKeyLastUsed(id: string): Promise<void> {
    await this.pool.query(
      `UPDATE api_keys SET last_used = NOW() WHERE id = $1`,
      [id]
    );
  }

  async deactivateApiKey(id: string): Promise<void> {
    await this.pool.query(
      `UPDATE api_keys SET is_active = FALSE WHERE id = $1`,
      [id]
    );
  }

  // API Key Usage Tracking Methods

  async getApiKeyUsage(from: string, to: string): Promise<ApiKeyUsage[]> {
    const fromDate = new Date(from + 'T00:00:00.000Z');
    const toDate = new Date(to + 'T23:59:59.999Z');

    const result = await this.pool.query(
      `
      SELECT 
        ak.id as api_key_id,
        ak.key_prefix,
        COALESCE(SUM(cl.total_tokens), 0) as total_tokens,
        COALESCE(SUM(cl.cost), 0) as total_cost,
        COUNT(cl.id) as call_count,
        MAX(cl.ts) as last_used
      FROM api_keys ak
      LEFT JOIN call_logs cl ON ak.id = cl.api_key_id 
        AND cl.ts >= $1 AND cl.ts <= $2
      WHERE ak.is_active = TRUE
      GROUP BY ak.id, ak.key_prefix
      ORDER BY COALESCE(SUM(cl.cost), 0) DESC
      `,
      [fromDate.toISOString(), toDate.toISOString()]
    );

    return result.rows.map(row => ({
      api_key_id: row.api_key_id,
      key_prefix: row.key_prefix,
      total_tokens: parseInt(row.total_tokens),
      total_cost: parseFloat(row.total_cost),
      call_count: parseInt(row.call_count),
      last_used: row.last_used?.toISOString(),
    }));
  }

  async getApiKeyDailyReports(
    from: string,
    to: string
  ): Promise<ApiKeyReport[]> {
    const fromDate = new Date(from + 'T00:00:00.000Z');
    const toDate = new Date(to + 'T23:59:59.999Z');

    const result = await this.pool.query(
      `
      SELECT 
        ak.id as api_key_id,
        ak.key_prefix,
        DATE(cl.ts) as date,
        COALESCE(SUM(cl.total_tokens), 0) as total_tokens,
        COALESCE(SUM(cl.cost), 0) as cost,
        COUNT(cl.id) as call_count
      FROM api_keys ak
      LEFT JOIN call_logs cl ON ak.id = cl.api_key_id 
        AND cl.ts >= $1 AND cl.ts <= $2
      WHERE ak.is_active = TRUE
      GROUP BY ak.id, ak.key_prefix, DATE(cl.ts)
      ORDER BY DATE(cl.ts), COALESCE(SUM(cl.cost), 0) DESC
      `,
      [fromDate.toISOString(), toDate.toISOString()]
    );

    return result.rows.map(row => ({
      api_key_id: row.api_key_id,
      key_prefix: row.key_prefix,
      date: row.date.toISOString().split('T')[0],
      total_tokens: parseInt(row.total_tokens),
      cost: parseFloat(row.cost),
      call_count: parseInt(row.call_count),
    }));
  }

  async getApiKeyUsageById(
    apiKeyId: string,
    from: string,
    to: string
  ): Promise<ApiKeyUsage | null> {
    const fromDate = new Date(from + 'T00:00:00.000Z');
    const toDate = new Date(to + 'T23:59:59.999Z');

    const result = await this.pool.query(
      `
      SELECT 
        ak.id as api_key_id,
        ak.key_prefix,
        COALESCE(SUM(cl.total_tokens), 0) as total_tokens,
        COALESCE(SUM(cl.cost), 0) as total_cost,
        COUNT(cl.id) as call_count,
        MAX(cl.ts) as last_used
      FROM api_keys ak
      LEFT JOIN call_logs cl ON ak.id = cl.api_key_id 
        AND cl.ts >= $1 AND cl.ts <= $2
      WHERE ak.id = $3 AND ak.is_active = TRUE
      GROUP BY ak.id, ak.key_prefix
      `,
      [fromDate.toISOString(), toDate.toISOString(), apiKeyId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      api_key_id: row.api_key_id,
      key_prefix: row.key_prefix,
      total_tokens: parseInt(row.total_tokens),
      total_cost: parseFloat(row.total_cost),
      call_count: parseInt(row.call_count),
      last_used: row.last_used?.toISOString(),
    };
  }

  async getApiKeyByHash(keyHash: string): Promise<ApiKey | null> {
    const result = await this.pool.query(
      `SELECT * FROM api_keys WHERE key_hash = $1`,
      [keyHash]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      key_prefix: row.key_prefix,
      key_hash: row.key_hash,
      salt: row.salt,
      created_at: row.created_at.toISOString(),
      last_used: row.last_used?.toISOString(),
      is_active: row.is_active,
      description: row.description,
    };
  }
}
