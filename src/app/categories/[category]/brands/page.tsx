import Link from 'next/link';
import Image from 'next/image';

// ブランドデータ（実際のプロジェクトではAPIから取得）
const brands = [
  // ラグジュアリーブランド
  { id: '1', name: 'Louis Vuitton', slug: 'louis-vuitton', country: 'France', logo: '🇫🇷' },
  { id: '2', name: 'Hermès', slug: 'hermes', country: 'France', logo: '🇫🇷' },
  { id: '3', name: 'Chanel', slug: 'chanel', country: 'France', logo: '🇫🇷' },
  { id: '4', name: 'Gucci', slug: 'gucci', country: 'Italy', logo: '🇮🇹' },
  { id: '5', name: 'Prada', slug: 'prada', country: 'Italy', logo: '🇮🇹' },
  { id: '6', name: 'Dior', slug: 'dior', country: 'France', logo: '🇫🇷' },
  { id: '7', name: 'Balenciaga', slug: 'balenciaga', country: 'Spain', logo: '🇪🇸' },
  { id: '8', name: 'Saint Laurent', slug: 'saint-laurent', country: 'France', logo: '🇫🇷' },
  { id: '9', name: 'Bottega Veneta', slug: 'bottega-veneta', country: 'Italy', logo: '🇮🇹' },
  { id: '10', name: 'Burberry', slug: 'burberry', country: 'UK', logo: '🇬🇧' },
  { id: '11', name: 'Fendi', slug: 'fendi', country: 'Italy', logo: '🇮🇹' },
  { id: '12', name: 'Celine', slug: 'celine', country: 'France', logo: '🇫🇷' },
  { id: '13', name: 'Valentino', slug: 'valentino', country: 'Italy', logo: '🇮🇹' },
  { id: '14', name: 'Givenchy', slug: 'givenchy', country: 'France', logo: '🇫🇷' },
  { id: '15', name: 'Versace', slug: 'versace', country: 'Italy', logo: '🇮🇹' },
  // 時計ブランド
  { id: '16', name: 'Rolex', slug: 'rolex', country: 'Switzerland', logo: '🇨🇭' },
  { id: '17', name: 'Omega', slug: 'omega', country: 'Switzerland', logo: '🇨🇭' },
  { id: '18', name: 'Cartier', slug: 'cartier', country: 'France', logo: '🇫🇷' },
  { id: '19', name: 'Patek Philippe', slug: 'patek-philippe', country: 'Switzerland', logo: '🇨🇭' },
  // ジュエリーブランド
  { id: '20', name: 'Tiffany & Co.', slug: 'tiffany', country: 'USA', logo: '🇺🇸' },
  { id: '21', name: 'Bulgari', slug: 'bulgari', country: 'Italy', logo: '🇮🇹' },
];

const categoryNames: { [key: string]: string } = {
  'bags': 'バッグ',
  'shoes': '靴',
  'watches': '時計',
  'jewelry': 'ジュエリー',
  'accessories': 'アクセサリー',
  'clothing': '洋服'
};

export default function BrandsPage({ params }: { params: { category: string } }) {
  const categoryName = categoryNames[params.category] || params.category;

  // カテゴリーに応じてブランドをフィルタリング（実際のプロジェクトではAPIで行う）
  const filteredBrands = params.category === 'watches' 
    ? brands.filter(b => ['Rolex', 'Omega', 'Cartier', 'Patek Philippe'].includes(b.name))
    : params.category === 'jewelry'
    ? brands.filter(b => ['Cartier', 'Tiffany & Co.', 'Bulgari', 'Hermès', 'Chanel'].includes(b.name))
    : brands.filter(b => !['Rolex', 'Omega', 'Patek Philippe'].includes(b.name));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/categories" className="hover:text-gray-900">カテゴリー</Link>
            <span>/</span>
            <span className="text-gray-900">{categoryName}</span>
          </nav>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ブランドを選択</h1>
          <p className="text-lg text-gray-600">
            {categoryName}の人気ブランドからお選びください
          </p>
        </div>

        {/* 人気ブランド */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">人気ブランド</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBrands.slice(0, 8).map((brand) => (
              <Link
                key={brand.id}
                href={`/products?category=${params.category}&brand=${brand.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-2">{brand.logo}</div>
                <h3 className="font-semibold text-lg">{brand.name}</h3>
                <p className="text-sm text-gray-500">{brand.country}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* すべてのブランド */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">すべてのブランド</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/products?category=${params.category}&brand=${brand.slug}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{brand.logo}</span>
                    <div>
                      <h3 className="font-medium">{brand.name}</h3>
                      <p className="text-sm text-gray-500">{brand.country}</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <Link
            href="/categories"
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
            カテゴリーに戻る
          </Link>

          <Link
            href={`/products?category=${params.category}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            {categoryName}のすべての商品を見る
            <svg
              className="w-5 h-5 ml-2"
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
          </Link>
        </div>
      </div>
    </div>
  );
}