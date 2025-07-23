
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analysisService } from '../services/analysisService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await analysisService.getAnalysisHistory({ limit: 5 });
      setAnalyses(response.data.analyses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Moderate';
    return 'Needs Work';
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">
              Track your resume analysis progress and improve your job applications
            </p>
          </div>
          <Link to="/" className="new-analysis-btn">
            <span className="btn-icon">🤖</span>
            New Analysis
          </Link>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{user?.analysisCount || 0}</div>
              <div className="stat-label">Total Analyses</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💎</div>
            <div className="stat-content">
              <div className="stat-number subscription">
                {user?.subscription || 'Free'}
              </div>
              <div className="stat-label">Plan</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">
                {new Date(user?.createdAt).toLocaleDateString()}
              </div>
              <div className="stat-label">Member Since</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <div className="stat-number">
                {analyses.length > 0 
                  ? Math.round(analyses.reduce((sum, a) => sum + (a.results?.compatibilityScore || 0), 0) / analyses.length)
                  : 0}%
              </div>
              <div className="stat-label">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="recent-analyses">
          <div className="section-header">
            <h2>Recent Analyses</h2>
            {analyses.length > 0 && (
              <Link to="/history" className="view-all-link">
                View All History
              </Link>
            )}
          </div>

          {analyses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No analyses yet</h3>
              <p>Start by analyzing your first resume to see how well it matches job descriptions.</p>
              <Link to="/" className="get-started-btn">
                <span className="btn-icon">🤖</span>
                Analyze Resume
              </Link>
            </div>
          ) : (
            <div className="analyses-grid">
              {analyses.map((analysis) => (
                <div key={analysis._id} className="analysis-card">
                  <div className="card-header">
                    <div className="job-info">
                      <h4 className="job-title">
                        {analysis.jobTitle || 'Untitled Position'}
                      </h4>
                      {analysis.companyName && (
                        <p className="company-name">{analysis.companyName}</p>
                      )}
                    </div>
                    <div 
                      className="score-badge"
                      style={{ 
                        backgroundColor: getScoreColor(analysis.results?.compatibilityScore || 0),
                        color: 'white'
                      }}
                    >
                      {analysis.results?.compatibilityScore || 0}%
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="score-info">
                      <span className="score-label">
                        {getScoreLabel(analysis.results?.compatibilityScore || 0)} Match
                      </span>
                      <span className="analysis-date">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <Link 
                      to={`/analysis/${analysis._id}`}
                      className="view-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/" className="action-card">
              <div className="action-icon">🤖</div>
              <h3>New Analysis</h3>
              <p>Analyze a new resume against a job description</p>
            </Link>
            
            <Link to="/history" className="action-card">
              <div className="action-icon">📊</div>
              <h3>View History</h3>
              <p>Browse all your previous analyses</p>
            </Link>
            
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Profile Settings</h3>
              <p>Update your account information</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;