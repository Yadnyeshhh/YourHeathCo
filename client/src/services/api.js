import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_BASE_URL = envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');

    let token = null;
    const url = config.url || '';

    if (
      url.startsWith('/admin') ||
      url.includes('/user/assign') ||
      url.includes('/user/unassign') ||
      url.includes('/user/search')
    ) {
      token = adminToken;
    } else if (url.startsWith('/user/')) {
      token = userToken;
    } else {
      // Shared endpoints (e.g., /meds_meals, /appointment)
      token = adminToken || userToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

  api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
  );

export default api;
