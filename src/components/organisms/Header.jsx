import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ className = "" }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-b border-gray-200 ${className}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="UtensilsCrossed" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">MealCraft</h1>
              <p className="text-sm text-gray-600">Smart meal planning made simple</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back!</p>
              <p className="text-xs text-gray-600">Plan your perfect week</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;