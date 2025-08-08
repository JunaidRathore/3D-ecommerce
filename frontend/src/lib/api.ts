import axios, { AxiosInstance, AxiosError } from 'axios'
import { 
  User, 
  AuthUser, 
  Product, 
  ProductsResponse, 
  Cart, 
  Order, 
  ApiResponse, 
  ApiError,
  ProductFilters,
  LoginCredentials,
  RegisterData,
  AddToCartRequest,
  UpdateCartItemRequest,
  CreateOrderRequest,
  PaymentIntent,
  CreatePaymentIntentRequest
} from '@/types'

class ApiClient {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          this.clearAuthToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data } = await this.axiosInstance.post<ApiResponse<AuthUser>>('/auth/login', credentials)
    this.setAuthToken(data.data.accessToken)
    return data.data
  }

  async register(userData: RegisterData): Promise<AuthUser> {
    const { data } = await this.axiosInstance.post<ApiResponse<AuthUser>>('/auth/register', userData)
    this.setAuthToken(data.data.accessToken)
    return data.data
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/logout')
    } finally {
      this.clearAuthToken()
    }
  }

  async refreshToken(): Promise<AuthUser> {
    const { data } = await this.axiosInstance.post<ApiResponse<AuthUser>>('/auth/refresh')
    this.setAuthToken(data.data.accessToken)
    return data.data
  }

  async forgotPassword(email: string): Promise<void> {
    await this.axiosInstance.post('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.axiosInstance.post('/auth/reset-password', { token, password })
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const { data } = await this.axiosInstance.get<ApiResponse<User>>('/users/profile')
    return data.data
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const { data } = await this.axiosInstance.patch<ApiResponse<User>>('/users/profile', userData)
    return data.data
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.axiosInstance.patch('/users/change-password', {
      currentPassword,
      newPassword,
    })
  }

  async deleteAccount(): Promise<void> {
    await this.axiosInstance.delete('/users/profile')
    this.clearAuthToken()
  }

  // Product endpoints
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const { data } = await this.axiosInstance.get<ApiResponse<ProductsResponse>>('/products', {
      params: filters,
    })
    return data.data
  }

  async getProduct(id: string): Promise<Product> {
    const { data } = await this.axiosInstance.get<ApiResponse<Product>>(`/products/${id}`)
    return data.data
  }

  async searchProducts(query: string, filters?: ProductFilters): Promise<ProductsResponse> {
    const { data } = await this.axiosInstance.get<ApiResponse<ProductsResponse>>('/products/search', {
      params: { query, ...filters },
    })
    return data.data
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { data } = await this.axiosInstance.get<ApiResponse<Product[]>>('/products/featured')
    return data.data
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data } = await this.axiosInstance.get<ApiResponse<Product[]>>(`/products/category/${category}`)
    return data.data
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    const { data } = await this.axiosInstance.get<ApiResponse<Product[]>>(`/products/${productId}/recommendations`)
    return data.data
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const { data } = await this.axiosInstance.get<ApiResponse<Cart>>('/cart')
    return data.data
  }

  async addToCart(productId: string, quantity: number): Promise<Cart> {
    const request: AddToCartRequest = { productId, quantity }
    const { data } = await this.axiosInstance.post<ApiResponse<Cart>>('/cart/items', request)
    return data.data
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const request: UpdateCartItemRequest = { quantity }
    const { data } = await this.axiosInstance.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, request)
    return data.data
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const { data } = await this.axiosInstance.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`)
    return data.data
  }

  async clearCart(): Promise<Cart> {
    const { data } = await this.axiosInstance.delete<ApiResponse<Cart>>('/cart')
    return data.data
  }

  // Order endpoints
  async getOrders(): Promise<Order[]> {
    const { data } = await this.axiosInstance.get<ApiResponse<Order[]>>('/orders')
    return data.data
  }

  async getOrder(id: string): Promise<Order> {
    const { data } = await this.axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`)
    return data.data
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const { data } = await this.axiosInstance.post<ApiResponse<Order>>('/orders', orderData)
    return data.data
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data } = await this.axiosInstance.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status })
    return data.data
  }

  async cancelOrder(id: string): Promise<Order> {
    const { data } = await this.axiosInstance.patch<ApiResponse<Order>>(`/orders/${id}/cancel`)
    return data.data
  }

  // Payment endpoints
  async createPaymentIntent(paymentData: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    const { data } = await this.axiosInstance.post<ApiResponse<PaymentIntent>>('/payments/create-intent', paymentData)
    return data.data
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    const { data } = await this.axiosInstance.post<ApiResponse<PaymentIntent>>(`/payments/confirm/${paymentIntentId}`)
    return data.data
  }

  async getPaymentMethods(): Promise<Array<{ id: string; type: string; last4?: string }>> {
    const { data } = await this.axiosInstance.get<ApiResponse<Array<{ id: string; type: string; last4?: string }>>>('/payments/methods')
    return data.data
  }

  async addPaymentMethod(paymentMethodId: string): Promise<void> {
    await this.axiosInstance.post('/payments/methods', { paymentMethodId })
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await this.axiosInstance.delete(`/payments/methods/${paymentMethodId}`)
  }

  // Utility methods
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)
    
    const { data } = await this.axiosInstance.post<ApiResponse<{ url: string }>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data.url
  }

  async uploadModel3D(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('model', file)
    
    const { data } = await this.axiosInstance.post<ApiResponse<{ url: string }>>('/upload/model', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data.url
  }

  // Contact and support
  async sendContactMessage(contactData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<void> {
    await this.axiosInstance.post('/contact', contactData)
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.axiosInstance.post('/newsletter/subscribe', { email })
  }

  async unsubscribeFromNewsletter(email: string): Promise<void> {
    await this.axiosInstance.post('/newsletter/unsubscribe', { email })
  }

  // Analytics and tracking
  async trackEvent(eventName: string, properties?: Record<string, unknown>): Promise<void> {
    await this.axiosInstance.post('/analytics/track', {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
    })
  }

  async trackPageView(page: string): Promise<void> {
    await this.axiosInstance.post('/analytics/pageview', {
      page,
      timestamp: new Date().toISOString(),
    })
  }
}

// Create and export a single instance
export const apiClient = new ApiClient()

// Export the class for testing purposes
export { ApiClient }