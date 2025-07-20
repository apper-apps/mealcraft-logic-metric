import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatPrepTime } from "@/utils/mealUtils";

const MealCard = ({ 
  meal, 
  onEdit, 
  onDelete, 
  isDragging = false,
  className = "",
  showActions = true,
  ...props 
}) => {
  if (!meal) return null;

  return (
    <motion.div
      layout
      whileHover={{ scale: showActions ? 1.02 : 1 }}
      className={`premium-card p-4 cursor-pointer ${isDragging ? "drag-ghost" : ""} ${className}`}
      {...props}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
          {meal.name}
        </h3>
        {showActions && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(meal);
              }}
              className="p-1 text-gray-400 hover:text-secondary transition-colors"
            >
              <ApperIcon name="Edit2" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(meal);
              }}
              className="p-1 text-gray-400 hover:text-error transition-colors"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" size="sm">
          <ApperIcon name="Clock" size={12} className="mr-1" />
          {formatPrepTime(meal.prepTime)}
        </Badge>
        <Badge variant="primary" size="sm">
          <ApperIcon name="Users" size={12} className="mr-1" />
          {meal.servings}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="ShoppingCart" size={14} className="mr-1" />
          {meal.ingredients?.length || 0} ingredients
        </div>
        
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex gap-1">
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