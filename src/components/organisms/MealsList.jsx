import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import MealFormModal from "@/components/organisms/MealFormModal";
import MealCard from "@/components/molecules/MealCard";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { mealService } from "@/services/api/mealService";

export default function MealsList({ className }) {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [activeId, setActiveId] = useState(null)
  
// Configure drag sensors with accessibility support and mobile-friendly touch handling
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 12, // Increased for better touch handling on mobile
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Load meals from API
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
    setIsModalOpen(true);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleDeleteMeal = async (meal) => {
    if (!confirm(`Are you sure you want to delete "${meal.Name}"?`)) return;
    
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
      setIsModalOpen(false);
      setEditingMeal(null);
    } catch (err) {
      toast.error("Failed to save meal");
      console.error(err);
    }
  };

  // Drag handlers
  function handleDragStart(event) {
    setActiveId(event.active.id)
  }
  
  function handleDragEnd(event) {
    setActiveId(null)
    // Meals list is read-only for dragging, no reordering needed
  }
  
  function handleDragCancel() {
    setActiveId(null)
  }
  
  // Filter meals based on search
const filteredMeals = meals.filter(meal => {
    if (!meal) return false;
    
    const mealName = meal.name || meal.Name || '';
    const mealCategory = meal.category || meal.Category || '';
    const mealIngredients = meal.ingredients || meal.Ingredients || [];
    
    return (
      mealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mealCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mealIngredients.some(ingredient => 
        ingredient?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false
      )
    );
  });
  
  // Create draggable component for meal cards
  function DraggableMeal({ meal, index }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: meal.Id.toString(),
      data: {
        type: 'meal',
        meal,
      },
    })
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
    
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.05 }}
        className={`group ${isDragging ? "drag-preview" : ""}`}
      >
        <MealCard
          meal={meal}
          onEdit={handleEditMeal}
          onDelete={handleDeleteMeal}
          isDragging={isDragging}
          className="drag-item"
        />
      </motion.div>
    )
}
  
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
    <div className={`space-y-5 md:space-y-6 ${className}`}>
      {/* Header - Mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold gradient-text">Meal Library</h2>
        <Button onClick={handleAddMeal} variant="primary" className="w-full sm:w-auto shrink-0">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Meal
        </Button>
      </div>

      {/* Search - Mobile optimized */}
      <Input
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />

      {filteredMeals.length === 0 ? (
        <Empty
          title={searchTerm ? "No meals found" : "No meals yet"}
          message={searchTerm ? "Try adjusting your search terms" : "Start building your meal library"}
          actionLabel="Add Your First Meal"
          onAction={handleAddMeal}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={filteredMeals.map(meal => meal.Id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {/* Single column layout optimized for drag and drop */}
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              <AnimatePresence>
                {filteredMeals.map((meal, index) => (
                  <DraggableMeal
                    key={meal.Id}
                    meal={meal}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeId ? (
              <div className="drag-preview">
                {(() => {
                  const meal = meals.find(m => m.Id.toString() === activeId)
                  return meal ? (
                    <MealCard
                      meal={meal}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      isDragging={true}
                      className="drag-item"
                    />
                  ) : null
                })()}
              </div>
            ) : null}
          </DragOverlay>
</DndContext>
        </div>
      )}

      {isModalOpen && (
        <MealFormModal
          meal={editingMeal}
          onSave={handleSaveMeal}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMeal(null);
          }}
        />
      )}
    </div>
  );
}