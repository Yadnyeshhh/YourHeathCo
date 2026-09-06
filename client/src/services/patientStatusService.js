import api from './api';

export const updatePatientStatus = async (patientId, statusData) => {
  return await api.put(`/patient-status/${patientId}`, statusData);
};
