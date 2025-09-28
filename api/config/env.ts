import { z } from 'zod';

const envSchema = z.object({
  port: z.number().default(3000),
  openaiApiKey: z.string().optional(),
  openaiBaseUrl: z.string().url().default('https://api.openai.com/v1'),
  dbDriver: z.enum(['mysql', 'postgres']).default('postgres'),
  dbHost: z.string().default('localhost'),
  dbPort: z.number().default(5432),
  dbUser: z.string().default('opti_lm'),
  dbPassword: z.string().default('opti_lm'),
  dbName: z.string().default('opti_lm'),
});

export type IConfig = z.infer<typeof envSchema>;

const rawEnv = {
  port: parseInt(process.env['PORT'] || '3000'),
  openaiApiKey: process.env['OPENAI_API_KEY'] || '',
  openaiBaseUrl: process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1',
  dbDriver: process.env['DB_DRIVER'] || 'postgres',
  dbHost: process.env['DB_HOST'] || 'localhost',
  dbPort: process.env['DB_PORT'] ? parseInt(process.env['DB_PORT']) : 5432,
  dbUser: process.env['DB_USER'] || 'opti_lm',
  dbPassword: process.env['DB_PASSWORD'] || 'opti_lm',
  dbName: process.env['DB_NAME'] || 'opti_lm',
};

export const config: IConfig = envSchema.parse(rawEnv);

export interface Env {
  get: <Key extends keyof IConfig>(key: Key) => IConfig[Key];
}

export class EnvAdapter {
  private static instance: EnvAdapter;
  private env: IConfig;

  private constructor(config: IConfig) {
    this.env = config;
  }

  public static getInstance(config?: IConfig): EnvAdapter {
    if (!EnvAdapter.instance) {
      if (!config) {
        throw new Error('Config must be provided for first initialization');
      }
      EnvAdapter.instance = new EnvAdapter(config);
    }
    return EnvAdapter.instance;
  }

  public get: Env['get'] = key => {
    return this.env[key];
  };
}
