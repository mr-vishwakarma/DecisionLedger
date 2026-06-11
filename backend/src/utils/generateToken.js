const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback_access_secret';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',  
  });
};

const generateRefreshToken = (id) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET ? process.env.JWT_SECRET + '_refresh' : 'fallback_refresh_secret');
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
