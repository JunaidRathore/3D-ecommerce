export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  HOME = 'home',
  SPORTS = 'sports',
  BOOKS = 'books',
  TOYS = 'toys',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: ProductCategory
  images: string[]
  model3dUrl?: string
  tags?: string[]
  rating: number
  reviewCount: number
  isActive: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
  productName: string
  createdAt: string
}

export interface Order {
  id: string
  user: User
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentIntentId?: string
  shippingAddress: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  error: string
}