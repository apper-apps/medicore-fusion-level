import metricsData from "@/services/mockData/metrics.json";
import React from "react";
import Error from "@/components/ui/Error";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// WebSocket connection management
let wsConnection = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000;
let subscribers = new Set();

// Initialize live metrics data
let liveMetricsData = [...metricsData];

export const getMetrics = async () => {
  await delay(250);
  return [...liveMetricsData];
};

export const getMetricById = async (label) => {
  await delay(200);
  const metric = liveMetricsData.find(m => m.label === label);
  if (!metric) {
    throw new Error("Metric not found");
  }
  return { ...metric };
};

export const updateMetric = async (label, updates) => {
  await delay(300);
  const index = liveMetricsData.findIndex(m => m.label === label);
  if (index === -1) {
    throw new Error("Metric not found");
  }
  liveMetricsData[index] = { 
    ...liveMetricsData[index], 
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  return { ...liveMetricsData[index] };
};

// WebSocket connection management
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
    if (mockWebSocket.readyState === WebSocket.OPEN) {
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