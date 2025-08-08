import { 
  User, 
  Product, 
  Cart, 
  CartItem, 
  Order, 
  ProductCategory, 
  OrderStatus, 
  PaymentStatus,
  UserRole,
  AuthUser,
  ProductsResponse 
} from '@/types'

// Test Account Credentials
export const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'TestUser123',
  firstName: 'John',
  lastName: 'Doe'
}

// Mock User Data
export const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, San Francisco, CA 94105',
  role: UserRole.USER,
  isEmailVerified: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}

export const mockAuthUser: AuthUser = {
  ...mockUser,
  accessToken: 'mock-jwt-token-123456789',
  refreshToken: 'mock-refresh-token-123456789'
}

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Gaming Headset Pro',
    description: 'Premium wireless gaming headset with 7.1 surround sound, noise cancellation, and RGB lighting. Perfect for competitive gaming with ultra-low latency.',
    price: 149.99,
    category: ProductCategory.ELECTRONICS,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=400',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'
    ],
    model3dUrl: '/models/headset.glb',
    rating: 4.8,
    reviewCount: 342,
    tags: ['gaming', 'wireless', 'rgb', 'noise-cancelling'],
    weight: 0.8,
    dimensions: { length: 8.2, width: 7.1, height: 3.5 },
    features: ['7.1 Surround Sound', 'Noise Cancellation', 'RGB Lighting', '20hr Battery'],
    brand: 'GameTech Pro',
    sku: 'GTP-WGH-001',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Ergonomic Office Chair',
    description: 'Professional ergonomic office chair with lumbar support, adjustable height, and breathable mesh back. Designed for all-day comfort.',
    price: 299.99,
    category: ProductCategory.HOME,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400'
    ],
    model3dUrl: '/models/office-chair.glb',
    rating: 4.6,
    reviewCount: 189,
    tags: ['office', 'ergonomic', 'professional', 'comfort'],
    weight: 22.5,
    dimensions: { length: 26, width: 26, height: 48 },
    features: ['Lumbar Support', 'Height Adjustable', 'Breathable Mesh', '360° Swivel'],
    brand: 'ErgoComfort',
    sku: 'EC-OFC-002',
    isActive: true,
    createdAt: '2024-01-08T14:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  },
  {
    id: 'prod-3',
    name: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water-resistant design.',
    price: 79.99,
    category: ProductCategory.SPORTS,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
      'https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=400'
    ],
    model3dUrl: '/models/fitness-tracker.glb',
    rating: 4.4,
    reviewCount: 567,
    tags: ['fitness', 'smart', 'health', 'waterproof'],
    weight: 0.05,
    dimensions: { length: 1.6, width: 0.8, height: 0.4 },
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Sleep Analysis', '7-Day Battery'],
    brand: 'FitLife',
    sku: 'FL-SFT-003',
    isActive: true,
    createdAt: '2024-01-05T11:45:00Z',
    updatedAt: '2024-01-14T16:20:00Z'
  },
  {
    id: 'prod-4',
    name: 'Premium Coffee Maker',
    description: 'Professional-grade coffee maker with built-in grinder, programmable settings, and thermal carafe. Makes perfect coffee every time.',
    price: 199.99,
    category: ProductCategory.HOME,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      'https://images.unsplash.com/photo-1585478188849-c045f3c3e2e8?w=400'
    ],
    model3dUrl: '/models/coffee-maker.glb',
    rating: 4.7,
    reviewCount: 234,
    tags: ['coffee', 'kitchen', 'premium', 'programmable'],
    weight: 8.2,
    dimensions: { length: 12, width: 8, height: 14 },
    features: ['Built-in Grinder', 'Programmable Timer', 'Thermal Carafe', 'Auto Shut-off'],
    brand: 'BrewMaster',
    sku: 'BM-PCM-004',
    isActive: true,
    createdAt: '2024-01-03T09:20:00Z',
    updatedAt: '2024-01-11T13:45:00Z'
  },
  {
    id: 'prod-5',
    name: 'Wireless Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life. Perfect for outdoor adventures.',
    price: 89.99,
    category: ProductCategory.ELECTRONICS,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'
    ],
    model3dUrl: '/models/bluetooth-speaker.glb',
    rating: 4.5,
    reviewCount: 421,
    tags: ['bluetooth', 'portable', 'waterproof', 'outdoor'],
    weight: 1.2,
    dimensions: { length: 6, width: 6, height: 8 },
    features: ['360° Sound', 'Waterproof IPX7', '12hr Battery', 'Voice Assistant'],
    brand: 'SoundWave',
    sku: 'SW-BTS-005',
    isActive: true,
    createdAt: '2024-01-01T15:00:00Z',
    updatedAt: '2024-01-13T10:30:00Z'
  },
  {
    id: 'prod-6',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical gaming keyboard with Cherry MX switches, customizable backlighting, and programmable macro keys.',
    price: 129.99,
    category: ProductCategory.ELECTRONICS,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'
    ],
    model3dUrl: '/models/gaming-keyboard.glb',
    rating: 4.9,
    reviewCount: 892,
    tags: ['gaming', 'mechanical', 'rgb', 'customizable'],
    weight: 1.8,
    dimensions: { length: 17, width: 5, height: 1.5 },
    features: ['Cherry MX Switches', 'RGB Backlighting', 'Macro Keys', 'N-Key Rollover'],
    brand: 'GameTech Pro',
    sku: 'GTP-MGK-006',
    isActive: true,
    createdAt: '2023-12-28T12:15:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  },
  {
    id: 'prod-7',
    name: 'Casual Cotton T-Shirt',
    description: 'Premium 100% organic cotton t-shirt with modern fit. Soft, comfortable, and available in multiple colors.',
    price: 24.99,
    category: ProductCategory.CLOTHING,
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'https://images.unsplash.com/photo-1503341338985-b600d4c2e71e?w=400'
    ],
    rating: 4.3,
    reviewCount: 156,
    tags: ['cotton', 'casual', 'organic', 'comfortable'],
    weight: 0.2,
    dimensions: { length: 28, width: 20, height: 0.1 },
    features: ['100% Organic Cotton', 'Modern Fit', 'Pre-shrunk', 'Multiple Colors'],
    brand: 'EcoWear',
    sku: 'EW-CCT-007',
    isActive: true,
    createdAt: '2023-12-25T08:45:00Z',
    updatedAt: '2024-01-10T11:30:00Z'
  },
  {
    id: 'prod-8',
    name: 'Programming Book Set',
    description: 'Complete set of 3 programming books covering JavaScript, React, and Node.js. Perfect for web developers.',
    price: 59.99,
    category: ProductCategory.BOOKS,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    ],
    rating: 4.8,
    reviewCount: 234,
    tags: ['programming', 'javascript', 'react', 'education'],
    weight: 2.1,
    dimensions: { length: 9, width: 7, height: 2 },
    features: ['3-Book Set', 'Latest Editions', 'Practical Examples', 'Digital Access'],
    brand: 'TechBooks',
    sku: 'TB-PBS-008',
    isActive: true,
    createdAt: '2023-12-20T16:30:00Z',
    updatedAt: '2024-01-08T09:45:00Z'
  }
]

