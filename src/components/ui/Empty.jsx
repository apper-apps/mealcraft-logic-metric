import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet",
  message = "Get started by adding some content",
  actionLabel = "Get Started",
  onAction,
  icon = "Package",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-secondary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{message}</p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          size="lg"
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;