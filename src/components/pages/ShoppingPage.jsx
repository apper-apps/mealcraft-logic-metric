import { useState } from "react";
import { motion } from "framer-motion";
import ShoppingList from "@/components/organisms/ShoppingList";
import WeekNavigation from "@/components/molecules/WeekNavigation";
import { getWeekStart, getPreviousWeek, getNextWeek } from "@/utils/date";

const ShoppingPage = () => {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));

  const handlePreviousWeek = () => {
    setCurrentWeek(getPreviousWeek(currentWeek));
  };

  const handleNextWeek = () => {
    setCurrentWeek(getNextWeek(currentWeek));
  };

  const handleToday = () => {
    setCurrentWeek(getWeekStart(new Date()));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-2">Shopping List</h1>
        <p className="text-gray-600">
          Automatically generated from your weekly meal plan
        </p>
      </div>

      <WeekNavigation
        currentWeek={currentWeek}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />

      <ShoppingList currentWeek={currentWeek} />
    </motion.div>
  );
};

export default ShoppingPage;