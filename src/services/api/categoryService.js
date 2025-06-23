const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const categoryService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } }
        ]
      };
      
      const response = await apperClient.getRecordById('category', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const params = {
        records: [{
          Name: categoryData.name,
          color: categoryData.color || '#94a3b8',
          task_count: 0
        }]
      };
      
      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create category');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id, 10),
          ...(updateData.name && { Name: updateData.name }),
          ...(updateData.color && { color: updateData.color }),
          ...(updateData.task_count !== undefined && { task_count: updateData.task_count })
        }]
      };
      
      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update category');
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  async updateTaskCount(categoryName, count) {
    try {
      // First find the category by name
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } }
        ],
        where: [
          { FieldName: "Name", Operator: "EqualTo", Values: [categoryName] }
        ]
      };
      
      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      const category = response.data[0];
      
      // Update the task count
      const updateResponse = await this.update(category.Id, { task_count: count });
      
      return updateResponse;
    } catch (error) {
      console.error("Error updating task count:", error);
      return null;
    }
  }
};

export default categoryService;