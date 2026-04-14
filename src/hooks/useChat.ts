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
    
    addChatMessage({ role: 'user', message });
    
    // Boshlanishida "O'ylamoqda..." deb ko'rsatamiz
    useStore.getState().addChatMessage({ role: 'assistant', message: "O'ylamoqda...", steps: [] });
    let isFirstChunk = true;

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/${uid}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          useStore.getState().logout();
          window.location.href = '/login';
        }
        throw new Error('Chat API xatosi: ' + response.statusText);
      }

      if (!response.body) throw new Error('Response body is missing');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let rawStreamBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        rawStreamBuffer += chunk;
        
        const lines = rawStreamBuffer.split(/(?=\{"type")/g); 
        rawStreamBuffer = lines.pop() || ''; // Oxirgi chala qismini saqlaymiz

        for (const line of lines) {
           let cleanLine = line.trim();
           if (!cleanLine) continue;
           
           if (cleanLine.startsWith('data: ')) {
               cleanLine = cleanLine.replace('data: ', '');
           }
           if (cleanLine === '[DONE]') continue;
           
           try {
              const parsed = JSON.parse(cleanLine);
              if (parsed.type === 'text') {
                  if (typeof parsed.text === 'string') {
                      useStore.getState().updateLastAssistantMessage({ text: parsed.text }, isFirstChunk);
                      isFirstChunk = false;
                  }
              } else if (parsed.type) {
                  // Tool calls va boshqalarni step sifatida qo'shamiz (text bo'lmasa ham)
                  useStore.getState().updateLastAssistantMessage({ 
                      step: { 
                          type: parsed.type, 
                          text: parsed.text || '', // text yo'q bo'lsa bo'sh string beramiz, oldingisini saqlab qoladi
                          finished: parsed.finished !== undefined ? parsed.finished : true
                      } 
                  });
              }
           } catch(e) {}
        }
      }

      // Bufferda qolgan oxirgi qismni ham tekshiramiz
      if (rawStreamBuffer.trim()) {
         let cleanLine = rawStreamBuffer.trim();
         if (cleanLine.startsWith('data: ')) cleanLine = cleanLine.replace('data: ', '');
         try {
            const parsed = JSON.parse(cleanLine);
            if (parsed.type === 'text') {
                if (typeof parsed.text === 'string') {
                    useStore.getState().updateLastAssistantMessage({ text: parsed.text }, isFirstChunk);
                    isFirstChunk = false;
                }
            } else if (parsed.type) {
                useStore.getState().updateLastAssistantMessage({ 
                    step: { 
                        type: parsed.type, 
                        text: parsed.text || '',
                        finished: parsed.finished !== undefined ? parsed.finished : true
                    } 
                });
            }
         } catch(e) {}
      }

      if (isFirstChunk) {
         useStore.getState().updateLastAssistantMessage({ text: '' }, true);
      }

      // Refresh the notes list after the chat request is fully processed
      try {
        const notesResponse = await api.get(`/${uid}/note/`);
        useStore.getState().setNotes(notesResponse.data.data);
      } catch (noteError) {
        console.error('Error refreshing notes after chat:', noteError);
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      useStore.getState().updateLastAssistantMessage({ text: "Kechirasiz xatolik yuz berdi." }, true);
      throw error;
    }
  };

  return { fetchHistory, sendMessage };
};
