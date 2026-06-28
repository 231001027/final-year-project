import { redisClient } from './redis.js';

const CACHE_TTL = 300; // 5 minutes in seconds

export const cacheGet = async (key: string): Promise<string | null> => {
  try {
    if (!redisClient.isOpen) return null;
    return await redisClient.get(key);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async (key: string, value: string, ttl: number = CACHE_TTL): Promise<void> => {
  try {
    if (!redisClient.isOpen) return;
    await redisClient.setEx(key, ttl, value);
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    if (!redisClient.isOpen) return;
    await redisClient.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  try {
    if (!redisClient.isOpen) return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Cache delete pattern error:', error);
  }
};
