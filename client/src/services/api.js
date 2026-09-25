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
    // Choose token: admin token for admin routes and meds_meals, otherwise patient token
    const isAdminRoute = config.url && (
      config.url.startsWith('/admin') ||
      config.url.includes('/user/assign') ||
      config.url.includes('/user/unassign') ||
      config.url.includes('/meds_meals')
    );
    const token = isAdminRoute ? adminToken : userToken;
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
