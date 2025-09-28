import {
  ChatRequest,
  ChatResponse,
  EmbeddingsRequest,
  EmbeddingsResponse,
} from '@pulsecost-oss/model';

export interface InferenceGateway {
  chatCompletion(request: ChatRequest): Promise<ChatResponse>;
  embeddings(request: EmbeddingsRequest): Promise<EmbeddingsResponse>;
}
