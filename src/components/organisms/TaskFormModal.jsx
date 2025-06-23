import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import TaskForm from '@/components/molecules/TaskForm';
import ApperIcon from '@/components/ApperIcon';

const TaskFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  categories = [],
  loading = false 
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon 
                      name={initialData ? "Edit2" : "Plus"} 
                      className="w-4 h-4 text-primary" 
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {initialData ? 'Edit Task' : 'Create New Task'}
                  </h2>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all duration-200"
                  disabled={loading}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Form */}
              <div className="p-6">
                <TaskForm
                  onSubmit={onSubmit}
                  onCancel={onClose}
                  initialData={initialData}
                  categories={categories}
                  loading={loading}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;