import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatWeekRange } from "@/utils/date";

const WeekNavigation = ({ 
  currentWeek, 
  onPreviousWeek, 
  onNextWeek, 
  onToday,
  className = "" 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold gradient-text">
          {formatWeekRange(currentWeek)}
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="text-secondary hover:bg-secondary/10"
        >
          Today
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousWeek}
          className="hover:bg-gray-100"
        >
          <ApperIcon name="ChevronLeft" size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextWeek}
          className="hover:bg-gray-100"
        >
          <ApperIcon name="ChevronRight" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default WeekNavigation;