'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { api } from '@/lib/api'
import { Cart, CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  
  const router = useRouter()
  const { setCart: setGlobalCart, removeItem, updateItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCart()
  }, [isAuthenticated])

  const fetchCart = async () => {
    setIsLoading(true)
    try {
      const cartData = await api.getCart()
      setCart(cartData)
      setGlobalCart(cartData)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId)
      return
    }

    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      const updatedCart = await api.updateCartItem(itemId, newQuantity)
      setCart(updatedCart)
      setGlobalCart(updatedCart)
      updateItem(itemId, newQuantity)
    } catch (error) {
      console.error('Failed to update cart item:', error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const removeFromCart = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      const updatedCart = await api.removeFromCart(itemId)
      setCart(updatedCart)
      setGlobalCart(updatedCart)
      removeItem(itemId)
    } catch (error) {
      console.error('Failed to remove cart item:', error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      const clearedCart = await api.clearCart()
      setCart(clearedCart)
      setGlobalCart(clearedCart)
    } catch (error) {
      console.error('Failed to clear cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSubtotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity)
    }, 0)
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 50 ? 0 : 9.99
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return subtotal * 0.08 // 8% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const CartItemComponent = ({ item }: { item: CartItem }) => {
    const isUpdating = updatingItems.has(item.id)
    
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Product Image */}
            <div className="w-full sm:w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {item.product.images[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <Link 
                    href={`/products/${item.product.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.product.category}
                  </p>
                  {item.product.model3dUrl && (
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mt-1">
                      3D Available
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatPrice(Number(item.product.price))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    each
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= item.product.stock}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="font-semibold">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    disabled={isUpdating}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stock Warning */}
              {item.quantity > item.product.stock && (
                <div className="text-sm text-red-600">
                  Only {item.product.stock} items available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your cart
          </p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Link 
              href="/products" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : !cart?.items || cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Cart Items ({cart.items.length})
                </h2>
                {cart.items.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                )}
              </div>

              {cart.items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(calculateShipping())
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(calculateTax())}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  {calculateShipping() > 0 && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      Add {formatPrice(50 - calculateSubtotal())} more for free shipping!
                    </div>
                  )}

                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-muted-foreground">
                    Secure checkout with SSL encryption
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage