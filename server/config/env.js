require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];

if (process.env.NODE_ENV === 'production') {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bnk_billing',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_EXPIRES_IN: parseInt(process.env.COOKIE_EXPIRES_IN || '7', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development'
};