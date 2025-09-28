import { InferenceGateway } from '../../application/ports/InferenceGateway';
import {
  ChatRequest,
  ChatResponse,
  EmbeddingsRequest,
  EmbeddingsResponse,
} from '@pulsecost-oss/model';
import { ApiError } from '@pulsecost-oss/common';

export class OpenAIInferenceGateway implements InferenceGateway {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async chatCompletion(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(
        `OpenAI API error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return ChatResponse.parse(data);
  }

  async embeddings(request: EmbeddingsRequest): Promise<EmbeddingsResponse> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return EmbeddingsResponse.parse(data);
  }
}
