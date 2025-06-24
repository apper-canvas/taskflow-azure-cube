const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const taskService = {
  async getAll() {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "category" } },
          { field: { Name: "phone" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "category" } },
          { field: { Name: "phone" } }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
const params = {
        records: [{
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description || '',
          completed: false,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          created_at: new Date().toISOString(),
          category: taskData.category,
          phone: taskData.phone || ''
        }]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
const params = {
        records: [{
          Id: parseInt(id, 10),
          ...(updateData.title && { Name: updateData.title, title: updateData.title }),
          ...(updateData.description !== undefined && { description: updateData.description }),
          ...(updateData.completed !== undefined && { completed: updateData.completed }),
          ...(updateData.priority && { priority: updateData.priority }),
          ...(updateData.dueDate && { due_date: updateData.dueDate }),
          ...(updateData.category && { category: updateData.category }),
          ...(updateData.phone !== undefined && { phone: updateData.phone })
        }]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update task');
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task
      const task = await this.getById(id);
      
      // Toggle the completed status
      const updatedTask = await this.update(id, { completed: !task.completed });
      
      return updatedTask;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "category" } },
          { field: { Name: "phone" } }
        ],
        where: [
          { FieldName: "category", Operator: "EqualTo", Values: [category] }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      throw error;
    }
  },

  async getByPriority(priority) {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "category" } },
          { field: { Name: "phone" } }
        ],
        where: [
          { FieldName: "priority", Operator: "EqualTo", Values: [priority] }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by priority:", error);
      throw error;
    }
  },

  async searchTasks(query) {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "category" } },
          { field: { Name: "phone" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "Name",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "title",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "description",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }
};

export default taskService;