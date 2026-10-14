import { create } from 'zustand'

export interface ComparisonItem {
  id: string
  name: string
  price: number
  image?: string
  make?: string
  partType?: string
  condition?: string
  warranty?: string
  location?: string
  rating?: number
}

interface ComparisonStore {
  items: ComparisonItem[]
  addItem: (item: ComparisonItem) => void
  removeItem: (id: string) => void
  clearComparison: () => void
  canAddMore: () => boolean
  getCount: () => number
}

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id)
      if (exists) return state
      if (state.items.length >= 5) return state
      return { items: [...state.items, item] }
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearComparison: () => set({ items: [] }),
  canAddMore: () => {
    const state = get()
    return state.items.length < 5
  },
  getCount: () => {
    const state = get()
    return state.items.length
  },
}))
