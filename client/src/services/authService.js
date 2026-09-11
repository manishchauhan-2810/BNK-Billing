import api from './api';

// Your backend always responds with { success, message, data }.
// Every method here returns just the inner `data` payload so pages don't
// have to know about that envelope.

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data; // { user, token }
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data; // { user }
  }
};