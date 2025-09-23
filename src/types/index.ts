import { Prisma } from '@prisma/client'

// Product types
export type Product = Prisma.ProductGetPayload<{
  include: {
    images: true
    category: true
    variants: true
    reviews: {
      include: {
        user: {
          select: {
            name: true
            image: true
          }
        }
      }
    }
    _count: {
      select: {
        reviews: true
      }
    }
  }
}>

export type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    images: true
    category: true
  }
}>

export type ProductCard = Prisma.ProductGetPayload<{
  include: {
    images: {
      take: 1
      orderBy: {
        order: 'asc'
      }
    }
    category: true
  }
}>

// Cart types
export type Cart = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: {
              take: 1
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
        variant: true
      }
    }
  }
}>

export type CartItem = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        images: {
          take: 1
          orderBy: {
            order: 'asc'
          }
        }
      }
    }
    variant: true
  }
}>

// Order types
export type Order = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true
        variant: true
      }
    }
    user: {
      select: {
        name: true
        email: true
      }
    }
  }
}>

// User types
export type User = Prisma.UserGetPayload<{
  include: {
    orders: true
    reviews: true
  }
}>

// Category types
export type Category = Prisma.CategoryGetPayload<{
  include: {
    children: true
    parent: true
    products: {
      include: {
        images: {
          take: 1
          orderBy: {
            order: 'asc'
          }
        }
      }
    }
  }
}>

// Review types
export type Review = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        name: true
        image: true
      }
    }
    product: {
      select: {
        name: true
        slug: true
      }
    }
  }
}>

// API Response types
export interface ProductsResponse {
  products: ProductCard[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface CartResponse {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  totalItems: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchResponse {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    image?: string
    category: string
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  total: number
}

// Form types
export interface ProductFormData {
  name: string
  description?: string
  price: number
  compareAt?: number
  cost?: number
  sku: string
  barcode?: string
  quantity: number
  categoryId: string
  featured: boolean
  images: Array<{
    url: string
    alt?: string
  }>
  variants: Array<{
    name: string
    sku: string
    price: number
    quantity: number
    image?: string
    attributes?: Record<string, any>
  }>
}

export interface CartItemUpdate {
  productId: string
  variantId?: string
  quantity: number
}

export interface OrderFormData {
  email: string
  phone?: string
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  notes?: string
}

// Filter types
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price' | 'name' | 'createdAt'
  order?: 'asc' | 'desc'
  featured?: boolean
  page?: number
  limit?: number
}

// NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}