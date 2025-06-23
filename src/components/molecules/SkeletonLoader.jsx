import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, className = '' }) => {
  const shimmerVariants = {
    animate: {
      x: [-100, 100],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox skeleton */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-5 h-5 bg-gray-200 rounded border-2"></div>
            </div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0">
              {/* Title skeleton */}
              <div className="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4 mb-2">
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                />
              </div>

              {/* Description skeleton */}
              <div className="relative overflow-hidden bg-gray-200 rounded h-3 w-1/2 mb-3">
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                />
              </div>

              {/* Badges skeleton */}
              <div className="flex items-center gap-2">
                <div className="relative overflow-hidden bg-gray-200 rounded-full h-6 w-16">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  />
                </div>
                <div className="relative overflow-hidden bg-gray-200 rounded-full h-6 w-20">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Actions skeleton */}
            <div className="flex-shrink-0 flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;