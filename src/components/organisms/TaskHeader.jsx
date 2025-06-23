import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ProgressRing from '@/components/atoms/ProgressRing';

const TaskHeader = ({ 
  onAddTask,
  onSearch,
  onClearSearch,
  completionPercentage = 0,
  tasksCompleted = 0,
  totalTasks = 0
}) => {
  const currentDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-100 px-6 py-4"
    >
      <div className="flex items-center justify-between mb-4">
        {/* Left side - Logo and date */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div className="hidden sm:block text-sm text-gray-500">
            {currentDate}
          </div>
        </div>

        {/* Right side - Progress and Add button */}
        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          {totalTasks > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {tasksCompleted} of {totalTasks} completed
                </div>
                <div className="text-xs text-gray-500">
                  Keep up the great work!
                </div>
              </div>
              <ProgressRing 
                progress={completionPercentage}
                size={48}
                strokeWidth={3}
              />
            </div>
          )}

          {/* Add task button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onAddTask}
              icon="Plus"
              className="shadow-lg"
            >
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Search bar */}
      <div className="max-w-md">
        <SearchBar
          onSearch={onSearch}
          onClear={onClearSearch}
          placeholder="Search your tasks..."
        />
      </div>
    </motion.header>
  );
};

export default TaskHeader;