// Mock Cart Data
export const mockCartItems: CartItem[] = [
  {
    id: 'cart-item-1',
    product: mockProducts[0], // Gaming Headset
    quantity: 1,
    subtotal: 149.99,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'cart-item-2',
    product: mockProducts[2], // Fitness Tracker
    quantity: 2,
    subtotal: 159.98,
    createdAt: '2024-01-15T15:45:00Z',
    updatedAt: '2024-01-15T15:45:00Z'
  }
]

export const mockCart: Cart = {
  id: 'cart-123',
  userId: 'user-123',
  items: mockCartItems,
  totalAmount: 309.97,
  createdAt: '2024-01-15T14:30:00Z',
  updatedAt: '2024-01-15T15:45:00Z'
}

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    userId: 'user-123',
    items: [
      {
        id: 'order-item-1',
        productId: 'prod-1',
        productName: 'Wireless Gaming Headset Pro',
        productImage: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400',
        quantity: 1,
        unitPrice: 149.99,
        subtotal: 149.99
      },
      {
        id: 'order-item-2',
        productId: 'prod-3',
        productName: 'Smart Fitness Tracker',
        productImage: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
        quantity: 1,
        unitPrice: 79.99,
        subtotal: 79.99
      }
    ],
    totalAmount: 249.97,
    subtotalAmount: 229.98,
    shippingAmount: 9.99,
    taxAmount: 18.40,
    status: OrderStatus.DELIVERED,
    shippingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States'
    },
    paymentMethod: 'credit_card' as any,
    paymentStatus: PaymentStatus.PAID,
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20T18:00:00Z',
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  },
  {
    id: 'order-002',
    userId: 'user-123',
    items: [
      {
        id: 'order-item-3',
        productId: 'prod-2',
        productName: 'Ergonomic Office Chair',
        productImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        quantity: 1,
        unitPrice: 299.99,
        subtotal: 299.99
      }
    ],
    totalAmount: 323.99,
    subtotalAmount: 299.99,
    shippingAmount: 0, // Free shipping
    taxAmount: 24.00,
    status: OrderStatus.PROCESSING,
    shippingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States'
    },
    paymentMethod: 'credit_card' as any,
    paymentStatus: PaymentStatus.PAID,
    estimatedDelivery: '2024-01-25T18:00:00Z',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T11:20:00Z'
  }
]

// Mock Products Response with Pagination
export const mockProductsResponse: ProductsResponse = {
  products: mockProducts,
  totalCount: mockProducts.length,
  totalPages: 1,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false
}

// Featured Products (subset of all products)
export const mockFeaturedProducts = mockProducts.slice(0, 4)

// Mock API Response Helpers
export const createMockApiResponse = <T>(data: T) => ({
  data,
  message: 'Success',
  success: true
})

// Search and Filter Helpers
export const filterProducts = (products: Product[], filters: any = {}) => {
  let filtered = [...products]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.tags?.some(tag => tag.toLowerCase().includes(search))
    )
  }
  
  if (filters.category) {
    filtered = filtered.filter(product => product.category === filters.category)
  }
  
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice)
  }
  
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice)
  }
  
  // Sort products
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      const order = filters.sortOrder === 'DESC' ? -1 : 1
      
      switch (filters.sortBy) {
        case 'name':
          return order * a.name.localeCompare(b.name)
        case 'price':
          return order * (a.price - b.price)
        case 'rating':
          return order * (a.rating - b.rating)
        case 'createdAt':
        default:
          return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }
    })
  }
  
  return filtered
}

// Pagination Helper
export const paginateResults = <T>(items: T[], page: number = 1, limit: number = 12) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = items.slice(startIndex, endIndex)
  
  return {
    items: paginatedItems,
    totalCount: items.length,
    totalPages: Math.ceil(items.length / limit),
    currentPage: page,
    hasNextPage: endIndex < items.length,
    hasPreviousPage: page > 1
  }
}