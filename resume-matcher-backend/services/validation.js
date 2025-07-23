class ValidationService {
    validateAnalysisInput(jobDescription, resume) {
      const errors = [];
  
      // Check if inputs exist
      if (!jobDescription || typeof jobDescription !== 'string') {
        errors.push('Job description is required');
      }
  
      if (!resume || typeof resume !== 'string') {
        errors.push('Resume is required');
      }
  
      if (errors.length > 0) {
        return {
          isValid: false,
          message: 'Missing required fields',
          errors
        };
      }
  
      // Trim whitespace
      const trimmedJob = jobDescription.trim();
      const trimmedResume = resume.trim();
  
      // Check minimum lengths
      if (trimmedJob.length < 100) {
        errors.push('Job description must be at least 100 characters');
      }
  
      if (trimmedResume.length < 200) {
        errors.push('Resume must be at least 200 characters');
      }
  
      // Check maximum lengths
      if (trimmedJob.length > 5000) {
        errors.push('Job description must be less than 5000 characters');
      }
  
      if (trimmedResume.length > 10000) {
        errors.push('Resume must be less than 10000 characters');
      }
  
      // Check for basic content (not just whitespace/special characters)
      if (!/[a-zA-Z]/.test(trimmedJob)) {
        errors.push('Job description must contain valid text content');
      }
  
      if (!/[a-zA-Z]/.test(trimmedResume)) {
        errors.push('Resume must contain valid text content');
      }
  
      return {
        isValid: errors.length === 0,
        message: errors.length > 0 ? 'Input validation failed' : 'Input is valid',
        errors
      };
    }
  
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    validatePassword(password) {
      if (!password || password.length < 6) {
        return {
          isValid: false,
          message: 'Password must be at least 6 characters long'
        };
      }
  
      return {
        isValid: true,
        message: 'Password is valid'
      };
    }
  
    sanitizeInput(text) {
      if (!text || typeof text !== 'string') return '';
      
      return text
        .trim()
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 15000);
    }
  }
  
  module.exports = new ValidationService();