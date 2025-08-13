import { dateToString, getWeekStart } from "@/utils/date";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'week_plan_c';

const createEmptyWeekPlan = (weekStart) => {
  const weekStartDate = getWeekStart(weekStart);
  const weekStartString = dateToString(weekStartDate);
  
  const meals = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + i);
    meals.push({
      date: dateToString(date),
      breakfast: null,
      lunch: null,
      dinner: null
    });
  }

  return {
    Name: `Week of ${weekStartString}`,
    week_start_c: weekStartString,
    meals_c: JSON.stringify(meals)
  };
};

export const weekPlanService = {
  async getWeekPlan(weekStart) {
    try {
      const weekStartString = dateToString(getWeekStart(weekStart));
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "week_start_c" } },
          { field: { Name: "meals_c" } }
        ],
        where: [
          {
            FieldName: "week_start_c",
            Operator: "EqualTo",
            Values: [weekStartString]
          }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      let weekPlan;
      
      if (!response.data || response.data.length === 0) {
        // Create new week plan
        const newPlanData = createEmptyWeekPlan(weekStart);
        const createParams = {
          records: [newPlanData]
        };
        
        const createResponse = await apperClient.createRecord(TABLE_NAME, createParams);
        
        if (!createResponse.success) {
          throw new Error(createResponse.message);
        }
        
        if (createResponse.results && createResponse.results[0]?.success) {
          weekPlan = createResponse.results[0].data;
        } else {
          throw new Error('Failed to create week plan');
        }
      } else {
        weekPlan = response.data[0];
      }

      // Parse meals_c from JSON string
      let meals = [];
      try {
        if (weekPlan.meals_c) {
          meals = JSON.parse(weekPlan.meals_c);
        }
      } catch (e) {
        console.error('Error parsing meals_c:', e);
        meals = [];
      }

      // Convert meals array to object format for calendar compatibility
      const mealsObject = {};
      if (Array.isArray(meals)) {
        meals.forEach(dayMeal => {
          if (dayMeal && dayMeal.date) {
            mealsObject[dayMeal.date] = {
              breakfast: dayMeal.breakfast,
              lunch: dayMeal.lunch,
              dinner: dayMeal.dinner
            };
          }
        });
      }
      
      return {
        ...weekPlan,
        weekStart: weekPlan.week_start_c,
        meals: mealsObject
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching week plan:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching week plan:", error.message);
        throw error;
      }
    }
  },

  async addMealToPlan(weekStart, date, mealType, mealId) {
    try {
      const dateString = typeof date === 'string' ? date : dateToString(date);
      const weekStartString = dateToString(getWeekStart(weekStart));
      
      // Get existing week plan
      const weekPlan = await this.getWeekPlan(weekStart);
      
      // Convert meals object back to array for storage
      const mealsArray = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(getWeekStart(weekStart));
        date.setDate(date.getDate() + i);
        const dateStr = dateToString(date);
        const existingMeals = weekPlan.meals[dateStr] || {};
        mealsArray.push({
          date: dateStr,
          breakfast: existingMeals.breakfast || null,
          lunch: existingMeals.lunch || null,
          dinner: existingMeals.dinner || null
        });
      }
      
      // Update the specific meal
      const dayMeals = mealsArray.find(dm => dm.date === dateString);
      if (dayMeals) {
        dayMeals[mealType] = mealId.toString();
      }

      const params = {
        records: [
          {
            Id: weekPlan.Id,
            meals_c: JSON.stringify(mealsArray)
          }
        ]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Convert back to object format for return
      const mealsObject = {};
      mealsArray.forEach(dayMeal => {
        if (dayMeal && dayMeal.date) {
          mealsObject[dayMeal.date] = {
            breakfast: dayMeal.breakfast,
            lunch: dayMeal.lunch,
            dinner: dayMeal.dinner
          };
        }
      });
      
      return {
        ...weekPlan,
        meals: mealsObject
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding meal to plan:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error adding meal to plan:", error.message);
        throw error;
      }
    }
  },

  async removeMeal(weekStart, dateString, mealType) {
    try {
      // Get existing week plan
      const weekPlan = await this.getWeekPlan(weekStart);
      
      // Convert meals object back to array for storage
      const mealsArray = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(getWeekStart(weekStart));
        date.setDate(date.getDate() + i);
        const dateStr = dateToString(date);
        const existingMeals = weekPlan.meals[dateStr] || {};
        mealsArray.push({
          date: dateStr,
          breakfast: existingMeals.breakfast || null,
          lunch: existingMeals.lunch || null,
          dinner: existingMeals.dinner || null
        });
      }
      
      // Remove the specific meal
      const dayMeals = mealsArray.find(dm => dm.date === dateString);
      if (dayMeals) {
        dayMeals[mealType] = null;
      }

      const params = {
        records: [
          {
            Id: weekPlan.Id,
            meals_c: JSON.stringify(mealsArray)
          }
        ]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Convert back to object format for return
      const mealsObject = {};
      mealsArray.forEach(dayMeal => {
        if (dayMeal && dayMeal.date) {
          mealsObject[dayMeal.date] = {
            breakfast: dayMeal.breakfast,
            lunch: dayMeal.lunch,
            dinner: dayMeal.dinner
          };
        }
      });
      
      return {
        ...weekPlan,
        meals: mealsObject
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing meal from plan:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error removing meal from plan:", error.message);
        throw error;
      }
    }
  },

  async copyWeek(fromWeekStart, toWeekStart) {
    try {
      const fromWeekPlan = await this.getWeekPlan(fromWeekStart);
      const toWeekStartString = dateToString(getWeekStart(toWeekStart));
      
      // Create meals array for the target week
      const mealsArray = [];
      for (let i = 0; i < 7; i++) {
        const sourceDate = new Date(getWeekStart(fromWeekStart));
        sourceDate.setDate(sourceDate.getDate() + i);
        const sourceDateStr = dateToString(sourceDate);
        
        const targetDate = new Date(getWeekStart(toWeekStart));
        targetDate.setDate(targetDate.getDate() + i);
        const targetDateStr = dateToString(targetDate);
        
        const sourceMeals = fromWeekPlan.meals[sourceDateStr] || {};
        mealsArray.push({
          date: targetDateStr,
          breakfast: sourceMeals.breakfast || null,
          lunch: sourceMeals.lunch || null,
          dinner: sourceMeals.dinner || null
        });
      }

      // Create or update target week plan
      const newPlanData = {
        Name: `Week of ${toWeekStartString}`,
        week_start_c: toWeekStartString,
        meals_c: JSON.stringify(mealsArray)
      };

      const createParams = {
        records: [newPlanData]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, createParams);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      let targetWeekPlan;
      if (response.results && response.results[0]?.success) {
        targetWeekPlan = response.results[0].data;
      } else {
        throw new Error('Failed to copy week plan');
      }

      // Convert back to object format for return
      const mealsObject = {};
      mealsArray.forEach(dayMeal => {
        if (dayMeal && dayMeal.date) {
          mealsObject[dayMeal.date] = {
            breakfast: dayMeal.breakfast,
            lunch: dayMeal.lunch,
            dinner: dayMeal.dinner
          };
        }
      });
      
      return {
        ...targetWeekPlan,
        weekStart: targetWeekPlan.week_start_c,
        meals: mealsObject
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error copying week plan:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error copying week plan:", error.message);
        throw error;
      }
    }
  }
};