import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import IngredientInput from "@/components/molecules/IngredientInput";

const MealFormModal = ({ meal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    ingredients: [],
    prepTime: "",
    servings: "",
    tags: "",
    notes: ""
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.name || "",
        ingredients: meal.ingredients || [],
        prepTime: meal.prepTime?.toString() || "",
        servings: meal.servings?.toString() || "",
        tags: meal.tags ? meal.tags.join(", ") : "",
        notes: meal.notes || ""
      });
    }
  }, [meal]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Meal name is required";
    }
    
    if (!formData.prepTime || formData.prepTime <= 0) {
      newErrors.prepTime = "Prep time must be greater than 0";
    }
    
    if (!formData.servings || formData.servings <= 0) {
      newErrors.servings = "Servings must be greater than 0";
    }
    
    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const mealData = {
      name: formData.name.trim(),
      ingredients: formData.ingredients,
      prepTime: parseInt(formData.prepTime),
      servings: parseInt(formData.servings),
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      notes: formData.notes.trim(),
      createdAt: meal?.createdAt || new Date().toISOString()
    };
    
    onSave(mealData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold gradient-text">
            {meal ? "Edit Meal" : "Add New Meal"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <Input
              label="Meal Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              placeholder="Enter meal name..."
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prep Time (minutes)"
                type="number"
                min="1"
                value={formData.prepTime}
                onChange={(e) => handleInputChange("prepTime", e.target.value)}
                error={errors.prepTime}
                placeholder="30"
                required
              />
              <Input
                label="Servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => handleInputChange("servings", e.target.value)}
                error={errors.servings}
                placeholder="4"
                required
              />
            </div>

            <div>
              <IngredientInput
                ingredients={formData.ingredients}
                onChange={(ingredients) => handleInputChange("ingredients", ingredients)}
              />
              {errors.ingredients && (
                <p className="text-sm text-error mt-1">{errors.ingredients}</p>
              )}
            </div>

            <Input
              label="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="vegetarian, quick, healthy"
            />

            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add any cooking notes or tips..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {meal ? "Update Meal" : "Add Meal"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MealFormModal;