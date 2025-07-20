import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MealPlanCalendar from "@/components/organisms/MealPlanCalendar";
import MealsList from "@/components/organisms/MealsList";
import { getWeekStart } from "@/utils/date";
import { mealService } from "@/services/api/mealService";

const CalendarPage = () => {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const data = await mealService.getAll();
        setMeals(data);
      } catch (error) {
        console.error('Failed to load meals:', error);
      }
    };

    loadMeals();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-2">Weekly Meal Planner</h1>
        <p className="text-gray-600">
          Drag meals from your library to plan the perfect week
</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2 order-2 xl:order-1">
          <MealPlanCalendar 
            meals={meals}
            currentWeek={currentWeek}
            onWeekChange={setCurrentWeek}
          />
        </div>
        
        <div className="xl:col-span-1 order-1 xl:order-2">
          <div className="sticky top-6">
            <MealsList className="h-fit" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarPage;