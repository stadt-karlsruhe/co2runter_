const jwt = require('jsonwebtoken');
const config = require('../config.js');

const auth = (req, res, next) => {
  const token = req.body.co2token || req.query.co2token || req.headers['co2token'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.auth.token_key);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    // Handle other JWT verification errors if necessary
    return res.status(401).json({ error: 'Failed to authenticate token.' });
  }
};

module.exports = auth;
