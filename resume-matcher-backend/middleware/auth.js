const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Access denied. No token provided.'
        }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token. User not found.'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired.'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token.'
      }
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

const checkAnalysisLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      // Allow guest users (you can add session-based limiting if needed)
      return next();
    }

    const limits = {
      free: 10,    // 10 analyses per day
      premium: 100 // 100 analyses per day
    };

    const userLimit = limits[req.user.subscription] || limits.free;
    
    // Check analyses in the last 24 hours
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { Analysis } = require('../models');
    const todayCount = await Analysis.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: today }
    });

    if (todayCount >= userLimit) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'ANALYSIS_LIMIT_EXCEEDED',
          message: `Daily analysis limit of ${userLimit} reached. ${req.user.subscription === 'free' ? 'Upgrade to premium for more analyses.' : 'Please try again tomorrow.'}`
        }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  optionalAuth,
  checkAnalysisLimit
};