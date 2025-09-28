import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ProxyRequest } from '../../application/usecases/ProxyRequest';
import { ChatRequest, EmbeddingsRequest } from '@pulsecost-oss/model';
import { logger, isApiError } from '@pulsecost-oss/common';
import { Repository } from '../../application/ports/Repository';
import { config } from '../../config/env';

export class HttpServer {
  private app = express();
  private proxyRequest: ProxyRequest;
  private repository: Repository;

  constructor(proxyRequest: ProxyRequest, repository: Repository) {
    this.proxyRequest = proxyRequest;
    this.repository = repository;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  }

  private extractApiKey(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return undefined;
  }

  private setupRoutes(): void {
    this.app.post(
      '/v1/chat/completions',
      async (req: Request, res: Response) => {
        try {
          const request = ChatRequest.parse(req.body);
          const apiKey = this.extractApiKey(req);
          const response = await this.proxyRequest.handleChatCompletion(
            request,
            apiKey
          );
          res.json(response);
        } catch (error) {
          logger.error('Chat completion error:', error);
          this.handleError(error, res);
        }
      }
    );

    this.app.post('/v1/embeddings', async (req: Request, res: Response) => {
      try {
        const request = EmbeddingsRequest.parse(req.body);
        const apiKey = this.extractApiKey(req);
        const response = await this.proxyRequest.handleEmbeddings(
          request,
          apiKey
        );
        res.json(response);
      } catch (error) {
        logger.error('Embeddings error:', error);
        this.handleError(error, res);
      }
    });

    // Dashboard API endpoints
    this.app.get('/reports/daily', async (req: Request, res: Response) => {
      try {
        const { from, to } = req.query;
        if (!from || !to) {
          return res
            .status(400)
            .json({ error: 'from and to parameters are required' });
        }

        const days = await this.repository.getDailyReports(
          from as string,
          to as string
        );
        return res.json({ days });
      } catch (error) {
        logger.error('Daily reports error:', error);
        return res.status(500).json({ error: 'Failed to fetch daily reports' });
      }
    });

    this.app.get('/logs', async (req: Request, res: Response) => {
      try {
        const { from, to, model } = req.query;
        if (!from || !to) {
          return res
            .status(400)
            .json({ error: 'from and to parameters are required' });
        }

        const logs = await this.repository.getCallLogs(
          from as string,
          to as string,
          model as string | undefined
        );
        return res.json({ items: logs, total: logs.length });
      } catch (error) {
        logger.error('Logs error:', error);
        return res.status(500).json({ error: 'Failed to fetch logs' });
      }
    });

    this.app.get('/config', async (_req: Request, res: Response) => {
      try {
        const settings = {
          db_driver: config.dbDriver,
          ttl_secs: 3600, // Default TTL
          openai_base: config.openaiBaseUrl,
          version: '1.0.0',
        };
        return res.json(settings);
      } catch (error) {
        logger.error('Config error:', error);
        return res.status(500).json({ error: 'Failed to fetch config' });
      }
    });

    // API Key Management endpoints (read-only)

    this.app.get('/api-keys', async (_req: Request, res: Response) => {
      try {
        const keys = await this.repository.listApiKeys();
        return res.json(
          keys.map(key => ({
            id: key.id,
            key_prefix: key.key_prefix,
            created_at: key.created_at,
            last_used: key.last_used,
            is_active: key.is_active,
            description: key.description,
          }))
        );
      } catch (error) {
        logger.error('List API keys error:', error);
        return res.status(500).json({ error: 'Failed to fetch API keys' });
      }
    });

    // API Key Usage endpoints
    this.app.get('/api-keys/usage', async (req: Request, res: Response) => {
      try {
        const { from, to } = req.query;
        if (!from || !to) {
          return res
            .status(400)
            .json({ error: 'from and to parameters are required' });
        }

        const usage = await this.repository.getApiKeyUsage(
          from as string,
          to as string
        );
        return res.json(usage);
      } catch (error) {
        logger.error('API key usage error:', error);
        return res.status(500).json({ error: 'Failed to fetch API key usage' });
      }
    });

    this.app.get(
      '/api-keys/reports/daily',
      async (req: Request, res: Response) => {
        try {
          const { from, to } = req.query;
          if (!from || !to) {
            return res
              .status(400)
              .json({ error: 'from and to parameters are required' });
          }

          const reports = await this.repository.getApiKeyDailyReports(
            from as string,
            to as string
          );
          return res.json(reports);
        } catch (error) {
          logger.error('API key daily reports error:', error);
          return res
            .status(500)
            .json({ error: 'Failed to fetch API key daily reports' });
        }
      }
    );

    this.app.get('/api-keys/:id/usage', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { from, to } = req.query;
        if (!from || !to) {
          return res
            .status(400)
            .json({ error: 'from and to parameters are required' });
        }

        const usage = await this.repository.getApiKeyUsageById(
          id as string,
          from as string,
          to as string
        );
        if (!usage) {
          return res.status(404).json({ error: 'API key not found' });
        }

        return res.json(usage);
      } catch (error) {
        logger.error('API key usage by ID error:', error);
        return res.status(500).json({ error: 'Failed to fetch API key usage' });
      }
    });

    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  start(port: number): void {
    this.app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  }

  private handleError(error: unknown, res: Response): void {
    if (isApiError(error)) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  }
}
