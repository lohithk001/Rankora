/**
 * Sliding Window Token Bucket Rate Limiter
 * Provides memory-safe, per-IP rate limiting without external dependencies.
 */

export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const max = options.max || 100; // Max requests per window
  const message = options.message || 'Too many requests from this IP. Please try again later.';
  
  // IP -> array of timestamps
  const hits = new Map();

  // Periodically cleanup expired IP windows every 5 minutes to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of hits.entries()) {
      const active = timestamps.filter(t => now - t < windowMs);
      if (active.length === 0) {
        hits.delete(ip);
      } else {
        hits.set(ip, active);
      }
    }
  }, 5 * 60 * 1000);

  // Unref cleanup so it does not block node shutdown
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const clientTimestamps = hits.get(ip) || [];
    const validTimestamps = clientTimestamps.filter(t => now - t < windowMs);

    const remaining = Math.max(0, max - validTimestamps.length);
    const resetTime = validTimestamps.length > 0 
      ? Math.ceil((validTimestamps[0] + windowMs) / 1000)
      : Math.ceil((now + windowMs) / 1000);

    // Set standard rate limit headers
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(0, remaining - 1));
    res.setHeader('RateLimit-Reset', resetTime);

    if (validTimestamps.length >= max) {
      res.setHeader('Retry-After', Math.ceil((validTimestamps[0] + windowMs - now) / 1000));
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfterSeconds: Math.ceil((validTimestamps[0] + windowMs - now) / 1000)
        }
      });
    }

    validTimestamps.push(now);
    hits.set(ip, validTimestamps);
    next();
  };
}
