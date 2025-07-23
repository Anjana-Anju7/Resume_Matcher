const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
 origin: process.env.FRONTEND_URL || 'http://localhost:3000',
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
 console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
 next();
});

// Database connection
// Database connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
// Connect to database
connectDB();

// Import and setup routes one by one with error handling
try {
  console.log('Loading health routes...');
  const healthRoutes = require('./routes/health');
  app.use('/api/health', healthRoutes);
  console.log('✅ Health routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading health routes:', error.message);
}

try {
  console.log('Loading user routes...');
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
}

try {
  console.log('Loading analysis routes...');
  const analysisRoutes = require('./routes/analysis');
  app.use('/api/analysis', analysisRoutes);
  console.log('✅ Analysis routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading analysis routes:', error.message);
}

// Root endpoint
app.get('/', (req, res) => {
 res.json({
 success: true,
 message: 'Resume-Job Matcher API',
 version: process.env.APP_VERSION || '1.0.0',
 timestamp: new Date().toISOString(),
 endpoints: {
 health: '/api/health',
 users: '/api/users',
 analysis: '/api/analysis'
 }
 });
});

// Import error handling middleware with error handling
try {
  console.log('Loading error handling middleware...');
  const errorHandler = require('./middleware/errorHandling');
  app.use(errorHandler);
  console.log('✅ Error handling middleware loaded successfully');
} catch (error) {
  console.error('❌ Error loading error handling middleware:', error.message);
}

// 404 handler
app.use('*', (req, res) => {
 res.status(404).json({
 success: false,
 error: {
 code: 'NOT_FOUND',
 message: 'Endpoint not found'
 }
 });
});

// Graceful shutdown
process.on('SIGINT', async () => {
 console.log('\n🔄 Graceful shutdown initiated...');
try {
await mongoose.connection.close();
 console.log('✅ MongoDB connection closed');
 process.exit(0);
 } catch (error) {
 console.error('❌ Error during shutdown:', error);
 process.exit(1);
 }
});

// Test OpenAI connection on startup
const testOpenAI = async () => {
try {
const openaiService = require('./services/openaiService');
const isConnected = await openaiService.testConnection();
if (isConnected) {
 console.log('✅ OpenAI API connection verified');
 } else {
 console.log('⚠️ OpenAI API connection failed - check your API key');
 }
 } catch (error) {
 console.log('⚠️ OpenAI service error:', error.message);
 }
};

app.listen(PORT, () => {
 console.log(`🚀 Server running on port ${PORT}`);
 console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
 console.log(`📝 API Documentation: http://localhost:${PORT}/`);
// Test connections
 testOpenAI();
});

module.exports = app;