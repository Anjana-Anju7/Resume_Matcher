const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeResume(jobDescription, resume) {
    try {
      const prompt = this.createAnalysisPrompt(jobDescription, resume);
      
      console.log('🤖 Sending request to OpenAI...');
      
      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR recruiter and resume writer with 15+ years of experience. Your job is to analyze resume compatibility with job descriptions and provide specific, actionable feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0].message.content;
      console.log('✅ OpenAI response received');
      
      return this.parseOpenAIResponse(response);
    } catch (error) {
      console.error('❌ OpenAI API Error:', error);
      
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key.');
      } else {
        throw new Error('AI analysis temporarily unavailable. Please try again.');
      }
    }
  }

  createAnalysisPrompt(jobDescription, resume) {
    return `
Please analyze the compatibility between this job description and resume. Provide a detailed assessment in JSON format.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

Analyze and return your response in this exact JSON format:

{
  "compatibilityScore": [number between 0-100],
  "analysis": {
    "strengths": [
      "Specific strength that aligns with job requirements",
      "Another strength with concrete examples"
    ],
    "gaps": [
      "Missing skill or qualification",
      "Experience gap or certification needed"
    ],
    "suggestions": [
      {
        "section": "Skills",
        "current": "Current skills mentioned in resume",
        "suggested": "Enhanced skills section with job-relevant keywords"
      },
      {
        "section": "Experience",
        "current": "Current experience description",
        "suggested": "Improved description with metrics and job-relevant achievements"
      }
    ]
  }
}

SCORING GUIDELINES:
- 90-100: Excellent match, minimal changes needed
- 80-89: Strong match, few improvements suggested
- 70-79: Good match, some gaps to address
- 60-69: Moderate match, several improvements needed
- 50-59: Weak match, significant changes required
- Below 50: Poor match, major restructuring needed

FOCUS ON:
1. Keyword matching between job requirements and resume
2. Relevant experience and skills alignment
3. Education and certification requirements
4. Industry-specific terminology usage
5. Quantifiable achievements and metrics

Make suggestions specific and actionable. Include exact keywords and phrases that should be added or modified.
`;
  }

  parseOpenAIResponse(response) {
    try {
      const parsed = JSON.parse(response);
      
      // Validate required fields
      if (!parsed.compatibilityScore || !parsed.analysis) {
        throw new Error('Invalid response format from AI');
      }

      // Ensure score is within valid range
      parsed.compatibilityScore = Math.max(0, Math.min(100, Math.round(parsed.compatibilityScore)));

      // Validate analysis structure
      if (!parsed.analysis.strengths) parsed.analysis.strengths = [];
      if (!parsed.analysis.gaps) parsed.analysis.gaps = [];
      if (!parsed.analysis.suggestions) parsed.analysis.suggestions = [];

      // Ensure suggestions have required fields
      parsed.analysis.suggestions = parsed.analysis.suggestions.map(suggestion => ({
        section: suggestion.section || 'General',
        current: suggestion.current || 'Current content',
        suggested: suggestion.suggested || 'Suggested improvement'
      }));

      console.log(`📊 Analysis complete: ${parsed.compatibilityScore}% compatibility`);
      
      return parsed;
    } catch (error) {
      console.error('❌ Failed to parse OpenAI response:', error);
      
      // Return fallback response if parsing fails
      return {
        compatibilityScore: 50,
        analysis: {
          strengths: ['Unable to analyze strengths - please try again'],
          gaps: ['Unable to analyze gaps - please try again'],
          suggestions: [{
            section: 'General',
            current: 'Current resume content',
            suggested: 'Please resubmit for detailed analysis'
          }]
        }
      };
    }
  }

  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  async testConnection() {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello, this is a test.' }],
        max_tokens: 10
      });
      
      console.log('✅ OpenAI connection test successful');
      return true;
    } catch (error) {
      console.error('❌ OpenAI connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new OpenAIService();