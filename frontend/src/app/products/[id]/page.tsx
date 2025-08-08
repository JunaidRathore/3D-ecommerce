'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/header'
import ProductViewer from '@/components/3d/ProductViewer'
import { api } from '@/lib/api'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'

const ProductDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showFullscreen3D, setShowFullscreen3D] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const productData = await api.getProduct(productId)
      setProduct(productData)
    } catch (error) {
      console.error('Failed to fetch product:', error)
      router.push('/products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    setAddingToCart(true)
    try {
      await api.addToCart(product.id, quantity)
      addItem({
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <Link href="/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/products" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images & 3D Viewer */}
          <div className="space-y-4">
            {/* Main Display */}
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                {product.model3dUrl ? (
                  <div className="w-full h-full">
                    <ProductViewer 
                      modelUrl={product.model3dUrl} 
                      className="w-full h-full"
                    />
                    <Button
                      onClick={() => setShowFullscreen3D(true)}
                      className="absolute top-4 right-4"
                      size="sm"
                    >
                      View in 3D
                    </Button>
                  </div>
                ) : product.images[selectedImageIndex] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ShoppingCart className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer overflow-hidden ${
                      selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <div className="aspect-square">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-muted-foreground capitalize">
                  {product.category}
                </span>
                {product.model3dUrl && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    3D Available
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm">
                {product.stock > 0 
                  ? `${product.stock} in stock` 
                  : 'Out of stock'
                }
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full"
                size="lg"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">2 Year Warranty</div>
                  <div className="text-xs text-muted-foreground">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">30 Day Returns</div>
                  <div className="text-xs text-muted-foreground">No questions asked</div>
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            {(product.weight || product.dimensions) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Specifications</h3>
                  <div className="space-y-2">
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span>{product.weight} lbs</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span>
                          {product.dimensions.length}" × {product.dimensions.width}" × {product.dimensions.height}"
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen 3D Modal */}
      {showFullscreen3D && product.model3dUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="w-full h-full max-w-6xl max-h-[90vh] relative">
            <ProductViewer 
              modelUrl={product.model3dUrl} 
              className="w-full h-full"
            />
            <Button
              onClick={() => setShowFullscreen3D(false)}
              className="absolute top-4 right-4"
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage