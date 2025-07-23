const { v4: uuidv4 } = require('uuid');
const { Analysis, User } = require('../models');
const openaiService = require('../services/openaiService');
const validationService = require('../services/validation');

class AnalysisController {
  async analyzeResume(req, res) {
    const startTime = Date.now();

    try {
      const { jobDescription, resume, jobTitle, companyName } = req.body;
      const sessionId = uuidv4();
      const userId = req.user?._id || null;

      console.log(`🔍 Starting analysis for ${userId ? 'user' : 'guest'}`);

      // Validate input
      const validation = validationService.validateAnalysisInput(jobDescription, resume);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: validation.message,
            details: validation.errors
          }
        });
      }

      // Estimate tokens for cost control
      const totalTokens = openaiService.estimateTokens(jobDescription + resume);
      if (totalTokens > 8000) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INPUT_TOO_LONG',
            message: 'Combined input is too long. Please reduce the text length.'
          }
        });
      }

      // Process with OpenAI FIRST
      console.log('🤖 Processing with OpenAI...');
      const aiAnalysis = await openaiService.analyzeResume(jobDescription, resume);
      const processingTime = Date.now() - startTime;

      // NOW create analysis record with complete data
      const analysisRecord = new Analysis({
        userId,
        sessionId,
        jobDescription: validationService.sanitizeInput(jobDescription),
        resume: validationService.sanitizeInput(resume),
        jobTitle: jobTitle?.trim() || '',
        companyName: companyName?.trim() || '',
        results: {
          compatibilityScore: aiAnalysis.compatibilityScore,
          analysis: aiAnalysis.analysis,
          tokensUsed: totalTokens
        },
        processingTime,
        status: 'completed'
      });

      await analysisRecord.save();
      console.log(`✅ Analysis completed in ${processingTime}ms`);

      // Update user analysis count if authenticated
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          $inc: { analysisCount: 1 }
        });
      }

      // Return successful response
      res.json({
        success: true,
        data: {
          analysisId: analysisRecord._id,
          sessionId,
          compatibilityScore: aiAnalysis.compatibilityScore,
          analysis: aiAnalysis.analysis,
          jobTitle: analysisRecord.jobTitle,
          companyName: analysisRecord.companyName,
          processedAt: analysisRecord.createdAt,
          processingTime,
          tokensUsed: totalTokens
        }
      });

    } catch (error) {
      console.error('❌ Analysis error:', error);
      
      // For failed analyses, we can create a record with failed status
      try {
        if (error.message.includes('OpenAI') || error.message.includes('AI analysis')) {
          const failedAnalysis = new Analysis({
            userId: req.user?._id || null,
            sessionId: uuidv4(),
            jobDescription: validationService.sanitizeInput(req.body.jobDescription || ''),
            resume: validationService.sanitizeInput(req.body.resume || ''),
            jobTitle: req.body.jobTitle?.trim() || '',
            companyName: req.body.companyName?.trim() || '',
            results: {
              compatibilityScore: 0,
              analysis: {
                strengths: [],
                gaps: [],
                suggestions: []
              },
              tokensUsed: 0
            },
            processingTime: Date.now() - startTime,
            status: 'failed',
            error: error.message
          });
          
          await failedAnalysis.save();
        }
      } catch (saveError) {
        console.error('Failed to save error record:', saveError);
      }
      
      res.status(500).json({
        success: false,
        error: {
          code: 'ANALYSIS_FAILED',
          message: error.message || 'Failed to analyze resume. Please try again.'
        }
      });
    }
  }

  async getAnalysisById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      const analysis = await Analysis.findById(id);

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'ANALYSIS_NOT_FOUND',
            message: 'Analysis not found.'
          }
        });
      }

      // Check if user has access to this analysis
      if (analysis.userId && userId && !analysis.userId.equals(userId)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have access to this analysis.'
          }
        });
      }

      res.json({
        success: true,
        data: {
          analysisId: analysis._id,
          sessionId: analysis.sessionId,
          jobTitle: analysis.jobTitle,
          companyName: analysis.companyName,
          compatibilityScore: analysis.results?.compatibilityScore,
          analysis: analysis.results?.analysis,
          processedAt: analysis.createdAt,
          processingTime: analysis.processingTime,
          status: analysis.status
        }
      });

    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch analysis.'
        }
      });
    }
  }

  async getAnalysisStatus(req, res) {
    try {
      const totalAnalyses = await Analysis.countDocuments();
      const todayAnalyses = await Analysis.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      });
      
      const avgProcessingTime = await Analysis.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, avgTime: { $avg: '$processingTime' } } }
      ]);

      // Test OpenAI connection
      const openaiStatus = await openaiService.testConnection();

      res.json({
        success: true,
        data: {
          status: 'online',
          openaiStatus: openaiStatus ? 'connected' : 'disconnected',
          availableModels: ['gpt-3.5-turbo'],
          statistics: {
            totalAnalyses,
            todayAnalyses,
            averageProcessingTime: Math.round(avgProcessingTime[0]?.avgTime || 0)
          },
          lastUpdated: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Get status error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'STATUS_FETCH_FAILED',
          message: 'Failed to fetch analysis status.'
        }
      });
    }
  }

  async getUserAnalyses(req, res) {
    try {
      const userId = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [analyses, totalCount] = await Promise.all([
        Analysis.find({ userId })
          .select('jobTitle companyName results.compatibilityScore status createdAt processingTime')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Analysis.countDocuments({ userId })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          analyses,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get user analyses error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch analysis history.'
        }
      });
    }
  }
}

module.exports = new AnalysisController();