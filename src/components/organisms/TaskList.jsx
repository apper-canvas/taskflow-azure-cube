import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const TaskList = ({ 
  tasks = [], 
  loading = false,
  error = null,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onRetry,
  emptyStateConfig = {}
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } }
  };

  if (loading) {
    return <SkeletonLoader count={5} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={emptyStateConfig.icon || 'CheckSquare'}
        title={emptyStateConfig.title || 'No tasks found'}
        description={emptyStateConfig.description || 'Create your first task to get started organizing your day'}
        actionLabel={emptyStateConfig.actionLabel || 'Add Your First Task'}
        onAction={onAddTask}
      />
    );
  }

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            variants={itemVariants}
            layout
            className="w-full"
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;