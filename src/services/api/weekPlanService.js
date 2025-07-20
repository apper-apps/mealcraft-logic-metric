import weekPlansData from "@/services/mockData/weekPlans.json";
import { dateToString, getWeekStart } from "@/utils/date";

// Create a copy of the data to avoid mutations
let weekPlans = [...weekPlansData];

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

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
    Id: Math.max(...weekPlans.map(wp => wp.Id), 0) + 1,
    weekStart: weekStartString,
    meals
  };
};

export const weekPlanService = {
  async getWeekPlan(weekStart) {
    await delay();
    const weekStartString = dateToString(getWeekStart(weekStart));
    
    let weekPlan = weekPlans.find(wp => wp.weekStart === weekStartString);
    
    if (!weekPlan) {
weekPlan = createEmptyWeekPlan(weekStart);
      weekPlans.push(weekPlan);
    }
    
    // Convert meals array to object format for calendar compatibility
    if (weekPlan.meals && Array.isArray(weekPlan.meals)) {
      const mealsObject = {};
      weekPlan.meals.forEach(dayMeal => {
        if (dayMeal && dayMeal.date) {
          mealsObject[dayMeal.date] = {
            breakfast: dayMeal.breakfast,
            lunch: dayMeal.lunch,
            dinner: dayMeal.dinner
          };
        }
      });
      weekPlan = {
        ...weekPlan,
        meals: mealsObject
      };
    }
    
    return { ...weekPlan };
  },

  async addMealToPlan(weekStart, date, mealType, mealId) {
    await delay();
    const dateString = typeof date === 'string' ? date : dateToString(date);
    const weekStartString = dateToString(getWeekStart(weekStart));
    
    let weekPlan = weekPlans.find(wp => wp.weekStart === weekStartString);
    
    if (!weekPlan) {
      weekPlan = createEmptyWeekPlan(weekStart);
      weekPlans.push(weekPlan);
    }
    
    // Ensure meals is an array for storage
    if (!Array.isArray(weekPlan.meals)) {
      // Convert object format back to array format for storage
      const mealsArray = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(getWeekStart(weekStart));
        date.setDate(date.getDate() + i);
        const dateStr = dateToString(date);
        mealsArray.push({
          date: dateStr,
          breakfast: weekPlan.meals[dateStr]?.breakfast || null,
          lunch: weekPlan.meals[dateStr]?.lunch || null,
          dinner: weekPlan.meals[dateStr]?.dinner || null
        });
      }
      weekPlan.meals = mealsArray;
    }
    
    const dayMeals = weekPlan.meals.find(dm => dm.date === dateString);
    if (dayMeals) {
      dayMeals[mealType] = mealId.toString();
    }
    
    // Convert back to object format for return
    const mealsObject = {};
    weekPlan.meals.forEach(dayMeal => {
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
  },
  async assignMeal(weekStart, dateString, mealType, mealId) {
    await delay();
    const weekStartString = dateToString(getWeekStart(weekStart));
    
    let weekPlan = weekPlans.find(wp => wp.weekStart === weekStartString);
    
    if (!weekPlan) {
      weekPlan = createEmptyWeekPlan(weekStart);
      weekPlans.push(weekPlan);
    }
    
    const dayMeals = weekPlan.meals.find(dm => dm.date === dateString);
    if (dayMeals) {
      dayMeals[mealType] = mealId.toString();
    }
    
    return { ...weekPlan };
  },

  async removeMeal(weekStart, dateString, mealType) {
    await delay();
    const weekStartString = dateToString(getWeekStart(weekStart));
    
    const weekPlan = weekPlans.find(wp => wp.weekStart === weekStartString);
    if (!weekPlan) {
      throw new Error("Week plan not found");
    }
    
    const dayMeals = weekPlan.meals.find(dm => dm.date === dateString);
    if (dayMeals) {
      dayMeals[mealType] = null;
    }
    
    return { ...weekPlan };
  },

  async copyWeek(fromWeekStart, toWeekStart) {
    await delay();
    const fromWeekString = dateToString(getWeekStart(fromWeekStart));
    const toWeekString = dateToString(getWeekStart(toWeekStart));
    
    const sourceWeekPlan = weekPlans.find(wp => wp.weekStart === fromWeekString);
    if (!sourceWeekPlan) {
      throw new Error("Source week plan not found");
    }
    
    let targetWeekPlan = weekPlans.find(wp => wp.weekStart === toWeekString);
    if (!targetWeekPlan) {
      targetWeekPlan = createEmptyWeekPlan(toWeekStart);
      weekPlans.push(targetWeekPlan);
    }
    
    // Copy meal assignments
    sourceWeekPlan.meals.forEach((sourceDayMeals, index) => {
      if (targetWeekPlan.meals[index]) {
        targetWeekPlan.meals[index].breakfast = sourceDayMeals.breakfast;
        targetWeekPlan.meals[index].lunch = sourceDayMeals.lunch;
        targetWeekPlan.meals[index].dinner = sourceDayMeals.dinner;
      }
    });
    
    return { ...targetWeekPlan };
  }
};