# Claude Code 自動化設定

## プロジェクト概要
高級ブランドECサイト「Fancy」の開発プロジェクト

## 技術スタック
- Next.js 14.0.4
- React 18.2.0
- Prisma ORM (SQLite)
- TypeScript
- Tailwind CSS
- NextAuth.js (認証)
- Stripe (決済)

## 自動実行コマンド

### 開発時
```bash
npm run dev        # 開発サーバー起動
npm run lint       # ESLint実行
npm run build      # ビルド
```

### データベース
```bash
prisma generate    # Prismaクライアント生成
prisma db push     # スキーマ反映
node seed-categories.js   # カテゴリシード
node seed-products.js     # 商品シード
```

### テスト
```bash
npm test          # テスト実行（設定後）
```

## 必須タスク

1. **認証システム**
   - NextAuth設定
   - ユーザー登録/ログイン
   - セッション管理

2. **商品管理**
   - 商品一覧
   - 商品詳細
   - カテゴリー/ブランド別表示
   - 検索機能

3. **カート機能**
   - カート追加/削除
   - 数量変更
   - セッション保持

4. **決済システム**
   - Stripe連携
   - チェックアウトフロー
   - 注文確認

5. **管理画面**
   - 商品管理
   - 注文管理
   - ユーザー管理

## Claude Code Hooks設定済み

- **pre-commit**: lint & build
- **post-save**: TypeScript型チェック
- **pre-build**: Prisma生成 & DB同期
- **auto-test**: テスト自動実行
- **auto-format**: コード整形

## 環境変数（.env.local）
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 現在のステータス
- ✅ 基本構造セットアップ完了
- ✅ データベーススキーマ定義済み
- ✅ ホームページ実装済み
- 🚧 商品ページ実装中
- ⏳ 認証システム未実装
- ⏳ 決済システム未実装
- ⏳ 管理画面未実装