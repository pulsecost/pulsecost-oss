import { InferenceGateway } from '../ports/InferenceGateway';
import { Repository } from '../ports/Repository';
import {
  ChatRequest,
  ChatResponse,
  EmbeddingsRequest,
  EmbeddingsResponse,
} from '@pulsecost-oss/model';
import { calculateCost, extractTokensFromResponse } from '../utils/pricing';
import { logger } from '@pulsecost-oss/common';
import { ApiKeyManager } from '../utils/ApiKeyManager';

export class ProxyRequest {
  constructor(
    private inferenceGateway: InferenceGateway,
    private repository: Repository
  ) {}

  private async getOrCreateApiKey(apiKey: string): Promise<string | null> {
    try {
      // Create deterministic hash for lookup
      const keyHash = await ApiKeyManager.createDeterministicHash(apiKey);

      // First, try to find existing API key by hash
      const existingKey = await this.repository.getApiKeyByHash(keyHash);
      if (existingKey) {
        return existingKey.id;
      }

      // If not found, create a new one
      const createdKey = await this.repository.createApiKeyFromRequest(apiKey);
      return createdKey.id;
    } catch (error) {
      logger.error('Error getting or creating API key:', error);
      return null;
    }
  }

  async handleChatCompletion(
    request: ChatRequest,
    apiKey?: string
  ): Promise<ChatResponse> {
    const startTime = Date.now();
    const response = await this.inferenceGateway.chatCompletion(
      request,
      apiKey
    );

    const { inputTokens, outputTokens } = extractTokensFromResponse(response);
    const totalTokens = inputTokens + outputTokens;
    const cost = calculateCost(request.model, inputTokens, outputTokens);

    let apiKeyId: string | null = null;
    if (apiKey) {
      apiKeyId = await this.getOrCreateApiKey(apiKey);
      if (apiKeyId) {
        await this.repository.updateApiKeyLastUsed(apiKeyId);
      }
    }

    await this.repository.saveCallLog({
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      model: request.model,
      prompt_tokens: inputTokens,
      completion_tokens: outputTokens,
      total_tokens: totalTokens,
      cost,
      cache_hit: false,
      latency_ms: Date.now() - startTime,
      api_key_id: apiKeyId || undefined,
    });

    return response;
  }

  async handleEmbeddings(
    request: EmbeddingsRequest,
    apiKey?: string
  ): Promise<EmbeddingsResponse> {
    const startTime = Date.now();
    const response = await this.inferenceGateway.embeddings(request, apiKey);

    const { inputTokens, outputTokens } = extractTokensFromResponse(response);
    const totalTokens = inputTokens + outputTokens;
    const cost = calculateCost(request.model, inputTokens, outputTokens);

    let apiKeyId: string | null = null;
    if (apiKey) {
      apiKeyId = await this.getOrCreateApiKey(apiKey);
      if (apiKeyId) {
        await this.repository.updateApiKeyLastUsed(apiKeyId);
      }
    }

    await this.repository.saveCallLog({
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      model: request.model,
      prompt_tokens: inputTokens,
      completion_tokens: outputTokens,
      total_tokens: totalTokens,
      cost,
      cache_hit: false,
      latency_ms: Date.now() - startTime,
      api_key_id: apiKeyId || undefined,
    });

    return response;
  }
}
