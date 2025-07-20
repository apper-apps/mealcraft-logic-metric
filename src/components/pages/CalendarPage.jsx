import { useState } from "react";
import { motion } from "framer-motion";
import MealPlanCalendar from "@/components/organisms/MealPlanCalendar";
import MealsList from "@/components/organisms/MealsList";
import { getWeekStart } from "@/utils/date";

const CalendarPage = () => {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));

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

<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <MealPlanCalendar 
            currentWeek={currentWeek}
            onWeekChange={setCurrentWeek}
          />
        </div>
        
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <MealsList />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarPage;