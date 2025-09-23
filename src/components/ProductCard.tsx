'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '@/hooks/useCart'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compareAt?: number
  images: Array<{
    id: string
    url: string
    alt?: string
  }>
  category: {
    name: string
    slug: string
  }
  featured: boolean
  active: boolean
}

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const discountPercentage = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      await addItem({
        productId: product.id,
        quantity: 1,
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist API call
  }

  const primaryImage = product.images[0]

  return (
    <div className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <Link href={`/products/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.featured && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded">
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add to Cart - appears on hover */}
          <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              disabled={isLoading || !product.active}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isLoading ? 'Adding...' : 'Quick Add'}
              </span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category.name}
          </p>

          {/* Product Name */}
          <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating (placeholder) */}
          <div className="mt-2 flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.5)</span>
          </div>
        </div>
      </Link>
    </div>
  )
}