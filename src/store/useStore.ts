import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Notebook {
  uid: string;
  notebook_uid?: string; // in case api returns notebook_uid
  name: string;
  created_at?: string;
}

interface Note {
  id: number;
  name?: string;
  title?: string;
  content?: string;
  type?: 'note' | 'flashcard';
  created_at?: string;
  created_at_formatted?: string;
}

interface Message {
  role: 'user' | 'assistant';
  message: string;
  steps?: { type: string; text: string; finished?: boolean }[];
}

interface AppState {
  user: User | null;
  token: string | null;
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  notes: Note[];
  chatHistory: Message[];
  isLoading: boolean;
  isMaximized: boolean;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setNotebooks: (notebooks: Notebook[]) => void;
  setCurrentNotebook: (notebook: Notebook | null) => void;
  setNotes: (notes: Note[]) => void;
  clearNotes: () => void;
  setChatHistory: (history: Message[]) => void;
  addChatMessage: (message: Message) => void;
  updateLastAssistantMessage: (payload: { text?: string; step?: { type: string; text: string; finished?: boolean } }, overwrite?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setIsMaximized: (isMaximized: boolean) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      notebooks: [],
      currentNotebook: null,
      notes: [],
      chatHistory: [],
      isLoading: false,
      isMaximized: false,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
        set({ token });
      },
      setNotebooks: (notebooks) => set({ notebooks }),
      setCurrentNotebook: (currentNotebook) => set({ currentNotebook, notes: [], chatHistory: [] }),
      setNotes: (notes) => set({ notes }),
      clearNotes: () => set({ notes: [] }),
      setChatHistory: (chatHistory) => set({
        chatHistory: Array.isArray(chatHistory) ? chatHistory : [],
      }),
      addChatMessage: (message) =>
        set((state) => {
          const current = Array.isArray(state.chatHistory) ? state.chatHistory : [];
          return {
            chatHistory: [...current, { ...message, steps: message.steps || [] }],
          };
        }),
      updateLastAssistantMessage: (payload, overwrite = false) =>
        set((state) => {
          const current = Array.isArray(state.chatHistory) ? [...state.chatHistory] : [];
          if (current.length > 0 && current[current.length - 1].role === 'assistant') {
            const lastMsg = { ...current[current.length - 1] };
            
            if (payload.text !== undefined) {
                if (overwrite) {
                    lastMsg.message = payload.text;
                } else {
                    lastMsg.message += payload.text;
                }
            }
            
            if (payload.step) {
                if (!lastMsg.steps) lastMsg.steps = [];
                
                // Bitta tipdagi oxirgi tugallanmagan (finished === false) stepni topamiz
                let unfinishedIndex = -1;
                for (let i = lastMsg.steps.length - 1; i >= 0; i--) {
                    if (lastMsg.steps[i].type === payload.step.type && lastMsg.steps[i].finished === false) {
                        unfinishedIndex = i;
                        break;
                    }
                }
                
                if (unfinishedIndex !== -1) {
                    // Agar topilsa, o'shani holatini yangilaymiz. Text agar kelgan bo'lsa yangilaymiz.
                    lastMsg.steps[unfinishedIndex] = {
                        ...lastMsg.steps[unfinishedIndex],
                        text: payload.step.text || lastMsg.steps[unfinishedIndex].text,
                        finished: payload.step.finished
                    };
                } else {
                    // Agar ochiq step topilmasa, lekin xuddi shunday (type va text bir xil) step allaqachon completed bo'lsa, duplikat qo'shmaymiz.
                    // Yoki faqat "finished: true" o'zi kelsa (yangi text siz) uni ham ignore qilishimiz mumkin.
                    // Asosiysi, agar rostdan yangi narsa bo'lsa qo'shamiz.
                    const isExactDuplicate = lastMsg.steps.some(s => s.type === payload.step?.type && s.text === payload.step?.text && s.finished === payload.step?.finished);
                    if (!isExactDuplicate) {
                        lastMsg.steps.push(payload.step);
                    }
                }
            }
            
            current[current.length - 1] = lastMsg;
          }
          return { chatHistory: current };
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setIsMaximized: (isMaximized) => set({ isMaximized }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, notebooks: [], currentNotebook: null, notes: [], chatHistory: [] });
      },
    }),
    {
      name: 'notebook-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
