import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'app_Activity';

// Define updateable fields based on schema
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'type', 'timestamp', 'description', 'severity', 'relatedPatientId'
];

export const getActivities = async (limit = 10) => {
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
        { field: { Name: "type" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "description" } },
        { field: { Name: "severity" } },
        { field: { Name: "relatedPatientId" } }
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
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activities:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getActivityById = async (id) => {
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
        { field: { Name: "type" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "description" } },
        { field: { Name: "severity" } },
        { field: { Name: "relatedPatientId" } }
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
      console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const createActivity = async (activityData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields and format data
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (activityData[field] !== undefined) {
        let value = activityData[field];
        
        // Format data according to field types
        if (field === 'timestamp' && value) {
          value = new Date(value).toISOString();
        } else if (field === 'relatedPatientId' && value) {
          value = parseInt(value?.Id || value);
        } else if (field === 'Owner' && value) {
          value = parseInt(value?.Id || value);
        }
        
        filteredData[field] = value;
      }
    });
    
    // Set default timestamp if not provided
    if (!filteredData.timestamp) {
      filteredData.timestamp = new Date().toISOString();
    }
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success('Activity created successfully');
        return successfulRecords[0].data;
      }
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating activity:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const getActivitiesByPatient = async (patientId) => {
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
        { field: { Name: "type" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "description" } },
        { field: { Name: "severity" } },
        { field: { Name: "relatedPatientId" } }
      ],
      where: [
        {
          FieldName: "relatedPatientId",
          Operator: "EqualTo",
          Values: [parseInt(patientId)]
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
      console.error("Error fetching activities by patient:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getActivitiesByType = async (type) => {
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
        { field: { Name: "type" } },
        { field: { Name: "timestamp" } },
        { field: { Name: "description" } },
        { field: { Name: "severity" } },
        { field: { Name: "relatedPatientId" } }
      ],
      where: [
        {
          FieldName: "type",
          Operator: "EqualTo",
          Values: [type]
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
      console.error("Error fetching activities by type:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};