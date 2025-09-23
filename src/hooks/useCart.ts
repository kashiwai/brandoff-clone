'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

interface CartActions {
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
}

type CartStore = CartState & CartActions

const createCartStore = () => {
  const store = (set: any, get: any) => ({
    items: [],
    isOpen: false,

    addItem: (newItem: CartItem) => {
      set((state: CartState) => {
        const existingItemIndex = state.items.findIndex(
          item => item.productId === newItem.productId
        )

        if (existingItemIndex > -1) {
          const updatedItems = [...state.items]
          updatedItems[existingItemIndex].quantity += newItem.quantity
          return { items: updatedItems }
        } else {
          return { items: [...state.items, newItem] }
        }
      })
    },

    removeItem: (productId: string) => {
      set((state: CartState) => ({
        items: state.items.filter(item => item.productId !== productId)
      }))
    },

    updateQuantity: (productId: string, quantity: number) => {
      if (quantity <= 0) {
        set((state: CartState) => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
      } else {
        set((state: CartState) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        }))
      }
    },

    clearCart: () => set({ items: [] }),

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((state: CartState) => ({ isOpen: !state.isOpen })),

    getTotalItems: () => {
      const state = get()
      return state.items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
    },

    getSubtotal: () => {
      const state = get()
      return state.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0)
    },
  })

  if (typeof window === 'undefined') {
    return create<CartStore>()(store)
  }

  return create<CartStore>()(
    persist(
      store,
      {
        name: 'cart-storage',
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
      }
    )
  )
}

const useCartStore = createCartStore()

export const useCart = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  const store = useCartStore()

  useEffect(() => {
    if (!isHydrated && typeof window !== 'undefined') {
      const persist = (useCartStore as any).persist
      if (persist && persist.rehydrate) {
        persist.rehydrate()
      }
      setIsHydrated(true)
    }
  }, [isHydrated])

  return store
}