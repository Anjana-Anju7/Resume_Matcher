import api from './api';

export const analysisService = {
  async analyzeResume(data) {
    const response = await api.post('/api/analysis', data);
    return response.data;
  },

  async getAnalysisById(id) {
    const response = await api.get(`/api/analysis/${id}`);
    return response.data;
  },

  async getAnalysisHistory(params = {}) {
    const response = await api.get('/api/analysis/user/history', { params });
    return response.data;
  },

  async getAnalysisStatus() {
    const response = await api.get('/api/analysis/status');
    return response.data;
  },

  // MongoDB-specific methods
  async getMongoAnalysisById(id) {
    const response = await api.get(`/api/analysis/mongo/${id}`);
    return response.data;
  },

  async getMongoAnalysisHistory(params = {}) {
    const response = await api.get('/api/analysis/mongo/history', { params });
    return response.data;
  },

  async getMongoAnalysisBySession(sessionId) {
    const response = await api.get(`/api/analysis/mongo/session/${sessionId}`);
    return response.data;
  },

  async getMongoAnalysisByUser(userId, params = {}) {
    const response = await api.get(`/api/analysis/mongo/user/${userId}`, { params });
    return response.data;
  }
};