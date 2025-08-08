'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Grid3X3, List, Star, ShoppingCart, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { api } from '@/lib/api'
import { Product, ProductCategory, ProductsResponse } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC')
  
  const searchParams = useSearchParams()
  const { addItem } = useCartStore()

  const categories = [
    { value: '', label: 'All Categories' },
    { value: ProductCategory.ELECTRONICS, label: 'Electronics' },
    { value: ProductCategory.CLOTHING, label: 'Clothing' },
    { value: ProductCategory.HOME, label: 'Home & Garden' },
    { value: ProductCategory.SPORTS, label: 'Sports & Outdoors' },
    { value: ProductCategory.BOOKS, label: 'Books' },
    { value: ProductCategory.TOYS, label: 'Toys & Games' },
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price', label: 'Price Low to High' },
    { value: 'rating', label: 'Highest Rated' },
  ]

  useEffect(() => {
    // Initialize from URL params
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const page = searchParams.get('page')
    
    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category as ProductCategory)
    if (page) setCurrentPage(parseInt(page))
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, searchQuery, priceRange, sortBy, sortOrder])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder,
      }
      
      if (searchQuery) params.search = searchQuery
      if (selectedCategory) params.category = selectedCategory
      if (priceRange.min) params.minPrice = parseFloat(priceRange.min)
      if (priceRange.max) params.maxPrice = parseFloat(priceRange.max)

      const response: ProductsResponse = await api.getProducts(params)
      setProducts(response.products)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await api.addToCart(product.id, 1)
      // Add to local state for immediate feedback
      addItem({
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const ProductCard = ({ product, isListView = false }: { product: Product; isListView?: boolean }) => (
    <Card className={`group overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 ${isListView ? 'flex' : ''}`}>
      {/* Product Image */}
      <div className={`${isListView ? 'w-48 flex-shrink-0' : 'aspect-square'} bg-muted relative overflow-hidden`}>
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* 3D Badge */}
        {product.model3dUrl && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            3D
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Link href={`/products/${product.id}`}>
            <Button size="sm" variant="secondary">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
          <Button size="sm" onClick={() => handleAddToCart(product)}>
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <CardContent className={`${isListView ? 'flex-1 p-4' : 'p-4'}`}>
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {!isListView && (
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {isListView && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
          )}
          
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
            {isListView && (
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Discover our amazing collection of products with 3D visualization
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | '')}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order as 'ASC' | 'DESC')
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={`${option.value}-${option.value === 'price' ? 'ASC' : 'DESC'}`}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Range */}
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-sm font-medium">Price Range:</span>
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-24"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-24"
              />
              <Button onClick={() => fetchProducts()} variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `Showing ${products.length} products`}
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isListView={viewMode === 'list'} 
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage