require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 商品データの定義
const productsData = {
  'cmcfmjhuy0000iekaiudmlfxu': [ // メンズ
    {
      name: 'グッチ メンズ レザージャケット',
      description: '高級レザーを使用したスタイリッシュなジャケット。イタリア製。',
      price: 185000,
      sku: 'GUCCI-MJ-001',
      quantity: 3,
      featured: true,
    },
    {
      name: 'プラダ メンズ ナイロンジャケット',
      description: 'シグネチャーナイロン素材を使用した軽量ジャケット。',
      price: 128000,
      sku: 'PRADA-MJ-002',
      quantity: 5,
    },
    {
      name: 'バーバリー チェックシャツ',
      description: 'クラシックなバーバリーチェック柄のコットンシャツ。',
      price: 48000,
      sku: 'BURBERRY-MS-001',
      quantity: 8,
    },
    {
      name: 'ディオール メンズ Tシャツ',
      description: 'ロゴ刺繍入りのプレミアムコットンTシャツ。',
      price: 35000,
      sku: 'DIOR-MT-001',
      quantity: 10,
    },
    {
      name: 'ヴェルサーチ デニムジーンズ',
      description: 'イタリア製の高級デニム。スリムフィット。',
      price: 68000,
      sku: 'VERSACE-MJ-001',
      quantity: 6,
    },
  ],
  'cmcfmjhv20001iekagyxxtz6i': [ // レディース
    {
      name: 'シャネル ツイードジャケット',
      description: 'アイコニックなツイード素材のジャケット。フランス製。',
      price: 380000,
      sku: 'CHANEL-WJ-001',
      quantity: 2,
      featured: true,
    },
    {
      name: 'エルメス シルクブラウス',
      description: '100%シルクの高級ブラウス。エレガントなデザイン。',
      price: 158000,
      sku: 'HERMES-WB-001',
      quantity: 4,
    },
    {
      name: 'グッチ フローラルドレス',
      description: '花柄プリントが美しいシルクドレス。',
      price: 225000,
      sku: 'GUCCI-WD-001',
      quantity: 3,
    },
    {
      name: 'プラダ ナイロンスカート',
      description: 'モダンなデザインのナイロンスカート。',
      price: 88000,
      sku: 'PRADA-WS-001',
      quantity: 7,
    },
    {
      name: 'ディオール カシミアセーター',
      description: '最高級カシミア100%のセーター。',
      price: 145000,
      sku: 'DIOR-WS-001',
      quantity: 5,
    },
  ],
  'cmcfmjhv30002ieka57towd6b': [ // アクセサリー
    {
      name: 'カルティエ ラブブレスレット',
      description: 'アイコニックなラブコレクションのゴールドブレスレット。',
      price: 680000,
      sku: 'CARTIER-AB-001',
      quantity: 2,
      featured: true,
    },
    {
      name: 'ティファニー ダイヤモンドネックレス',
      description: 'プラチナとダイヤモンドのエレガントなネックレス。',
      price: 450000,
      sku: 'TIFFANY-AN-001',
      quantity: 3,
    },
    {
      name: 'ブルガリ セルペンティリング',
      description: 'セルペンティコレクションのゴールドリング。',
      price: 320000,
      sku: 'BVLGARI-AR-001',
      quantity: 4,
    },
    {
      name: 'エルメス シルクスカーフ',
      description: 'カレ90 シルク100%スカーフ。',
      price: 58000,
      sku: 'HERMES-AS-001',
      quantity: 10,
    },
    {
      name: 'グッチ レザーベルト',
      description: 'GGバックル付きレザーベルト。',
      price: 68000,
      sku: 'GUCCI-AB-001',
      quantity: 8,
    },
  ],
  'cmcfmjhv30003iekar50axpz1': [ // バッグ
    {
      name: 'エルメス バーキン30',
      description: '最高級トゴレザーのバーキンバッグ。',
      price: 1850000,
      sku: 'HERMES-BB-001',
      quantity: 1,
      featured: true,
    },
    {
      name: 'シャネル クラシックフラップバッグ',
      description: 'キャビアスキンのミディアムサイズ。',
      price: 780000,
      sku: 'CHANEL-BF-001',
      quantity: 2,
    },
    {
      name: 'ルイヴィトン スピーディ30',
      description: 'モノグラムキャンバスの定番バッグ。',
      price: 185000,
      sku: 'LV-BS-001',
      quantity: 5,
    },
    {
      name: 'グッチ ディオニュソス',
      description: 'GGスプリームキャンバスのショルダーバッグ。',
      price: 280000,
      sku: 'GUCCI-BD-001',
      quantity: 3,
    },
    {
      name: 'プラダ ガレリア',
      description: 'サフィアーノレザーのトートバッグ。',
      price: 320000,
      sku: 'PRADA-BG-001',
      quantity: 4,
    },
  ],
  'cmcfmjhv50004iekaz9qhj4nz': [ // 時計
    {
      name: 'ロレックス デイトナ',
      description: 'ステンレススチール クロノグラフ。',
      price: 2850000,
      sku: 'ROLEX-WD-001',
      quantity: 1,
      featured: true,
    },
    {
      name: 'オメガ スピードマスター',
      description: 'ムーンウォッチ プロフェッショナル。',
      price: 680000,
      sku: 'OMEGA-WS-001',
      quantity: 2,
    },
    {
      name: 'カルティエ タンク',
      description: 'クラシックなレクタンギュラーウォッチ。',
      price: 480000,
      sku: 'CARTIER-WT-001',
      quantity: 3,
    },
    {
      name: 'パテックフィリップ カラトラバ',
      description: 'エレガントなドレスウォッチ。',
      price: 3200000,
      sku: 'PP-WC-001',
      quantity: 1,
    },
    {
      name: 'ブルガリ オクト',
      description: 'モダンなイタリアンデザイン。',
      price: 580000,
      sku: 'BVLGARI-WO-001',
      quantity: 2,
    },
  ],
  'cmcfmjhv50005ieka7vqra2p6': [ // 靴
    {
      name: 'クリスチャンルブタン パンプス',
      description: 'レッドソールのアイコニックなハイヒール。',
      price: 128000,
      sku: 'LOUBOUTIN-SP-001',
      quantity: 4,
      featured: true,
    },
    {
      name: 'グッチ レザーローファー',
      description: 'ホースビット付きレザーローファー。',
      price: 98000,
      sku: 'GUCCI-SL-001',
      quantity: 6,
    },
    {
      name: 'プラダ スニーカー',
      description: 'ロゴ入りレザースニーカー。',
      price: 88000,
      sku: 'PRADA-SS-001',
      quantity: 8,
    },
    {
      name: 'バレンシアガ トリプルS',
      description: 'アイコニックなダッドスニーカー。',
      price: 145000,
      sku: 'BALENCIAGA-ST-001',
      quantity: 5,
    },
    {
      name: 'ジミーチュウ サンダル',
      description: 'クリスタル装飾のエレガントなサンダル。',
      price: 118000,
      sku: 'JIMMYCHOO-SS-001',
      quantity: 3,
    },
  ],
};

