import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EditTourModal = ({ isOpen, onClose, tour, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    price: '',
    type: '',
    rating: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title || '',
        location: tour.location || '',
        duration: tour.duration || '',
        price: tour.price || '',
        type: tour.type || '',
        rating: tour.rating || '',
        image: tour.image || '',
      });
    }
  }, [tour]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData, _id: tour?._id || tour?.id };
    console.log("SUBMIT:", payload);
    console.log("ID:", payload._id);

    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      
      const tourId = payload._id;
      
      const submitData = { ...payload };
      delete submitData._id;
      delete submitData.id;
      delete submitData.createdAt;
      delete submitData.updatedAt;
      delete submitData.__v;

      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(String(tourId));

      if (isValidMongoId) {
        try {
          await axios.put(`http://localhost:5000/api/admin/service/tour/${tourId}`, submitData, config);
          toast.success("Tour updated on server!");
        } catch (apiErr) {
          console.warn("Could not hit real DB API, continuing with local update", apiErr);
          toast.error(apiErr.response?.data?.message || 'Failed to update on server, but saved locally.');
        }
      } else {
        console.warn(`Skipping backend API call because ID ${tourId} is a local mock ID`);
        toast.success("Tour updated locally (Mock data)");
      }

      // Merge updated fields back into tour object
      const updatedTour = { 
        ...tour, 
        ...formData, 
        _id: payload._id,
        price: Number(formData.price) 
      };

      onSave(updatedTour);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update tour locally');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            ✏️ Edit Tour
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title / Name</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g., 5 Days / 4 Nights" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <input type="text" name="type" value={formData.type} onChange={handleChange} required placeholder="e.g., Adventure, Leisure, etc." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (Optional)</label>
            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL (Optional)</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTourModal;
