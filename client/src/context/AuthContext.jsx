import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await authService.getMe(); // { user }
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

const login = async (email, password) => {
  try {
    const data = await authService.login(email, password);

    // Save JWT for browsers where the cookie is not reliably sent
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    setUser(data.user);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

const logout = async () => {
  try {
    await authService.logout();
  } finally {
    localStorage.removeItem('token');
    setUser(null);
  }
};

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};