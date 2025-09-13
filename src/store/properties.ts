import { create } from 'zustand'

export interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  type: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  description?: string
  images: string[]
  amenities: string[]
  isActive: boolean
  units: Unit[]
}

export interface Unit {
  id: string
  number: string
  floor?: number
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  rent: number
  deposit: number
  isAvailable: boolean
}

interface PropertiesState {
  properties: Property[]
  selectedProperty: Property | null
  isLoading: boolean
  setProperties: (properties: Property[]) => void
  setSelectedProperty: (property: Property | null) => void
  addProperty: (property: Property) => void
  updateProperty: (id: string, updates: Partial<Property>) => void
  removeProperty: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const usePropertiesStore = create<PropertiesState>((set) => ({
  properties: [],
  selectedProperty: null,
  isLoading: false,
  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (selectedProperty) => set({ selectedProperty }),
  addProperty: (property) =>
    set((state) => ({ properties: [...state.properties, property] })),
  updateProperty: (id, updates) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removeProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}))

