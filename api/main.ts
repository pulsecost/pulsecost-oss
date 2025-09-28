import { OpenAIInferenceGateway } from './infrastructure/adapters/OpenAIInferenceGateway';
import { HttpServer } from './infrastructure/http/HttpServer';
import { ProxyRequest } from './application/usecases/ProxyRequest';
import { createRepository } from './config/db';
import { config, EnvAdapter } from './config/env';
import { logger } from '@pulsecost-oss/common';

async function main(): Promise<void> {
  try {
    const envAdapter = EnvAdapter.getInstance(config);
    const repository = createRepository();

    // Initialize the repository (create tables)
    await repository.init();

    // Only create inference gateway if API key is provided
    const apiKey = envAdapter.get('openaiApiKey');
    const inferenceGateway = apiKey
      ? new OpenAIInferenceGateway(apiKey, envAdapter.get('openaiBaseUrl'))
      : null;
    const proxyRequest = new ProxyRequest(inferenceGateway, repository);
    const httpServer = new HttpServer(proxyRequest, repository);

    httpServer.start(envAdapter.get('port'));
    logger.info('AI Cost Optimizer API started');
  } catch (error) {
    logger.error('Failed to start API:', error);
    process.exit(1);
  }
}

main();
