import {
  mockUser,
  mockAuthUser,
  mockProducts,
  mockProductsResponse,
  mockFeaturedProducts,
  mockCart,
  mockOrders,
  filterProducts,
  paginateResults,
  createMockApiResponse,
  TEST_CREDENTIALS
} from './mock-data'
import { ProductFilters, LoginCredentials, RegisterData } from '@/types'

// Mock API delay to simulate network requests
const MOCK_DELAY = 800

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class MockApiClient {
  // Auth endpoints
  async login(credentials: LoginCredentials) {
    await delay(MOCK_DELAY)
    
    if (credentials.email === TEST_CREDENTIALS.email && 
        credentials.password === TEST_CREDENTIALS.password) {
      return mockAuthUser
    }
    
    throw new Error('Invalid email or password')
  }

  async register(userData: RegisterData) {
    await delay(MOCK_DELAY)
    
    // Simulate successful registration
    return {
      ...mockAuthUser,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      address: userData.address || ''
    }
  }

  async logout() {
    await delay(MOCK_DELAY / 2)
    // Mock logout - no return value needed
  }

  async refreshToken() {
    await delay(MOCK_DELAY / 2)
    return mockAuthUser
  }

  async forgotPassword(email: string) {
    await delay(MOCK_DELAY)
    // Mock forgot password - no return value needed
  }

  async resetPassword(token: string, password: string) {
    await delay(MOCK_DELAY)
    // Mock reset password - no return value needed
  }

  // User endpoints
  async getCurrentUser() {
    await delay(MOCK_DELAY / 2)
    return mockUser
  }

  async updateProfile(userData: Partial<typeof mockUser>) {
    await delay(MOCK_DELAY)
    return { ...mockUser, ...userData }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    await delay(MOCK_DELAY)
    // Mock change password - no return value needed
  }

  async deleteAccount() {
    await delay(MOCK_DELAY)
    // Mock delete account - no return value needed
  }

  // Product endpoints
  async getProducts(filters?: ProductFilters) {
    await delay(MOCK_DELAY)
    
    const filtered = filterProducts(mockProducts, filters)
    const paginated = paginateResults(filtered, filters?.page, filters?.limit)
    
    return {
      products: paginated.items,
      totalCount: paginated.totalCount,
      totalPages: paginated.totalPages,
      currentPage: paginated.currentPage,
      hasNextPage: paginated.hasNextPage,
      hasPreviousPage: paginated.hasPreviousPage
    }
  }

  async getProduct(id: string) {
    await delay(MOCK_DELAY)
    
    const product = mockProducts.find(p => p.id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    
    return product
  }

  async searchProducts(query: string, filters?: ProductFilters) {
    await delay(MOCK_DELAY)
    
    const searchFilters = { ...filters, search: query }
    return this.getProducts(searchFilters)
  }

  async getFeaturedProducts() {
    await delay(MOCK_DELAY / 2)
    return mockFeaturedProducts
  }

  async getProductsByCategory(category: string) {
    await delay(MOCK_DELAY)
    return mockProducts.filter(p => p.category === category)
  }

  async getProductRecommendations(productId: string) {
    await delay(MOCK_DELAY)
    
    const product = mockProducts.find(p => p.id === productId)
    if (!product) return []
    
    // Return products from same category, excluding the current product
    return mockProducts
      .filter(p => p.category === product.category && p.id !== productId)
      .slice(0, 4)
  }

  // Cart endpoints
  async getCart() {
    await delay(MOCK_DELAY / 2)
    return mockCart
  }

  async addToCart(productId: string, quantity: number) {
    await delay(MOCK_DELAY)
    
    const product = mockProducts.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }
    
    // Simulate adding to cart and return updated cart
    const newItem = {
      id: `cart-item-${Date.now()}`,
      product,
      quantity,
      subtotal: product.price * quantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedCart = {
      ...mockCart,
      items: [...mockCart.items, newItem],
      totalAmount: mockCart.totalAmount + (product.price * quantity),
      updatedAt: new Date().toISOString()
    }
    
    return updatedCart
  }

  async updateCartItem(itemId: string, quantity: number) {
    await delay(MOCK_DELAY)
    
    const updatedItems = mockCart.items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            quantity, 
            subtotal: item.product.price * quantity,
            updatedAt: new Date().toISOString()
          }
        : item
    )
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
    
    return {
      ...mockCart,
      items: updatedItems,
      totalAmount,
      updatedAt: new Date().toISOString()
    }
  }

  async removeFromCart(itemId: string) {
    await delay(MOCK_DELAY)
    
    const updatedItems = mockCart.items.filter(item => item.id !== itemId)
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
    
    return {
      ...mockCart,
      items: updatedItems,
      totalAmount,
      updatedAt: new Date().toISOString()
    }
  }

  async clearCart() {
    await delay(MOCK_DELAY)
    
    return {
      ...mockCart,
      items: [],
      totalAmount: 0,
      updatedAt: new Date().toISOString()
    }
  }

  // Order endpoints
  async getOrders() {
    await delay(MOCK_DELAY)
    return mockOrders
  }

  async getOrder(id: string) {
    await delay(MOCK_DELAY)
    
    const order = mockOrders.find(o => o.id === id)
    if (!order) {
      throw new Error('Order not found')
    }
    
    return order
  }

  async createOrder(orderData: any) {
    await delay(MOCK_DELAY * 1.5) // Longer delay for order creation
    
    // Create a mock order
    const newOrder = {
      ...mockOrders[0],
      id: `order-${Date.now()}`,
      items: orderData.items.map((item: any, index: number) => ({
        id: `order-item-${Date.now()}-${index}`,
        productId: item.productId,
        productName: `Product ${item.productId}`,
        quantity: item.quantity,
        unitPrice: 99.99,
        subtotal: 99.99 * item.quantity
      })),
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return newOrder
  }

  async updateOrderStatus(id: string, status: string) {
    await delay(MOCK_DELAY)
    
    const order = mockOrders.find(o => o.id === id)
    if (!order) {
      throw new Error('Order not found')
    }
    
    return {
      ...order,
      status: status as any,
      updatedAt: new Date().toISOString()
    }
  }

  async cancelOrder(id: string) {
    await delay(MOCK_DELAY)
    
    const order = mockOrders.find(o => o.id === id)
    if (!order) {
      throw new Error('Order not found')
    }
    
    return {
      ...order,
      status: 'cancelled' as any,
      updatedAt: new Date().toISOString()
    }
  }

  // Payment endpoints
  async createPaymentIntent(paymentData: any) {
    await delay(MOCK_DELAY)
    
    return {
      id: `pi_${Date.now()}`,
      clientSecret: `pi_${Date.now()}_secret_mock`,
      amount: paymentData.amount,
      currency: paymentData.currency || 'usd',
      status: 'requires_payment_method'
    }
  }

  async confirmPayment(paymentIntentId: string) {
    await delay(MOCK_DELAY)
    
    return {
      id: paymentIntentId,
      clientSecret: `${paymentIntentId}_secret_mock`,
      amount: 10000, // $100.00
      currency: 'usd',
      status: 'succeeded'
    }
  }

  async getPaymentMethods() {
    await delay(MOCK_DELAY / 2)
    
    return [
      { id: 'pm_1', type: 'card', last4: '4242' },
      { id: 'pm_2', type: 'card', last4: '0000' }
    ]
  }

  async addPaymentMethod(paymentMethodId: string) {
    await delay(MOCK_DELAY)
    // Mock add payment method - no return value needed
  }

  async removePaymentMethod(paymentMethodId: string) {
    await delay(MOCK_DELAY)
    // Mock remove payment method - no return value needed
  }

  // Utility methods
  async uploadImage(file: File) {
    await delay(MOCK_DELAY * 2) // Longer delay for file upload
    
    // Return a mock URL
    return `https://mock-cdn.example.com/images/${file.name}-${Date.now()}`
  }

  async uploadModel3D(file: File) {
    await delay(MOCK_DELAY * 3) // Even longer delay for 3D model upload
    
    // Return a mock URL
    return `https://mock-cdn.example.com/models/${file.name}-${Date.now()}`
  }

  // Contact and support
  async sendContactMessage(contactData: any) {
    await delay(MOCK_DELAY)
    // Mock send contact message - no return value needed
  }

  async subscribeToNewsletter(email: string) {
    await delay(MOCK_DELAY)
    // Mock newsletter subscription - no return value needed
  }

  async unsubscribeFromNewsletter(email: string) {
    await delay(MOCK_DELAY)
    // Mock newsletter unsubscription - no return value needed
  }

  // Analytics and tracking
  async trackEvent(eventName: string, properties?: Record<string, unknown>) {
    await delay(100) // Very short delay for analytics
    // Mock analytics tracking - no return value needed
  }

  async trackPageView(page: string) {
    await delay(100) // Very short delay for analytics
    // Mock page view tracking - no return value needed
  }
}

// Create and export a single mock instance
export const mockApiClient = new MockApiClient()

// Development mode toggle
export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development' && 
         process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
}

// Helper to get the appropriate API client
export const getApiClient = () => {
  if (isDevelopmentMode()) {
    console.log('🧪 Using Mock API for development')
    return mockApiClient
  }
  
  // In production or when mock is disabled, import and return real API
  const { apiClient } = require('./api')
  return apiClient
}