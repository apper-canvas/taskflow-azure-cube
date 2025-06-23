import { motion } from 'framer-motion';
import CategoryList from '@/components/molecules/CategoryList';
import FilterBar from '@/components/molecules/FilterBar';

const TaskSidebar = ({ 
  categories = [],
  activeCategory,
  onCategorySelect,
  activeFilter,
  onFilterChange,
  taskCounts = {},
  isOpen = false,
  onClose
}) => {
  const sidebarVariants = {
    closed: { x: '-100%' },
    open: { x: 0 }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <>
      {/* Mobile overlay */}
      <motion.div
        variants={overlayVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 overflow-y-auto lg:translate-x-0"
      >
        <div className="p-6">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Organize</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.div>
            </button>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Organize</h2>
            <p className="text-sm text-gray-500 mt-1">
              Filter and organize your tasks
            </p>
          </div>

          {/* Filter bar - vertical on sidebar */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
            <div className="space-y-2">
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
                taskCounts={taskCounts}
                className="flex-col space-y-2"
              />
            </div>
          </div>

          {/* Categories */}
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={onCategorySelect}
          />
        </div>
      </motion.aside>
    </>
  );
};

export default TaskSidebar;