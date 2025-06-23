import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ 
  onSearch, 
  onClear,
  placeholder = "Search tasks...",
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        onSearch(query.trim()).finally(() => setIsSearching(false));
      } else {
        onClear?.();
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch, onClear]);

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={isSearching ? 'Loader2' : 'Search'}
        iconPosition="left"
        className={isSearching ? 'animate-pulse' : ''}
      />
      
      {query && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Button
            variant="ghost"
            size="small"
            icon="X"
            onClick={handleClear}
            className="p-1 h-6 w-6"
          />
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;