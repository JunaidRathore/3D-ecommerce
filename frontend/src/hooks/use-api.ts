import { 
  useMutation, 
  useQuery, 
  useQueryClient, 
  UseQueryOptions,
  UseMutationOptions 
} from '@tanstack/react-query'
import { 
  User, 
  AuthUser, 
  Product, 
  ProductsResponse, 
  Cart, 
  Order, 
  ProductFilters,
  LoginCredentials,
  RegisterData,
  CreateOrderRequest,
  PaymentIntent,
  CreatePaymentIntentRequest
} from '@/types'
import { apiClient } from '@/lib/api'

// Query Keys
export const queryKeys = {
  // Auth
  currentUser: ['currentUser'] as const,
  
  // Products
  products: ['products'] as const,
  product: (id: string) => ['product', id] as const,
  featuredProducts: ['products', 'featured'] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,
  productRecommendations: (id: string) => ['products', id, 'recommendations'] as const,
  searchProducts: (query: string, filters?: ProductFilters) => ['products', 'search', query, filters] as const,
  
  // Cart
  cart: ['cart'] as const,
  
  // Orders
  orders: ['orders'] as const,
  order: (id: string) => ['order', id] as const,
  
  // Payment
  paymentMethods: ['paymentMethods'] as const,
} as const

// Auth Hooks
export function useLogin(options?: UseMutationOptions<AuthUser, Error, LoginCredentials>) {
  return useMutation({
    mutationFn: apiClient.login.bind(apiClient),
    ...options,
  })
}

export function useRegister(options?: UseMutationOptions<AuthUser, Error, RegisterData>) {
  return useMutation({
    mutationFn: apiClient.register.bind(apiClient),
    ...options,
  })
}

export function useLogout(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.logout.bind(apiClient),
    onSuccess: () => {
      queryClient.clear()
    },
    ...options,
  })
}

export function useForgotPassword(options?: UseMutationOptions<void, Error, string>) {
  return useMutation({
    mutationFn: apiClient.forgotPassword.bind(apiClient),
    ...options,
  })
}

export function useResetPassword(options?: UseMutationOptions<void, Error, { token: string; password: string }>) {
  return useMutation({
    mutationFn: ({ token, password }) => apiClient.resetPassword(token, password),
    ...options,
  })
}

// User Hooks
export function useCurrentUser(options?: UseQueryOptions<User, Error>) {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: apiClient.getCurrentUser.bind(apiClient),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useUpdateProfile(options?: UseMutationOptions<User, Error, Partial<User>>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.updateProfile.bind(apiClient),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.currentUser, data)
    },
    ...options,
  })
}

export function useChangePassword(options?: UseMutationOptions<void, Error, { currentPassword: string; newPassword: string }>) {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) => 
      apiClient.changePassword(currentPassword, newPassword),
    ...options,
  })
}

export function useDeleteAccount(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.deleteAccount.bind(apiClient),
    onSuccess: () => {
      queryClient.clear()
    },
    ...options,
  })
}

// Product Hooks
export function useProducts(filters?: ProductFilters, options?: UseQueryOptions<ProductsResponse, Error>) {
  return useQuery({
    queryKey: [...queryKeys.products, filters],
    queryFn: () => apiClient.getProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}

export function useProduct(id: string, options?: UseQueryOptions<Product, Error>) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => apiClient.getProduct(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    ...options,
  })
}

export function useFeaturedProducts(options?: UseQueryOptions<Product[], Error>) {
  return useQuery({
    queryKey: queryKeys.featuredProducts,
    queryFn: apiClient.getFeaturedProducts.bind(apiClient),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

export function useProductsByCategory(category: string, options?: UseQueryOptions<Product[], Error>) {
  return useQuery({
    queryKey: queryKeys.productsByCategory(category),
    queryFn: () => apiClient.getProductsByCategory(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!category,
    ...options,
  })
}

export function useProductRecommendations(productId: string, options?: UseQueryOptions<Product[], Error>) {
  return useQuery({
    queryKey: queryKeys.productRecommendations(productId),
    queryFn: () => apiClient.getProductRecommendations(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId,
    ...options,
  })
}

export function useSearchProducts(
  query: string, 
  filters?: ProductFilters, 
  options?: UseQueryOptions<ProductsResponse, Error>
) {
  return useQuery({
    queryKey: queryKeys.searchProducts(query, filters),
    queryFn: () => apiClient.searchProducts(query, filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!query && query.length > 0,
    ...options,
  })
}

// Cart Hooks
export function useCart(options?: UseQueryOptions<Cart, Error>) {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: apiClient.getCart.bind(apiClient),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  })
}

export function useAddToCart(options?: UseMutationOptions<Cart, Error, { productId: string; quantity: number }>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, quantity }) => apiClient.addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data)
    },
    ...options,
  })
}

