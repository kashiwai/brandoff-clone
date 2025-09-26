const { PrismaClient } = require('@prisma/client');
const luxuryData = require('../data/luxury-brands.json');

const prisma = new PrismaClient();

// 商品名のパターン
const productPatterns = {
  'バッグ': [
    { name: 'Classic Flap Bag', variants: ['Small', 'Medium', 'Large'] },
    { name: 'Tote Bag', variants: ['PM', 'MM', 'GM'] },
    { name: 'Shoulder Bag', variants: ['Mini', 'Small', 'Medium'] },
    { name: 'Crossbody Bag', variants: ['Compact', 'Regular'] },
    { name: 'Clutch', variants: ['Evening', 'Day'] },
    { name: 'Backpack', variants: ['Small', 'Large'] },
    { name: 'Hobo Bag', variants: ['Small', 'Medium'] },
  ],
  '財布': [
    { name: 'Long Wallet', variants: ['Zip', 'Flap'] },
    { name: 'Compact Wallet', variants: ['Bifold', 'Trifold'] },
    { name: 'Card Holder', variants: ['4 Slots', '6 Slots'] },
    { name: 'Coin Purse', variants: ['Round', 'Square'] },
  ],
  'アクセサリー': [
    { name: 'Belt', variants: ['30mm', '35mm', '40mm'] },
    { name: 'Scarf', variants: ['90cm', '120cm'] },
    { name: 'Keychain', variants: ['Charm', 'Ring'] },
    { name: 'Bracelet', variants: ['Leather', 'Chain'] },
  ],
  'シューズ': [
    { name: 'Sneakers', variants: ['Low-top', 'High-top'] },
    { name: 'Loafers', variants: ['Classic', 'Platform'] },
    { name: 'Boots', variants: ['Ankle', 'Knee-high'] },
    { name: 'Pumps', variants: ['85mm', '100mm'] },
  ]
};

// 価格を生成（ブランドによって異なる価格帯）
const getPriceByBrand = (brandSlug, category) => {
  const priceRanges = {
    'hermes': { base: 800000, multiplier: 3 },
    'chanel': { base: 500000, multiplier: 2.5 },
    'louis-vuitton': { base: 200000, multiplier: 2 },
    'dior': { base: 350000, multiplier: 2.2 },
    'gucci': { base: 180000, multiplier: 1.8 },
    'prada': { base: 150000, multiplier: 1.7 },
    'saint-laurent': { base: 200000, multiplier: 1.9 },
    'bottega-veneta': { base: 250000, multiplier: 2 },
    'celine': { base: 280000, multiplier: 2.1 },
    'balenciaga': { base: 180000, multiplier: 1.8 }
  };

  const range = priceRanges[brandSlug] || { base: 100000, multiplier: 1.5 };
  const basePrice = range.base;
  const variance = Math.random() * range.multiplier;

  return Math.floor(basePrice * (1 + variance));
};

// 商品の状態
const conditions = ['新品', '未使用', '美品', '良品'];
const years = [2020, 2021, 2022, 2023, 2024];

async function seedLuxuryProducts() {
  try {
    console.log('🎨 高級ブランド商品をシード中...');

    // カテゴリーを取得または作成
    const categories = {};
    for (const categoryName of ['バッグ', '財布', 'アクセサリー', 'シューズ']) {
      let category = await prisma.category.findFirst({
        where: { name: categoryName }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: categoryName.toLowerCase(),
            description: `高級ブランドの${categoryName}`,
          }
        });
      }
      categories[categoryName] = category;
    }

    // ブランドを作成
    for (const brandData of luxuryData.brands) {
      console.log(`\n📦 ${brandData.name} の商品を作成中...`);

      // ブランドを作成または取得
      let brand = await prisma.brand.findFirst({
        where: { name: brandData.name }
      });

      if (!brand) {
        brand = await prisma.brand.create({
          data: {
            name: brandData.name,
            slug: brandData.slug,
            description: brandData.description,
            country: brandData.country,
            featured: true,
          }
        });
      }

      // 各カテゴリーの商品を作成
      for (const categoryName of brandData.categories.slice(0, 3)) {
        const category = categories[categoryName];
        if (!category) continue;

        const patterns = productPatterns[categoryName] || [];

        for (let i = 0; i < Math.min(patterns.length, 3); i++) {
          const pattern = patterns[i];
          const condition = conditions[Math.floor(Math.random() * conditions.length)];
          const year = years[Math.floor(Math.random() * years.length)];

          for (const variant of pattern.variants.slice(0, 2)) {
            const productName = `${brandData.name} ${pattern.name} ${variant}`;
            const sku = `${brandData.slug.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const price = getPriceByBrand(brandData.slug, categoryName);

            try {
              const product = await prisma.product.create({
                data: {
                  name: productName,
                  slug: productName.toLowerCase().replace(/\s+/g, '-'),
                  description: `${brandData.name}の${year}年製${pattern.name}。${condition}、${variant}サイズ。${brandData.description}`,
                  price: price,
                  compareAt: Math.floor(price * 1.2),
                  cost: Math.floor(price * 0.6),
                  sku: sku,
                  quantity: Math.floor(Math.random() * 5) + 1,
                  active: true,
                  featured: Math.random() > 0.7,
                  categoryId: category.id,
                  brandId: brand.id,
                  images: {
                    create: [
                      {
                        url: luxuryData.imageUrls[categoryName === 'バッグ' ? 'bags' :
                             categoryName === '財布' ? 'wallets' :
                             categoryName === 'シューズ' ? 'shoes' : 'accessories']
                             [Math.floor(Math.random() * 2)] || luxuryData.imageUrls.placeholder,
                        alt: productName,
                        order: 0
                      }
                    ]
                  }
                }
              });

              console.log(`  ✅ ${productName} - ¥${price.toLocaleString()}`);
            } catch (error) {
              console.error(`  ❌ エラー: ${productName}`, error.message);
            }
          }
        }
      }
    }

    console.log('\n✨ 高級ブランド商品のシードが完了しました！');
  } catch (error) {
    console.error('シード中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプト実行
seedLuxuryProducts();