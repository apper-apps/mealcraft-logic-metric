import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { getMealTypeLabel } from "@/utils/mealUtils";

const MealSlot = ({ 
  mealType, 
  meal, 
  onRemove,
  isDropTarget = false,
  className = "",
  ...props 
}) => {
  const isEmpty = !meal;
  
  return (
    <motion.div
      layout
      className={`
        relative rounded-xl p-3 transition-all duration-200 min-h-[80px] flex flex-col
        ${isEmpty ? "empty-slot" : "premium-card"}
        ${isDropTarget ? "drop-zone-active" : ""}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {getMealTypeLabel(mealType)}
        </span>
        {!isEmpty && onRemove && (
          <button
            onClick={() => onRemove(mealType)}
            className="p-1 text-gray-400 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
          >
            <ApperIcon name="X" size={12} />
          </button>
        )}
      </div>
      
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <ApperIcon name="Plus" size={20} className="mx-auto mb-1" />
            <p className="text-xs">Drop meal here</p>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
            {meal.name}
          </h4>
          <div className="flex items-center text-xs text-gray-600">
            <ApperIcon name="Clock" size={12} className="mr-1" />
            {meal.prepTime}m
            <span className="mx-2">•</span>
            <ApperIcon name="Users" size={12} className="mr-1" />
            {meal.servings}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MealSlot;