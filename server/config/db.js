const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  if (env.NODE_ENV === 'production' && (!env.MONGODB_URI || env.MONGODB_URI.includes('<username>'))) {
    console.error('FATAL: MONGODB_URI is not set correctly for production.');
    process.exit(1);
  }

  const uri = (env.MONGODB_URI && !env.MONGODB_URI.includes('<username>'))
    ? env.MONGODB_URI
    : 'mongodb://127.0.0.1:27017/bnk_billing';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;