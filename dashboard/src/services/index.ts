// API service for fetching data from the backend
import {
  CallLog,
  ReportDaily,
  SettingsView,
  ApiKey,
  ApiKeyUsage,
  ApiKeyReport,
} from './api';

// TypeScript DOM types for RequestInit
type FetchOptions = RequestInit;

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const fetchWithErrorHandling = async <T>(
  url: string,
  options?: FetchOptions
): Promise<T> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout');
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const apiService = {
  getDailyReport: async (
    from: string,
    to: string
  ): Promise<{ days: ReportDaily[] }> => {
    const url = `${API_BASE_URL}/reports/daily?from=${from}&to=${to}`;
    return fetchWithErrorHandling(url);
  },

  getLogs: async (
    from: string,
    to: string,
    model?: string
  ): Promise<{ items: CallLog[]; total: number }> => {
    const params = new URLSearchParams({ from, to });
    if (model) params.append('model', model);
    const url = `${API_BASE_URL}/logs?${params}`;
    return fetchWithErrorHandling(url);
  },

  getConfig: async (): Promise<SettingsView> => {
    const url = `${API_BASE_URL}/config`;
    return fetchWithErrorHandling(url);
  },

  getApiKeys: async (): Promise<ApiKey[]> => {
    const url = `${API_BASE_URL}/api-keys`;
    return fetchWithErrorHandling(url);
  },

  getApiKeyUsage: async (from: string, to: string): Promise<ApiKeyUsage[]> => {
    const url = `${API_BASE_URL}/api-keys/usage?from=${from}&to=${to}`;
    return fetchWithErrorHandling(url);
  },

  getApiKeyDailyReports: async (
    from: string,
    to: string
  ): Promise<ApiKeyReport[]> => {
    const url = `${API_BASE_URL}/api-keys/reports/daily?from=${from}&to=${to}`;
    return fetchWithErrorHandling(url);
  },
};

export function service() {
  return apiService;
}
