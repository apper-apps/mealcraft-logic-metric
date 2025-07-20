import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ApperIcon from "@/components/ApperIcon";
import WeekNavigation from "@/components/molecules/WeekNavigation";
import MealSlot from "@/components/molecules/MealSlot";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getWeekStart, getWeekDays, formatDate, getPreviousWeek, getNextWeek, dateToString } from "@/utils/date";
import { weekPlanService } from "@/services/api/weekPlanService";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

const MealPlanCalendar = ({ 
  meals = [], 
  currentWeek, 
  onWeekChange,
  className = "" 
}) => {
  const [weekPlan, setWeekPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const weekDays = getWeekDays(currentWeek);

  useEffect(() => {
    loadWeekPlan();
  }, [currentWeek]);

  const loadWeekPlan = async () => {
    try {
      setLoading(true);
      setError("");
      const plan = await weekPlanService.getWeekPlan(currentWeek);
      setWeekPlan(plan);
    } catch (err) {
      setError("Failed to load week plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMealForSlot = (date, mealType) => {
    if (!weekPlan?.meals) return null;
    const dateString = dateToString(date);
    const dayMeals = weekPlan.meals.find(dm => dm.date === dateString);
    if (!dayMeals || !dayMeals[mealType]) return null;
    
    const mealId = parseInt(dayMeals[mealType]);
    return meals.find(m => m.Id === mealId) || null;
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    // Parse destination
    const [destDate, destMealType] = destination.droppableId.split("-");
    const mealId = parseInt(draggableId);
    
    try {
      const updatedPlan = await weekPlanService.assignMeal(currentWeek, destDate, destMealType, mealId);
      setWeekPlan(updatedPlan);
      toast.success("Meal assigned successfully!");
    } catch (err) {
      toast.error("Failed to assign meal");
      console.error(err);
    }
  };

  const handleRemoveMeal = async (date, mealType) => {
    try {
      const dateString = dateToString(date);
      const updatedPlan = await weekPlanService.removeMeal(currentWeek, dateString, mealType);
      setWeekPlan(updatedPlan);
      toast.success("Meal removed!");
    } catch (err) {
      toast.error("Failed to remove meal");
      console.error(err);
    }
  };

  const handlePreviousWeek = () => {
    onWeekChange(getPreviousWeek(currentWeek));
  };

  const handleNextWeek = () => {
    onWeekChange(getNextWeek(currentWeek));
  };

  const handleToday = () => {
    onWeekChange(getWeekStart(new Date()));
  };

  if (loading) {
    return <Loading variant="calendar" className={className} />;
  }

  if (error) {
    return (
      <Error 
        title="Calendar Error"
        message={error}
        onRetry={loadWeekPlan}
        className={className}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`space-y-6 ${className}`}>
        <WeekNavigation
          currentWeek={currentWeek}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day, dayIndex) => (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="text-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  {formatDate(day, "EEEE")}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(day)}
                </p>
              </div>

              <div className="space-y-3">
                {MEAL_TYPES.map((mealType) => {
                  const dateString = dateToString(day);
                  const droppableId = `${dateString}-${mealType}`;
                  const meal = getMealForSlot(day, mealType);

                  return (
                    <Droppable key={droppableId} droppableId={droppableId}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="group"
                        >
                          <MealSlot
                            mealType={mealType}
                            meal={meal}
                            onRemove={() => handleRemoveMeal(day, mealType)}
                            isDropTarget={snapshot.isDraggingOver}
                          />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default MealPlanCalendar;