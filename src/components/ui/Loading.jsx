import { motion } from "framer-motion";

const LoadingSkeleton = ({ className = "" }) => (
  <div className={`shimmer rounded-lg ${className}`} />
);

const CalendarSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <LoadingSkeleton className="h-8 w-48" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-10 w-10 rounded-lg" />
        <LoadingSkeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
    
    <div className="calendar-grid">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <LoadingSkeleton className="h-6 w-20" />
          {Array.from({ length: 3 }).map((_, mealIndex) => (
            <LoadingSkeleton key={mealIndex} className="h-24 rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const MealListSkeleton = () => (
  <div className="space-y-3">
    <LoadingSkeleton className="h-8 w-32" />
    {Array.from({ length: 6 }).map((_, index) => (
      <LoadingSkeleton key={index} className="h-20 rounded-xl" />
    ))}
  </div>
);

const ShoppingListSkeleton = () => (
  <div className="space-y-4">
    <LoadingSkeleton className="h-8 w-40" />
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="flex justify-between items-center">
        <LoadingSkeleton className="h-5 w-32" />
        <LoadingSkeleton className="h-5 w-16" />
      </div>
    ))}
  </div>
);

const Loading = ({ variant = "default", className = "" }) => {
  const variants = {
    calendar: CalendarSkeleton,
    mealList: MealListSkeleton,
    shoppingList: ShoppingListSkeleton,
    default: () => <LoadingSkeleton className="h-32 w-full" />
  };

  const SkeletonComponent = variants[variant] || variants.default;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`animate-pulse ${className}`}
    >
      <SkeletonComponent />
    </motion.div>
  );
};

export default Loading;