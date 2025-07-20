import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatPrepTime } from "@/utils/mealUtils";

function MealCard({ 
  meal, 
  onEdit, 
  onDelete, 
  className = "",
  showActions = true,
  isDragging = false,
  ...props 
}) {
  if (!meal) return null;

return (
    <motion.div
      layout
      whileHover={{ scale: showActions ? 1.02 : 1 }}
      className={`premium-card p-4 md:p-5 cursor-pointer ${isDragging ? "drag-ghost" : ""} ${className}`}
      {...props}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 flex-1 mr-3">
          {meal.name}
        </h3>
        {showActions && (
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(meal);
              }}
              className="p-1.5 text-gray-400 hover:text-secondary transition-colors rounded-md hover:bg-gray-50"
            >
              <ApperIcon name="Edit2" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(meal);
              }}
              className="p-1.5 text-gray-400 hover:text-error transition-colors rounded-md hover:bg-gray-50"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        )}
      </div>
<div className="flex items-center gap-2.5 mb-4">
        <Badge variant="secondary" size="sm">
          <ApperIcon name="Clock" size={12} className="mr-1" />
          {formatPrepTime(meal.prepTime)}
        </Badge>
        <Badge variant="primary" size="sm">
          <ApperIcon name="Users" size={12} className="mr-1" />
          {meal.servings}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="ShoppingCart" size={14} className="mr-1.5" />
          {meal.ingredients?.length || 0} ingredients
        </div>
        
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {meal.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {meal.tags.length > 2 && (
              <Badge variant="default" size="sm">
                +{meal.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MealCard;