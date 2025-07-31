import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'patient';

// Define updateable fields based on schema
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'age', 'roomNumber', 'attendingDoctor', 
  'admissionStatus', 'admissionDate', 'admissionFrom', 'admissionTo', 'condition', 'emergencyContact'
];

export const getPatients = async () => {
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
        { field: { Name: "age" } },
        { field: { Name: "roomNumber" } },
        { field: { Name: "attendingDoctor" } },
        { field: { Name: "admissionStatus" } },
        { field: { Name: "admissionDate" } },
        { field: { Name: "admissionFrom" } },
        { field: { Name: "admissionTo" } },
        { field: { Name: "condition" } },
        { field: { Name: "emergencyContact" } }
      ],
      orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
      pagingInfo: { limit: 100, offset: 0 }
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
      console.error("Error fetching patients:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getPatientById = async (id) => {
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
        { field: { Name: "age" } },
        { field: { Name: "roomNumber" } },
        { field: { Name: "attendingDoctor" } },
        { field: { Name: "admissionStatus" } },
        { field: { Name: "admissionDate" } },
        { field: { Name: "admissionFrom" } },
        { field: { Name: "admissionTo" } },
        { field: { Name: "condition" } },
        { field: { Name: "emergencyContact" } }
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
      console.error(`Error fetching patient with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const createPatient = async (patientData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields and format data
    const filteredData = {};
UPDATEABLE_FIELDS.forEach(field => {
      if (patientData[field] !== undefined) {
        let value = patientData[field];
        
        // Format data according to field types
        if (field === 'age' && value) {
          value = parseInt(value);
        } else if ((field === 'admissionDate' || field === 'admissionFrom' || field === 'admissionTo') && value) {
          value = new Date(value).toISOString();
        } else if (field === 'Owner' && value) {
          value = parseInt(value?.Id || value);
        }
        
        filteredData[field] = value;
      }
});
    
    // Validate that admission date and admission from date are the same
    if (filteredData.admissionDate && filteredData.admissionFrom) {
      const admissionDate = new Date(filteredData.admissionDate);
      const admissionFromDate = new Date(filteredData.admissionFrom);
      
      if (admissionDate.toISOString() !== admissionFromDate.toISOString()) {
        toast.error("Admission date and admission from date must be the same");
        return null;
      }
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
        console.error(`Failed to create patient ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success('Patient created successfully');
        return successfulRecords[0].data;
      }
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating patient:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const updatePatient = async (id, updates) => {
  try {
    const apperClient = getApperClient();
    
// Filter to only include updateable fields and format data
    const filteredData = { Id: parseInt(id) };
    UPDATEABLE_FIELDS.forEach(field => {
      if (updates[field] !== undefined) {
        let value = updates[field];
        
        // Format data according to field types
        if (field === 'age' && value) {
          value = parseInt(value);
        } else if ((field === 'admissionDate' || field === 'admissionFrom' || field === 'admissionTo') && value) {
          value = new Date(value).toISOString();
        } else if (field === 'Owner' && value) {
          value = parseInt(value?.Id || value);
        }
        
        filteredData[field] = value;
      }
});
    
    // Validate that admission date and admission from date are the same
    if (filteredData.admissionDate && filteredData.admissionFrom) {
      const admissionDate = new Date(filteredData.admissionDate);
      const admissionFromDate = new Date(filteredData.admissionFrom);
      
      if (admissionDate.toISOString() !== admissionFromDate.toISOString()) {
        toast.error("Admission date and admission from date must be the same");
        return null;
      }
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
        console.error(`Failed to update patient ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success('Patient updated successfully');
        return successfulUpdates[0].data;
      }
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating patient:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const deletePatient = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete patient ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success('Patient deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting patient:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};