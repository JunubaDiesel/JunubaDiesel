import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
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

export function checkRateLimit(
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
