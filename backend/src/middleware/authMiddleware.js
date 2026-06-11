const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback_access_secret';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, not authorized' });
      }
      return next();
    } catch (error) {
      
      console.warn(`Auth failed: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback_access_secret';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.warn(`Optional auth token verification failed: ${error.message}`);
    }
  }
  next();
};

module.exports = { protect, optionalProtect };

