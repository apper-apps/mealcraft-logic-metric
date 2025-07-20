export const consolidateIngredients = (meals) => {
  const consolidated = {};
  
  meals.forEach(meal => {
    if (meal && meal.ingredients) {
      meal.ingredients.forEach(ingredient => {
        const key = `${ingredient.name}-${ingredient.unit}`;
        if (consolidated[key]) {
          consolidated[key].quantity += ingredient.quantity;
        } else {
          consolidated[key] = { ...ingredient };
        }
      });
    }
  });
  
  return Object.values(consolidated).sort((a, b) => a.name.localeCompare(b.name));
};

export const getMealsForWeek = (weekPlan, allMeals) => {
  if (!weekPlan || !weekPlan.meals) return [];
  
  const weekMeals = [];
  weekPlan.meals.forEach(dayMeals => {
    ["breakfast", "lunch", "dinner"].forEach(mealType => {
      const mealId = dayMeals[mealType];
      if (mealId) {
        const meal = allMeals.find(m => m.Id === parseInt(mealId));
        if (meal) {
          weekMeals.push(meal);
        }
      }
    });
  });
  
  return weekMeals;
};

export const formatPrepTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const getMealTypeLabel = (mealType) => {
  const labels = {
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner"
  };
  return labels[mealType] || mealType;
};