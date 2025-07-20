import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { mealService } from "@/services/api/mealService";
import { getMealTypeLabel } from "@/utils/mealUtils";

const MealSelectorModal = ({ isOpen, onClose, onSelectMeal, date, mealType }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load meals when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMeals();
    }
  }, [isOpen]);

  const loadMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mealService.getAll();
      setMeals(data);
    } catch (err) {
      setError("Failed to load meals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSelectMeal = (meal) => {
    onSelectMeal(meal);
    onClose();
    toast.success(`${meal.name || meal.Name} added to ${getMealTypeLabel(mealType)}!`);
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold gradient-text">
              Select a Meal
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {getMealTypeLabel(mealType)} • {date?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Search Input */}
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md"
            />

            {/* Content Area */}
            {loading ? (
              <Loading variant="mealList" />
            ) : error ? (
              <Error 
                title="Failed to Load Meals"
                message={error}
                onRetry={loadMeals}
              />
            ) : filteredMeals.length === 0 ? (
              <Empty
                title={searchTerm ? "No meals found" : "No meals available"}
                message={searchTerm ? "Try adjusting your search terms" : "Create some meals first"}
                actionLabel="Clear Search"
                onAction={() => setSearchTerm("")}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredMeals.map((meal, index) => (
                    <motion.div
                      key={meal.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-secondary/20 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleSelectMeal(meal)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 group-hover:text-secondary transition-colors">
                          {meal.name || meal.Name}
                        </h3>
                        <ApperIcon 
                          name="Plus" 
                          size={16} 
                          className="text-gray-400 group-hover:text-secondary transition-colors" 
                        />
                      </div>
                      
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {meal.ingredients.slice(0, 3).map(ing => ing.name).join(", ")}
                          {meal.ingredients.length > 3 && "..."}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{meal.prepTime} min</span>
                        <span>{meal.servings} servings</span>
                      </div>
                      
                      {meal.tags && meal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {meal.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {meal.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{meal.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MealSelectorModal;