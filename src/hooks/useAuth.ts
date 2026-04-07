import { useCallback } from 'react';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';

export const useAuth = () => {
  const { setUser, setToken, setLoading, logout } = useStore();

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data.data;
      setToken(access_token);
      setUser(user);
      return response.data.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMe = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Get me failed:', error);
      logout();
    }
  }, [setUser, logout]);

  return { register, login, getMe, logout };
};
