import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'emergency_alert';

// Define updateable fields based on schema
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'severity', 'message', 'recipients', 'timestamp', 
  'status', 'sentBy', 'acknowledgedBy', 'createdAt', 'updatedAt'
];

export const emergencyService = {
  getAll: async () => {
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
          { field: { Name: "severity" } },
          { field: { Name: "message" } },
          { field: { Name: "recipients" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "status" } },
          { field: { Name: "sentBy" } },
          { field: { Name: "acknowledgedBy" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching emergency alerts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getById: async (id) => {
    try {
      const alertId = parseInt(id);
      if (isNaN(alertId)) {
        throw new Error('Invalid alert ID');
      }

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
          { field: { Name: "severity" } },
          { field: { Name: "message" } },
          { field: { Name: "recipients" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "status" } },
          { field: { Name: "sentBy" } },
          { field: { Name: "acknowledgedBy" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, alertId, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Emergency alert not found');
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching emergency alert with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  create: async (alertData) => {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields and format data
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (alertData[field] !== undefined) {
          let value = alertData[field];
          
          // Format data according to field types
          if (field === 'timestamp' && value) {
            value = new Date(value).toISOString();
          } else if (field === 'createdAt' && value) {
            value = new Date(value).toISOString();
          } else if (field === 'updatedAt' && value) {
            value = new Date(value).toISOString();
          } else if (field === 'recipients' && Array.isArray(value)) {
            value = value.join(',');
          } else if (field === 'acknowledgedBy' && Array.isArray(value)) {
            value = value.join(',');
          } else if (field === 'Owner' && value) {
            value = parseInt(value?.Id || value);
          }
          
          filteredData[field] = value;
        }
      });
      
      // Set defaults
      if (!filteredData.timestamp) {
        filteredData.timestamp = new Date().toISOString();
      }
      if (!filteredData.status) {
        filteredData.status = "Sent";
      }
      if (!filteredData.sentBy) {
        filteredData.sentBy = "System";
      }
      if (!filteredData.acknowledgedBy) {
        filteredData.acknowledgedBy = "";
      }
      if (!filteredData.createdAt) {
        filteredData.createdAt = new Date().toISOString();
      }
      if (!filteredData.updatedAt) {
        filteredData.updatedAt = new Date().toISOString();
      }
      
      const params = {
        records: [filteredData]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create emergency alert ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Emergency alert created successfully');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create emergency alert');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating emergency alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, updateData) => {
    try {
      const alertId = parseInt(id);
      if (isNaN(alertId)) {
        throw new Error('Invalid alert ID');
      }

      const apperClient = getApperClient();
      
      // Filter to only include updateable fields and format data
      const filteredData = { Id: alertId };
      UPDATEABLE_FIELDS.forEach(field => {
        if (updateData[field] !== undefined) {
          let value = updateData[field];
          
          // Format data according to field types
          if (field === 'timestamp' && value) {
            value = new Date(value).toISOString();
          } else if (field === 'createdAt' && value) {
            value = new Date(value).toISOString();
          } else if (field === 'updatedAt' && value) {
            value = new Date(value).toISOString();
          } else if (field === 'recipients' && Array.isArray(value)) {
            value = value.join(',');
          } else if (field === 'acknowledgedBy' && Array.isArray(value)) {
            value = value.join(',');
          } else if (field === 'Owner' && value) {
            value = parseInt(value?.Id || value);
          }
          
          filteredData[field] = value;
        }
      });
      
      // Always update the updatedAt timestamp
      filteredData.updatedAt = new Date().toISOString();
      
      const params = {
        records: [filteredData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Emergency alert not found');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update emergency alert ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Emergency alert updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Emergency alert not found');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating emergency alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const alertId = parseInt(id);
      if (isNaN(alertId)) {
        throw new Error('Invalid alert ID');
      }

      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [alertId]
      };
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Emergency alert not found');
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete emergency alert ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Emergency alert deleted successfully');
          return { success: true };
        }
      }
      
      throw new Error('Emergency alert not found');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting emergency alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  acknowledge: async (id, acknowledgedBy) => {
    try {
      const alertId = parseInt(id);
      if (isNaN(alertId)) {
        throw new Error('Invalid alert ID');
      }

      // First get the current alert
      const currentAlert = await emergencyService.getById(id);
      
      // Parse current acknowledgedBy list
      const currentAcknowledged = currentAlert.acknowledgedBy ? 
        currentAlert.acknowledgedBy.split(',').filter(Boolean) : [];
      
      // Add new acknowledgment if not already present
      if (!currentAcknowledged.includes(acknowledgedBy)) {
        currentAcknowledged.push(acknowledgedBy);
        
        // Update the alert
        const updateData = {
          acknowledgedBy: currentAcknowledged,
          updatedAt: new Date().toISOString()
        };
        
        return await emergencyService.update(id, updateData);
      }
      
      return currentAlert;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error acknowledging emergency alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  getRecent: async (limit = 10) => {
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
          { field: { Name: "severity" } },
          { field: { Name: "message" } },
          { field: { Name: "recipients" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "status" } },
          { field: { Name: "sentBy" } },
          { field: { Name: "acknowledgedBy" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent emergency alerts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getBySeverity: async (severity) => {
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
          { field: { Name: "severity" } },
          { field: { Name: "message" } },
          { field: { Name: "recipients" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "status" } },
          { field: { Name: "sentBy" } },
          { field: { Name: "acknowledgedBy" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "severity",
            Operator: "EqualTo",
            Values: [severity]
          }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching emergency alerts by severity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
}
};