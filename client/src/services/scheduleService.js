import api from './api';

export const getSchedule = async (patientId) => {
  try {
    console.log('Fetching schedule for patient', patientId);
    return await api.get(`/meds_meals/patient/${patientId}/schedule`);
  } catch (err) {
    console.warn('Schedule not found, creating empty schedule for', patientId);
    // Create empty schedule and then fetch it
    await api.post(`/meds_meals/create/${patientId}`);
    return await api.get(`/meds_meals/patient/${patientId}/schedule`);
  }
};

export const updateMeds = async (patientId, medsData) => {
  // PATCH medications for a patient (owner must match ID)
  // Backend expects { schedule: { ... } }
  return await api.patch(`/meds_meals/patient/${patientId}/medications`, { schedule: medsData });
};
