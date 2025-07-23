import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import AnalysisResults from '../components/analysis/AnalysisResults';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AnalysisDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      const response = await analysisService.getAnalysisById(id);
      setAnalysis(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner message="Loading analysis details..." />;
  }

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={error} />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => navigate('/history')}
            className="btn btn-primary"
          >
            ← Back to History
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Analysis not found</h2>
          <button 
            onClick={() => navigate('/history')}
            className="btn btn-primary"
          >
            ← Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-detail-page">
      <div className="container">
        <AnalysisResults 
          result={analysis} 
          onNewAnalysis={handleNewAnalysis}
        />
      </div>
    </div>
  );
};

export default AnalysisDetailPage;