const rateLimit = require('express-rate-limit');

exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  }
});
