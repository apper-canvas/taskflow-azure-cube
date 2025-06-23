import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterBar = ({ 
  activeFilter, 
  onFilterChange, 
  taskCounts = {},
  className = '' 
}) => {
  const filters = [
    { id: 'all', label: 'All Tasks', icon: 'List', count: taskCounts.all || 0 },
    { id: 'today', label: 'Today', icon: 'Calendar', count: taskCounts.today || 0 },
    { id: 'week', label: 'This Week', icon: 'CalendarDays', count: taskCounts.week || 0 },
    { id: 'high', label: 'High Priority', icon: 'AlertCircle', count: taskCounts.high || 0 },
    { id: 'overdue', label: 'Overdue', icon: 'Clock', count: taskCounts.overdue || 0 }
  ];

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 ${className}`}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        
        return (
          <motion.div
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isActive ? 'primary' : 'ghost'}
              size="small"
              icon={filter.icon}
              onClick={() => onFilterChange(filter.id)}
              className={`flex-shrink-0 ${isActive ? 'shadow-md' : ''}`}
            >
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <Badge 
                  variant={isActive ? 'default' : 'primary'} 
                  size="small"
                  className="ml-2"
                >
                  {filter.count}
                </Badge>
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FilterBar;