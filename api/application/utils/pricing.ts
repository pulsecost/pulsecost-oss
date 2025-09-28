// OpenAI pricing per 1K tokens (as of 2024)
const PRICING = {
  'gpt-4': {
    input: 0.03,
    output: 0.06,
  },
  'gpt-4-turbo': {
    input: 0.01,
    output: 0.03,
  },
  'gpt-3.5-turbo': {
    input: 0.0015,
    output: 0.002,
  },
  'gpt-3.5-turbo-16k': {
    input: 0.003,
    output: 0.004,
  },
  'text-embedding-ada-002': {
    input: 0.0001,
    output: 0,
  },
  'text-embedding-3-small': {
    input: 0.00002,
    output: 0,
  },
  'text-embedding-3-large': {
    input: 0.00013,
    output: 0,
  },
} as const;

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model as keyof typeof PRICING];
  if (!pricing) {
    // Default pricing for unknown models
    return ((inputTokens + outputTokens) * 0.002) / 1000;
  }

  const inputCost = (inputTokens * pricing.input) / 1000;
  const outputCost = (outputTokens * pricing.output) / 1000;

  return inputCost + outputCost;
}

export function extractTokensFromResponse(response: any): {
  inputTokens: number;
  outputTokens: number;
} {
  if (response.usage) {
    return {
      inputTokens: response.usage.prompt_tokens || 0,
      outputTokens: response.usage.completion_tokens || 0,
    };
  }

  // Fallback estimation for responses without usage info
  return {
    inputTokens: 0,
    outputTokens: 0,
  };
}
