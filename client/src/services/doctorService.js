import api from './api';

export const getAllDoctors = async (patientId) => {
  const url = patientId ? `/doctors?patientId=${patientId}` : '/doctors';
  return await api.get(url);
};

export const getDoctorById = async (id) => {
  return await api.get(`/doctors/${id}`);
};

export const createDoctor = async (doctorData) => {
  return await api.post('/doctors', doctorData);
};

export const updateDoctor = async (id, doctorData) => {
  return await api.put(`/doctors/${id}`, doctorData);
};

export const deleteDoctor = async (id) => {
  return await api.delete(`/doctors/${id}`);
};
