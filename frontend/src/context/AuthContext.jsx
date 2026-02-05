import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);
      // Normalize role to lowercase for frontend consistency
      const normalizedUser = {
        ...userData,
        role: userData.role?.toLowerCase()
      };
      setToken(storedToken);
      setUser(normalizedUser);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user: userData } = response.data;

      // Normalize role to lowercase for frontend consistency
      const normalizedUser = {
        ...userData,
        role: userData.role?.toLowerCase()
      };

      // Save to state
      setToken(access_token);
      setUser(normalizedUser);

      // Save to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  const register = async (email, password, role) => {
    try {
      const response = await authAPI.register({ email, password, role });
      const { access_token, user: userData } = response.data;

      // Normalize role to lowercase for frontend consistency
      const normalizedUser = {
        ...userData,
        role: userData.role?.toLowerCase()
      };

      // Save to state
      setToken(access_token);
      setUser(normalizedUser);

      // Save to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAgent: user?.role === 'agent',
    isAffiliate: user?.role === 'affiliate',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};