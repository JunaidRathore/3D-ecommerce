'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Grid3X3, List, Star, ShoppingCart, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { useProducts, useAddToCart } from '@/hooks/use-api'
import { Product, ProductCategory, ProductFilters } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { productFiltersSchema, type ProductFiltersFormData } from '@/lib/validations'
import { toast } from '@/hooks/use-toast'

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addLocalItem } = useCartStore()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFiltersFormData>({
    resolver: zodResolver(productFiltersSchema),
    defaultValues: {
      search: searchParams.get('search') || '',
      category: (searchParams.get('category') as ProductCategory) || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    },
  })

  const watchedFilters = watch()
  
  const {
    data: productsResponse,
    isLoading,
    isError,
    error
  } = useProducts({
    ...watchedFilters,
    page: currentPage,
  })

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
    { value: 'createdAt-DESC', label: 'Newest First' },
    { value: 'name-ASC', label: 'Name A-Z' },
    { value: 'price-ASC', label: 'Price Low to High' },
    { value: 'price-DESC', label: 'Price High to Low' },
    { value: 'rating-DESC', label: 'Highest Rated' },
  ]

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams()
    
    if (watchedFilters.search) params.set('search', watchedFilters.search)
    if (watchedFilters.category) params.set('category', watchedFilters.category)
    if (currentPage > 1) params.set('page', currentPage.toString())
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/products${newUrl}`, { scroll: false })
  }, [watchedFilters, currentPage, router])

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

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setValue('sortBy', sortBy as any)
    setValue('sortOrder', sortOrder as 'ASC' | 'DESC')
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <Button 
            size="sm" 
            onClick={() => handleAddToCart(product)}
            disabled={addToCartMutation.isPending || product.stock === 0}
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </>
            )}
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
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
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
            <form onSubmit={handleSubmit(() => {})} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    {...register('search')}
                    className="pl-10"
                  />
                  {errors.search && (
                    <p className="text-sm text-red-600 mt-1">{errors.search.message}</p>
                  )}
                </div>
                
                {/* Category Filter */}
                <select
                  {...register('category')}
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
                  value={`${watchedFilters.sortBy}-${watchedFilters.sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Price Range:</span>
                <Input
                  type="number"
                  placeholder="Min"
                  {...register('minPrice', { valueAsNumber: true })}
                  className="w-24"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  {...register('maxPrice', { valueAsNumber: true })}
                  className="w-24"
                />
                {(errors.minPrice || errors.maxPrice) && (
                  <div className="text-sm text-red-600">
                    {errors.minPrice?.message || errors.maxPrice?.message}
                  </div>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              'Loading...'
            ) : isError ? (
              'Error loading products'
            ) : (
              `Showing ${productsResponse?.products.length || 0} of ${productsResponse?.totalCount || 0} products`
            )}
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
            <span className="ml-2 text-muted-foreground">Loading products...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Error loading products</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : !productsResponse?.products.length ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {productsResponse.products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isListView={viewMode === 'list'} 
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {productsResponse && productsResponse.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            
            {[...Array(Math.min(5, productsResponse.totalPages))].map((_, i) => {
              const page = Math.max(1, currentPage - 2) + i
              if (page > productsResponse.totalPages) return null
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              disabled={currentPage === productsResponse.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
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