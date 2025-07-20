import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const navigation = [
  { name: "Calendar", href: "/", icon: "Calendar" },
  { name: "Meals", href: "/meals", icon: "UtensilsCrossed" },
  { name: "Shopping List", href: "/shopping", icon: "ShoppingCart" }
];

const Sidebar = ({ className = "" }) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="UtensilsCrossed" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">MealCraft</h1>
            <p className="text-xs text-gray-600">Smart meal planning</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
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

      <div className="mt-auto p-6">
        <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl p-4 border border-secondary/20">
          <div className="flex items-center gap-3 mb-3">
            <ApperIcon name="Lightbulb" size={20} className="text-secondary" />
            <h3 className="font-semibold text-gray-900">Pro Tip</h3>
          </div>
          <p className="text-sm text-gray-600">
            Drag meals from your library directly onto calendar slots to plan your week quickly!
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;