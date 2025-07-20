import { motion } from "framer-motion";
import MealsList from "@/components/organisms/MealsList";

const MealsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Meal Library</h1>
        <p className="text-gray-600">
          Manage your collection of favorite meals and recipes
        </p>
      </div>

      <MealsList />
    </motion.div>
  );
};

export default MealsPage;