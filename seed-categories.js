require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('カテゴリーを作成しています...');
  
  const categories = [
    { name: 'メンズ', slug: 'mens', description: 'メンズファッション' },
    { name: 'レディース', slug: 'womens', description: 'レディースファッション' },
    { name: 'アクセサリー', slug: 'accessories', description: 'アクセサリー・小物' },
    { name: 'バッグ', slug: 'bags', description: 'バッグ・鞄' },
    { name: '時計', slug: 'watches', description: '腕時計' },
    { name: '靴', slug: 'shoes', description: 'シューズ' },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
    console.log(`✅ カテゴリー「${category.name}」を作成しました`);
  }

  console.log('\n✨ すべてのカテゴリーを作成しました！');
  
  const allCategories = await prisma.category.findMany();
  console.log('\n作成されたカテゴリー:');
  allCategories.forEach(cat => {
    console.log(`- ${cat.name} (ID: ${cat.id})`);
  });
}

main()
  .catch((e) => {
    console.error('エラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });