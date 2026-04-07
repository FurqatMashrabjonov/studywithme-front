import { useCallback } from 'react';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';

export const useNotebooks = () => {
  const { setNotebooks, setLoading, setCurrentNotebook, currentNotebook } = useStore();

  const fetchNotebooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/notebook/');
      const items = response.data.data || [];
      setNotebooks(items);

      if (items.length > 0) {
        if (!currentNotebook) {
          setCurrentNotebook(items[0]);
        } else {
          const currentUid = currentNotebook.uid || currentNotebook.notebook_uid;
          const matched = items.find((n: any) => (n.uid || n.notebook_uid) === currentUid);
          setCurrentNotebook(matched || items[0]);
        }
      } else {
        setCurrentNotebook(null);
      }
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    } finally {
      setLoading(false);
    }
  }, [setNotebooks, setLoading, setCurrentNotebook, currentNotebook]);

  const createNotebook = async () => {
    try {
      const response = await api.post('/notebook/');
      const newNotebook = response.data.data;
      await fetchNotebooks();
      return newNotebook;
    } catch (error) {
      console.error('Error creating notebook:', error);
      throw error;
    }
  };

  const updateNotebook = async (uid: string, name: string) => {
    try {
      const response = await api.put(`/notebook/${uid}`, { name });
      await fetchNotebooks();
      return response.data.data;
    } catch (error) {
      console.error('Error updating notebook:', error);
      throw error;
    }
  };

  const deleteNotebook = async (uid: string) => {
    try {
      await api.delete(`/notebook/${uid}`);
      await fetchNotebooks();
    } catch (error) {
      console.error('Error deleting notebook:', error);
      throw error;
    }
  };

  return { fetchNotebooks, createNotebook, updateNotebook, deleteNotebook };
};
