import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'metric';

// Define updateable fields based on schema
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'label', 'value', 'unit', 'trend', 'icon', 'color', 'lastUpdated'
];

// WebSocket connection management
let wsConnection = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000;
let subscribers = new Set();

// Initialize live metrics data
let liveMetricsData = [];

export const getMetrics = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } },
        { field: { Name: "label" } },
        { field: { Name: "value" } },
        { field: { Name: "unit" } },
        { field: { Name: "trend" } },
        { field: { Name: "icon" } },
        { field: { Name: "color" } },
        { field: { Name: "lastUpdated" } }
      ],
      orderBy: [{ fieldName: "CreatedOn", sorttype: "ASC" }],
      pagingInfo: { limit: 20, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Update live metrics data for WebSocket simulation
    liveMetricsData = [...response.data];
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching metrics:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getMetricById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } },
        { field: { Name: "label" } },
        { field: { Name: "value" } },
        { field: { Name: "unit" } },
        { field: { Name: "trend" } },
        { field: { Name: "icon" } },
        { field: { Name: "color" } },
        { field: { Name: "lastUpdated" } }
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching metric with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const updateMetric = async (id, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields and format data
    const filteredData = { Id: parseInt(id) };
    UPDATEABLE_FIELDS.forEach(field => {
      if (updates[field] !== undefined) {
        let value = updates[field];
        
        // Format data according to field types
        if (field === 'value' && value) {
          value = parseInt(value);
        } else if (field === 'lastUpdated' && value) {
          value = new Date(value).toISOString();
        } else if (field === 'Owner' && value) {
          value = parseInt(value?.Id || value);
        }
        
        filteredData[field] = value;
      }
    });
    
    // Set default lastUpdated if not provided
    if (!filteredData.lastUpdated) {
      filteredData.lastUpdated = new Date().toISOString();
    }
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update metric ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success('Metric updated successfully');
        return successfulUpdates[0].data;
      }
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating metric:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

// WebSocket connection management with database integration
export const connectWebSocket = (onUpdate, onConnectionChange) => {
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    return wsConnection;
  }

  // Simulate WebSocket with mock server
  const mockWebSocket = {
    readyState: WebSocket.OPEN,
    close: () => {
      mockWebSocket.readyState = WebSocket.CLOSED;
      onConnectionChange?.(false);
    },
    send: () => {}
  };

  wsConnection = mockWebSocket;
  onConnectionChange?.(true);

  // Simulate real-time metric updates
  const updateInterval = setInterval(() => {
    if (mockWebSocket.readyState === WebSocket.OPEN && liveMetricsData.length > 0) {
      // Simulate metric changes
      const randomMetricIndex = Math.floor(Math.random() * liveMetricsData.length);
      const metric = liveMetricsData[randomMetricIndex];
      
      let newValue = metric.value;
      let newTrend = metric.trend;

      // Simulate realistic value changes
      const changePercent = (Math.random() - 0.5) * 0.1; // ±5% change
      const change = Math.floor(metric.value * changePercent);
      
      if (change !== 0) {
        newValue = Math.max(0, metric.value + change);
        newTrend = change > 0 ? "up" : "down";
      }

      const updatedMetric = {
        ...metric,
        value: newValue,
        trend: newTrend,
        lastUpdated: new Date().toISOString()
      };

      liveMetricsData[randomMetricIndex] = updatedMetric;
      
      // Notify all subscribers
      subscribers.forEach(callback => {
        callback(liveMetricsData, randomMetricIndex);
      });
      
      onUpdate?.(liveMetricsData, randomMetricIndex);
    }
  }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

  // Store interval for cleanup
  mockWebSocket._updateInterval = updateInterval;
  
  return mockWebSocket;
};

export const disconnectWebSocket = () => {
  if (wsConnection) {
    if (wsConnection._updateInterval) {
      clearInterval(wsConnection._updateInterval);
    }
    wsConnection.readyState = WebSocket.CLOSED;
    wsConnection = null;
  }
  subscribers.clear();
};

export const subscribeToMetricUpdates = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

export const getConnectionStatus = () => {
  return wsConnection && wsConnection.readyState === WebSocket.OPEN;
};