import api from './api';

export const loginUser = async (credentials) => {
  const data = await api.post('/user/login', credentials);
  if (data.data && data.data.token) {
    localStorage.setItem('token', data.data.token);
    if (data.data.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
  }
  return data;
};

export const signupAdmin = async (adminData) => {
  const data = await api.post('/admin/signup', adminData);
  if (data.data && data.data.token) {
    localStorage.setItem('adminToken', data.data.token);
  }
  return data;
};

export const loginAdmin = async (credentials) => {
  const data = await api.post('/admin/login', credentials);
  if (data.data && data.data.token) {
    localStorage.setItem('adminToken', data.data.token);
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('adminToken');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!localStorage.getItem('token');
export const isAdminAuthenticated = () => !!localStorage.getItem('adminToken');
