'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item => item.productId === newItem.productId
          )
          
          if (existingItemIndex > -1) {
            // 既存のアイテムの数量を更新
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += newItem.quantity
            return { items: updatedItems }
          } else {
            // 新しいアイテムを追加
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        const state = get()
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
)

export const useCart = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  const store = useCartStore()

  useEffect(() => {
    if (!isHydrated) {
      useCartStore.persist.rehydrate()
      setIsHydrated(true)
    }
  }, [])

  return store
}