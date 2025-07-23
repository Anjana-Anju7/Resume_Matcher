import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '' });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <LoadingSpinner message="Updating profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {success && <ErrorMessage message={success} type="success" onClose={() => setSuccess('')} />}

        <div className="profile-content">
          {/* Profile Info Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="btn-icon">✏️</span>
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={loading}
                  >
                    <span className="btn-icon">💾</span>
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <label>Full Name</label>
                  <div className="info-value">{user?.name}</div>
                </div>
                <div className="info-group">
                  <label>Email Address</label>
                  <div className="info-value">{user?.email}</div>
                </div>
                <div className="info-group">
                  <label>Member Since</label>
                  <div className="info-value">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Stats Card */}
          <div className="stats-card">
            <div className="card-header">
              <h2>Account Statistics</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-number">{user?.analysisCount || 0}</div>
                  <div className="stat-label">Total Analyses</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💎</div>
                <div className="stat-content">
                  <div className="stat-number subscription">
                    {user?.subscription || 'Free'}
                  </div>
                  <div className="stat-label">Current Plan</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🕒</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {user?.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </div>
                  <div className="stat-label">Last Login</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions Card */}
          <div className="actions-card">
            <div className="card-header">
              <h2>Account Actions</h2>
            </div>
            <div className="actions-list">
              <div className="action-item">
                <div className="action-info">
                  <h4>Download Data</h4>
                  <p>Export all your analysis data and account information</p>
                </div>
                <button className="action-btn secondary">
                  <span className="btn-icon">📥</span>
                  Export Data
                </button>
              </div>
              
              <div className="action-item">
                <div className="action-info">
                  <h4>Change Password</h4>
                  <p>Update your account password for better security</p>
                </div>
                <button className="action-btn secondary">
                  <span className="btn-icon">🔐</span>
                  Change Password
                </button>
              </div>
              
              <div className="action-item danger">
                <div className="action-info">
                  <h4>Sign Out</h4>
                  <p>Sign out of your account on this device</p>
                </div>
                <button 
                  className="action-btn danger"
                  onClick={logout}
                >
                  <span className="btn-icon">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;