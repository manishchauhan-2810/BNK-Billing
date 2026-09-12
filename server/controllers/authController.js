const env = require('../config/env');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isProd = env.NODE_ENV === 'production';

  const cookieOptions = {
    expires: new Date(
      Date.now() +
      env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax'
  };

  res.cookie('token', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user,
      token
    }
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Account is deactivated', 403));
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  const isProd = env.NODE_ENV === 'production';
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'   // must match the original cookie's attributes to actually clear it
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};


exports.getMe = (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user }
  });
};
