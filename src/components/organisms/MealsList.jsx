import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import MealCard from "@/components/molecules/MealCard";
import MealFormModal from "@/components/organisms/MealFormModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { mealService } from "@/services/api/mealService";

const MealsList = ({ className = "" }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await mealService.getAll();
      setMeals(data);
    } catch (err) {
      setError("Failed to load meals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setShowMealForm(true);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };

  const handleDeleteMeal = async (meal) => {
    if (!confirm(`Are you sure you want to delete "${meal.name}"?`)) return;
    
    try {
      await mealService.delete(meal.Id);
      setMeals(meals.filter(m => m.Id !== meal.Id));
      toast.success("Meal deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete meal");
      console.error(err);
    }
  };

  const handleSaveMeal = async (mealData) => {
    try {
      if (editingMeal) {
        const updated = await mealService.update(editingMeal.Id, mealData);
        setMeals(meals.map(m => m.Id === editingMeal.Id ? updated : m));
        toast.success("Meal updated successfully!");
      } else {
        const newMeal = await mealService.create(mealData);
        setMeals([newMeal, ...meals]);
        toast.success("Meal added successfully!");
      }
      setShowMealForm(false);
      setEditingMeal(null);
    } catch (err) {
      toast.error(`Failed to ${editingMeal ? "update" : "add"} meal`);
      console.error(err);
    }
  };

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (meal.tags && meal.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  if (loading) {
    return <Loading variant="mealList" className={className} />;
  }

  if (error) {
    return (
      <Error 
        title="Meals Error"
        message={error}
        onRetry={loadMeals}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">Meal Library</h2>
        <Button onClick={handleAddMeal} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Meal
        </Button>
      </div>

      <Input
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {filteredMeals.length === 0 ? (
        <Empty
          title={searchTerm ? "No meals found" : "No meals yet"}
          message={searchTerm ? "Try adjusting your search terms" : "Start building your meal library"}
          actionLabel="Add Your First Meal"
          onAction={handleAddMeal}
          icon="UtensilsCrossed"
        />
      ) : (
        <Droppable droppableId="meals-list" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3"
            >
              <AnimatePresence>
                {filteredMeals.map((meal, index) => (
                  <Draggable 
                    key={meal.Id} 
                    draggableId={meal.Id.toString()} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group ${snapshot.isDragging ? "drag-preview" : ""}`}
                      >
                        <MealCard
                          meal={meal}
                          onEdit={handleEditMeal}
                          onDelete={handleDeleteMeal}
                          isDragging={snapshot.isDragging}
                          className="drag-item"
                        />
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}

      <AnimatePresence>
        {showMealForm && (
          <MealFormModal
            meal={editingMeal}
            onSave={handleSaveMeal}
            onClose={() => {
              setShowMealForm(false);
              setEditingMeal(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealsList;