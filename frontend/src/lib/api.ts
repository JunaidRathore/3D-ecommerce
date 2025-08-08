import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '@/store/auth'
import { 
  AuthResponse, 
  User, 
  Product, 
  ProductsResponse, 
  Cart, 
  Order,
  ProductCategory 
} from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout()
          // Redirect to login if needed
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    return response.data
  }

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    address?: string
  }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/auth/profile')
    return response.data
  }

  // User endpoints
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.patch<User>('/users/me', data)
    return response.data
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: ProductCategory
    search?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  }): Promise<ProductsResponse> {
    const response = await this.client.get<ProductsResponse>('/products', { params })
    return response.data
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.client.get<Product>(`/products/${id}`)
    return response.data
  }

  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/products/featured', {
      params: { limit },
    })
    return response.data
  }

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    const response = await this.client.get<Product[]>(`/products/category/${category}`)
    return response.data
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const response = await this.client.get<Cart>('/cart')
    return response.data
  }

  async addToCart(productId: string, quantity: number): Promise<Cart> {
    const response = await this.client.post<Cart>('/cart/add', {
      productId,
      quantity,
    })
    return response.data
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await this.client.patch<Cart>(`/cart/item/${itemId}`, {
      quantity,
    })
    return response.data
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const response = await this.client.delete<Cart>(`/cart/item/${itemId}`)
    return response.data
  }

  async clearCart(): Promise<Cart> {
    const response = await this.client.delete<Cart>('/cart/clear')
    return response.data
  }

  async getCartTotal(): Promise<number> {
    const response = await this.client.get<number>('/cart/total')
    return response.data
  }

  // Order endpoints
  async createOrder(data: {
    shippingAddress: string
    notes?: string
  }): Promise<Order> {
    const response = await this.client.post<Order>('/orders', data)
    return response.data
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/orders')
    return response.data
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.client.get<Order>(`/orders/${id}`)
    return response.data
  }

  // Payment endpoints
  async createPaymentIntent(orderId: string): Promise<{ clientSecret: string }> {
    const response = await this.client.post<{ clientSecret: string }>('/payments/create-intent', {
      orderId,
    })
    return response.data
  }
}

export const api = new ApiClient()