import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const CategoryList = ({ 
  categories = [], 
  activeCategory, 
  onCategorySelect,
  className = '' 
}) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <ApperIcon name="Folder" className="w-4 h-4" />
          Categories
        </h3>
        
        <div className="space-y-1">
          {/* All Categories */}
<motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategorySelect(null)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
              !activeCategory ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>All Categories</span>
            </div>
            <Badge size="small" variant={!activeCategory ? 'primary' : 'default'}>
              {categories.reduce((sum, cat) => sum + (cat.task_count || 0), 0)}
            </Badge>
          </motion.button>

          {/* Individual Categories */}
          {categories.map((category) => (
            <motion.button
              key={category.Id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategorySelect(category.Name?.toLowerCase())}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                activeCategory === category.Name?.toLowerCase() 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="capitalize">{category.Name}</span>
              </div>
              {(category.task_count || 0) > 0 && (
                <Badge 
                  size="small" 
                  variant={activeCategory === category.Name?.toLowerCase() ? 'primary' : 'default'}
                >
                  {category.task_count}
                </Badge>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryList;