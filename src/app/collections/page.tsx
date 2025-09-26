'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiShoppingBag, FiWatch, FiPackage, FiStar, FiGlobe, FiTruck } from 'react-icons/fi';
import { GiJewelCrown, GiRunningShoe, GiClothes } from 'react-icons/gi';

// カテゴリーデータ
const categories = [
  {
    id: 'bags',
    name: 'バッグ',
    slug: 'bags',
    description: 'ハンドバッグ、ショルダーバッグ、トートバッグなど',
    icon: <FiShoppingBag className="w-8 h-8" />,
    color: 'bg-pink-100 text-pink-600'
  },
  {
    id: 'shoes',
    name: '靴',
    slug: 'shoes',
    description: 'スニーカー、パンプス、ブーツ、サンダルなど',
    icon: <GiRunningShoe className="w-8 h-8" />,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'watches',
    name: '時計',
    slug: 'watches',
    description: '腕時計、スマートウォッチなど',
    icon: <FiWatch className="w-8 h-8" />,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'jewelry',
    name: 'ジュエリー',
    slug: 'jewelry',
    description: 'ネックレス、リング、ピアス、ブレスレットなど',
    icon: <GiJewelCrown className="w-8 h-8" />,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'accessories',
    name: 'アクセサリー',
    slug: 'accessories',
    description: '財布、ベルト、スカーフ、サングラスなど',
    icon: <FiStar className="w-8 h-8" />,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 'clothing',
    name: '洋服',
    slug: 'clothing',
    description: 'トップス、ボトムス、アウター、ドレスなど',
    icon: <GiClothes className="w-8 h-8" />,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 'luggage',
    name: 'カバン',
    slug: 'luggage',
    description: 'トラベルバッグ、スーツケース、ボストンバッグなど',
    icon: <FiTruck className="w-8 h-8" />,
    color: 'bg-orange-100 text-orange-600'
  }
];

// ブランドデータ
const brands = [
  // ラグジュアリーブランド
  { id: '1', name: 'Louis Vuitton', slug: 'louis-vuitton', country: 'France', logo: '🇫🇷', category: 'luxury' },
  { id: '2', name: 'Hermès', slug: 'hermes', country: 'France', logo: '🇫🇷', category: 'luxury' },
  { id: '3', name: 'Chanel', slug: 'chanel', country: 'France', logo: '🇫🇷', category: 'luxury' },
  { id: '4', name: 'Gucci', slug: 'gucci', country: 'Italy', logo: '🇮🇹', category: 'luxury' },
  { id: '5', name: 'Prada', slug: 'prada', country: 'Italy', logo: '🇮🇹', category: 'luxury' },
  { id: '6', name: 'Dior', slug: 'dior', country: 'France', logo: '🇫🇷', category: 'luxury' },
  { id: '7', name: 'Balenciaga', slug: 'balenciaga', country: 'Spain', logo: '🇪🇸', category: 'luxury' },
  { id: '8', name: 'Saint Laurent', slug: 'saint-laurent', country: 'France', logo: '🇫🇷', category: 'luxury' },
  { id: '9', name: 'Bottega Veneta', slug: 'bottega-veneta', country: 'Italy', logo: '🇮🇹', category: 'luxury' },
  { id: '10', name: 'Burberry', slug: 'burberry', country: 'UK', logo: '🇬🇧', category: 'luxury' },
  { id: '11', name: 'Fendi', slug: 'fendi', country: 'Italy', logo: '🇮🇹', category: 'luxury' },
  { id: '12', name: 'Celine', slug: 'celine', country: 'France', logo: '🇫🇷', category: 'luxury' },
  { id: '13', name: 'Valentino', slug: 'valentino', country: 'Italy', logo: '🇮🇹', category: 'luxury' },
  { id: '14', name: 'Givenchy', slug: 'givenchy', country: 'France', logo: '🇫🇷', category: 'luxury' },
  { id: '15', name: 'Versace', slug: 'versace', country: 'Italy', logo: '🇮🇹', category: 'luxury' },
  // 時計ブランド
  { id: '16', name: 'Rolex', slug: 'rolex', country: 'Switzerland', logo: '🇨🇭', category: 'watches' },
  { id: '17', name: 'Omega', slug: 'omega', country: 'Switzerland', logo: '🇨🇭', category: 'watches' },
  { id: '18', name: 'Cartier', slug: 'cartier', country: 'France', logo: '🇫🇷', category: 'watches' },
  { id: '19', name: 'Patek Philippe', slug: 'patek-philippe', country: 'Switzerland', logo: '🇨🇭', category: 'watches' },
  { id: '20', name: 'Audemars Piguet', slug: 'audemars-piguet', country: 'Switzerland', logo: '🇨🇭', category: 'watches' },
  // ジュエリーブランド
  { id: '21', name: 'Tiffany & Co.', slug: 'tiffany', country: 'USA', logo: '🇺🇸', category: 'jewelry' },
  { id: '22', name: 'Bulgari', slug: 'bulgari', country: 'Italy', logo: '🇮🇹', category: 'jewelry' },
  { id: '23', name: 'Van Cleef & Arpels', slug: 'van-cleef', country: 'France', logo: '🇫🇷', category: 'jewelry' },
  { id: '24', name: 'Harry Winston', slug: 'harry-winston', country: 'USA', logo: '🇺🇸', category: 'jewelry' },
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // カテゴリーに基づいてブランドをフィルター
  const filteredBrands = selectedCategory
    ? brands.filter(brand => {
        if (selectedCategory === 'watches') return brand.category === 'watches';
        if (selectedCategory === 'jewelry') return brand.category === 'jewelry';
        return brand.category === 'luxury';
      })
    : brands;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダーセクション */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Collections</h1>
            <p className="text-xl text-gray-300">カテゴリーとブランドからお好みの商品をお選びください</p>
          </div>
        </div>
      </div>

      {/* カテゴリーセクション */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">カテゴリーから探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.slug ? 'ring-4 ring-blue-500' : ''
                }`}
              >
                <Link href={`/products?category=${category.slug}`} className="block p-6">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${category.color}`}>
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.description.split('、')[0]}</p>
                </Link>
              </button>
            ))}
          </div>
        </div>

        {/* ブランドセクション */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">ブランドから探す</h2>

          {selectedCategory && (
            <div className="mb-6 text-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                すべてのブランドを表示
              </button>
            </div>
          )}

          {/* 人気ブランド */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FiStar className="w-6 h-6 mr-2 text-yellow-500" />
              人気ブランド
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredBrands.slice(0, 10).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.slug}`}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-black hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-4xl mb-3">{brand.logo}</div>
                  <h3 className="font-bold text-lg">{brand.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{brand.country}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* すべてのブランド（アルファベット順） */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FiGlobe className="w-6 h-6 mr-2 text-blue-500" />
              すべてのブランド
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.slug}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{brand.logo}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">{brand.name}</h4>
                      <p className="text-xs text-gray-500">{brand.country}</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* フッターナビゲーション */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-lg font-medium"
          >
            すべての商品を見る
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}