import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export default api;
