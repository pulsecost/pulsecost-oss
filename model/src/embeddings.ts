import { z } from 'zod';

export const EmbeddingsRequest = z.object({
  model: z.string(),
  input: z.union([z.string(), z.array(z.string())]),
  encoding_format: z.literal('float').optional(),
});

export const EmbeddingsResponse = z.object({
  object: z.literal('list'),
  data: z.array(
    z.object({
      object: z.literal('embedding'),
      index: z.number(),
      embedding: z.array(z.number()),
    })
  ),
  model: z.string(),
  usage: z.object({
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export type EmbeddingsRequest = z.infer<typeof EmbeddingsRequest>;
export type EmbeddingsResponse = z.infer<typeof EmbeddingsResponse>;
