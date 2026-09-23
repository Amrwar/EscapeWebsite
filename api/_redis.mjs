/**
 * Builds the Redis client from whichever env var names Vercel's storage
 * integration actually set. Vercel KV (now deprecated) used
 * KV_REST_API_URL/KV_REST_API_TOKEN; the Marketplace Redis integration that
 * replaced it is Upstash underneath and may set either that pair or
 * UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN depending on how it was
 * connected — checking both means this keeps working either way.
 */
import { Redis } from '@upstash/redis';

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
