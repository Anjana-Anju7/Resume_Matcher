const errorHandler = (error, req, res, next) => {
    console.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  
    let statusCode = 500;
    let errorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    };
  
    // Handle specific error types
    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorResponse.error.code = 'VALIDATION_ERROR';
      errorResponse.error.message = Object.values(error.errors).map(err => err.message).join(', ');
    } else if (error.name === 'CastError') {
      statusCode = 400;
      errorResponse.error.code = 'INVALID_ID';
      errorResponse.error.message = 'Invalid ID format';
    } else if (error.code === 11000) {
      statusCode = 409;
      errorResponse.error.code = 'DUPLICATE_ERROR';
      errorResponse.error.message = 'Email already exists';
    } else if (error.message.includes('OpenAI') || error.message.includes('AI analysis')) {
      statusCode = 502;
      errorResponse.error.code = 'OPENAI_ERROR';
      errorResponse.error.message = error.message;
    } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      statusCode = 400;
      errorResponse.error.code = 'INVALID_JSON';
      errorResponse.error.message = 'Invalid JSON in request body';
    }
  
    // Don't expose internal errors in production
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.error.stack = error.stack;
    }
  
    res.status(statusCode).json(errorResponse);
  };
  
  module.exports = errorHandler;