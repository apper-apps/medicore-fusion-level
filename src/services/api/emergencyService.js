import mockEmergencyAlerts from "@/services/mockData/emergencyAlerts.json";

let emergencyAlerts = [...mockEmergencyAlerts];
let nextId = Math.max(...emergencyAlerts.map(alert => alert.Id)) + 1;

export const emergencyService = {
  getAll: () => {
    return Promise.resolve([...emergencyAlerts]);
  },

  getById: (id) => {
    const alertId = parseInt(id);
    if (isNaN(alertId)) {
      return Promise.reject(new Error('Invalid alert ID'));
    }
    
    const alert = emergencyAlerts.find(a => a.Id === alertId);
    if (!alert) {
      return Promise.reject(new Error('Emergency alert not found'));
    }
    
    return Promise.resolve({ ...alert });
  },

  create: (alertData) => {
    const newAlert = {
      Id: nextId++,
      severity: alertData.severity,
      message: alertData.message,
      recipients: alertData.recipients,
      timestamp: alertData.timestamp || new Date().toISOString(),
      status: alertData.status || "Sent",
      sentBy: alertData.sentBy || "System",
      acknowledgedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    emergencyAlerts.unshift(newAlert);
    return Promise.resolve({ ...newAlert });
  },

  update: (id, updateData) => {
    const alertId = parseInt(id);
    if (isNaN(alertId)) {
      return Promise.reject(new Error('Invalid alert ID'));
    }

    const index = emergencyAlerts.findIndex(a => a.Id === alertId);
    if (index === -1) {
      return Promise.reject(new Error('Emergency alert not found'));
    }

    const updatedAlert = {
      ...emergencyAlerts[index],
      ...updateData,
      Id: alertId,
      updatedAt: new Date().toISOString()
    };

    emergencyAlerts[index] = updatedAlert;
    return Promise.resolve({ ...updatedAlert });
  },

  delete: (id) => {
    const alertId = parseInt(id);
    if (isNaN(alertId)) {
      return Promise.reject(new Error('Invalid alert ID'));
    }

    const index = emergencyAlerts.findIndex(a => a.Id === alertId);
    if (index === -1) {
      return Promise.reject(new Error('Emergency alert not found'));
    }

    const deletedAlert = emergencyAlerts.splice(index, 1)[0];
    return Promise.resolve({ ...deletedAlert });
  },

  acknowledge: (id, acknowledgedBy) => {
    const alertId = parseInt(id);
    if (isNaN(alertId)) {
      return Promise.reject(new Error('Invalid alert ID'));
    }

    const index = emergencyAlerts.findIndex(a => a.Id === alertId);
    if (index === -1) {
      return Promise.reject(new Error('Emergency alert not found'));
    }

    const alert = emergencyAlerts[index];
    if (!alert.acknowledgedBy.includes(acknowledgedBy)) {
      alert.acknowledgedBy.push(acknowledgedBy);
      alert.updatedAt = new Date().toISOString();
    }

    return Promise.resolve({ ...alert });
  },

  getRecent: (limit = 10) => {
    const sortedAlerts = [...emergencyAlerts].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    return Promise.resolve(sortedAlerts.slice(0, limit));
  },

  getBySeverity: (severity) => {
    const filteredAlerts = emergencyAlerts.filter(alert => 
      alert.severity.toLowerCase() === severity.toLowerCase()
    );
    return Promise.resolve([...filteredAlerts]);
  }
};