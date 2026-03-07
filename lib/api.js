import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// --- THE FIX: AUTH INTERCEPTOR ---
// This automatically attaches your accessToken to EVERY request
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle 401 (Expired Token) errors automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token is invalid/expired, clear storage and boot to login
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;