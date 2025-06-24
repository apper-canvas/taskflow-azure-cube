import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ContactForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    Name: initialData?.Name || '',
    Phone: initialData?.Phone || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }

    if (!formData.Phone.trim()) {
      newErrors.Phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.Phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.Phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          placeholder="Enter contact name"
          value={formData.Name}
          onChange={(e) => handleChange('Name', e.target.value)}
          error={errors.Name}
          icon="User"
          disabled={isSubmitting}
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="Enter phone number"
          value={formData.Phone}
          onChange={(e) => handleChange('Phone', e.target.value)}
          error={errors.Phone}
          icon="Phone"
          disabled={isSubmitting}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <ApperIcon name={initialData ? "Save" : "Plus"} size={16} className="mr-2" />
                {initialData ? 'Update Contact' : 'Create Contact'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;