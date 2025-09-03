// src/common/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  onModuleInit() {
    try {
      this.client = new Redis({ host: '127.0.0.1', port: 6379 });
      this.logger.log('✅ Connected to Redis');
    } catch (error) {
      this.logger.error('Redis connection failed', error);
      throw error;
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
      this.logger.log('Redis disconnected');
    }
  }

  /** ---------------- String Commands ---------------- **/

  async set(key: string, value: any, ttlSeconds = 0) {
    try {
      const val = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await this.client.set(key, val, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, val);
      }
    } catch (error) {
      this.logger.error(`Failed to set key ${key}`, error);
      throw new Error(`Failed to set key ${key}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      this.logger.error(`Failed to get key ${key}`, error);
      return null;
    }
  }

  async del(key: string) {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}`, error);
      throw new Error(`Failed to delete key ${key}`);
    }
  }

  /** ---------------- Hash Commands ---------------- **/

  async hset(key: string, data: Record<string, any>) {
    try {
      const flatData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, JSON.stringify(v)]),
      );
      await this.client.hset(key, flatData);
    } catch (error) {
      this.logger.error(`Failed to hset key ${key}`, error);
      throw new Error(`Failed to hset key ${key}`);
    }
  }

  async hget(key: string, field: string) {
    try {
      const data = await this.client.hget(key, field);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Failed to hget ${field} of ${key}`, error);
      return null;
    }
  }

  async hgetall(key: string) {
    try {
      const data = await this.client.hgetall(key);
      const parsed = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, JSON.parse(v)]),
      );
      return parsed;
    } catch (error) {
      this.logger.error(`Failed to hgetall ${key}`, error);
      return {};
    }
  }

  async hdel(key: string, field: string) {
    try {
      const result = await this.client.hdel(key, field);
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to hdel ${field} of ${key}`, error);
      throw new Error(`Failed to hdel ${field} of ${key}`);
    }
  }

  /** ---------------- List Commands ---------------- **/

  async lpush(key: string, value: any) {
    try {
      await this.client.lpush(key, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Failed to lpush ${key}`, error);
      throw new Error(`Failed to lpush ${key}`);
    }
  }

  async rpop<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.rpop(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Failed to rpop ${key}`, error);
      return null;
    }
  }

  async lrange<T>(key: string, start = 0, end = -1): Promise<T[]> {
    try {
      const list = await this.client.lrange(key, start, end);
      return list.map(item => JSON.parse(item));
    } catch (error) {
      this.logger.error(`Failed to lrange ${key}`, error);
      return [];
    }
  }

  /** ---------------- Set Commands ---------------- **/

  async sadd(key: string, value: any) {
    try {
      await this.client.sadd(key, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Failed to sadd ${key}`, error);
      throw new Error(`Failed to sadd ${key}`);
    }
  }

  async smembers<T>(key: string): Promise<T[]> {
    try {
      const members = await this.client.smembers(key);
      return members.map(m => JSON.parse(m));
    } catch (error) {
      this.logger.error(`Failed to smembers ${key}`, error);
      return [];
    }
  }

  async srem(key: string, value: any) {
    try {
      return await this.client.srem(key, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Failed to srem ${key}`, error);
      throw new Error(`Failed to srem ${key}`);
    }
  }

  /** ---------------- Utility Commands ---------------- **/

  async expire(key: string, ttlSeconds: number) {
    try {
      await this.client.expire(key, ttlSeconds);
    } catch (error) {
      this.logger.error(`Failed to set expire for ${key}`, error);
      throw new Error(`Failed to set expire for ${key}`);
    }
  }

  async ttl(key: string) {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get TTL for ${key}`, error);
      return -2; // key does not exist
    }
  }

  async keys(pattern: string) {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Failed to get keys with pattern ${pattern}`, error);
      return [];
    }
  }

  async flushall() {
    try {
      await this.client.flushall();
    } catch (error) {
      this.logger.error(`Failed to flush all keys`, error);
      throw new Error(`Failed to flush all keys`);
    }
  }
}
