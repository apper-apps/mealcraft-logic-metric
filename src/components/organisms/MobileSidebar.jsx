import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const navigation = [
  { name: "Calendar", href: "/", icon: "Calendar" },
  { name: "Meals", href: "/meals", icon: "UtensilsCrossed" },
  { name: "Shopping List", href: "/shopping", icon: "ShoppingCart" }
];

const MobileSidebar = ({ isOpen, onClose, className = "" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 lg:hidden ${className}`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="UtensilsCrossed" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">MealCraft</h1>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <div className="flex-1 p-6">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} size={20} />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl p-4 border border-secondary/20">
                <div className="flex items-center gap-3 mb-3">
                  <ApperIcon name="Lightbulb" size={18} className="text-secondary" />
                  <h3 className="font-semibold text-gray-900 text-sm">Pro Tip</h3>
                </div>
                <p className="text-xs text-gray-600">
                  Drag meals from your library directly onto calendar slots!
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;