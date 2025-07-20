import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { getMealTypeLabel } from "@/utils/mealUtils";

export default function MealSlot({ mealType, meal, onRemove, onClick, isDropTarget = false }) {
  const isEmpty = !meal;
  
return (
    <div
      className={`
        min-h-[88px] md:min-h-[96px] rounded-lg border-2 transition-all duration-200 group relative
        ${meal 
          ? 'bg-white border-gray-200 hover:border-secondary/30 hover:shadow-sm p-3' 
          : 'border-dashed border-gray-300 bg-gray-50/50 hover:border-secondary hover:bg-secondary/5 empty-slot cursor-pointer p-4'
        }
        ${isDropTarget ? 'drop-zone-active' : ''}
      `}
      onClick={!meal ? onClick : undefined}
    >
      {meal && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => onRemove(mealType)}
            className="p-1 text-gray-400 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
          >
            <ApperIcon name="X" size={12} />
          </button>
        </div>
      )}
      
{isEmpty ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <ApperIcon name="Plus" size={20} className="text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-500 capitalize mb-1">
            {getMealTypeLabel(mealType)}
          </p>
          <p className="text-xs text-gray-400">Click to add or drop meal here</p>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-between">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
            {meal.name}
          </h4>
          <div className="flex items-center text-xs text-gray-600 mt-auto">
            <ApperIcon name="Clock" size={12} className="mr-1.5" />
            {meal.prepTime}m
            <span className="mx-2">•</span>
            <span>{meal.calories} cal</span>
          </div>
        </div>
      )}
    </div>
  );
}