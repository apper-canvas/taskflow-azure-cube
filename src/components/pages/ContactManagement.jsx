import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ContactForm from '@/components/molecules/ContactForm';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Filter contacts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = contacts.filter(contact => 
        contact.Name?.toLowerCase().includes(query) ||
        contact.Phone?.toLowerCase().includes(query)
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(contact => contact.Id !== contactId));
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingContact) {
        // Update existing contact
        const updatedContact = await contactService.update(editingContact.Id, formData);
        setContacts(prev => prev.map(contact => 
          contact.Id === editingContact.Id ? { ...contact, ...updatedContact } : contact
        ));
        toast.success('Contact updated successfully');
      } else {
        // Create new contact
        const newContact = await contactService.create(formData);
        setContacts(prev => [...prev, newContact]);
        toast.success('Contact created successfully');
      }
      setShowForm(false);
      setEditingContact(null);
    } catch (err) {
      toast.error(editingContact ? 'Failed to update contact' : 'Failed to create contact');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const getEmptyStateConfig = () => {
    if (searchQuery.trim()) {
      return {
        icon: 'Search',
        title: 'No contacts found',
        description: `No contacts match "${searchQuery}". Try adjusting your search.`,
        action: {
          label: 'Clear Search',
          onClick: handleClearSearch
        }
      };
    }
    
    return {
      icon: 'UserCircle',
      title: 'No contacts yet',
      description: 'Start building your contact list by adding your first contact.',
      action: {
        label: 'Add Contact',
        onClick: handleAddContact
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            message={error}
            onRetry={loadContacts}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
              <p className="mt-2 text-gray-600">
                Manage your contact information
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleAddContact}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <Input
              type="text"
              placeholder="Search contacts by name or phone..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              icon="Search"
              className="max-w-md"
            />
          </div>

          {/* Stats */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ApperIcon name="Users" size={20} className="text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact List */}
        {filteredContacts.length === 0 && !loading ? (
          <EmptyState {...getEmptyStateConfig()} />
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Contact List ({filteredContacts.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {contact.Name}
                        </h4>
                        <p className="text-gray-600">
                          <ApperIcon name="Phone" size={14} className="inline mr-1" />
                          {contact.Phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContact(contact)}
                      >
                        <ApperIcon name="Edit" size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.Id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleFormCancel}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ContactForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                initialData={editingContact}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactManagement;