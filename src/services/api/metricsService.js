import metricsData from "@/services/mockData/metrics.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getMetrics = async () => {
  await delay(250);
  return [...metricsData];
};

export const getMetricById = async (label) => {
  await delay(200);
  const metric = metricsData.find(m => m.label === label);
  if (!metric) {
    throw new Error("Metric not found");
  }
  return { ...metric };
};

export const updateMetric = async (label, updates) => {
  await delay(300);
  const index = metricsData.findIndex(m => m.label === label);
  if (index === -1) {
    throw new Error("Metric not found");
  }
  metricsData[index] = { 
    ...metricsData[index], 
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  return { ...metricsData[index] };
};