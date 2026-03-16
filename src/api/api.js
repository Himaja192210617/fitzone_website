import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include user_id or other tokens if needed
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.user_id) {
      // Some endpoints might need this, or we pass it specifically in the calls
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
