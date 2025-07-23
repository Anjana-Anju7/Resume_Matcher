import React, { useState } from 'react';
import './SuggestedEdits.css';

const SuggestedEdits = ({ suggestions }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [copiedItems, setCopiedItems] = useState(new Set());

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      const newCopied = new Set(copiedItems);
      newCopied.add(index);
      setCopiedItems(newCopied);
      
      setTimeout(() => {
        setCopiedItems(prev => {
          const updated = new Set(prev);
          updated.delete(index);
          return updated;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="suggested-edits">
        <div className="no-suggestions">
          <div className="no-suggestions-icon">🎯</div>
          <h3>No Specific Suggestions</h3>
          <p>Your resume appears to be well-aligned with the job requirements! Consider reviewing the strengths and gaps sections for additional insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="suggested-edits">
      <div className="suggestions-header">
        <h3>
          <span className="header-icon">💡</span>
          AI-Powered Suggestions
        </h3>
        <p>Click on any suggestion below to see detailed before/after comparisons.</p>
      </div>

      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <div 
              className="suggestion-header"
              onClick={() => toggleExpanded(index)}
            >
              <div className="suggestion-title">
                <span className="section-badge">{suggestion.section}</span>
                <span className="suggestion-preview">
                  {suggestion.current.substring(0, 60)}
                  {suggestion.current.length > 60 ? '...' : ''}
                </span>
              </div>
              <span className="expand-icon">
                {expandedItems.has(index) ? '🔽' : '▶️'}
              </span>
            </div>

            {expandedItems.has(index) && (
              <div className="suggestion-content">
                <div className="suggestion-comparison">
                  <div className="version-container current-version">
                    <h4>
                      <span className="version-icon">📝</span>
                      Current Version
                    </h4>
                    <div className="text-content current">
                      {suggestion.current}
                    </div>
                  </div>

                  <div className="arrow-container">
                    <div className="improvement-arrow">
                      <span className="arrow-icon">→</span>
                      <span className="arrow-label">AI Improved</span>
                    </div>
                  </div>

                  <div className="version-container suggested-version">
                    <h4>
                      <span className="version-icon">✨</span>
                      Suggested Improvement
                      <button
                        className={`copy-btn ${copiedItems.has(index) ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(suggestion.suggested, index)}
                        title="Copy suggested text"
                      >
                        {copiedItems.has(index) ? '✅ Copied!' : '📋 Copy'}
                      </button>
                    </h4>
                    <div className="text-content suggested">
                      {suggestion.suggested}
                    </div>
                  </div>
                </div>

                <div className="suggestion-benefits">
                  <h5>
                    <span className="benefits-icon">🎯</span>
                    Why this helps:
                  </h5>
                  <ul className="benefits-list">
                    <li>Better keyword alignment with job requirements</li>
                    <li>More specific and measurable language</li>
                    <li>Enhanced readability for ATS systems</li>
                    <li>Stronger impact and professional tone</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="suggestions-footer">
        <div className="implementation-tips">
          <h4>
            <span className="tips-icon">💡</span>
            Implementation Tips:
          </h4>
          <div className="tips-grid">
            <div className="tip-item">
              <span className="tip-icon">✅</span>
              <span>Apply suggestions that match your actual experience</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <span>Maintain honesty while optimizing for keywords</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📝</span>
              <span>Consider the overall flow and readability</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🏢</span>
              <span>Tailor further based on company culture</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedEdits;