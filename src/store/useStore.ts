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
  created_at?: string;
  created_at_formatted?: string;
}

interface Message {
  role: 'user' | 'assistant';
  message: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  notes: Note[];
  chatHistory: Message[];
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setNotebooks: (notebooks: Notebook[]) => void;
  setCurrentNotebook: (notebook: Notebook | null) => void;
  setNotes: (notes: Note[]) => void;
  clearNotes: () => void;
  setChatHistory: (history: Message[]) => void;
  addChatMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
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
            chatHistory: [...current, message],
          };
        }),
      setLoading: (isLoading) => set({ isLoading }),
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
