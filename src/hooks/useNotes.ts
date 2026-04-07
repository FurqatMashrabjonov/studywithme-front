import { useCallback } from 'react';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';

export const useNotes = () => {
  const { currentNotebook, setNotes, setLoading } = useStore();

  const fetchNotes = useCallback(async () => {
    if (!currentNotebook) return;
    const uid = currentNotebook.uid || currentNotebook.notebook_uid;
    if (!uid) return;

    // Har bir notebook uchun alohida yuklashni ta'minlaymiz
    // Store-dagi notes arrayi hozirgi notebook uchun ekanligini 
    // tekshirish murakkab bo'lgani uchun, har safar tozalab yuklaymiz.
    setLoading(true);
    setNotes([]); 
    try {
      const response = await api.get(`/${uid}/note/`);
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [currentNotebook, setNotes, setLoading]);

  const createNote = async () => {
    if (!currentNotebook) return;
    const uid = currentNotebook.uid || currentNotebook.notebook_uid;
    if (!uid) return;

    try {
      const response = await api.post(`/${uid}/note/`);
      fetchNotes();
      return response.data.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const updateNote = async (noteId: number, name?: string, content?: string) => {
    if (!currentNotebook) return;
    const uid = currentNotebook.uid || currentNotebook.notebook_uid;
    if (!uid) return;

    try {
      const response = await api.put(`/${uid}/note/${noteId}`, { name, content });
      fetchNotes();
      return response.data.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId: number) => {
    if (!currentNotebook) return;
    const uid = currentNotebook.uid || currentNotebook.notebook_uid;
    if (!uid) return;

    try {
      await api.delete(`/${uid}/note/${noteId}`);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return { fetchNotes, createNote, updateNote, deleteNote };
};
