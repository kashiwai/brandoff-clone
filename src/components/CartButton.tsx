'use client'

import { FiShoppingCart } from 'react-icons/fi'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

export default function CartButton() {
  const { items, getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
    >
      <FiShoppingCart className="w-6 h-6" />
      
      {/* Cart Item Count Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
      
      {/* Screen reader text */}
      <span className="sr-only">
        Shopping cart with {totalItems} {totalItems === 1 ? 'item' : 'items'}
      </span>
    </Link>
  )
}