require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

console.log('データベースをセットアップしています...');

try {
  // Prismaクライアントを生成
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // データベースをプッシュ
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ データベースのセットアップが完了しました！');
} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
}