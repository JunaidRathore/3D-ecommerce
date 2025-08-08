import { z } from "zod"
import { ProductCategory, UserRole } from "@/types"

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
  token: z.string().min(1, "Reset token is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Profile schemas
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional().or(z.literal("")),
})

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password cannot exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

// Product schemas
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(ProductCategory).optional(),
  minPrice: z.number().min(0, "Minimum price cannot be negative").optional(),
  maxPrice: z.number().min(0, "Maximum price cannot be negative").optional(),
  sortBy: z.enum(["name", "price", "createdAt", "rating", "popularity"]).optional(),
  sortOrder: z.enum(["ASC", "DESC"]).optional(),
  page: z.number().min(1, "Page must be at least 1").optional(),
  limit: z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").optional(),
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice
  }
  return true
}, {
  message: "Minimum price cannot be greater than maximum price",
  path: ["maxPrice"],
})

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
})

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
})

// Address schema
export const addressSchema = z.object({
  street: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(100, "Street address cannot exceed 100 characters"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "State can only contain letters and spaces"),
  postalCode: z
    .string()
    .min(5, "Postal code must be at least 5 characters")
    .max(10, "Postal code cannot exceed 10 characters")
    .regex(/^[\d\-\s]+$/, "Invalid postal code format"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Country can only contain letters and spaces"),
})

// Order schemas
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z
          .number()
          .min(1, "Quantity must be at least 1")
          .max(100, "Quantity cannot exceed 100"),
      })
    )
    .min(1, "At least one item is required"),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethodId: z.string().min(1, "Payment method is required"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
})

// Contact and review schemas
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject cannot exceed 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
})

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
})

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
})

// Search schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query cannot exceed 100 characters"),
  filters: productFiltersSchema.optional(),
})

// Payment schemas
export const paymentIntentSchema = z.object({
  amount: z
    .number()
    .min(0.5, "Amount must be at least $0.50")
    .max(999999.99, "Amount cannot exceed $999,999.99"),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .toUpperCase(),
  orderId: z.string().min(1, "Order ID is required"),
})

// Admin schemas (if needed)
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  price: z
    .number()
    .min(0.01, "Price must be at least $0.01")
    .max(999999.99, "Price cannot exceed $999,999.99"),
  category: z.nativeEnum(ProductCategory),
  stock: z
    .number()
    .min(0, "Stock cannot be negative")
    .max(99999, "Stock cannot exceed 99,999"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required")
    .max(10, "Cannot have more than 10 images"),
  model3dUrl: z.string().url("Invalid 3D model URL").optional().or(z.literal("")),
  tags: z.array(z.string().max(50, "Tag cannot exceed 50 characters")).optional(),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  dimensions: z.object({
    length: z.number().min(0, "Length cannot be negative"),
    width: z.number().min(0, "Width cannot be negative"),
    height: z.number().min(0, "Height cannot be negative"),
  }).optional(),
  features: z.array(z.string().max(100, "Feature cannot exceed 100 characters")).optional(),
  brand: z.string().max(50, "Brand cannot exceed 50 characters").optional().or(z.literal("")),
  sku: z.string().max(50, "SKU cannot exceed 50 characters").optional().or(z.literal("")),
})

export const updateProductSchema = createProductSchema.partial()

// Type exports for form data
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type ProductFiltersFormData = z.infer<typeof productFiltersSchema>
export type AddToCartFormData = z.infer<typeof addToCartSchema>
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type CreateOrderFormData = z.infer<typeof createOrderSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type PaymentIntentFormData = z.infer<typeof paymentIntentSchema>
export type CreateProductFormData = z.infer<typeof createProductSchema>
export type UpdateProductFormData = z.infer<typeof updateProductSchema>