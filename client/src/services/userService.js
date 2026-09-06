import api from './api';

export const getProfile = async () => {
  return await api.get('/user/profile');
};

export const updateUser = async (id, userData) => {
  // PUT updated user data (patient must own the record)
  return await api.put(`/user/update/${id}`, userData);
};

export const searchUsers = async (query = '', filters = {}) => {
  const params = {};
  if (query) params.query = query;
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });
  return await api.get('/user/search', { params });
};

export const uploadProfileImage = async (formData) => {
  // PATCH profile image upload (owner must match)
  return await api.patch('/user/upload-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
