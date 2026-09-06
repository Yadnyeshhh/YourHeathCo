import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_BASE_URL = envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : (error.message || 'An unexpected error occurred');
    return Promise.reject(new Error(message));
  }
);

export default adminApi;
