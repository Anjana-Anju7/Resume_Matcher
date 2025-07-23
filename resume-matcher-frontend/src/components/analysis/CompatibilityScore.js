
import React, { useEffect, useState } from 'react';
import './CompatibilityScore.css';

const CompatibilityScore = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreLevel = (score) => {
    if (score >= 90) return { 
      level: 'excellent', 
      label: 'Excellent Match', 
      color: '#10b981',
      emoji: '🎯',
      description: 'Outstanding! Your resume aligns perfectly with this job.'
    };
    if (score >= 80) return { 
      level: 'strong', 
      label: 'Strong Match', 
      color: '#3b82f6',
      emoji: '💪',
      description: 'Great match! Just a few tweaks could make it perfect.'
    };
    if (score >= 70) return { 
      level: 'good', 
      label: 'Good Match', 
      color: '#f59e0b',
      emoji: '👍',
      description: 'Good foundation with some areas for improvement.'
    };
    if (score >= 60) return { 
      level: 'moderate', 
      label: 'Moderate Match', 
      color: '#f97316',
      emoji: '⚡',
      description: 'Decent match but needs several improvements.'
    };
    if (score >= 50) return { 
      level: 'weak', 
      label: 'Weak Match', 
      color: '#ef4444',
      emoji: '🔧',
      description: 'Significant changes needed to improve compatibility.'
    };
    return { 
      level: 'poor', 
      label: 'Poor Match', 
      color: '#dc2626',
      emoji: '🛠️',
      description: 'Major restructuring required for this position.'
    };
  };

  const scoreInfo = getScoreLevel(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="compatibility-score">
      <div className="score-container">
        <div className="score-visual">
          <div className="score-circle">
            <svg width="160" height="160" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={scoreInfo.color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
                className="score-progress"
                style={{
                  transition: 'stroke-dashoffset 2s ease-in-out'
                }}
              />
            </svg>
            <div className="score-content">
              <div className="score-emoji">{scoreInfo.emoji}</div>
              <div className="score-number">{animatedScore}</div>
              <div className="score-percent">%</div>
            </div>
          </div>
        </div>
        
        <div className="score-details">
          <h3 className={`score-label ${scoreInfo.level}`}>
            {scoreInfo.label}
          </h3>
          <p className="score-description">
            {scoreInfo.description}
          </p>
          
          <div className="score-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Match Quality:</span>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill"
                  style={{ 
                    width: `${score}%`, 
                    backgroundColor: scoreInfo.color 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityScore;