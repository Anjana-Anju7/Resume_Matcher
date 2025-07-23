const express = require('express');
const analysisController = require('../controllers/analysisController');
const { optionalAuth, checkAnalysisLimit, verifyToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for analysis endpoint
const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many analysis requests. Please wait before trying again.'
    }
  }
});

// Public routes (guest + authenticated users)
router.post('/', analysisLimiter, optionalAuth, checkAnalysisLimit, analysisController.analyzeResume);
router.get('/status', analysisController.getAnalysisStatus);
router.get('/:id', optionalAuth, analysisController.getAnalysisById);

// Protected routes (authenticated users only)
router.get('/user/history', verifyToken, analysisController.getUserAnalyses);

module.exports = router;