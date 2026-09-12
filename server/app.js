const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const billRoutes = require('./routes/billRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const revenueRoutes = require('./routes/revenueRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: env.CLIENT_URL.replace(/\/$/, ''),
  credentials: true
}));

app.use(cookieParser());

app.use(express.json({
  limit: '10kb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}));

app.use('/api', generalLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/bills', billRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/revenue', revenueRoutes);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;