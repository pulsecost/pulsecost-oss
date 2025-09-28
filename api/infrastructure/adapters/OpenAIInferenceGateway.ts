import { InferenceGateway } from '../../application/ports/InferenceGateway';
import {
  ChatRequest,
  ChatResponse,
  EmbeddingsRequest,
  EmbeddingsResponse,
} from '@pulsecost-oss/model';
import { ApiError } from '@pulsecost-oss/common';

export class OpenAIInferenceGateway implements InferenceGateway {
  private readonly baseUrl: string;

  constructor(baseUrl = 'https://api.openai.com/v1') {
    this.baseUrl = baseUrl;
  }

  async chatCompletion(
    request: ChatRequest,
    apiKey?: string
  ): Promise<ChatResponse> {
    if (!apiKey) {
      throw new ApiError('API key is required', 401);
    }
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;

      // Detect invalid API key
      if (
        response.status === 401 ||
        errorMessage.includes('Invalid API key') ||
        errorMessage.includes('Incorrect API key') ||
        errorMessage.includes('API key not found')
      ) {
        throw new ApiError(
          `Invalid OpenAI API key: ${errorMessage}`,
          response.status,
          'INVALID_API_KEY'
        );
      }

      throw new ApiError(
        `OpenAI API error: ${response.status} ${errorMessage}`,
        response.status
      );
    }

    const data = await response.json();
    return ChatResponse.parse(data);
  }

  async embeddings(
    request: EmbeddingsRequest,
    apiKey?: string
  ): Promise<EmbeddingsResponse> {
    if (!apiKey) {
      throw new ApiError('API key is required', 401);
    }
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;

      // Detect invalid API key
      if (
        response.status === 401 ||
        errorMessage.includes('Invalid API key') ||
        errorMessage.includes('Incorrect API key') ||
        errorMessage.includes('API key not found')
      ) {
        throw new ApiError(
          `Invalid OpenAI API key: ${errorMessage}`,
          response.status,
          'INVALID_API_KEY'
        );
      }

      throw new ApiError(
        `OpenAI API error: ${response.status} ${errorMessage}`,
        response.status
      );
    }

    const data = await response.json();
    return EmbeddingsResponse.parse(data);
  }
}
