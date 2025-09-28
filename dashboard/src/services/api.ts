// API service for fetching data from the backend

// Type definitions
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
  api_key_id?: string;
}

export interface ReportDaily {
  date: string;
  total_tokens: number;
  cost: number;
  cache_hit_rate: number;
  saved_estimate: number;
}

export interface SettingsView {
  db_driver: 'sqlite' | 'mysql' | 'postgres';
  ttl_secs?: number;
  openai_base?: string;
  version?: string;
}

export interface ApiKey {
  id: string;
  key_prefix: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
  description?: string;
}

export interface ApiKeyUsage {
  api_key_id: string;
  key_prefix: string;
  total_tokens: number;
  total_cost: number;
  call_count: number;
  last_used?: string;
}

export interface ApiKeyReport {
  api_key_id: string;
  key_prefix: string;
  date: string;
  total_tokens: number;
  cost: number;
  call_count: number;
}
