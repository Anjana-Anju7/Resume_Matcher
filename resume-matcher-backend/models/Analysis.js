const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true
  },
  resume: {
    type: String,
    required: true,
    trim: true
  },
  jobTitle: {
    type: String,
    default: '',
    trim: true
  },
  companyName: {
    type: String,
    default: '',
    trim: true
  },
  results: {
    compatibilityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    analysis: {
      strengths: [{
        type: String
      }],
      gaps: [{
        type: String
      }],
      suggestions: [{
        section: {
          type: String,
          required: true
        },
        current: {
          type: String,
          required: true
        },
        suggested: {
          type: String,
          required: true
        }
      }]
    },
    tokensUsed: {
      type: Number,
      default: 0
    }
  },
  processingTime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Keep only these indexes, remove duplicates
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ sessionId: 1 }, { unique: true }); // Move unique here
analysisSchema.index({ status: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);