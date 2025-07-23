import React from 'react';
import AnalysisResults from './AnalysisResults';
import './MongoAnalysisDisplay.css';

const MongoAnalysisDisplay = ({ mongoResult, onNewAnalysis }) => {
  // Transform MongoDB data to match the expected AnalysisResults format
  const transformMongoData = (data) => {
    return {
      analysisId: data._id?.$oid || data._id,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      processedAt: data.createdAt?.$date ? new Date(data.createdAt.$date.$numberLong ? parseInt(data.createdAt.$date.$numberLong) : data.createdAt.$date) : new Date(),
      processingTime: data.processingTime?.$numberInt ? parseInt(data.processingTime.$numberInt) : data.processingTime,
      compatibilityScore: data.results?.compatibilityScore?.$numberInt ? 
        parseInt(data.results.compatibilityScore.$numberInt) : 
        data.results?.compatibilityScore || 0,
      analysis: {
        strengths: data.results?.analysis?.strengths || [],
        gaps: data.results?.analysis?.gaps || [],
        suggestions: data.results?.analysis?.suggestions || []
      },
      tokensUsed: data.results?.tokensUsed?.$numberInt ? 
        parseInt(data.results.tokensUsed.$numberInt) : 
        data.results?.tokensUsed || 0,
      status: data.status,
      error: data.error
    };
  };

  // Handle loading state
  if (!mongoResult) {
    return (
      <div className="analysis-loading">
        <div className="loading-spinner"></div>
        <p>Loading analysis results...</p>
      </div>
    );
  }

  // Handle error state
  if (mongoResult.error) {
    return (
      <div className="analysis-error">
        <div className="error-content">
          <span className="error-icon">❌</span>
          <h3>Analysis Error</h3>
          <p>{mongoResult.error}</p>
          <button onClick={onNewAnalysis} className="retry-btn">
            Try New Analysis
          </button>
        </div>
      </div>
    );
  }

  // Handle incomplete analysis
  if (mongoResult.status !== 'completed') {
    return (
      <div className="analysis-processing">
        <div className="processing-content">
          <span className="processing-icon">⏳</span>
          <h3>Analysis in Progress</h3>
          <p>Status: {mongoResult.status}</p>
          <div className="processing-spinner"></div>
        </div>
      </div>
    );
  }

  // Transform and display results
  const transformedResult = transformMongoData(mongoResult);

  return <AnalysisResults result={transformedResult} onNewAnalysis={onNewAnalysis} />;
};

export default MongoAnalysisDisplay;