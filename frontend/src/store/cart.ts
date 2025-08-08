import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Cart, CartItem } from '@/types'

interface CartState {
  // Local cart state (for immediate UI updates)
  localCart: CartItem[]
  
  // Actions
  setCart: (cart: Cart) => void
  addLocalItem: (item: CartItem) => void
  updateLocalItem: (itemId: string, quantity: number) => void
  removeLocalItem: (itemId: string) => void
  clearLocalCart: () => void
  
  // Calculated values
  getTotalItems: () => number
  getTotalAmount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      localCart: [],
      
      setCart: (cart: Cart) => {
        set({ localCart: cart.items })
      },
      
      addLocalItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.localCart.find(cartItem => 
            cartItem.product.id === item.product.id
          )
          
          if (existingItem) {
            return {
              localCart: state.localCart.map(cartItem =>
                cartItem.product.id === item.product.id
                  ? { 
                      ...cartItem, 
                      quantity: cartItem.quantity + item.quantity,
                      subtotal: (cartItem.quantity + item.quantity) * Number(cartItem.product.price)
                    }
                  : cartItem
              )
            }
          }
          
          return {
            localCart: [...state.localCart, {
              ...item,
              subtotal: item.quantity * Number(item.product.price)
            }]
          }
        })
      },
      
      updateLocalItem: (itemId: string, quantity: number) => {
        set((state) => ({
          localCart: state.localCart.map(item =>
            item.id === itemId
              ? { 
                  ...item, 
                  quantity,
                  subtotal: quantity * Number(item.product.price)
                }
              : item
          )
        }))
      },
      
      removeLocalItem: (itemId: string) => {
        set((state) => ({
          localCart: state.localCart.filter(item => item.id !== itemId)
        }))
      },
      
      clearLocalCart: () => {
        set({ localCart: [] })
      },
      
      getTotalItems: () => {
        const state = get()
        return state.localCart.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalAmount: () => {
        const state = get()
        return state.localCart.reduce((total, item) => total + item.subtotal, 0)
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        localCart: state.localCart,
      }),
    }
  )
)

// Helper functions
export const getCartState = () => useCartStore.getState()
export const getCartItems = () => useCartStore.getState().localCart
export const getCartTotal = () => useCartStore.getState().getTotalAmount()
export const getCartItemCount = () => useCartStore.getState().getTotalItems()

// Helper to sync with server cart
export const syncCartWithServer = (serverCart: Cart) => {
  useCartStore.getState().setCart(serverCart)
}