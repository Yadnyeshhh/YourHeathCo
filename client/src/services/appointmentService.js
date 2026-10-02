import api from './api';

export const getAppointments = async (patientId) => {
  return await api.get(`/appointments/${patientId}`);
};

export const updateAppointment = async (patientId, appointmentData) => {
  return await api.put(`/appointments/${patientId}`, appointmentData);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  return await api.put(`/appointments/${appointmentId}/status`, { status });
};

export const requestAppointment = async (appointmentData) => {
  return await api.post('/appointments/request', appointmentData);
};

export const deleteAppointment = async (appointmentId) => {
  return await api.delete(`/appointments/${appointmentId}`);
};
