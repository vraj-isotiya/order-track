const rateLimit = require("express-rate-limit");

const MAX_REQUESTS_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const BLOCK_MS = 24 * 60 * 60 * 1000; // 24 hours

const blockedIps = new Map();

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

setInterval(() => {
  const now = Date.now();
  for (const [ip, blockedUntil] of blockedIps.entries()) {
    if (!blockedUntil || now >= blockedUntil) {
      blockedIps.delete(ip);
    }
  }
}, CLEANUP_INTERVAL_MS).unref();

function getClientIp(req) {
  return req.ip;
}

function getRemainingTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function blockCheck(req, res, next) {
  const ip = getClientIp(req);
  const blockedUntil = blockedIps.get(ip);

  if (blockedUntil && Date.now() < blockedUntil) {
    const remaining = getRemainingTime(blockedUntil - Date.now());

    return res.status(429).json({
      success: false,
      message:
        "Too many requests. Your IP is temporarily blocked. Please try again later.",
      retry_after: remaining,
    });
  }

  return next();
}

const limiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_REQUESTS_PER_HOUR,
  standardHeaders: true,
  legacyHeaders: false,

  // Use req.ip as key
  keyGenerator: (req) => getClientIp(req),

  handler: (req, res) => {
    const ip = getClientIp(req);
    const blockedUntil = Date.now() + BLOCK_MS;

    blockedIps.set(ip, blockedUntil);

    const remaining = getRemainingTime(BLOCK_MS);

    return res.status(429).json({
      success: false,
      message: "Rate limit exceeded. Your IP is blocked.",
      retry_after: remaining,
    });
  },
});

module.exports = {
  ipRateLimiter: [blockCheck, limiter],
};
