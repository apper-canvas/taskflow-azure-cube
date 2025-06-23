import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
const { Id, title, Name, description, completed, priority, category, due_date, dueDate } = task;
const taskTitle = title || Name;
  const taskDueDate = due_date || dueDate;
  const dueDateObj = parseISO(taskDueDate);
  const isOverdue = isPast(dueDateObj) && !isToday(dueDateObj) && !completed;
  const isDueToday = isToday(dueDateObj);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#94a3b8';
    }
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      work: '#5B4FE9',
      personal: '#4CAF50',
      shopping: '#FF9800',
      fitness: '#F44336',
      learning: '#2196F3'
    };
    return categoryColors[category] || '#94a3b8';
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition-all duration-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={completed}
            onChange={() => onToggleComplete(Id)}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Priority Indicator */}
            <div 
              className={`w-2 h-2 rounded-full ${priority === 'high' && isOverdue ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: getPriorityColor(priority) }}
            />
            
{/* Title */}
            <h3 className={`font-medium text-gray-900 ${completed ? 'line-through opacity-60' : ''}`}>
              {taskTitle}
            </h3>
          </div>

          {/* Description */}
          {description && (
            <p className={`text-sm text-gray-600 mb-2 ${completed ? 'opacity-60' : ''}`}>
              {description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Badge */}
            <Badge 
              color={getCategoryColor(category)}
              size="small"
            >
              {category}
            </Badge>

            {/* Due Date */}
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-600' : 
              isDueToday ? 'text-amber-600' : 
              'text-gray-500'
            }`}>
              <ApperIcon name="Calendar" className="w-3 h-3" />
              <span>
                {isDueToday ? 'Today' : format(dueDateObj, 'MMM d')}
              </span>
              {isOverdue && (
                <Badge variant="danger" size="small">
                  Overdue
                </Badge>
              )}
            </div>

            {/* Priority Label */}
            <Badge 
              variant={priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'success'}
              size="small"
            >
              {priority}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit?.(task)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete?.(Id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;