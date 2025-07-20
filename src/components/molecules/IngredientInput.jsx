import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const COMMON_UNITS = [
  "cups", "tbsp", "tsp", "oz", "lbs", "grams", "kg", 
  "pieces", "cloves", "slices", "bunches", "cans", "bottles"
];

const IngredientInput = ({ 
  ingredients = [], 
  onChange,
  className = "" 
}) => {
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    unit: "cups"
  });

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      const ingredient = {
        name: newIngredient.name.trim(),
        quantity: parseFloat(newIngredient.quantity),
        unit: newIngredient.unit
      };
      onChange([...ingredients, ingredient]);
      setNewIngredient({ name: "", quantity: "", unit: "cups" });
    }
  };

  const removeIngredient = (index) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    const updated = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { 
          ...ingredient, 
          [field]: field === "quantity" ? parseFloat(value) || 0 : value 
        };
      }
      return ingredient;
    });
    onChange(updated);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ingredients
      </label>
      
      {/* Existing ingredients */}
      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Input
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
              placeholder="Ingredient name"
              className="flex-1"
            />
            <Input
              type="number"
              step="0.25"
              min="0"
              value={ingredient.quantity}
              onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
              placeholder="Qty"
              className="w-20"
            />
            <Select
              value={ingredient.unit}
              onChange={(e) => updateIngredient(index, "unit", e.target.value)}
              className="w-24"
            >
              {COMMON_UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeIngredient(index)}
              className="text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new ingredient */}
      <div className="flex gap-2 items-end">
        <Input
          value={newIngredient.name}
          onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Add ingredient..."
          className="flex-1"
          onKeyPress={(e) => e.key === "Enter" && addIngredient()}
        />
        <Input
          type="number"
          step="0.25"
          min="0"
          value={newIngredient.quantity}
          onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
          placeholder="Qty"
          className="w-20"
          onKeyPress={(e) => e.key === "Enter" && addIngredient()}
        />
        <Select
          value={newIngredient.unit}
          onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
          className="w-24"
        >
          {COMMON_UNITS.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </Select>
        <Button
          onClick={addIngredient}
          variant="secondary"
          size="sm"
          disabled={!newIngredient.name || !newIngredient.quantity}
        >
          <ApperIcon name="Plus" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default IngredientInput;