const cache = new Map();

const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function set(key, value, ttl = DEFAULT_TTL) {
  cache.set(key, { value, expiry: Date.now() + ttl });
}

function clear() {
  cache.clear();
}

module.exports = { get, set, clear };
