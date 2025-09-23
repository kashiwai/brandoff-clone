require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 実際の商品画像URL（Unsplashから高品質な画像を使用）
const productImages = {
  // メンズ
  'GUCCI-MJ-001': 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&h=800&fit=crop',
  'PRADA-MJ-002': 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&h=800&fit=crop',
  'BURBERRY-MS-001': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop',
  'DIOR-MT-001': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop',
  'VERSACE-MJ-001': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',

  // レディース
  'CHANEL-WJ-001': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
  'HERMES-WB-001': 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&h=800&fit=crop',
  'GUCCI-WD-001': 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=800&fit=crop',
  'PRADA-WS-001': 'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800&h=800&fit=crop',
  'DIOR-WS-001': 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&h=800&fit=crop',

  // アクセサリー
  'CARTIER-AB-001': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
  'TIFFANY-AN-001': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'BVLGARI-AR-001': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'HERMES-AS-001': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
  'GUCCI-AB-001': 'https://images.unsplash.com/photo-1624006389438-c03488175975?w=800&h=800&fit=crop',

  // バッグ
  'HERMES-BB-001': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
  'CHANEL-BF-001': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
  'LV-BS-001': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=800&fit=crop',
  'GUCCI-BD-001': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
  'PRADA-BG-001': 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=800&fit=crop',

  // 時計
  'ROLEX-WD-001': 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=800&h=800&fit=crop',
  'OMEGA-WS-001': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
  'CARTIER-WT-001': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
  'PP-WC-001': 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&h=800&fit=crop',
  'BVLGARI-WO-001': 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop',

  // 靴
  'LOUBOUTIN-SP-001': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
  'GUCCI-SL-001': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop',
  'PRADA-SS-001': 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop',
  'BALENCIAGA-ST-001': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop',
  'JIMMYCHOO-SS-001': 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800&h=800&fit=crop',
};

async function updateProductImages() {
  console.log('商品画像を更新しています...\n');

  for (const [sku, imageUrl] of Object.entries(productImages)) {
    try {
      // 商品を検索
      const product = await prisma.product.findUnique({
        where: { sku },
        include: { images: true },
      });

      if (!product) {
        console.log(`❌ SKU ${sku} の商品が見つかりません`);
        continue;
      }

      // 既存の画像を削除
      if (product.images.length > 0) {
        await prisma.image.deleteMany({
          where: { productId: product.id },
        });
      }

      // 新しい画像を追加
      await prisma.image.create({
        data: {
          productId: product.id,
          url: imageUrl,
          alt: product.name,
          order: 0,
        },
      });

      console.log(`✅ ${product.name} の画像を更新しました`);
    } catch (error) {
      console.error(`❌ エラー (${sku}):`, error.message);
    }
  }

  console.log('\n✨ 画像の更新が完了しました！');
}

updateProductImages()
  .catch((e) => {
    console.error('エラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });