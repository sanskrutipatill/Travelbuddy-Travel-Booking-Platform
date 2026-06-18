import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    city: '',
    country: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  // Load saved profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name required
    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profile.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation (optional but if provided must be valid)
    if (profile.phone && !validatePhone(profile.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }

    // Date of birth format check (optional)
    if (profile.dateOfBirth) {
      const date = new Date(profile.dateOfBirth);
      const today = new Date();
      if (date > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Save error:', error);
    }
  };

  const handleCancel = () => {
    // Reset to saved values
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
    setErrors({});
    setIsEditing(false);
    toast.info('Changes discarded');
  };

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={profile[name]}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} rounded-xl border ${
            errors[name]
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
          } bg-white shadow-sm focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-500`}
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={profile[name]}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-500"
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your personal information</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-8">
            {/* Section 1: General Information */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                General Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  icon={User}
                  required
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  options={genderOptions}
                />
                <InputField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  placeholder="Select your date of birth"
                  icon={Calendar}
                />
                <InputField
                  label="City"
                  name="city"
                  placeholder="Enter your city"
                  icon={MapPin}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Country"
                    name="country"
                    placeholder="Enter your country"
                    icon={MapPin}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Contact Details */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number"
                  name="phone"
                  placeholder="Enter your phone number"
                  icon={Phone}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  required
                />
              </div>
            </section>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your profile information is stored locally in your browser. For a complete experience, please ensure your details are up to date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
