import { motion } from 'framer-motion';
import { useContext } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { AuthContext } from '../../App';

function Header({ className = "" }) {
  const { logout } = useContext(AuthContext);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="UtensilsCrossed" size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold gradient-text">MealCraft</h1>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="LogOut" size={16} />
          Logout
        </Button>
      </div>
    </motion.header>
  );
}

export default Header;