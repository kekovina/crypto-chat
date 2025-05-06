import { create } from 'zustand';

export type ChatStore = {
  username: string | null;
  setUsername: (value: string) => void;

  messages: any[];
  addMessage: (value: any) => void;
  resetMessages: () => void;

  online: number;
  setOnline: (value: number) => void;

  mate: any;
  setMate: (value: any) => void;
};

export const chatStore = create<ChatStore>((set) => ({
  username: null,
  setUsername: (value) => set({ username: value }),

  messages: [],
  addMessage: (value) => {
    set((state) => ({
      messages: Array.isArray(value) ? [...state.messages, ...value] : [...state.messages, value],
    }));
  },
  resetMessages: () => set({ messages: [] }),

  online: 0,
  setOnline: (value) => set({ online: value }),

  mate: null,
  setMate: (value) => set({ mate: value }),
}));
