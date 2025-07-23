import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ResumeMatch</h4>
            <p>AI-powered resume analysis to help you land your dream job.</p>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>AI Resume Analysis</li>
              <li>Compatibility Scoring</li>
              <li>Tailored Suggestions</li>
              <li>Job Matching</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 ResumeMatch. Powered by OpenAI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;