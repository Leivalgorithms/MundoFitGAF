import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  slug: string
  nombre: string
  categoria: string
  marca: string
  imagen: string
  cantidad: number
}

interface CartStore {
  items: CartItem[]
  agregarItem: (item: Omit<CartItem, 'cantidad'>) => void
  quitarItem: (id: string) => void
  incrementar: (id: string) => void
  decrementar: (id: string) => void
  limpiarCarrito: () => void
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      agregarItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, cantidad: 1 }] })
        }
      },

      quitarItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      incrementar: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i
          ),
        })
      },

      decrementar: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad - 1) } : i
          ),
        })
      },

      limpiarCarrito: () => {
        set({ items: [] })
      },

      totalItems: () => {
        return get().items.reduce((sum, i) => sum + i.cantidad, 0)
      },
    }),
    {
      name: 'mundo-fit-carrito',
    }
  )
)
