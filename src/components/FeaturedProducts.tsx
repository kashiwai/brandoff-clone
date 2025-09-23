'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  images: { url: string; alt: string }[];
  category: {
    name: string;
  };
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8');
      if (!response.ok) throw new Error('商品の取得に失敗しました');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.slice(0, 8).map((product) => (
        <div key={product.id} className="group relative bg-white overflow-hidden hover-lift">
          <Link href={`/products/${product.slug}`}>
            <div className="relative h-80 w-full overflow-hidden">
              <Image
                src={product.images[0]?.url || 'https://via.placeholder.com/400x400'}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </Link>
          <div className="p-4 bg-white">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{product.category.name}</p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-serif text-gray-900 mb-3 hover:text-gray-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <p className="text-lg font-light text-gray-900">
                ¥{product.price.toLocaleString()}
              </p>
              <button
                onClick={() => toast.success('カートに追加しました')}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white p-2 hover:bg-gray-800"
              >
                <FiShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}