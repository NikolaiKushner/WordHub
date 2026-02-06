/**
 * In-memory sliding window rate limiter.
 *
 * Tracks requests per IP using timestamp arrays. Each route tier
 * has its own limits. Expired entries are cleaned up periodically.
 *
 * For multi-instance deployments, replace with a Redis-based solution.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

const store = new Map<string, number[]>();

// Cleanup expired entries every 60 seconds
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(maxWindowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - maxWindowMs;
  for (const [key, timestamps] of store) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      store.set(key, valid);
    }
  }
}

function check(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get existing timestamps and filter to current window
  const timestamps = (store.get(key) || []).filter((t) => t > windowStart);

  const allowed = timestamps.length < config.maxRequests;
  if (allowed) {
    timestamps.push(now);
  }
  store.set(key, timestamps);

  // Trigger periodic cleanup
  cleanup(config.windowMs);

  const oldest = timestamps[0] || now;
  const resetAt = oldest + config.windowMs;

  return {
    allowed,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - timestamps.length),
    resetAt,
  };
}

// --- Rate limit tiers ---

const TIERS = {
  strict: { maxRequests: 5, windowMs: 15 * 60 * 1000 } as RateLimitConfig,
  auth: { maxRequests: 20, windowMs: 15 * 60 * 1000 } as RateLimitConfig,
  public: { maxRequests: 60, windowMs: 60 * 1000 } as RateLimitConfig,
  standard: { maxRequests: 100, windowMs: 60 * 1000 } as RateLimitConfig,
};

const STRICT_ROUTES = [
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/settings/delete-account",
];

function getTier(pathname: string): RateLimitConfig {
  if (STRICT_ROUTES.includes(pathname)) return TIERS.strict;
  if (pathname.startsWith("/api/auth/")) return TIERS.auth;
  if (
    pathname === "/api/links/click" ||
    pathname.startsWith("/api/public-profile/")
  ) {
    return TIERS.public;
  }
  return TIERS.standard;
}

/** Extract client IP from request headers. */
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

/** Build rate-limit response headers. */
function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

/**
 * Apply rate limiting to a request.
 * Returns a 429 Response if the limit is exceeded, or null if allowed.
 * When allowed, returns headers to add to the response via the second element.
 */
export function applyRateLimit(
  req: Request,
): { response: Response } | { headers: Record<string, string> } {
  const url = new URL(req.url);
  const tier = getTier(url.pathname);
  const ip = getClientIp(req);
  const key = `${ip}:${url.pathname}`;

  const result = check(key, tier);
  const headers = rateLimitHeaders(result);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return {
      response: new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            ...headers,
          },
        },
      ),
    };
  }

  return { headers };
}
