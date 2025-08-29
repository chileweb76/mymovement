// Simple in-memory cache for user records with TTL.
// Not persistent across server restarts. Use Redis or similar for multi-process.

const cache = new Map();
const DEFAULT_TTL = parseInt(process.env.USER_CACHE_TTL_MS) || 5 * 60 * 1000; // 5 minutes

export function getCachedUser(email) {
  if (!email) return null;
  const entry = cache.get(email);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(email);
    return null;
  }
  return entry.user;
}

export function setCachedUser(email, user, ttl = DEFAULT_TTL) {
  if (!email) return;
  cache.set(email, { user, expires: Date.now() + ttl });
}

export function clearUserCache(email) {
  if (email) cache.delete(email);
}

// periodic cleanup to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expires <= now) cache.delete(key);
  }
}, Math.max(60000, DEFAULT_TTL));

const api = { getCachedUser, setCachedUser, clearUserCache };
export default api;
