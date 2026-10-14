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
          // Buy-now and reservation items never share a cart (see CartItem.isReservation).
          const items = state.items.filter((i) => !i.isReservation)
          const existing = items.find((i) => i.id === item.id)
          if (existing) {
            // One line per part: the latest mileage tier picked sets the price for all units.
            return {
              items: items.map((i) =>
                i.id === item.id ? { ...i, price: item.price, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...items, item] }
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
      version: 1,
      // Carts saved before version 1 could hold sample products from the removed
      // demo pages ("part-001", numeric ids) that checkout always refuses.
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<CartStore>
        const items = Array.isArray(state.items)
          ? state.items.filter((i) => typeof i?.id === 'string' && !/^(part-)?\d+$/.test(i.id))
          : []
        return { ...state, items } as CartStore
      },
    }
  )
)
