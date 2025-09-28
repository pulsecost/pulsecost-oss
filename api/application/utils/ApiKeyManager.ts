import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { ApiKey } from '../ports/Repository';

export class ApiKeyManager {
  private static readonly HASH_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
  };

  static async hashApiKey(
    apiKey: string
  ): Promise<{ hash: string; salt: string }> {
    const salt = randomBytes(32).toString('hex');
    const hash = await argon2.hash(apiKey, {
      ...this.HASH_OPTIONS,
      salt: Buffer.from(salt, 'hex'),
    });
    return { hash, salt };
  }

  static async verifyApiKey(apiKey: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, apiKey);
    } catch {
      return false;
    }
  }

  static getKeyPrefix(apiKey: string): string {
    return apiKey.substring(0, 8);
  }

  static generateKeyId(): string {
    return randomBytes(16).toString('hex');
  }

  static async createApiKey(
    apiKey: string,
    description?: string
  ): Promise<Omit<ApiKey, 'id' | 'created_at' | 'last_used' | 'is_active'>> {
    // Use deterministic hash for key_hash to enable lookup
    const keyHash = await this.createDeterministicHash(apiKey);
    const salt = randomBytes(32).toString('hex'); // Keep salt for compatibility
    return {
      key_prefix: this.getKeyPrefix(apiKey),
      key_hash: keyHash,
      salt,
      description: description || undefined,
    };
  }

  static async createDeterministicHash(apiKey: string): Promise<string> {
    // Create a deterministic hash using Argon2id with a fixed salt for lookup purposes
    const fixedSalt = Buffer.from('api-key-lookup-salt', 'utf8');
    return await argon2.hash(apiKey, {
      ...this.HASH_OPTIONS,
      salt: fixedSalt,
    });
  }
}
