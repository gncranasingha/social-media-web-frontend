import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
  });

  api.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      await fetchUser(data.token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      await fetchUser();
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);