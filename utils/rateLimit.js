// utils/rateLimit.js
// Best-effort in-memory rate limiter. Note: on Vercel serverless, each
// cold-started instance has its own memory, so this is NOT a strict
// distributed limit — it just blocks rapid repeat submissions from the
// same warm instance. Good enough to deter basic spam bots without
// needing an external store like Upstash/Redis.

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

const hits = new Map();

export function isRateLimited(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  const arr = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > MAX_REQUESTS;
}
