import { useCallback } from 'react';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';

export const useChat = () => {
  const { currentNotebook, setChatHistory, addChatMessage, setLoading } = useStore();

  const normalizeHistory = (payload: unknown) => {
    if (!Array.isArray(payload)) return [];

    return payload
      .map((item: any) => {
        const role = item?.role === 'user' ? 'user' : 'assistant';
        const message = item?.message ?? item?.text ?? '';

        if (typeof message !== 'string' || !message.trim()) {
          return null;
        }

        return { role, message };
      })
      .filter(Boolean) as { role: 'user' | 'assistant'; message: string }[];
  };

  const fetchHistory = useCallback(async () => {
    if (!currentNotebook) return;
    const uid = currentNotebook.uid || currentNotebook.notebook_uid;
    if (!uid) return;
    
    // Check if we already have history to avoid duplicate calls
    const currentHistory = useStore.getState().chatHistory;
    if (currentHistory && currentHistory.length > 0) return;

    setLoading(true);
    try {
      const response = await api.get(`/${uid}/ai/history`);
      const historyPayload = response?.data?.data ?? response?.data?.history ?? [];
      setChatHistory(normalizeHistory(historyPayload));
    } catch (error) {
      console.error('Error fetching history:', error);
      setChatHistory([]);
    } finally {
      setLoading(false);
    }
  }, [currentNotebook, setChatHistory, setLoading]);

  const sendMessage = async (message: string) => {
    if (!currentNotebook) return;
    const uid = currentNotebook.uid || currentNotebook.notebook_uid;
    if (!uid) return;
    
    // Add user message locally
    addChatMessage({ role: 'user', message });
    
    try {
      const response = await api.post(`/${uid}/ai/chat`, { message });
      const assistantMsg =
        response?.data?.data?.message ??
        response?.data?.data?.text ??
        response?.data?.message ??
        response?.data?.text ??
        '';

      if (assistantMsg) {
        addChatMessage({ role: 'assistant', message: String(assistantMsg) });
      }

      return response?.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return { fetchHistory, sendMessage };
};
