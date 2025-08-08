import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, AuthUser } from '@/types'

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (authData: AuthUser) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      login: (authData: AuthUser) => {
        const { accessToken, refreshToken, ...user } = authData
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
        
        // Store token in localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', accessToken)
        }
      },
      
      logout: () => {
        set(initialState)
        
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken')
        }
      },
      
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      clearAuth: () => {
        set(initialState)
        
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken')
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync token with localStorage on rehydration
        if (state?.accessToken && typeof window !== 'undefined') {
          localStorage.setItem('authToken', state.accessToken)
        }
      },
    }
  )
)

// Helper function to get current auth state
export const getAuthState = () => useAuthStore.getState()

// Helper function to check if user is authenticated
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated

// Helper function to get current user
export const getCurrentUser = () => useAuthStore.getState().user

// Helper function to get access token
export const getAccessToken = () => useAuthStore.getState().accessToken