import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error('VITE_API_URL is not set. Set it in your Render Static Site environment variables.');
}
const api = axios.create({
  baseURL: `${API_URL || ''}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;