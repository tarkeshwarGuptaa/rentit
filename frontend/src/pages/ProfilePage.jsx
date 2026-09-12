import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiEdit2,
  FiSave,
  FiX,
  FiAlertCircle,
} from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name || formData.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.phone) errs.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      updateUser(data.data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', phone: user?.phone || '' });
    setErrors({});
    setEditing(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile — RoomNear</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-8 font-[var(--font-display)]">
          Your Profile
        </h1>

        <div className="bg-white border border-surface-200 rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 rounded-[var(--radius-badge)] text-white/90 text-xs font-medium mt-1">
                  <FiShield className="w-3 h-3" />
                  {user?.role === 'landlord' ? 'Landlord' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <FiUser className="w-4 h-4 text-surface-700/40" />
                Full Name
              </label>
              {editing ? (
                <>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? 'border-red-300 focus:ring-red-500/30' : 'border-surface-200 focus:ring-primary-500/30'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </>
              ) : (
                <p className="text-surface-900 font-medium">{user?.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <FiMail className="w-4 h-4 text-surface-700/40" />
                Email Address
              </label>
              <p className="text-surface-900 font-medium">{user?.email}</p>
              <p className="text-xs text-surface-700/50 mt-0.5">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-1.5">
                <FiPhone className="w-4 h-4 text-surface-700/40" />
                Phone Number
              </label>
              {editing ? (
                <>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    className={`w-full px-4 py-2.5 border rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.phone ? 'border-red-300 focus:ring-red-500/30' : 'border-surface-200 focus:ring-primary-500/30'
                    }`}
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  {user?.role === 'landlord' && !errors.phone && formData.phone && (
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-[var(--radius-input)]">
                      <FiAlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        Ensure WhatsApp is active on this number.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-surface-900 font-medium">+91 {user?.phone}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-medium text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <FiSave className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-100 text-surface-700 rounded-[var(--radius-button)] font-medium text-sm hover:bg-surface-200 transition-colors cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-medium text-sm hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
