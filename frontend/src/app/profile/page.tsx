'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  LogOut,
  Edit,
  Save,
  X,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { api } from '@/lib/api'
import { User as UserType, Order } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  
  const router = useRouter()
  const { user, logout, updateUser, isAuthenticated } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      })
    }
    
    fetchOrders()
  }, [isAuthenticated, user, reset])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const ordersData = await api.getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true)
    try {
      const updatedUser = await api.updateProfile(data)
      updateUser(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your profile
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {tab.label}
                    </Button>
                  )
                })}
                
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button 
                        onClick={() => setIsEditing(false)} 
                        variant="outline" 
                        size="sm"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <Input
                            {...register('firstName', { required: 'First name is required' })}
                            className={errors.firstName ? 'border-red-500' : ''}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-600">{errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <Input
                            {...register('lastName', { required: 'Last name is required' })}
                            className={errors.lastName ? 'border-red-500' : ''}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-600">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          type="tel"
                          {...register('phone')}
                          placeholder="Optional"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input
                          {...register('address')}
                          placeholder="Optional"
                        />
                      </div>
                      
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Email</div>
                            <div className="font-medium">{user.email}</div>
                          </div>
                        </div>
                        
                        {user.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">Phone</div>
                              <div className="font-medium">{user.phone}</div>
                            </div>
                          </div>
                        )}
                        
                        {user.address && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">Address</div>
                              <div className="font-medium">{user.address}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Member Since</div>
                            <div className="font-medium">{formatDate(user.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't placed any orders yet
                      </p>
                      <Link href="/products">
                        <Button>Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="font-semibold">Order #{order.id.slice(-8)}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{formatPrice(order.totalAmount)}</div>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span>{item.productName} × {item.quantity}</span>
                                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                              <div className="text-sm text-muted-foreground">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </div>
                              <Link href={`/orders/${order.id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive updates about your orders and account
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Password</div>
                        <div className="text-sm text-muted-foreground">
                          Last updated 3 months ago
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                      <div>
                        <div className="font-medium text-red-600">Delete Account</div>
                        <div className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage