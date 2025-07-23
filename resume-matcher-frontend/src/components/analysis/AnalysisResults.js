import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CompatibilityScore from './CompatibilityScore';
import AnalysisBreakdown from './AnalysisBreakdown';
import SuggestedEdits from './SuggestedEdits';
import ExportResults from './ExportResults';
import './AnalysisResults.css';

const AnalysisResults = ({ result, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isAuthenticated } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
    { id: 'export', label: 'Export', icon: '📋' }
  ];

  return (
    <div className="analysis-results">
      <div className="results-header">
        <div className="results-title">
          <h2>Analysis Complete!</h2>
          <div className="results-meta">
            {result.jobTitle && (
              <div className="job-info">
                <span className="job-title">{result.jobTitle}</span>
                {result.companyName && (
                  <span className="company-name">at {result.companyName}</span>
                )}
              </div>
            )}
            <div className="analysis-meta">
              <span className="analysis-date">
                📅 {new Date(result.processedAt).toLocaleString()}
              </span>
              {result.processingTime && (
                <span className="processing-time">
                  ⚡ Analyzed in {(result.processingTime / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="results-actions">
          <button onClick={onNewAnalysis} className="new-analysis-btn">
            <span className="button-icon">🔄</span>
            New Analysis
          </button>
          {!isAuthenticated && (
            <a href="/register" className="save-results-btn">
              <span className="button-icon">💾</span>
              Sign Up to Save Results
            </a>
          )}
        </div>
      </div>

      {/* Compatibility Score - Always visible */}
      <CompatibilityScore score={result.compatibilityScore} />

      {/* Tab Navigation */}
      <div className="results-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="results-content">
        {activeTab === 'overview' && (
          <AnalysisBreakdown analysis={result.analysis} />
        )}
        
        {activeTab === 'suggestions' && (
          <SuggestedEdits suggestions={result.analysis.suggestions} />
        )}
        
        {activeTab === 'export' && (
          <ExportResults result={result} />
        )}
      </div>

      {/* Footer Info */}
      <div className="results-footer">
        <div className="analysis-info">
          <div className="info-item">
            <span className="info-label">Analysis ID:</span>
            <span className="info-value">{result.analysisId}</span>
          </div>
          {result.tokensUsed && (
            <div className="info-item">
              <span className="info-label">AI Tokens Used:</span>
              <span className="info-value">{result.tokensUsed}</span>
            </div>
          )}
                <div className="info-item">
        <span className="info-label">Powered by:</span>
        <span className="info-value">OpenAI GPT-3.5</span>
      </div>
    </div>
    
    {!isAuthenticated && (
      <div className="upgrade-prompt">
        <p>
          <strong>💎 Want to save your analyses and track progress?</strong> 
          <a href="/register" className="upgrade-link">Create a free account!</a>
        </p>
      </div>
    )}
  </div>
</div>
);
};
export default AnalysisResults;