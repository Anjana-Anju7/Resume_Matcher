import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { analysisService } from '../../services/analysisService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './AnalysisForm.css';

const AnalysisForm = ({ onAnalysisComplete }) => {
  const [formData, setFormData] = useState({
    jobDescription: '',
    resume: '',
    jobTitle: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, isAuthenticated } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await analysisService.analyzeResume(formData);
      onAnalysisComplete(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCharacterCount = (field) => formData[field].length;
  const getCharacterCountClass = (field, max) => {
    const count = getCharacterCount(field);
    if (count > max * 0.9) return 'char-count warning';
    if (count > max * 0.8) return 'char-count caution';
    return 'char-count';
  };

  if (loading) {
    return (
      <LoadingSpinner 
        message="🤖 AI is analyzing your resume... This may take up to 30 seconds."
        size="large"
      />
    );
  }

  return (
    <div className="analysis-form-container">
      <div className="form-header">
        <h2>AI Resume Analysis</h2>
        <p>Get instant feedback on how well your resume matches the job description</p>
        
        {isAuthenticated ? (
          <div className="user-info">
            <span className="user-greeting">Welcome back, {user?.name}!</span>
            <span className={`subscription-badge ${user?.subscription}`}>
              {user?.subscription} Plan
            </span>
          </div>
        ) : (
          <div className="guest-info">
            <p>
              💡 <strong>Tip:</strong> <a href="/register">Create a free account</a> to save your analyses and track your progress!
            </p>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="analysis-form">
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="jobTitle">
              Job Title <span className="optional">(Optional)</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Senior Software Engineer"
              maxLength="200"
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="companyName">
              Company Name <span className="optional">(Optional)</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g., Google, Microsoft"
              maxLength="200"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="jobDescription">
            Job Description *
            <span className={getCharacterCountClass('jobDescription', 5000)}>
              {getCharacterCount('jobDescription')}/5000
            </span>
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the complete job description here. Include requirements, responsibilities, and qualifications..."
            rows={10}
            required
            minLength="100"
            maxLength="5000"
          />
          <div className="field-help">
            Minimum 100 characters. Include job requirements, responsibilities, and qualifications for best results.
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="resume">
            Resume Content *
            <span className={getCharacterCountClass('resume', 10000)}>
              {getCharacterCount('resume')}/10000
            </span>
          </label>
          <textarea
            id="resume"
            name="resume"
            value={formData.resume}
            onChange={handleChange}
            placeholder="Paste your resume content here. Include your experience, skills, education, and achievements..."
            rows={15}
            required
            minLength="200"
            maxLength="10000"
          />
          <div className="field-help">
            Minimum 200 characters. Include your full resume content for comprehensive analysis.
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="analyze-button"
            disabled={loading || !formData.jobDescription.trim() || !formData.resume.trim()}
          >
            <span className="button-icon">🤖</span>
            Analyze Resume Match
          </button>
        </div>

        <div className="form-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <span>Instant AI Analysis</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <span>Compatibility Score</span>
            </div>
            <div className="info-item">
              <span className="info-icon">💡</span>
              <span>Tailored Suggestions</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔒</span>
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnalysisForm;