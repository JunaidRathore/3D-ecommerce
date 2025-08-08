// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  role: UserRole
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface AuthUser extends User {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  stock: number
  images: string[]
  model3dUrl?: string
  rating: number
  reviewCount: number
  tags?: string[]
  weight?: number
  dimensions?: ProductDimensions
  features?: string[]
  brand?: string
  sku?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
}

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  HOME = 'home',
  SPORTS = 'sports',
  BOOKS = 'books',
  TOYS = 'toys'
}

export interface ProductsResponse {
  products: Product[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ProductFilters {
  search?: string
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  sortBy?: ProductSortBy
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  RATING = 'rating',
  POPULARITY = 'popularity'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

// Cart types
export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  subtotal: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

// Order types
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  subtotalAmount: number
  shippingAmount: number
  taxAmount: number
  status: OrderStatus
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  stripePaymentIntentId?: string
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe'
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingAddress: Address
  billingAddress: Address
  paymentMethodId: string
}

// Payment types
export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

export interface CreatePaymentIntentRequest {
  amount: number
  currency: string
  orderId: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  error: string
  timestamp: string
  path: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    totalCount: number
    totalPages: number
    currentPage: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Form types
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface NewsletterForm {
  email: string
}

export interface ReviewForm {
  rating: number
  title: string
  comment: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  user: Pick<User, 'id' | 'firstName' | 'lastName'>
  rating: number
  title: string
  comment: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// Component Props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonVariant {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

// Hook types
export interface UseLocalStorageReturn<T> {
  value: T
  setValue: (value: T | ((prev: T) => T)) => void
  removeValue: () => void
}

export interface UseDisclosureReturn {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}