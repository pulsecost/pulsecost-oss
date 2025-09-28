import {
  ChatRequest,
  ChatResponse,
  EmbeddingsRequest,
  EmbeddingsResponse,
} from '@pulsecost-oss/model';

export interface InferenceGateway {
  chatCompletion(request: ChatRequest, apiKey?: string): Promise<ChatResponse>;
  embeddings(
    request: EmbeddingsRequest,
    apiKey?: string
  ): Promise<EmbeddingsResponse>;
}
