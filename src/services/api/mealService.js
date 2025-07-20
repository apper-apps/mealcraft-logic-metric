import mealsData from "@/services/mockData/meals.json";

// Create a copy of the data to avoid mutations
let meals = [...mealsData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mealService = {
  async getAll() {
    await delay();
    return [...meals];
  },

  async getById(id) {
    await delay();
    const meal = meals.find(m => m.Id === parseInt(id));
    if (!meal) {
      throw new Error("Meal not found");
    }
    return { ...meal };
  },

  async create(mealData) {
    await delay();
    const maxId = Math.max(...meals.map(m => m.Id), 0);
    const newMeal = {
      Id: maxId + 1,
      ...mealData,
      createdAt: new Date().toISOString()
    };
    meals.unshift(newMeal);
    return { ...newMeal };
  },

  async update(id, mealData) {
    await delay();
    const index = meals.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Meal not found");
    }
    
    const updatedMeal = {
      ...meals[index],
      ...mealData,
      Id: parseInt(id)
    };
    
    meals[index] = updatedMeal;
    return { ...updatedMeal };
  },

  async delete(id) {
    await delay();
    const index = meals.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Meal not found");
    }
    
    const deletedMeal = meals[index];
    meals = meals.filter(m => m.Id !== parseInt(id));
    return { ...deletedMeal };
  }
};