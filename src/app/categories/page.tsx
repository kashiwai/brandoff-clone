import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'bags',
    name: 'バッグ',
    slug: 'bags',
    description: 'ハンドバッグ、ショルダーバッグ、トートバッグなど',
    image: '/images/categories/bags.jpg',
    icon: '👜'
  },
  {
    id: 'shoes',
    name: '靴',
    slug: 'shoes',
    description: 'スニーカー、パンプス、ブーツ、サンダルなど',
    image: '/images/categories/shoes.jpg',
    icon: '👟'
  },
  {
    id: 'watches',
    name: '時計',
    slug: 'watches',
    description: '腕時計、スマートウォッチなど',
    image: '/images/categories/watches.jpg',
    icon: '⌚'
  },
  {
    id: 'jewelry',
    name: 'ジュエリー',
    slug: 'jewelry',
    description: 'ネックレス、リング、ピアス、ブレスレットなど',
    image: '/images/categories/jewelry.jpg',
    icon: '💎'
  },
  {
    id: 'accessories',
    name: 'アクセサリー',
    slug: 'accessories',
    description: '財布、ベルト、スカーフ、サングラスなど',
    image: '/images/categories/accessories.jpg',
    icon: '🕶️'
  },
  {
    id: 'clothing',
    name: '洋服',
    slug: 'clothing',
    description: 'トップス、ボトムス、アウター、ドレスなど',
    image: '/images/categories/clothing.jpg',
    icon: '👔'
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">カテゴリーを選択</h1>
          <p className="text-lg text-gray-600">
            お探しのアイテムのカテゴリーをお選びください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}/brands`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="relative h-64 bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">{category.icon}</span>
                  </div>
                  {/* 実際の画像がある場合はここに表示 */}
                  {/* <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  /> */}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                  </h2>
                  <p className="text-gray-600">{category.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    <span>ブランドを選択</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            すべての商品を見る
          </Link>
        </div>
      </div>
    </div>
  );
}