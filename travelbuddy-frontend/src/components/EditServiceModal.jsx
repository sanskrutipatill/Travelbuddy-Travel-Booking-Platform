import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Edit2, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const EditServiceModal = ({ isOpen, onClose, serviceType, item, onSave, onDelete }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const isCreating = !item; // If no item provided, we're creating

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      // Default values for new items
      const defaults = {
        flight: { airline: '', flightNumber: '', source: '', destination: '', departureTime: '', arrivalTime: '', duration: '', price: 0, stops: 0, date: '' },
        hotel: { name: '', location: '', price: 0, originalPrice: null, rating: 0, reviews: 0, propertyType: 'Hotel', amenities: [], image: '', description: '' },
        train: { trainName: '', trainNumber: '', source: '', destination: '', departure: '', arrival: '', duration: '', price: 0, class: '3AC', date: '' },
        cab: { model: '', cabType: 'Mini', pickup: '', drop: '', distance: 0, price: 0, driverName: '', carModel: '' },
        package: { title: '', location: '', price: 0, originalPrice: null, rating: 0, reviews: 0, duration: '', type: 'Leisure', highlights: [], image: '', description: '' },
      };
      setFormData(defaults[serviceType] || {});
    }
  }, [item, serviceType]);

  if (!isOpen) return null;

  const getConfig = () => {
    const configs = {
      flight: {
        title: isCreating ? 'Add New Flight' : 'Edit Flight',
        fields: [
          { key: 'airline', label: 'Airline', type: 'text', required: true },
          { key: 'flightNumber', label: 'Flight Number', type: 'text', required: true },
          { key: 'source', label: 'Source', type: 'text', required: true },
          { key: 'destination', label: 'Destination', type: 'text', required: true },
          { key: 'departureTime', label: 'Departure Time', type: 'text', placeholder: '06:00' },
          { key: 'arrivalTime', label: 'Arrival Time', type: 'text', placeholder: '08:30' },
          { key: 'duration', label: 'Duration', type: 'text', placeholder: '2h 30m' },
          { key: 'price', label: 'Price (₹)', type: 'number', required: true },
          { key: 'stops', label: 'Stops', type: 'number', default: 0 },
          { key: 'date', label: 'Date', type: 'date' },
        ],
        endpoint: isCreating ? '/api/admin/service/flight' : `/api/admin/service/flight/${item?._id}`,
        method: isCreating ? 'post' : 'put',
      },
      hotel: {
        title: isCreating ? 'Add New Hotel' : 'Edit Hotel',
        fields: [
          { key: 'name', label: 'Hotel Name', type: 'text', required: true },
          { key: 'location', label: 'Location', type: 'text', required: true },
          { key: 'price', label: 'Price per Night (₹)', type: 'number', required: true },
          { key: 'originalPrice', label: 'Original Price (₹)', type: 'number' },
          { key: 'rating', label: 'Rating', type: 'number', step: 0.1, min: 0, max: 5 },
          { key: 'reviews', label: 'Number of Reviews', type: 'number' },
          { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Hotel', 'Villa', 'Resort', 'Apartment', 'Boutique', 'Guest House'] },
          { key: 'amenities', label: 'Amenities (comma separated)', type: 'text', transform: (val) => typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(s => s) : val },
          { key: 'image', label: 'Image URL', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
        endpoint: isCreating ? '/api/admin/service/hotel' : `/api/admin/service/hotel/${item?._id}`,
        method: isCreating ? 'post' : 'put',
      },
      train: {
        title: isCreating ? 'Add New Train' : 'Edit Train',
        fields: [
          { key: 'trainName', label: 'Train Name', type: 'text', required: true },
          { key: 'trainNumber', label: 'Train Number', type: 'text', required: true },
          { key: 'source', label: 'Source', type: 'text', required: true },
          { key: 'destination', label: 'Destination', type: 'text', required: true },
          { key: 'departure', label: 'Departure', type: 'text', placeholder: '16:25' },
          { key: 'arrival', label: 'Arrival', type: 'text', placeholder: '08:35' },
          { key: 'duration', label: 'Duration', type: 'text', placeholder: '16h 10m' },
          { key: 'price', label: 'Price (₹)', type: 'number', required: true },
          { key: 'class', label: 'Class', type: 'select', options: ['1AC', '2AC', '3AC', 'Sleeper', 'General', 'AC Chair'] },
          { key: 'date', label: 'Date', type: 'date' },
        ],
        endpoint: isCreating ? '/api/admin/service/train' : `/api/admin/service/train/${item?._id}`,
        method: isCreating ? 'post' : 'put',
      },
      cab: {
        title: isCreating ? 'Add New Cab' : 'Edit Cab',
        fields: [
          { key: 'model', label: 'Car Model', type: 'text', required: true },
          { key: 'cabType', label: 'Cab Type', type: 'select', options: ['Mini', 'Sedan', 'SUV', 'Premium'] },
          { key: 'pickup', label: 'Pickup Location', type: 'text', required: true },
          { key: 'drop', label: 'Drop Location', type: 'text', required: true },
          { key: 'distance', label: 'Distance (km)', type: 'number', required: true },
          { key: 'price', label: 'Price (₹)', type: 'number', required: true },
          { key: 'driverName', label: 'Driver Name', type: 'text' },
          { key: 'carModel', label: 'Car Model Details', type: 'text' },
        ],
        endpoint: isCreating ? '/api/admin/service/cab' : `/api/admin/service/cab/${item?._id}`,
        method: isCreating ? 'post' : 'put',
      },
      package: {
        title: isCreating ? 'Add New Package' : 'Edit Package',
        fields: [
          { key: 'title', label: 'Package Title', type: 'text', required: true },
          { key: 'location', label: 'Location', type: 'text', required: true },
          { key: 'price', label: 'Price (₹)', type: 'number', required: true },
          { key: 'originalPrice', label: 'Original Price (₹)', type: 'number' },
          { key: 'rating', label: 'Rating', type: 'number', step: 0.1, min: 0, max: 5 },
          { key: 'reviews', label: 'Number of Reviews', type: 'number' },
          { key: 'duration', label: 'Duration', type: 'text', placeholder: '4 Days / 3 Nights' },
          { key: 'type', label: 'Package Type', type: 'select', options: ['Leisure', 'Adventure', 'Heritage', 'Nature', 'Romantic', 'Budget', 'International'] },
          { key: 'highlights', label: 'Highlights (comma separated)', type: 'text', transform: (val) => typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(s => s) : val },
          { key: 'image', label: 'Image URL', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
        endpoint: isCreating ? '/api/admin/service/package' : `/api/admin/service/package/${item?._id}`,
        method: isCreating ? 'post' : 'put',
      },
    };
    return configs[serviceType] || configs.flight;
  };

  const config = getConfig();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData, _id: item?._id || item?.id };
    if (serviceType === 'cab') console.log("CAB ID:", payload._id);
    console.log("SUBMIT:", payload);
    console.log("ID:", payload._id);

    try {
      const cleanData = { ...payload };

      if (cleanData.date) {
        cleanData.date = cleanData.date.split('T')[0];
      }
      
      if (serviceType === 'train') {
        cleanData.name = cleanData.trainName || cleanData.name || 'Train';
        if (!cleanData.timing) {
          cleanData.timing = `${cleanData.departure || '00:00'} - ${cleanData.arrival || '00:00'}`;
        }
      }

      config.fields.forEach(field => {
        if (field.transform && cleanData[field.key] !== undefined) {
          cleanData[field.key] = field.transform(cleanData[field.key]);
        }
      });

      const axiosConfig = { headers: { Authorization: `Bearer ${user?.token}` } };
      let updatedData = cleanData;

      if (!isCreating) {
        let endpoint = config.endpoint;
        if (endpoint.endsWith('undefined')) {
          endpoint = endpoint.replace('undefined', payload._id);
        } else if (!endpoint.includes(payload._id)) {
           endpoint = `/api/admin/service/${serviceType.toLowerCase()}/${payload._id}`;
        }

        // Avoid mutating immutable fields in mongo by deleting them from the update payload
        const submitData = { ...cleanData };
        delete submitData._id;
        delete submitData.createdAt;
        delete submitData.updatedAt;
        delete submitData.__v;
        delete submitData.id;

        // Check if the ID is a valid MongoDB ObjectId before sending PUT
        const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(String(payload._id));

        if (isValidMongoId) {
          try {
            const res = await axios.put(`http://localhost:5000${endpoint}`, submitData, axiosConfig);
            updatedData = res.data?.service || res.data || cleanData;
            toast.success(`${serviceType} updated successfully`);
          } catch (apiErr) {
            console.warn("API update failed", apiErr);
            toast.error(apiErr.response?.data?.message || 'Failed to update on server, but saved locally.');
          }
        } else {
          console.warn(`Skipping backend API call because ID ${payload._id} is a local mock ID`);
          toast.success(`${serviceType} updated locally (Mock data)`);
        }
      } else {
        try {
          const res = await axios.post(`http://localhost:5000${config.endpoint}`, cleanData, axiosConfig);
          updatedData = res.data?.service || res.data || cleanData;
          toast.success(`${serviceType} created successfully`);
        } catch (apiErr) {
          console.warn("API create failed", apiErr);
          toast.error(apiErr.response?.data?.message || 'Failed to create service.');
          throw apiErr; // block save if create fails
        }
      }

      if (onSave) {
        await onSave(updatedData);
      }
    } catch (err) {
      console.error(err);
      // Main catch is only hit if creation throws or code crashes
      toast.error('Local save error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Delete only works on existing items
  const handleDelete = async () => {
    if (isCreating) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const configAxios = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000${config.endpoint}`, configAxios);
      toast.success('Service deleted successfully!');
      if (onDelete) onDelete();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    let value = formData[field.key];
    
    // Specifically format date for <input type="date"> so it doesn't break
    if (field.type === 'date' && value) {
      if (typeof value === 'string' && value.includes('T')) {
        value = value.split('T')[0];
      } else if (value instanceof Date) {
        value = value.toISOString().split('T')[0];
      }
    }

    const displayValue = Array.isArray(value) ? value.join(', ') : (value !== undefined && value !== null ? value : '');
    const inputValue = value !== undefined && value !== null ? value : '';

    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.key}
          value={displayValue}
          onChange={handleChange}
          required={field.required}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder={field.placeholder}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          name={field.key}
          value={inputValue}
          onChange={handleChange}
          required={field.required}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
        >
          <option value="">Select {field.label}</option>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        name={field.key}
        value={inputValue}
        onChange={handleChange}
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step || 'any'}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {isCreating ? <Plus className="w-5 h-5 text-blue-600" /> : <Edit2 className="w-5 h-5 text-yellow-600" />}
            {config.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {config.fields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : (isCreating ? 'Create' : 'Save Changes')}
            </button>
            {!isCreating && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
