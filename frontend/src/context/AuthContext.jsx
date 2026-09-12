import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('roomnear_token');
    const storedUser = localStorage.getItem('roomnear_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('roomnear_token');
        localStorage.removeItem('roomnear_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = data.data;

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('roomnear_token', newToken);
    localStorage.setItem('roomnear_user', JSON.stringify(userData));

    return userData;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    const { token: newToken, ...userData } = data.data;

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('roomnear_token', newToken);
    localStorage.setItem('roomnear_user', JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('roomnear_token');
    localStorage.removeItem('roomnear_user');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('roomnear_user', JSON.stringify(newUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isLandlord: user?.role === 'landlord',
    isStudent: user?.role === 'student',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
