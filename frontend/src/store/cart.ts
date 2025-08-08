import { create } from 'zustand'
import { Cart, CartItem } from '@/types'

interface CartState {
  cart: Cart | null
  isLoading: boolean
  setCart: (cart: Cart) => void
  addItem: (item: CartItem) => void
  updateItem: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  setLoading: (loading: boolean) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  setCart: (cart: Cart) => {
    set({ cart, isLoading: false })
  },
  addItem: (item: CartItem) => {
    const currentCart = get().cart
    if (!currentCart) return

    const existingItemIndex = currentCart.items.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    )

    if (existingItemIndex > -1) {
      const updatedItems = [...currentCart.items]
      updatedItems[existingItemIndex].quantity += item.quantity
      set({
        cart: {
          ...currentCart,
          items: updatedItems,
        },
      })
    } else {
      set({
        cart: {
          ...currentCart,
          items: [...currentCart.items, item],
        },
      })
    }
  },
  updateItem: (itemId: string, quantity: number) => {
    const currentCart = get().cart
    if (!currentCart) return

    const updatedItems = currentCart.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    )

    set({
      cart: {
        ...currentCart,
        items: updatedItems,
      },
    })
  },
  removeItem: (itemId: string) => {
    const currentCart = get().cart
    if (!currentCart) return

    const updatedItems = currentCart.items.filter((item) => item.id !== itemId)

    set({
      cart: {
        ...currentCart,
        items: updatedItems,
      },
    })
  },
  clearCart: () => {
    const currentCart = get().cart
    if (!currentCart) return

    set({
      cart: {
        ...currentCart,
        items: [],
      },
    })
  },
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
  getTotalItems: () => {
    const cart = get().cart
    if (!cart) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  },
  getTotalPrice: () => {
    const cart = get().cart
    if (!cart) return 0
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },
}))