# このアプリの概要 「NOTE-STACKS」

PHP + React + MariaDB + Docker で作成したメモアプリで、ユーザー登録、ログイン、ノート作成、一覧表示、更新、削除ができます。
フロントエンド　＋　バックエンド　＋　DB の設計・実装を学ぶために作成しました。

## 使用技術

- PHP
- React
- Vite
- MariaDB
- Docker
- phpMyAdmin

## 主な機能

- ユーザー新規登録
- ログイン / ログアウト
- ノート作成
- ノート一覧表示
- ノート更新
- ノート削除

## 起動方法

1. `.env.example` を参考に `.env` を作成してください。

```env
MARIADB_ROOT_PASSWORD=rootpass
MARIADB_DATABASE=notes_app
MARIADB_USER=appuser
MARIADB_PASSWORD=apppass
```

2. Docker を起動する

```bash
docker compose up --build
```

3. フロントエンドを起動する

```bash
cd frontend
npm install
npm run dev
```

## アクセス先
PHP API: http://localhost:8000
React: http://localhost:5173
phpMyAdmin: http://localhost:8080


## 今後の改善点
バリデーションの改善
UI の改善
2段階認証の導入
エラーハンドリングの整理
環境変数や設定管理の整理

```
