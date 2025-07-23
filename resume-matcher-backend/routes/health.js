const express = require('express');
const mongoose = require('mongoose');
const openaiService = require('../services/openaiService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check OpenAI connection
    const openaiStatus = await openaiService.testConnection();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbStatus,
          name: mongoose.connection.name || 'unknown'
        },
        openai: {
          status: openaiStatus ? 'connected' : 'disconnected'
        }
      },
      uptime: process.uptime()
    };

    // If any critical service is down, return 503
    if (dbStatus === 'disconnected' || !openaiStatus) {
      return res.status(503).json({
        success: false,
        data: health,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'One or more critical services are unavailable'
        }
      });
    }

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed'
      }
    });
  }
});

module.exports = router;