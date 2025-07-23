import React from 'react';
import './AnalysisBreakdown.css';

const AnalysisBreakdown = ({ analysis }) => {
  return (
    <div className="analysis-breakdown">
      <div className="breakdown-grid">
        {/* Strengths Section */}
        <div className="breakdown-section strengths">
          <div className="section-header">
            <h3>
              <span className="section-icon">✅</span>
              Your Strengths
            </h3>
            <span className="count-badge">{analysis.strengths?.length || 0}</span>
          </div>
          <div className="section-content">
            {analysis.strengths && analysis.strengths.length > 0 ? (
              <ul className="items-list">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="list-item strength-item">
                    <span className="item-bullet">🌟</span>
                    <span className="item-text">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <p>No specific strengths identified. Try adding more relevant keywords and experiences.</p>
              </div>
            )}
          </div>
        </div>

        {/* Gaps Section */}
        <div className="breakdown-section gaps">
          <div className="section-header">
            <h3>
              <span className="section-icon">⚠️</span>
              Areas to Improve
            </h3>
            <span className="count-badge">{analysis.gaps?.length || 0}</span>
          </div>
          <div className="section-content">
            {analysis.gaps && analysis.gaps.length > 0 ? (
              <ul className="items-list">
                {analysis.gaps.map((gap, index) => (
                  <li key={index} className="list-item gap-item">
                    <span className="item-bullet">🔧</span>
                    <span className="item-text">{gap}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🎉</span>
                <p>Great! No major gaps identified in your resume.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h3>
          <span className="section-icon">📊</span>
          Analysis Summary
        </h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-number strengths-color">
              {analysis.strengths?.length || 0}
            </div>
            <div className="summary-label">Strengths Found</div>
          </div>
          <div className="summary-item">
            <div className="summary-number gaps-color">
              {analysis.gaps?.length || 0}
            </div>
            <div className="summary-label">Areas to Improve</div>
          </div>
          <div className="summary-item">
            <div className="summary-number suggestions-color">
              {analysis.suggestions?.length || 0}
            </div>
            <div className="summary-label">AI Suggestions</div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="action-items">
        <h4>📝 Quick Action Items:</h4>
        <ul className="action-list">
          {analysis.gaps?.length > 0 && (
            <li>Review the "Areas to Improve" and consider how to address them</li>
          )}
          {analysis.suggestions?.length > 0 && (
            <li>Check the "Suggestions" tab for specific improvement recommendations</li>
          )}
          <li>Update your resume with the suggested changes</li>
          <li>Re-analyze your updated resume to track improvement</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisBreakdown;