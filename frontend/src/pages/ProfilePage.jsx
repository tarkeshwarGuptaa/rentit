import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, selectUser, selectAuthLoading } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiShield, FiEdit2, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name || formData.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.phone) errs.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated!');
      setEditing(false);
    } else {
      toast.error(result.payload || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', phone: user?.phone || '' });
    setErrors({});
    setEditing(false);
  };

  const inputCls = (field) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
      errors[field] ? 'border-red-300' : 'border-zinc-200 focus:border-indigo-500'
    }`;

  return (
    <>
      <Helmet>
        <title>Profile — rentIt</title>
      </Helmet>

      <div className="px-4 sm:px-6 lg:px-10 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-6 font-display">
          Your Profile
        </h1>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
          style={{ boxShadow: 'var(--shadow-card)', maxWidth: '640px' }}>

          {/* Header banner */}
          <div className="p-6" style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-white text-xs font-medium mt-1"
                  style={{ background: 'rgba(255,255,255,0.18)' }}>
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
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-1.5">
                <FiUser className="w-4 h-4 text-zinc-400" /> Full Name
              </label>
              {editing ? (
                <>
                  <input type="text" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputCls('name')} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </>
              ) : (
                <p className="text-zinc-900 font-medium">{user?.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-1.5">
                <FiMail className="w-4 h-4 text-zinc-400" /> Email Address
              </label>
              <p className="text-zinc-900 font-medium">{user?.email}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-1.5">
                <FiPhone className="w-4 h-4 text-zinc-400" /> Phone Number
              </label>
              {editing ? (
                <>
                  <input type="tel" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className={inputCls('phone')} maxLength={10} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  {user?.role === 'landlord' && !errors.phone && formData.phone && (
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <FiAlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">Ensure WhatsApp is active on this number.</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-zinc-900 font-medium">+91 {user?.phone}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {editing ? (
                <>
                  <button onClick={handleSave} disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer">
                    <FiSave className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-700 rounded-xl font-medium text-sm hover:bg-zinc-200 transition-colors cursor-pointer">
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors cursor-pointer">
                  <FiEdit2 className="w-4 h-4" /> Edit Profile
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
