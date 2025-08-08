'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { api } from '@/lib/api'
import { Product } from '@/types'
import Header from '@/components/layout/header'
import { useCartStore } from '@/store/cart'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await api.getFeaturedProducts(8)
        setFeaturedProducts(products)
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = async (product: Product) => {
    // For now, we'll just add to local state
    // In a real app, this would call the API
    console.log('Adding to cart:', product.name)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Experience Products in
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {' '}3D Reality
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Revolutionize your shopping experience with interactive 3D product visualization. 
                  See, rotate, and explore products like never before.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* 3D Showcase Placeholder */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">
                    3D Product Viewer
                  </p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of online shopping with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '3D Product Visualization',
                description: 'View products from every angle with interactive 3D models',
                icon: '🔄',
              },
              {
                title: 'Secure Payments',
                description: 'Safe and secure checkout with multiple payment options',
                icon: '🔒',
              },
              {
                title: 'Fast Delivery',
                description: 'Quick and reliable shipping to your doorstep',
                icon: '🚀',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-lg text-muted-foreground">
              Discover our most popular items
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-4 space-y-4 animate-pulse">
                  <div className="aspect-square bg-muted rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-lg overflow-hidden card-shadow hover:shadow-xl transition-shadow">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {product.model3dUrl && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        3D
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                      <div className="flex space-x-2">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button size="sm" onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest products and exclusive offers
            </p>
          </div>
          
          <form className="max-w-md mx-auto flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-foreground"
            />
            <Button variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HomePage
