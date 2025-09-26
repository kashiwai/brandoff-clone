import Link from 'next/link'
import FeaturedProducts from '@/components/FeaturedProducts'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section with Video/Image Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=1080&fit=crop"
            alt="Luxury fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-shadow">
            <span className="block">Welcome to</span>
            <span className="gold-text text-6xl md:text-8xl lg:text-9xl">Fancy</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto">
            厳選された本物のラグジュアリーブランドをお届け
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collections"
              className="px-8 py-4 bg-white text-black hover:bg-gray-100 transition-all duration-300 font-medium tracking-wider uppercase"
            >
              コレクションを見る
            </Link>
            <Link
              href="#featured"
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wider uppercase"
            >
              特集商品
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 gold-text">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">100% 正規品保証</h3>
              <p className="text-gray-600">すべての商品は正規ルートから仕入れた本物です</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 gold-text">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">VIPカスタマーサービス</h3>
              <p className="text-gray-600">専門スタッフが丁寧にサポートいたします</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 gold-text">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">特別な体験</h3>
              <p className="text-gray-600">ラグジュアリーなショッピング体験をお届け</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              注目のコレクション
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto mb-4" />
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              世界の一流ブランドから厳選された、今シーズンの注目アイテム
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            カテゴリー
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products?category=bags" className="group relative overflow-hidden h-96">
              <Image
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"
                alt="バッグ"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold tracking-wider">BAGS</h3>
              </div>
            </Link>
            <Link href="/products?category=watches" className="group relative overflow-hidden h-96">
              <Image
                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop"
                alt="時計"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold tracking-wider">WATCHES</h3>
              </div>
            </Link>
            <Link href="/products?category=accessories" className="group relative overflow-hidden h-96">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop"
                alt="アクセサリー"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold tracking-wider">JEWELRY</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            メンバーシップに登録
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            限定商品や特別オファーの情報をいち早くお届けします
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="メールアドレス"
              className="flex-1 px-6 py-3 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-wider"
            >
              登録
            </button>
          </form>
        </div>
      </section>

      {/* Instagram Feed (Placeholder) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            @fancy_official
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square overflow-hidden group">
                <Image
                  src={`https://images.unsplash.com/photo-${1550000000000 + i * 10000000000}?w=400&h=400&fit=crop`}
                  alt={`Instagram ${i}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}