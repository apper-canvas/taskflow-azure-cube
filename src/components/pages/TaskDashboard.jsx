import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { isToday, isThisWeek, isPast, parseISO } from 'date-fns';

import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

import TaskHeader from '@/components/organisms/TaskHeader';
import TaskSidebar from '@/components/organisms/TaskSidebar';
import TaskList from '@/components/organisms/TaskList';
import TaskFormModal from '@/components/organisms/TaskFormModal';
import ApperIcon from '@/components/ApperIcon';

const TaskDashboard = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // UI state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await taskService.searchTasks(query);
      setSearchResults(results);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Task filtering logic
  const filteredTasks = useMemo(() => {
    let filtered = searchQuery ? searchResults : tasks;

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(task => task.category === activeCategory);
    }

    // Filter by quick filters
    switch (activeFilter) {
      case 'today':
        filtered = filtered.filter(task => isToday(parseISO(task.dueDate)));
        break;
      case 'week':
        filtered = filtered.filter(task => isThisWeek(parseISO(task.dueDate)));
        break;
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          isPast(parseISO(task.dueDate)) && 
          !isToday(parseISO(task.dueDate)) && 
          !task.completed
        );
        break;
      default:
        break;
    }

    // Sort: incomplete tasks first, then by due date
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [tasks, searchResults, searchQuery, activeCategory, activeFilter]);

  // Task count calculations
  const taskCounts = useMemo(() => {
    const all = tasks.length;
    const today = tasks.filter(task => isToday(parseISO(task.dueDate))).length;
    const week = tasks.filter(task => isThisWeek(parseISO(task.dueDate))).length;
    const high = tasks.filter(task => task.priority === 'high').length;
    const overdue = tasks.filter(task => 
      isPast(parseISO(task.dueDate)) && 
      !isToday(parseISO(task.dueDate)) && 
      !task.completed
    ).length;

    return { all, today, week, high, overdue };
  }, [tasks]);

  // Progress calculations
  const completionStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }, [tasks]);

  // Task operations
  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, formData);
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id ? updatedTask : task
        ));
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create(formData);
        setTasks(prev => [newTask, ...prev]);
        toast.success('Task created successfully');
      }
      
      setIsFormModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  // Empty state configurations
  const getEmptyStateConfig = () => {
    if (searchQuery) {
      return {
        icon: 'Search',
        title: 'No tasks found',
        description: `No tasks match "${searchQuery}". Try a different search term.`,
        actionLabel: null
      };
    }
    
    if (activeFilter === 'today') {
      return {
        icon: 'Calendar',
        title: 'No tasks due today',
        description: 'Looks like you have a free day! Add some tasks to stay productive.',
        actionLabel: 'Add Task for Today'
      };
    }
    
    if (activeCategory) {
      return {
        icon: 'Folder',
        title: `No ${activeCategory} tasks`,
        description: `You don't have any tasks in the ${activeCategory} category yet.`,
        actionLabel: `Add ${activeCategory} Task`
      };
    }

    return {
      icon: 'CheckSquare',
      title: 'Welcome to TaskFlow!',
      description: 'Start organizing your day by creating your first task. You\'ve got this!',
      actionLabel: 'Create Your First Task'
    };
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <TaskHeader
        onAddTask={handleAddTask}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        completionPercentage={completionStats.percentage}
        tasksCompleted={completionStats.completed}
        totalTasks={completionStats.total}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <TaskSidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskCounts={taskCounts}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <ApperIcon name="Menu" className="w-4 h-4" />
                <span className="text-sm font-medium">Filters & Categories</span>
              </motion.button>
            </div>

            {/* Filter summary */}
            {(activeFilter !== 'all' || activeCategory) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 mb-6 border border-gray-100"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="Filter" className="w-4 h-4" />
                  <span>
                    Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                    {activeCategory && ` in ${activeCategory}`}
                    {activeFilter !== 'all' && ` (${activeFilter})`}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Task list */}
            <TaskList
              tasks={filteredTasks}
              loading={loading}
              error={error}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
              onRetry={loadData}
              emptyStateConfig={getEmptyStateConfig()}
            />
          </div>
        </main>
      </div>

      {/* Task form modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        categories={categories}
        loading={formLoading}
      />
    </div>
  );
};

export default TaskDashboard;