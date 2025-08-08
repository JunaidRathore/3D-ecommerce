'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { ProductCategory } from '@/types'

const CategoriesPage = () => {
  const categories = [
    {
      id: ProductCategory.ELECTRONICS,
      name: 'Electronics',
      description: 'Latest tech gadgets and devices',
      icon: '📱',
      color: 'from-blue-500 to-indigo-600',
      featured: ['Smartphones', 'Laptops', 'Headphones', 'Cameras']
    },
    {
      id: ProductCategory.CLOTHING,
      name: 'Clothing',
      description: 'Fashion and apparel for everyone',
      icon: '👕',
      color: 'from-pink-500 to-rose-600',
      featured: ['T-Shirts', 'Dresses', 'Jeans', 'Accessories']
    },
    {
      id: ProductCategory.HOME,
      name: 'Home & Garden',
      description: 'Everything for your home and garden',
      icon: '🏠',
      color: 'from-green-500 to-emerald-600',
      featured: ['Furniture', 'Decor', 'Kitchen', 'Garden Tools']
    },
    {
      id: ProductCategory.SPORTS,
      name: 'Sports & Outdoors',
      description: 'Gear for active lifestyles',
      icon: '⚽',
      color: 'from-orange-500 to-red-600',
      featured: ['Fitness', 'Camping', 'Team Sports', 'Water Sports']
    },
    {
      id: ProductCategory.BOOKS,
      name: 'Books',
      description: 'Knowledge and entertainment',
      icon: '📚',
      color: 'from-purple-500 to-violet-600',
      featured: ['Fiction', 'Non-Fiction', 'Educational', 'Comics']
    },
    {
      id: ProductCategory.TOYS,
      name: 'Toys & Games',
      description: 'Fun for all ages',
      icon: '🧸',
      color: 'from-yellow-500 to-orange-600',
      featured: ['Board Games', 'Educational', 'Action Figures', 'Puzzles']
    }
  ]

  const CategoryCard = ({ category }: { category: typeof categories[0] }) => (
    <Card className="group overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`h-32 bg-gradient-to-br ${category.color} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-80">{category.icon}</span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-muted-foreground mb-4">
          {category.description}
        </p>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Popular items:
          </div>
          <div className="flex flex-wrap gap-1">
            {category.featured.map((item, index) => (
              <span 
                key={index}
                className="text-xs bg-muted px-2 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        
        <Link href={`/products?category=${category.id}`}>
          <Button className="w-full mt-4" variant="outline">
            Browse {category.name}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing products across all categories, now with interactive 3D visualization
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Experience Shopping in 3D
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Many of our products feature interactive 3D models that let you explore every detail. 
            Rotate, zoom, and examine products from every angle before you buy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold mb-2">360° Rotation</h3>
              <p className="text-sm text-muted-foreground">
                View products from every angle with smooth rotation controls
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold mb-2">Zoom & Inspect</h3>
              <p className="text-sm text-muted-foreground">
                Get up close to see textures, materials, and fine details
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="font-semibold mb-2">Interactive</h3>
              <p className="text-sm text-muted-foreground">
                Click and drag to interact with products in real-time
              </p>
            </div>
          </div>
          
          <Link href="/products">
            <Button size="lg">
              Explore 3D Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">Products Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">200+</div>
            <div className="text-sm text-muted-foreground">3D Models</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage