'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  images: { url: string; alt: string }[];
  category: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
}

const categoryNames: { [key: string]: string } = {
  'bags': 'バッグ',
  'shoes': '靴',
  'watches': '時計',
  'jewelry': 'ジュエリー',
  'accessories': 'アクセサリー',
  'clothing': '洋服'
};

const brandNames: { [key: string]: string } = {
  'louis-vuitton': 'Louis Vuitton',
  'hermes': 'Hermès',
  'chanel': 'Chanel',
  'gucci': 'Gucci',
  'prada': 'Prada',
  'dior': 'Dior',
  'balenciaga': 'Balenciaga',
  'saint-laurent': 'Saint Laurent',
  'bottega-veneta': 'Bottega Veneta',
  'burberry': 'Burberry',
  'fendi': 'Fendi',
  'celine': 'Celine',
  'valentino': 'Valentino',
  'givenchy': 'Givenchy',
  'versace': 'Versace',
  'rolex': 'Rolex',
  'omega': 'Omega',
  'cartier': 'Cartier',
  'patek-philippe': 'Patek Philippe',
  'tiffany': 'Tiffany & Co.',
  'bulgari': 'Bulgari',
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, brandParam]);

  const fetchProducts = async () => {
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      
      if (categoryParam) params.append('category', categoryParam);
      if (brandParam) params.append('brand', brandParam);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('商品の取得に失敗しました');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      toast.error('商品の読み込みに失敗しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">ホーム</Link>
          <span>/</span>
          {categoryParam ? (
            <>
              <Link href="/categories" className="hover:text-gray-900">カテゴリー</Link>
              <span>/</span>
              <Link href={`/categories/${categoryParam}/brands`} className="hover:text-gray-900">
                {categoryNames[categoryParam] || categoryParam}
              </Link>
              {brandParam && (
                <>
                  <span>/</span>
                  <span className="text-gray-900">{brandNames[brandParam] || brandParam}</span>
                </>
              )}
            </>
          ) : (
            <span className="text-gray-900">すべての商品</span>
          )}
        </nav>

        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {brandParam 
                ? `${brandNames[brandParam] || brandParam}の${categoryParam ? (categoryNames[categoryParam] || '商品') : '商品'}`
                : categoryParam 
                ? `${categoryNames[categoryParam] || categoryParam}の商品`
                : 'すべての商品'}
            </h1>
            <p className="text-gray-600 mt-2">{products.length}件の商品</p>
          </div>
          
          {/* フィルターボタン（モバイル用） */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiFilter />
            フィルター
          </button>
        </div>

        <div className="lg:flex lg:gap-8">
          {/* サイドバーフィルター */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4">絞り込み</h2>
              
              {/* カテゴリーフィルター */}
              {!categoryParam && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">カテゴリー</h3>
                  <div className="space-y-2">
                    {Object.entries(categoryNames).map(([slug, name]) => (
                      <Link
                        key={slug}
                        href={`/categories/${slug}/brands`}
                        className="block text-gray-700 hover:text-blue-600"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ブランド変更 */}
              {categoryParam && !brandParam && (
                <div>
                  <h3 className="font-medium mb-3">ブランドを選択</h3>
                  <Link
                    href={`/categories/${categoryParam}/brands`}
                    className="text-blue-600 hover:underline"
                  >
                    ブランド一覧を見る →
                  </Link>
                </div>
              )}

              {/* 現在の絞り込みをクリア */}
              {(categoryParam || brandParam) && (
                <div className="mt-6 pt-6 border-t">
                  <Link
                    href="/products"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    すべての商品を表示
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* 商品グリッド */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-64 w-full">
                      <Image
                        src={product.images[0]?.url || 'https://via.placeholder.com/400x400'}
                        alt={product.images[0]?.alt || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-500">{product.category.name}</p>
                      {product.brand && (
                        <p className="text-xs font-medium text-gray-700">{product.brand.name}</p>
                      )}
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-gray-900">
                        ¥{product.price.toLocaleString()}
                      </p>
                      <button
                        onClick={() => toast.success('カートに追加しました')}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <FiShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">該当する商品が見つかりませんでした。</p>
                <Link href="/categories" className="text-blue-600 hover:underline mt-4 inline-block">
                  カテゴリーから探す
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}