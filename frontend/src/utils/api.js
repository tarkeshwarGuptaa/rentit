import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach token ───────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roomnear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle errors globally ────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired or invalid — clear auth and redirect
          localStorage.removeItem('roomnear_token');
          localStorage.removeItem('roomnear_user');
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('You do not have permission for this action');
          break;
        case 404:
          // Don't toast 404s — let individual pages handle them
          break;
        case 409:
          toast.error(message);
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          break;
      }
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Unable to reach the server. Check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
