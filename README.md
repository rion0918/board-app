# 📝 神戸電子7DAYS掲示板アプリ

Next.js × NestJS × GraphQL × Chakra UI で構成されたシンプルな掲示板アプリです。

---

## 🧱 使用スタック

| 領域       | 技術構成                                         |
|------------|--------------------------------------------------|
| フロント   | Next.js (App Router) / Apollo Client / Chakra UI |
| バックエンド | NestJS / GraphQL (Code First) / Prisma ORM       |
| データベース | PostgreSQL                                       |
| その他     | TypeScript / pnpm / Emotion / Framer Motion       |

---

## 🚀 起動手順

### 1. パッケージインストール


# フロントエンド
cd web
pnpm install

# バックエンド
cd ../service
pnpm install

### 2. Prisma セットアップ（DB & Client）
pnpm prisma migrate dev --name init --schema=src/prisma/schema.prisma

### 3. サーバー起動
# バックエンド（NestJS）
cd service
pnpm run start:dev

# フロントエンド（Next.js）
cd ../web
pnpm run dev

### 4. URL 一覧
•	フロントエンド: http://localhost:3000
•	GraphQL API: http://localhost:3900/graphql

### メモ
•	Chakra UI テーマは app/providers.tsx にて定義
•	GraphQL スキーマは Code First で自動生成
•	Prisma スキーマ：src/prisma/schema.prisma
```bash