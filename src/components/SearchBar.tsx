'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch, FiX } from 'react-icons/fi'
import Link from 'next/link'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  image?: string
  category: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.products || [])
        setShowResults(true)
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowResults(false)
      inputRef.current?.blur()
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setShowResults(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) {
                setShowResults(true)
              }
            }}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={handleResultClick}
                  className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
              
              {/* See All Results Link */}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleResultClick}
                className="block p-3 text-center text-blue-600 hover:bg-blue-50 font-medium"
              >
                See all results for &quot;{query}&quot;
              </Link>
            </>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No products found for &quot;{query}&quot;</p>
              <Link
                href="/products"
                onClick={handleResultClick}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Browse all products
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}