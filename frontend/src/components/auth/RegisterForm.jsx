import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name || formData.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password || formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (!formData.phone) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register(formData);
      toast.success(`Welcome to RoomNear, ${user.name}!`);
      navigate(user.role === 'landlord' ? '/dashboard' : '/listings');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        const fieldErrors = {};
        data.errors.forEach((msg) => {
          if (msg.toLowerCase().includes('email')) fieldErrors.email = msg;
          else if (msg.toLowerCase().includes('phone')) fieldErrors.phone = msg;
          else if (msg.toLowerCase().includes('password')) fieldErrors.password = msg;
          else if (msg.toLowerCase().includes('name')) fieldErrors.name = msg;
          else fieldErrors.general = msg;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: data?.message || 'Registration failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-300 focus:ring-red-500/30'
        : 'border-surface-200 focus:ring-primary-500/30 focus:border-primary-500'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[var(--radius-input)] text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      {/* Role Selector */}
      <div >
        <label className="block text-sm font-medium text-surface-700 mb-2">I am a</label>
        <div className="grid grid-cols-2 gap-3">
          {['student', 'landlord'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFormData({ ...formData, role })}
              className={`py-3 rounded-[var(--radius-input)] text-sm font-medium border-2 transition-all cursor-pointer ${
                formData.role === role
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-surface-200 bg-white text-surface-700 hover:border-surface-300'
              }`}
            >
              {role === 'student' ? '🎓 Student' : '🏠 Landlord'}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700/40" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass('name')}
            placeholder="Your full name"
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700/40" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass('email')}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone Number</label>
        <div className="relative">
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700/40" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            className={inputClass('phone')}
            placeholder="9876543210"
            maxLength={10}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        {formData.role === 'landlord' && formData.phone && !errors.phone && (
          <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-[var(--radius-input)]">
            <FiAlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Ensure WhatsApp is active on this number. Students will contact you via WhatsApp.
            </p>
          </div>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700/40" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`${inputClass('password')} !pr-11`}
            placeholder="Min 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-700/40 hover:text-surface-700 cursor-pointer"
          >
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-surface-700/60">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