async function generateSlug(name) {
  // 日本語を含む文字列をslug化
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Date.now();
}

async function main() {
  console.log('商品データを作成しています...\n');

  let totalCreated = 0;

  for (const [categoryId, products] of Object.entries(productsData)) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      console.log(`カテゴリーID ${categoryId} が見つかりません。スキップします。`);
      continue;
    }

    console.log(`\n【${category.name}】カテゴリーの商品を追加中...`);

    for (const productData of products) {
      try {
        const slug = await generateSlug(productData.name);
        const product = await prisma.product.create({
          data: {
            ...productData,
            slug,
            categoryId,
            active: true,
            images: {
              create: [
                {
                  url: `https://via.placeholder.com/800x800?text=${encodeURIComponent(productData.name)}`,
                  alt: productData.name,
                  order: 0,
                },
              ],
            },
          },
          include: {
            category: true,
          },
        });

        console.log(`✅ ${product.name} (¥${product.price.toLocaleString()})`);
        totalCreated++;
      } catch (error) {
        console.error(`❌ エラー: ${productData.name} - ${error.message}`);
      }
    }
  }

  console.log(`\n✨ 合計 ${totalCreated} 個の商品を作成しました！`);

  // 作成した商品の統計を表示
  const stats = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: {
      id: true,
    },
  });

  console.log('\n📊 カテゴリー別商品数:');
  for (const stat of stats) {
    const category = await prisma.category.findUnique({
      where: { id: stat.categoryId },
    });
    console.log(`- ${category.name}: ${stat._count.id}個`);
  }
}

main()
  .catch((e) => {
    console.error('エラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });