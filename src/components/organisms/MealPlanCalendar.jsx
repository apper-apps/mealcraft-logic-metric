import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import MealSlot from "@/components/molecules/MealSlot";
import WeekNavigation from "@/components/molecules/WeekNavigation";
import { weekPlanService } from "@/services/api/weekPlanService";
import { dateToString, formatDate, getNextWeek, getPreviousWeek, getWeekDays, getWeekStart } from "@/utils/date";

export default function MealPlanCalendar({ meals, currentWeek, onWeekChange }) {
  const [weekPlan, setWeekPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeId, setActiveId] = useState(null)
  
  const MEAL_TYPES = ["breakfast", "lunch", "dinner"]
  
  // Configure drag sensors with accessibility support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
// Load week plan data
  const loadWeekPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const plan = await weekPlanService.getWeekPlan(currentWeek);
      setWeekPlan(plan);
    } catch (err) {
      setError("Failed to load week plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get meal for specific slot
  function getMealForSlot(date, mealType) {
    if (!weekPlan?.meals || !meals) return null;
    
    const dateString = dateToString(date);
    const dayMeals = weekPlan.meals[dateString];
    if (!dayMeals || typeof dayMeals !== 'object') return null;
    
    const mealId = dayMeals[mealType];
    if (!mealId) return null;
    
    const foundMeal = meals.find(meal => meal?.Id === mealId || meal?.id === mealId);
    return foundMeal || null;
  }

  // Load week plan on component mount and week change
  useEffect(() => {
    loadWeekPlan();
  }, [currentWeek]);

  // Handle drag start
  function handleDragStart(event) {
    setActiveId(event.active.id)
  }

  // Handle drag end
  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || !active?.id) return;
    
    const mealId = parseInt(active.id);
    if (isNaN(mealId) || !meals) return;
    
    const currentMeal = meals.find(meal => 
      (meal?.Id === mealId) || (meal?.id === mealId)
    );
    if (!currentMeal) return;
    
    const [dateString, mealType] = over.id.split('-');
    if (!dateString || !mealType) return;
    
    // Parse date from dateString
    const date = new Date(dateString);
    
    // Don't do anything if dropped on same slot that already contains this meal
    const existingMeal = getMealForSlot(date, mealType);
    if (existingMeal && (existingMeal.Id === mealId || existingMeal.id === mealId)) {
      return;
    }
    
    try {
      const updatedPlan = await weekPlanService.addMealToPlan(currentWeek, date, mealType, mealId);
      setWeekPlan(updatedPlan);
      toast.success('Meal added to plan!');
    } catch (error) {
      console.error('Error adding meal to plan:', error);
      toast.error('Failed to add meal to plan');
    }
  }
  
  // Handle drag cancel
  function handleDragCancel() {
    setActiveId(null)
  }
  
  // Remove meal from plan
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
    return <Loading variant="calendar" />;
  }

  if (error) {
    return (
      <Error 
        title="Calendar Error"
        message={error}
        onRetry={loadWeekPlan}
      />
    );
  }

  // Create droppable component for meal slots
  function DroppableSlot({ id, children, className }) {
    const {
      setNodeRef,
      isOver,
    } = useSortable({
      id,
      data: {
        type: 'droppable',
      },
    })
    
    return (
      <div
        ref={setNodeRef}
        className={`${className} ${isOver ? 'drop-zone-active' : ''}`}
      >
        {children}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <WeekNavigation
        currentWeek={currentWeek}
        onPrevious={handlePreviousWeek}
        onNext={handleNextWeek}
        onToday={handleToday}
      />
      
      {loading && <Loading />}
      {error && <Error message={error} onRetry={loadWeekPlan} />}
      
      {!loading && !error && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="calendar-grid">
            {getWeekDays(currentWeek).map((day) => {
              const dateString = formatDate(day)
              
              return (
                <motion.div
                  key={dateString}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-900">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {MEAL_TYPES.map((mealType) => {
                      const meal = getMealForSlot(day, mealType);
                      const droppableId = `${dateString}-${mealType}`;
                      
                      return (
                        <SortableContext
                          key={droppableId}
                          id={droppableId}
                          items={[]}
                          strategy={verticalListSortingStrategy}
                        >
                          <DroppableSlot
                            id={droppableId}
                            className="group"
                          >
                            <MealSlot
                              mealType={mealType}
                              meal={meal}
                              onRemove={() => handleRemoveMeal(day, mealType)}
                              isDropTarget={false}
                            />
                          </DroppableSlot>
                        </SortableContext>
                      );
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          <DragOverlay>
            {activeId ? (
              <div className="drag-preview">
                <div className="bg-white rounded-lg p-3 shadow-lg border">
                  <ApperIcon name="move" className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}