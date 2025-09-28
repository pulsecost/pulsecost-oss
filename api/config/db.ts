import { Repository } from '../application/ports/Repository';
import { MySqlRepository } from '../infrastructure/repositories/MySqlRepository';
import { PostgresRepository } from '../infrastructure/repositories/PostgresRepository';
import { config } from './env';

export function createRepository(): Repository {
  switch (config.dbDriver) {
    case 'mysql':
      return new MySqlRepository(
        config.dbHost!,
        config.dbPort!,
        config.dbUser!,
        config.dbPassword!,
        config.dbName!
      );
    case 'postgres':
      return new PostgresRepository(
        config.dbHost!,
        config.dbPort!,
        config.dbUser!,
        config.dbPassword!,
        config.dbName!
      );
    default:
      throw new Error(
        `Unsupported database driver: ${config.dbDriver}. Supported drivers: mysql, postgres`
      );
  }
}
