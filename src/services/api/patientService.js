import patientsData from "@/services/mockData/patients.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPatients = async () => {
  await delay(300);
  return [...patientsData];
};

export const getPatientById = async (id) => {
  await delay(200);
  const patient = patientsData.find(p => p.Id === parseInt(id));
  if (!patient) {
    throw new Error("Patient not found");
  }
  return { ...patient };
};

export const createPatient = async (patientData) => {
  await delay(400);
  const maxId = Math.max(...patientsData.map(p => p.Id));
  const newPatient = {
    ...patientData,
    Id: maxId + 1,
    admissionDate: new Date().toISOString()
  };
  patientsData.push(newPatient);
  return { ...newPatient };
};

export const updatePatient = async (id, updates) => {
  await delay(350);
  const index = patientsData.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Patient not found");
  }
  patientsData[index] = { ...patientsData[index], ...updates };
  return { ...patientsData[index] };
};

export const deletePatient = async (id) => {
  await delay(250);
  const index = patientsData.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Patient not found");
  }
  const deletedPatient = { ...patientsData[index] };
  patientsData.splice(index, 1);
  return deletedPatient;
};