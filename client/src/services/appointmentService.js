import api from './api';

export const getAppointments = async (patientId) => {
  return await api.get(`/appointments/${patientId}`);
};

export const updateAppointment = async (patientId, appointmentData) => {
  return await api.put(`/appointments/${patientId}`, appointmentData);
};
