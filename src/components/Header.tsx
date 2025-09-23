'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import SearchBar from './SearchBar'
import CartButton from './CartButton'
import { FiUser, FiMenu, FiChevronDown } from 'react-icons/fi'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  const categories = [
    { name: 'バッグ', slug: 'bags', icon: '👜' },
    { name: '靴', slug: 'shoes', icon: '👟' },
    { name: '時計', slug: 'watches', icon: '⌚' },
    { name: 'ジュエリー', slug: 'jewelry', icon: '💎' },
    { name: 'アクセサリー', slug: 'accessories', icon: '🕶️' },
    { name: '洋服', slug: 'clothing', icon: '👔' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="group">
            <h1 className="text-2xl font-bold tracking-wider">
              <span className="font-serif gold-text">Fancy</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* カテゴリードロップダウン */}
            <div className="relative group">
              <button
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
                className="flex items-center text-sm uppercase tracking-wider text-gray-700 hover:text-black transition-colors"
              >
                カテゴリー
                <FiChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              {isCategoryOpen && (
                <div
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2"
                >
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    すべてのカテゴリー
                  </Link>
                  <div className="border-t my-2"></div>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}/brands`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/products" className="text-sm uppercase tracking-wider text-gray-700 hover:text-black transition-colors">
              すべての商品
            </Link>
            <Link href="/sale" className="text-sm uppercase tracking-wider text-red-600 hover:text-red-700 font-semibold transition-colors">
              セール
            </Link>
            <Link href="/about" className="text-sm uppercase tracking-wider text-gray-700 hover:text-black transition-colors">
              Fancyについて
            </Link>
            <Link href="/admin/products" className="text-sm uppercase tracking-wider text-gray-700 hover:text-black transition-colors">
              管理
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            <Link
              href={session ? '/account' : '/auth/signin'}
              className="text-gray-700 hover:text-gray-900"
            >
              <FiUser className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <CartButton />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-gray-900"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 max-h-[70vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/categories"
              className="block py-2 text-gray-700 hover:text-gray-900 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              カテゴリーから探す
            </Link>
            
            {/* カテゴリー一覧 */}
            <div className="pl-4 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}/brands`}
                  className="flex items-center py-2 text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="border-t pt-2 mt-2"></div>
            
            <Link
              href="/products"
              className="block py-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              すべての商品
            </Link>
            <Link
              href="/sale"
              className="block py-2 text-red-600 hover:text-red-700 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              セール
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Fancyについて
            </Link>
            <Link
              href="/admin/products"
              className="block py-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              管理
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}