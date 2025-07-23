import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import AnalysisForm from '../components/analysis/AnalysisForm';
import AnalysisResults from '../components/analysis/AnalysisResults';
import './HomePage.css';

const HomePage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('analysis-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="home-page">
      <div className="container">
        {!analysisResult ? (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  AI-Powered Resume Analysis
                  <span className="hero-highlight">Get Your Dream Job</span>
                </h1>
                <p className="hero-description">
                  Get instant, AI-powered feedback on how well your resume matches specific job descriptions. 
                  Discover your strengths, identify gaps, and receive tailored suggestions to improve your chances of landing interviews.
                </p>
                
                {isAuthenticated ? (
                  <div className="user-welcome">
                    <div className="welcome-message">
                      <span className="welcome-emoji">👋</span>
                      <span>Welcome back, <strong>{user?.name}</strong>!</span>
                    </div>
                    <Link to="/dashboard" className="dashboard-button">
                      <span className="button-icon">📊</span>
                      View Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="auth-prompts">
                    <p className="auth-benefit">
                      <strong>💡 Pro Tip:</strong> Create a free account to save your analyses, 
                      track your progress, and build a stronger resume over time.
                    </p>
                    <div className="auth-buttons">
                      <Link to="/register" className="cta-button primary">
                        <span className="button-icon">🚀</span>
                        Get Started Free
                      </Link>
                      <Link to="/login" className="cta-button secondary">
                        Sign In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="hero-visual">
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">AI-Powered</div>
                    <div className="stat-label">Analysis Engine</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">Instant</div>
                    <div className="stat-label">Results</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Free to Try</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Analysis Form */}
            <section id="analysis-form" className="analysis-section">
              <AnalysisForm onAnalysisComplete={handleAnalysisComplete} />
            </section>

            {/* Features Section */}
            <section className="features-section">
              <h2 className="section-title">How It Works</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">📝</div>
                  <h3>Paste Job Description</h3>
                  <p>Copy and paste the job description from any job posting. Our AI works with all types of positions and industries.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📄</div>
                  <h3>Add Your Resume</h3>
                  <p>Paste your resume content. Include your experience, skills, education, and achievements for comprehensive analysis.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🤖</div>
                  <h3>AI Analysis</h3>
                  <p>Our advanced AI analyzes compatibility, identifies strengths and gaps, and provides detailed improvement suggestions.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💡</div>
                  <h3>Get Recommendations</h3>
                  <p>Receive specific, actionable recommendations to improve your resume and increase your chances of getting interviews.</p>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
              <h2 className="section-title">Why Choose ResumeMatch?</h2>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <div className="benefit-content">
                    <h4>Lightning Fast</h4>
                    <p>Get results in seconds, not hours</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎯</span>
                  <div className="benefit-content">
                    <h4>Highly Accurate</h4>
                    <p>Powered by advanced OpenAI technology</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔒</span>
                  <div className="benefit-content">
                    <h4>Privacy Protected</h4>
                    <p>Your data is secure and never stored</p>
                  </div>
                </div>
                <div className="benefit-item">
              <span className="benefit-icon">💰</span>
              <div className="benefit-content">
                <h4>Free to Use</h4>
                <p>No hidden fees or subscriptions required</p>
              </div>
            </div>
          </div>
        </section>
      </>
    ) : (
      /* Analysis Results */
      <section id="results" className="results-section">
        <AnalysisResults 
          result={analysisResult} 
          onNewAnalysis={handleNewAnalysis}
        />
      </section>
    )}
  </div>
</div>
);
};
export default HomePage;