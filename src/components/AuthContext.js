import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create auth context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      setUser(userInfo);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/auth/register', userData);
      
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/auth/login', userData);
      
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading, 
        error, 
        register, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);