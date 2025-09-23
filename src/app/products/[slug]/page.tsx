'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  quantity: number;
  images: { url: string; alt: string }[];
  category: {
    id: string;
    name: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params.slug]);

  const fetchProduct = async (slug: string) => {
    try {
      const response = await fetch(`/api/products?slug=${slug}`);
      if (!response.ok) throw new Error('商品が見つかりません');
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        setProduct(data.products[0]);
      } else {
        throw new Error('商品が見つかりません');
      }
    } catch (error) {
      toast.error('商品の読み込みに失敗しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0]?.url || '',
    });
    
    toast.success('カートに追加しました');
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0]?.url || '',
    });
    
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">商品が見つかりませんでした</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 戻るボタン */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <FiArrowLeft className="mr-2" />
          戻る
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* 商品画像 */}
            <div className="relative h-96 md:h-full">
              <Image
                src={product.images[0]?.url || 'https://via.placeholder.com/800x800'}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* 商品情報 */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-sm text-gray-600">商品コード: {product.sku}</p>
              </div>

              <div className="text-4xl font-bold text-gray-900">
                ¥{product.price.toLocaleString()}
              </div>

              {product.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">商品説明</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    数量
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(Math.min(10, product.quantity))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    在庫: {product.quantity}点
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    今すぐ購入
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-md hover:bg-blue-50 transition-colors font-medium flex items-center justify-center"
                  >
                    <FiShoppingCart className="mr-2" />
                    カートに追加
                  </button>
                </div>

                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
                  <FiHeart className="mr-2" />
                  お気に入りに追加
                </button>
              </div>

              <div className="border-t pt-6 space-y-2 text-sm text-gray-600">
                <p>✓ 全国送料無料</p>
                <p>✓ 14日間返品保証</p>
                <p>✓ 正規品保証</p>
              </div>
            </div>
          </div>
        </div>

        {/* 関連商品 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">関連商品</h2>
          <RelatedProducts categoryId={product.category.id} currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
}

function RelatedProducts({ categoryId, currentProductId }: { categoryId: string; currentProductId: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?categoryId=${categoryId}&limit=4`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.products.filter((p: Product) => p.id !== currentProductId);
        setProducts(filtered.slice(0, 4));
      })
      .catch(console.error);
  }, [categoryId, currentProductId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.slug}`}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={product.images[0]?.url || 'https://via.placeholder.com/400x400'}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-gray-900">
                ¥{product.price.toLocaleString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}