import {
  Repository,
  CallLog,
  ReportDaily,
  ApiKey,
  ApiKeyUsage,
  ApiKeyReport,
} from '../../application/ports/Repository';

export class MySqlRepository implements Repository {
  constructor(
    _host: string,
    _port: number,
    _user: string,
    _password: string,
    _database: string
  ) {
    // TODO: Initialize MySQL connection properly
    // MySQL Repository initialized for: { host, port, database }
  }

  async init(): Promise<void> {
    // TODO: Implement MySQL table creation
    // MySQL init called
  }

  async saveCallLog(_log: CallLog): Promise<void> {
    // TODO: Implement MySQL save with proper connection handling
    // Saving to MySQL: log
  }

  async listCallLogs(_limit = 100, _offset = 0): Promise<CallLog[]> {
    // TODO: Implement MySQL query with proper connection handling
    // Querying MySQL logs: { limit, offset }
    return [];
  }

  async getCallLogs(
    _from: string,
    _to: string,
    _model?: string
  ): Promise<CallLog[]> {
    // TODO: Implement MySQL query with proper connection handling
    // Querying MySQL logs with filters: { from, to, model }
    return [];
  }

  async getDailyReports(_from: string, _to: string): Promise<ReportDaily[]> {
    // TODO: Implement MySQL query with proper connection handling
    // Querying MySQL daily reports: { from, to }
    return [];
  }

  async createApiKeyFromRequest(
    _apiKey: string,
    _description?: string
  ): Promise<ApiKey> {
    throw new Error('API key management not implemented for MySQL');
  }

  async getApiKeyById(_id: string): Promise<ApiKey | null> {
    throw new Error('API key management not implemented for MySQL');
  }

  async listApiKeys(): Promise<ApiKey[]> {
    throw new Error('API key management not implemented for MySQL');
  }

  async updateApiKeyLastUsed(_id: string): Promise<void> {
    throw new Error('API key management not implemented for MySQL');
  }

  async deactivateApiKey(_id: string): Promise<void> {
    throw new Error('API key management not implemented for MySQL');
  }

  async getApiKeyUsage(_from: string, _to: string): Promise<ApiKeyUsage[]> {
    throw new Error('API key management not implemented for MySQL');
  }

  async getApiKeyDailyReports(
    _from: string,
    _to: string
  ): Promise<ApiKeyReport[]> {
    throw new Error('API key management not implemented for MySQL');
  }

  async getApiKeyUsageById(
    _apiKeyId: string,
    _from: string,
    _to: string
  ): Promise<ApiKeyUsage | null> {
    throw new Error('API key management not implemented for MySQL');
  }

  async getApiKeyByHash(_keyHash: string): Promise<ApiKey | null> {
    throw new Error('API key management not implemented for MySQL');
  }
}
