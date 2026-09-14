import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthLoading, selectAuthError, clearAuthError } from '../../store/slices/authSlice';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name || formData.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!formData.phone) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    if (!validate()) return;

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      const user = result.payload.user;
      toast.success(`Welcome to rentIt, ${user.name}!`);
      navigate(user.role === 'landlord' ? '/dashboard' : '/listings');
    }
  };

  const inputCls = (field) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
      errors[field] ? 'border-red-300' : 'border-zinc-200 focus:border-indigo-500'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(errors.general || serverError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errors.general || serverError}
        </div>
      )}

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">I am a</label>
        <div className="grid grid-cols-2 gap-3">
          {['student', 'landlord'].map((role) => (
            <button key={role} type="button"
              onClick={() => setFormData({ ...formData, role })}
              className={`py-3 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                formData.role === role
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
              }`}>
              {role === 'student' ? '🎓 Student' : '🏠 Landlord'}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name</label>
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputCls('name')} placeholder="Your full name" />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputCls('email')} placeholder="you@example.com" />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Phone Number</label>
        <div className="relative">
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="tel" value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            className={inputCls('phone')} placeholder="9876543210" maxLength={10} />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        {formData.role === 'landlord' && formData.phone && !errors.phone && (
          <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <FiAlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">Students will contact you via WhatsApp on this number.</p>
          </div>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type={showPassword ? 'text' : 'password'} value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`${inputCls('password')} pr-11`} placeholder="Min 6 characters" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer">
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
