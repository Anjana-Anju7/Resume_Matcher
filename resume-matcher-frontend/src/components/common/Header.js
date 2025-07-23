import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">ResumeMatch</span>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'nav-mobile-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Analyze
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/history" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  History
                </Link>
                <div className="user-menu">
                  <button className="user-menu-btn">
                    <span className="user-avatar">{user?.name?.charAt(0)}</span>
                    <span className="user-name">{user?.name}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-link">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-link logout-btn">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="nav-link nav-link-primary" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'hamburger-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;