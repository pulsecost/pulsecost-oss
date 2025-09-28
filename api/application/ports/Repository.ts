export interface CallLog {
  id: string;
  ts: string;
  model: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  cost?: number;
  cache_hit?: boolean;
  latency_ms?: number;
  api_key_id?: string | undefined; // Reference to the API key used
}

export interface ReportDaily {
  date: string;
  total_tokens: number;
  cost: number;
  cache_hit_rate: number;
  saved_estimate: number;
}

export interface ApiKey {
  id: string;
  key_prefix: string; // First 8 characters for identification
  key_hash: string; // Deterministic Argon2id hash for lookup
  salt: string; // Random salt for compatibility
  created_at: string;
  last_used?: string | undefined;
  is_active: boolean;
  description?: string | undefined;
}

export interface ApiKeyUsage {
  api_key_id: string;
  key_prefix: string;
  total_tokens: number;
  total_cost: number;
  call_count: number;
  last_used?: string | undefined;
}

export interface ApiKeyReport {
  api_key_id: string;
  key_prefix: string;
  date: string;
  total_tokens: number;
  cost: number;
  call_count: number;
}

export interface Repository {
  init(): Promise<void>;
  saveCallLog(log: CallLog): Promise<void>;
  listCallLogs(limit?: number, offset?: number): Promise<CallLog[]>;
  getCallLogs(from: string, to: string, model?: string): Promise<CallLog[]>;
  getDailyReports(from: string, to: string): Promise<ReportDaily[]>;

  // API Key management
  createApiKeyFromRequest(
    apiKey: string,
    description?: string
  ): Promise<ApiKey>;
  getApiKeyById(id: string): Promise<ApiKey | null>;
  listApiKeys(): Promise<ApiKey[]>;
  updateApiKeyLastUsed(id: string): Promise<void>;
  deactivateApiKey(id: string): Promise<void>;

  // API Key usage tracking
  getApiKeyUsage(from: string, to: string): Promise<ApiKeyUsage[]>;
  getApiKeyDailyReports(from: string, to: string): Promise<ApiKeyReport[]>;
  getApiKeyUsageById(
    apiKeyId: string,
    from: string,
    to: string
  ): Promise<ApiKeyUsage | null>;

  // API Key lookup
  getApiKeyByHash(keyHash: string): Promise<ApiKey | null>;
}
