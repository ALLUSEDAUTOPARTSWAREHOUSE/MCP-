import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReserveDeliveryMethod } from '@/lib/site-policy'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  make?: string
  partType?: string
  shippingCost?: number
  /** True for quote-only parts reserved online ("Reserve & Place Order").
   * Reservation items never mix with buy-now items in the same cart — adding
   * one clears the other kind first (see addReservationItem). */
  isReservation?: boolean
}

interface CartStore {
  items: CartItem[]
  /** Delivery method chosen for a reservation cart. Ignored for buy-now carts. */
  deliveryMethod: ReserveDeliveryMethod
  addItem: (item: CartItem) => void
  /** Adds a single quote-only part as a reservation, replacing any existing
   * cart contents so reservation and buy-now items never mix. */
  addReservationItem: (item: Omit<CartItem, 'isReservation' | 'price' | 'quantity'>) => void
  setDeliveryMethod: (method: ReserveDeliveryMethod) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryMethod: 'standard',
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      addReservationItem: (item) =>
        set({ items: [{ ...item, price: 0, isReservation: true, quantity: 1 }], deliveryMethod: 'standard' }),
      setDeliveryMethod: (method) => set({ deliveryMethod: method }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-store',
    }
  )
)
