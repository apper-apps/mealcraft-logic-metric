const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'meal_c';

export const mealService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "ingredients_c" } },
          { field: { Name: "prep_time_c" } },
          { field: { Name: "servings_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching meals:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching meals:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "ingredients_c" } },
          { field: { Name: "prep_time_c" } },
          { field: { Name: "servings_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Meal not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching meal with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching meal with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async create(mealData) {
    try {
      // Parse ingredients if it's a string
      let ingredients = mealData.ingredients_c || mealData.ingredients || [];
      if (typeof ingredients === 'string') {
        try {
          ingredients = JSON.parse(ingredients);
        } catch (e) {
          ingredients = mealData.ingredients || [];
        }
      }

      // Parse tags if it's a string  
      let tags = mealData.Tags || mealData.tags || "";
      if (Array.isArray(tags)) {
        tags = tags.join(",");
      }

      const params = {
        records: [
          {
            Name: mealData.Name || mealData.name || "",
            Tags: tags,
            ingredients_c: JSON.stringify(ingredients),
            prep_time_c: parseInt(mealData.prep_time_c || mealData.prepTime) || 0,
            servings_c: parseInt(mealData.servings_c || mealData.servings) || 0,
            notes_c: mealData.notes_c || mealData.notes || "",
            created_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create meals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          const errorMessages = [];
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              errorMessages.push(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) errorMessages.push(record.message);
          });
          
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(', '));
          }
        }

        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create meal');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating meal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating meal:", error.message);
        throw error;
      }
    }
  },

  async update(id, mealData) {
    try {
      // Parse ingredients if it's a string
      let ingredients = mealData.ingredients_c || mealData.ingredients || [];
      if (typeof ingredients === 'string') {
        try {
          ingredients = JSON.parse(ingredients);
        } catch (e) {
          ingredients = mealData.ingredients || [];
        }
      }

      // Parse tags if it's a string
      let tags = mealData.Tags || mealData.tags || "";
      if (Array.isArray(tags)) {
        tags = tags.join(",");
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: mealData.Name || mealData.name || "",
            Tags: tags,
            ingredients_c: JSON.stringify(ingredients),
            prep_time_c: parseInt(mealData.prep_time_c || mealData.prepTime) || 0,
            servings_c: parseInt(mealData.servings_c || mealData.servings) || 0,
            notes_c: mealData.notes_c || mealData.notes || ""
          }
        ]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update meals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          const errorMessages = [];
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              errorMessages.push(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) errorMessages.push(record.message);
          });
          
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(', '));
          }
        }

        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to update meal');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating meal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating meal:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete meals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          const errorMessages = [];
          failedRecords.forEach(record => {
            if (record.message) errorMessages.push(record.message);
          });
          
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(', '));
          }
        }

        return response.results.length > 0 && response.results[0].success;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting meal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting meal:", error.message);
        throw error;
      }
    }
  }
};