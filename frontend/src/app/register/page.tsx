'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, ArrowLeft, ShoppingBag, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  address?: string
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { login } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError('')
    
    try {
      const { confirmPassword, ...registerData } = data
      const authData = await api.register(registerData)
      login(authData)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { label: 'At least 6 characters', met: password && password.length >= 6 },
    { label: 'Contains uppercase letter', met: password && /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: password && /[a-z]/.test(password) },
    { label: 'Contains number', met: password && /\d/.test(password) },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="container py-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="container flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">
              Join us and start your 3D shopping experience
            </p>
          </div>

          {/* Register Form */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create your account to access exclusive features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters',
                        },
                      })}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters',
                        },
                      })}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
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

                {/* Phone Field (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('phone')}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                  
                  {/* Password Requirements */}
                  {password && (
                    <div className="space-y-1 mt-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <Check 
                            className={`h-3 w-3 mr-2 ${
                              req.met ? 'text-green-500' : 'text-gray-300'
                            }`} 
                          />
                          <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === password || 'Passwords do not match',
                      })}
                      className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Address Field (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State 12345"
                    {...register('address')}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="text-sm text-muted-foreground">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage