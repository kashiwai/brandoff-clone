# Fancy - Luxury Brand EC Site

高級ブランド専門のECサイト

## 技術スタック

- **Framework**: Next.js 14.0.4
- **UI**: React 18.2 + Tailwind CSS
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Deployment**: Vercel

## セットアップ

### 開発環境

1. **依存関係のインストール**
```bash
npm install
```

2. **環境変数の設定**
`.env.local`ファイルを作成し、以下の変数を設定:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

3. **データベースのセットアップ**
```bash
npx prisma generate
npx prisma db push
node seed-categories.js
node seed-products.js
```

4. **開発サーバーの起動**
```bash
npm run dev
```

## Vercelへのデプロイ

### 1. Vercel Postgresの設定

Vercelダッシュボードで:
1. Storage → Create Database → Postgres を選択
2. データベースを作成
3. 環境変数が自動的に追加される

### 2. 環境変数の設定

Vercelのプロジェクト設定で以下の環境変数を追加:

- `NEXTAUTH_URL`: https://your-domain.vercel.app
- `NEXTAUTH_SECRET`: ランダムな文字列（`openssl rand -base64 32`で生成）
- `STRIPE_PUBLIC_KEY`: Stripeの公開キー
- `STRIPE_SECRET_KEY`: Stripeのシークレットキー

### 3. デプロイ

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel

# 本番環境へデプロイ
vercel --prod
```

## 機能

### 実装済み
- ✅ 商品一覧・詳細表示
- ✅ カテゴリー別表示
- ✅ 商品検索
- ✅ レスポンシブデザイン
- ✅ データベーススキーマ
- ✅ NextAuth認証設定

### 開発中
- 🚧 カート機能
- 🚧 チェックアウト（Stripe決済）
- 🚧 ユーザー登録・ログイン
- 🚧 注文管理
- 🚧 管理画面

## プロジェクト構造

```
brandoff-clone/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # APIルート
│   │   ├── products/     # 商品ページ
│   │   ├── cart/         # カート
│   │   └── checkout/     # チェックアウト
│   ├── components/       # Reactコンポーネント
│   └── lib/             # ユーティリティ
├── prisma/
│   └── schema.prisma    # データベーススキーマ
└── public/              # 静的ファイル
```

## スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番用ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - ESLint実行

## ライセンス

Private