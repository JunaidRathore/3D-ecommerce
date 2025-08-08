'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Star, ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/header'
import ProductViewer from '@/components/3d/ProductViewer'
import { useFeaturedProducts, useAddToCart } from '@/hooks/use-api'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { toast } from '@/hooks/use-toast'

const HomePage = () => {
  const { data: featuredProducts, isLoading, isError } = useFeaturedProducts()
  const { addLocalItem } = useCartStore()
  
  const addToCartMutation = useAddToCart({
    onSuccess: (cart) => {
      useCartStore.getState().setCart(cart)
      toast({
        title: "Success",
        description: "Product added to cart successfully!",
      })
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add product to cart'
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })

  const handleAddToCart = (product: Product) => {
    // Optimistic update
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity: 1,
      subtotal: Number(product.price),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addLocalItem(cartItem)
    
    // Server update
    addToCartMutation.mutate({ productId: product.id, quantity: 1 })
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {product.model3dUrl && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            3D
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/products/${product.id}`}>
            <Button size="sm" variant="secondary" className="mr-2">
              View Details
            </Button>
          </Link>
          <Button 
            size="sm" 
            onClick={() => handleAddToCart(product)}
            disabled={addToCartMutation.isPending || product.stock === 0}
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Shop in
                  <span className="text-primary"> 3D Reality</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  Experience products like never before with our interactive 3D shopping platform. 
                  Rotate, zoom, and explore every detail before you buy.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 card-shadow">
                <ProductViewer className="w-full h-80" />
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Interactive 3D Product Showcase
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our 3D Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionary shopping experience with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold">360° Product View</h3>
              <p className="text-muted-foreground">
                Rotate and examine products from every angle with our interactive 3D viewer
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Optimized 3D models that load instantly without compromising quality
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold">True to Life</h3>
              <p className="text-muted-foreground">
                Photorealistic 3D models that show exactly what you'll receive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Discover our most popular items with 3D visualization
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading featured products...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load featured products</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 opacity-90">
              Get the latest updates on new 3D products and exclusive offers
            </p>
            
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
