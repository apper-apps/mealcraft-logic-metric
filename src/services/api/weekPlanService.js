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
    
    return { ...weekPlan };
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