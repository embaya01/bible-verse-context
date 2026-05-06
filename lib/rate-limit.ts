/**
 * Best-effort in-memory rate limiter for the MVP.
 *
 * Limitations:
 * - Per-instance only. Vercel may run multiple serverless instances; the limit
 *   is "per instance per hour", which is a soft cap, not a hard one.
 * - Resets on cold start.
 *
 * This is fine for an anonymous MVP because the real cost ceiling comes from
 * (a) the cache hit rate approaching 100% after warmup and (b) Anthropic's
 * own spend alerts. For production, swap this for Upstash/Vercel KV.
 */

const WINDOW_MS = 60 * 60 * 1000;
const DEFAULT_LIMIT = 30;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { ok: boolean; remaining: number } {
  const limit = parseInt(process.env.RATE_LIMIT_PER_HOUR ?? "", 10) || DEFAULT_LIMIT;
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
  recent.push(now);
  hits.set(key, recent);
  return { ok: recent.length <= limit, remaining: Math.max(0, limit - recent.length) };
}

const dayCounter = { day: "", count: 0 };

export function checkDailyCeiling(): boolean {
  const ceiling =
    parseInt(process.env.DAILY_GENERATION_CEILING ?? "", 10) || 200;
  const today = new Date().toISOString().slice(0, 10);
  if (dayCounter.day !== today) {
    dayCounter.day = today;
    dayCounter.count = 0;
  }
  dayCounter.count += 1;
  return dayCounter.count <= ceiling;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
