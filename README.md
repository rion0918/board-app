# 📝 神戸電子2DAYS掲示板アプリ

Next.js × NestJS × GraphQL × Chakra UI を使用

---

## 🧱 技術スタック

| 区分           | 技術                                           |
| -------------- | ---------------------------------------------- |
| フロントエンド | Next.js (App Router), Apollo Client, Chakra UI |
| バックエンド   | NestJS, GraphQL (Code First), Prisma ORM       |
| データベース   | PostgreSQL                                     |
| その他         | TypeScript, pnpm                               |

---

## 🚀 開発環境の起動手順

### 1. パッケージのインストール

```bash
# フロントエンド
cd web
pnpm install

# バックエンド
cd ../service
pnpm install
```

### 2. Prisma セットアップ（DB 初期化）

```bash
pnpm prisma migrate dev --name init --schema=src/prisma/schema.prisma
```

### 3. アプリケーション起動

```bash
# バックエンド（NestJS）
cd service
pnpm run start:dev

# フロントエンド（Next.js）
cd ../web
pnpm run dev
```

### 4. アクセス URL

- フロントエンド: http://localhost:3000
- GraphQL API: http://localhost:3900/graphql

### 5. デプロイ先

- 本番環境: https://board-app-phi.vercel.app/
  ※ Render の仕様により、一定時間アクセスがない場合はバックエンドの起動に時間がかかることがあります（初回アクセス時に数十秒程度かかる場合があります）。

### 📌 メモ

- Chakra UI のテーマ定義: `web/app/providers.tsx`
- GraphQL スキーマは Code First により自動生成
- Prisma スキーマ定義: `service/src/prisma/schema.prisma`
