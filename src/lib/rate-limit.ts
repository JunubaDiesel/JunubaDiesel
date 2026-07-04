import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();
const upstashLimiters = new Map<string, Ratelimit>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

function getUpstashLimiter(options: RateLimitOptions): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const cacheKey = `${options.prefix}:${options.limit}:${options.windowMs}`;
  const existing = upstashLimiters.get(cacheKey);
  if (existing) return existing;

  const windowSec = Math.max(1, Math.ceil(options.windowMs / 1000));
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(options.limit, `${windowSec} s`),
    prefix: `junuba:${options.prefix}`,
    analytics: false,
  });

  upstashLimiters.set(cacheKey, limiter);
  return limiter;
}

export function getClientIp(request: NextRequest | Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  prefix: string;
}

function checkInMemoryRateLimit(
  request: NextRequest | Request,
  options: RateLimitOptions
): NextResponse | null {
  const now = Date.now();
  cleanup(now);

  const ip = getClientIp(request);
  const key = `${options.prefix}:${ip}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (current.count >= options.limit) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intente más tarde." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  current.count += 1;
  return null;
}

export async function checkRateLimit(
  request: NextRequest | Request,
  options: RateLimitOptions
): Promise<NextResponse | null> {
  const upstash = getUpstashLimiter(options);
  if (!upstash) {
    return checkInMemoryRateLimit(request, options);
  }

  const ip = getClientIp(request);
  const { success, reset } = await upstash.limit(ip);

  if (success) return null;

  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intente más tarde." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  );
}
