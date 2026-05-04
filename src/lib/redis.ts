import { Redis } from '@upstash/redis';

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

let _redis: Redis | null = null;
if (url && token) {
  _redis = new Redis({ url, token });
}

export const redis = _redis;
export const isRedisConfigured = _redis !== null;
