import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error parsing user info from localStorage:', error);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);

      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));

      // ✅ UPDATE REACT STATE IMMEDIATELY
      setUser(data);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  // 📝 REGISTER
  const register = async (name, email, password, role = 'User') => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role }, config);

      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));

      // ✅ UPDATE REACT STATE IMMEDIATELY
      setUser(data);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');

    // ✅ RESET REACT STATE IMMEDIATELY
    setUser(null);
  };

  // 🔄 Google Auth (used by Login page)
  const googleAuth = async (id_token) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/google', { id_token });

      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));

      // ✅ UPDATE REACT STATE IMMEDIATELY
      setUser(data);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Google authentication failed',
      };
    }
  };

  // 🔍 Admin check helper
  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout, googleAuth, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 🔧 Helper hook for easy usage
export const useAuth = () => useContext(AuthContext);
