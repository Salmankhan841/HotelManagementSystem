const rateLimit = require('express-rate-limit');

// 1. General API Rate Limiter (Defends against DDoS & Scraping)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

// 2. Strict Authentication Rate Limiter (Defends against Credential Stuffing & Brute Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many login attempts from this device. Please try again in 15 minutes.'
  }
});

// 3. Recursive NoSQL Injection & Prototype Pollution Sanitizer
const sanitizeInput = (req, res, next) => {
  const clean = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      // Strip NoSQL query injection characters and prototype pollution keys
      if (key.startsWith('$') || key.includes('.') || key === '__proto__' || key === 'constructor') {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
  };

  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);

  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  sanitizeInput
};
