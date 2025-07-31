const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StaffService {
  constructor() {
    // Initialize ApperClient
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      await delay(300);
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "contactInformation" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords('staff', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching staff:", error?.response?.data?.message);
      } else {
        console.error("Error fetching staff:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(300);
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "contactInformation" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById('staff', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching staff with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching staff with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(staffData) {
    try {
      await delay(300);
      
      // Only include updateable fields
      const updateableData = {
        Name: staffData.Name || '',
        role: staffData.role || '',
        department: staffData.department || '',
        contactInformation: staffData.contactInformation || ''
      };

      // Add Tags and Owner if provided
      if (staffData.Tags) updateableData.Tags = staffData.Tags;
      if (staffData.Owner) updateableData.Owner = parseInt(staffData.Owner);

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('staff', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} staff records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.map(result => result.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating staff:", error?.response?.data?.message);
      } else {
        console.error("Error creating staff:", error.message);
      }
      throw error;
    }
  }

  async update(id, staffData) {
    try {
      await delay(300);
      
      // Only include updateable fields plus Id
      const updateableData = {
        Id: parseInt(id),
        Name: staffData.Name || '',
        role: staffData.role || '',
        department: staffData.department || '',
        contactInformation: staffData.contactInformation || ''
      };

      // Add Tags and Owner if provided
      if (staffData.Tags) updateableData.Tags = staffData.Tags;
      if (staffData.Owner) updateableData.Owner = parseInt(staffData.Owner);

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord('staff', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} staff records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.map(result => result.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating staff:", error?.response?.data?.message);
      } else {
        console.error("Error updating staff:", error.message);
      }
      throw error;
    }
  }

  async delete(recordIds) {
    try {
      await delay(300);
      
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await this.apperClient.deleteRecord('staff', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} staff records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting staff:", error?.response?.data?.message);
      } else {
        console.error("Error deleting staff:", error.message);
      }
      throw error;
    }
  }
}

export default new StaffService();