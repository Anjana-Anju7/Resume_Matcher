import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/api/users/login', { email, password });
    return response.data;
  },

  async register(name, email, password) {
    const response = await api.post('/api/users/register', { name, email, password });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  }
};