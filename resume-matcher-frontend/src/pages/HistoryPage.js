import React, { useState, useEffect } from 'react';
import { analysisService } from '../services/analysisService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './HistoryPage.css';

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAnalyses(currentPage);
  }, [currentPage]);

  const loadAnalyses = async (page = 1) => {
    try {
      setLoading(true);
      const response = await analysisService.getAnalysisHistory({ 
        page, 
        limit: 12 
      });
      setAnalyses(response.data.analyses);
      setPagination(response.data.pagination);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && currentPage === 1) {
    return <LoadingSpinner message="Loading your analysis history..." />;
  }

  return (
    <div className="history-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Analysis History</h1>
            <p>Review and manage all your resume analyses</p>
          </div>
          <Link to="/" className="new-analysis-btn">
            <span className="btn-icon">🤖</span>
            New Analysis
          </Link>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {loading && currentPage > 1 && (
          <div className="page-loading">
            <LoadingSpinner message="Loading..." size="small" />
          </div>
        )}

        {analyses.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h2>No analyses found</h2>
            <p>You haven't performed any resume analyses yet. Start by analyzing your first resume!</p>
            <Link to="/" className="get-started-btn">
              <span className="btn-icon">🤖</span>
              Start Analyzing
            </Link>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="results-summary">
              <div className="summary-item">
                <span className="summary-number">{pagination.totalCount || 0}</span>
                <span className="summary-label">Total Analyses</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">
                  {analyses.length > 0 
                    ? Math.round(analyses.reduce((sum, a) => sum + (a.results?.compatibilityScore || 0), 0) / analyses.length)
                    : 0}%
                </span>
                <span className="summary-label">Average Score</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">
                  {analyses.filter(a => (a.results?.compatibilityScore || 0) >= 80).length}
                </span>
                <span className="summary-label">Strong Matches</span>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="analyses-grid">
              {analyses.map((analysis) => (
                <div key={analysis._id} className="analysis-card">
                  <div className="card-header">
                    <div className="job-info">
                      <h3 className="job-title">
                        {analysis.jobTitle || 'Untitled Position'}
                      </h3>
                      {analysis.companyName && (
                        <p className="company-name">{analysis.companyName}</p>
                      )}
                    </div>
                    <div 
                      className="score-circle"
                      style={{ borderColor: getScoreColor(analysis.results?.compatibilityScore || 0) }}
                    >
                      <span 
                        className="score-number"
                        style={{ color: getScoreColor(analysis.results?.compatibilityScore || 0) }}
                      >
                        {analysis.results?.compatibilityScore || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="match-info">
                      <span 
                        className="match-label"
                        style={{ color: getScoreColor(analysis.results?.compatibilityScore || 0) }}
                      >
                        {getScoreLabel(analysis.results?.compatibilityScore || 0)} Match
                      </span>
                    </div>
                    
                    <div className="analysis-stats">
                      <div className="stat-item">
                        <span className="stat-icon">✅</span>
                        <span className="stat-text">
                          {analysis.results?.analysis?.strengths?.length || 0} Strengths
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">💡</span>
                        <span className="stat-text">
                          {analysis.results?.analysis?.suggestions?.length || 0} Suggestions
                        </span>
                      </div>
                    </div>
                    
                    <div className="analysis-date">
                      <span className="date-icon">📅</span>
                      <span className="date-text">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <Link 
                      to={`/analysis/${analysis._id}`}
                      className="view-btn"
                    >
                      <span className="btn-icon">👁️</span>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  ← Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = Math.max(1, currentPage - 2) + i;
                    if (page <= pagination.totalPages) {
                      return (
                        <button
                          key={page}
                          className={`page-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;