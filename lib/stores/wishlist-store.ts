import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
  make?: string
  partType?: string
  addedAt: number
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id)
          if (exists) return state
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      isInWishlist: (id) => {
        const state = get()
        return state.items.some((item) => item.id === id)
      },
      clearWishlist: () => set({ items: [] }),
      getCount: () => {
        const state = get()
        return state.items.length
      },
    }),
    {
      name: 'wishlist-store',
    }
  )
)
