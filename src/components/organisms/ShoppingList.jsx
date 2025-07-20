import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { weekPlanService } from "@/services/api/weekPlanService";
import { consolidateIngredients, getMealsForWeek } from "@/utils/mealUtils";

const ShoppingList = ({ 
  currentWeek, 
  meals = [],
  className = "" 
}) => {
const [weekPlan, setWeekPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [ingredients, setIngredients] = useState([]);

  const loadWeekPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const plan = await weekPlanService.getWeekPlan(currentWeek);
      setWeekPlan(plan);
      
      if (plan?.meals && meals && Array.isArray(meals)) {
        const weekMeals = getMealsForWeek(plan.meals, meals);
        if (weekMeals && weekMeals.length > 0) {
          const consolidatedIngredients = consolidateIngredients(weekMeals);
          setIngredients(consolidatedIngredients || []);
        } else {
          setIngredients([]);
        }
      } else {
        setIngredients([]);
      }
    } catch (err) {
      console.error('Failed to load week plan:', err);
      setError(err.message || 'Failed to load shopping list');
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentWeek) {
      loadWeekPlan();
    }
  }, [currentWeek]);

const weekMeals = weekPlan?.meals ? getMealsForWeek(weekPlan.meals, meals) : [];
  const consolidatedIngredients = ingredients;

  const toggleItemCheck = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const clearChecked = () => {
    setCheckedItems(new Set());
  };

const printList = () => {
    if (!consolidatedIngredients || consolidatedIngredients.length === 0) {
      return;
    }
    
    const printContent = consolidatedIngredients
      .map(ingredient => `• ${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.name || 'Unknown ingredient'}`)
      .join("\n");
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Shopping List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2D5016; }
            .ingredient { margin: 5px 0; }
          </style>
        </head>
        <body>
          <h1>Shopping List</h1>
          <div style="white-space: pre-line;">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <Loading variant="shoppingList" className={className} />;
  }

  if (error) {
    return (
      <Error 
        title="Shopping List Error"
        message={error}
        onRetry={loadWeekPlan}
        className={className}
      />
    );
  }

  if (consolidatedIngredients.length === 0) {
    return (
      <Empty
        title="No ingredients yet"
        message="Plan some meals for this week to generate your shopping list"
        icon="ShoppingCart"
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Shopping List</h2>
          <p className="text-gray-600">
            {consolidatedIngredients.length} items • {checkedItems.size} checked
          </p>
        </div>
        <div className="flex gap-2">
          {checkedItems.size > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChecked}>
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Clear Checked
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={printList}>
            <ApperIcon name="Printer" size={16} className="mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {consolidatedIngredients.map((ingredient, index) => {
          const isChecked = checkedItems.has(index);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                isChecked ? "bg-gray-50/50" : ""
              }`}
              onClick={() => toggleItemCheck(index)}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                isChecked 
                  ? "bg-success border-success" 
                  : "border-gray-300 hover:border-secondary"
              }`}>
                {isChecked && (
                  <ApperIcon name="Check" size={12} className="text-white" />
                )}
              </div>
              
              <div className={`flex-1 transition-all ${
                isChecked ? "opacity-60 line-through" : ""
              }`}>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {ingredient.name}
                  </span>
                  <Badge variant="secondary" size="sm">
                    {ingredient.quantity} {ingredient.unit}
                  </Badge>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {weekMeals.length > 0 && (
        <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl p-4 border border-secondary/20">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <ApperIcon name="UtensilsCrossed" size={16} className="mr-2 text-secondary" />
            This Week's Meals
          </h3>
          <div className="flex flex-wrap gap-2">
            {weekMeals.map((meal, index) => (
              <Badge key={`${meal.Id}-${index}`} variant="secondary" size="sm">
                {meal.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;