export function useUpdateCartItem(options?: UseMutationOptions<Cart, Error, { itemId: string; quantity: number }>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ itemId, quantity }) => apiClient.updateCartItem(itemId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data)
    },
    ...options,
  })
}

export function useRemoveFromCart(options?: UseMutationOptions<Cart, Error, string>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.removeFromCart.bind(apiClient),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data)
    },
    ...options,
  })
}

export function useClearCart(options?: UseMutationOptions<Cart, Error, void>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.clearCart.bind(apiClient),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data)
    },
    ...options,
  })
}

// Order Hooks
export function useOrders(options?: UseQueryOptions<Order[], Error>) {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: apiClient.getOrders.bind(apiClient),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}

export function useOrder(id: string, options?: UseQueryOptions<Order, Error>) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => apiClient.getOrder(id),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!id,
    ...options,
  })
}

export function useCreateOrder(options?: UseMutationOptions<Order, Error, CreateOrderRequest>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.createOrder.bind(apiClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.cart })
    },
    ...options,
  })
}

export function useUpdateOrderStatus(options?: UseMutationOptions<Order, Error, { id: string; status: string }>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }) => apiClient.updateOrderStatus(id, status),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.order(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
    },
    ...options,
  })
}

export function useCancelOrder(options?: UseMutationOptions<Order, Error, string>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.cancelOrder.bind(apiClient),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.order(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
    },
    ...options,
  })
}

// Payment Hooks
export function useCreatePaymentIntent(options?: UseMutationOptions<PaymentIntent, Error, CreatePaymentIntentRequest>) {
  return useMutation({
    mutationFn: apiClient.createPaymentIntent.bind(apiClient),
    ...options,
  })
}

export function useConfirmPayment(options?: UseMutationOptions<PaymentIntent, Error, string>) {
  return useMutation({
    mutationFn: apiClient.confirmPayment.bind(apiClient),
    ...options,
  })
}

export function usePaymentMethods(options?: UseQueryOptions<Array<{ id: string; type: string; last4?: string }>, Error>) {
  return useQuery({
    queryKey: queryKeys.paymentMethods,
    queryFn: apiClient.getPaymentMethods.bind(apiClient),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useAddPaymentMethod(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.addPaymentMethod.bind(apiClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods })
    },
    ...options,
  })
}

export function useRemovePaymentMethod(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.removePaymentMethod.bind(apiClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods })
    },
    ...options,
  })
}

// Utility Hooks
export function useUploadImage(options?: UseMutationOptions<string, Error, File>) {
  return useMutation({
    mutationFn: apiClient.uploadImage.bind(apiClient),
    ...options,
  })
}

export function useUploadModel3D(options?: UseMutationOptions<string, Error, File>) {
  return useMutation({
    mutationFn: apiClient.uploadModel3D.bind(apiClient),
    ...options,
  })
}

export function useSendContactMessage(
  options?: UseMutationOptions<void, Error, { name: string; email: string; subject: string; message: string }>
) {
  return useMutation({
    mutationFn: apiClient.sendContactMessage.bind(apiClient),
    ...options,
  })
}

export function useSubscribeToNewsletter(options?: UseMutationOptions<void, Error, string>) {
  return useMutation({
    mutationFn: apiClient.subscribeToNewsletter.bind(apiClient),
    ...options,
  })
}

export function useTrackEvent(options?: UseMutationOptions<void, Error, { eventName: string; properties?: Record<string, unknown> }>) {
  return useMutation({
    mutationFn: ({ eventName, properties }) => apiClient.trackEvent(eventName, properties),
    ...options,
  })
}