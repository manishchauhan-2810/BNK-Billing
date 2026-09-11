const mongoose = require('mongoose');
const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');
const User = require('./models/User');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const initializeAdmin = async () => {
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log('SEED_ADMIN_PASSWORD not set — skipping admin seed.');
    return;
  }
  try {
    const adminExists = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL || 'admin@bnkphysio.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.SEED_ADMIN_EMAIL || 'admin@bnkphysio.com',
        password: process.env.SEED_ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('Admin user seeded successfully');
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  }
};

connectDB().then(() => {
  initializeAdmin();
});

const server = app.listen(env.PORT, () => {
  console.log(`App running on port \${env.PORT} in \${env.NODE_ENV} mode...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
