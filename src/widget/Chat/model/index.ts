import { create } from 'zustand'

export type ChatStore = {
  online: number
  setOnline: (value: number) => void

  mate: any,
  setMate: (value: any) => void
}

export const chatStore = create<ChatStore>((set) => ({
  online: 0,
  setOnline: (value) => set(({ online: value })),

  mate: null,
  setMate: (value) => set({ mate: value })
}))
