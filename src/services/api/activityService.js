import activitiesData from "@/services/mockData/activities.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getActivities = async (limit = 10) => {
  await delay(300);
  return [...activitiesData]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

export const getActivityById = async (id) => {
  await delay(200);
  const activity = activitiesData.find(a => a.Id === parseInt(id));
  if (!activity) {
    throw new Error("Activity not found");
  }
  return { ...activity };
};

export const createActivity = async (activityData) => {
  await delay(350);
  const maxId = Math.max(...activitiesData.map(a => a.Id));
  const newActivity = {
    ...activityData,
    Id: maxId + 1,
    timestamp: new Date().toISOString()
  };
  activitiesData.unshift(newActivity);
  return { ...newActivity };
};

export const getActivitiesByPatient = async (patientId) => {
  await delay(250);
  return activitiesData
    .filter(a => a.relatedPatientId === patientId.toString())
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getActivitiesByType = async (type) => {
  await delay(250);
  return activitiesData
    .filter(a => a.type === type)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};