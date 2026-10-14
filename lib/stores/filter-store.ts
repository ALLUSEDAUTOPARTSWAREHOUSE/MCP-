import { create } from 'zustand'

export interface FilterState {
  priceRange: [number, number]
  condition: string[]
  warranty: string[]
  location: string
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'rating'
}

interface FilterStore extends FilterState {
  setPriceRange: (range: [number, number]) => void
  setCondition: (conditions: string[]) => void
  setWarranty: (warranties: string[]) => void
  setLocation: (location: string) => void
  setSortBy: (sort: FilterState['sortBy']) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  priceRange: [0, 10000],
  condition: [],
  warranty: [],
  location: '',
  sortBy: 'newest',
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...defaultFilters,
  setPriceRange: (range) => set({ priceRange: range }),
  setCondition: (condition) => set({ condition }),
  setWarranty: (warranty) => set({ warranty }),
  setLocation: (location) => set({ location }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(defaultFilters),
}))
