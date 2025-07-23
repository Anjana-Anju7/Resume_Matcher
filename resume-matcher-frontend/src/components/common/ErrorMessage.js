import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
  return (
    <div className={`message ${type}`}>
      <div className="message-content">
        <span className="message-icon">
          {type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
        </span>
        <span className="message-text">{message}</span>
        {onClose && (
          <button className="message-close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;