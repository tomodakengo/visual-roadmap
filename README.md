# Visual Roadmap Generator

プロジェクトのロードマップを視覚的に生成・管理するためのツールです。

## 機能

- タスクの作成・編集・削除
- ドラッグ＆ドロップでのタスク移動
- タイムラインのズーム機能
- 画像としてエクスポート
- ローカルストレージでのデータ保存

## 開発環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## ビルドと実行

```bash
# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm run start
```

## GitHub Pagesへのデプロイ

このプロジェクトはGitHub Actionsを使用して自動的にGitHub Pagesにデプロイされます。

1. リポジトリの「Settings」タブを開く
2. 「Pages」セクションに移動
3. 「Build and deployment」セクションで以下を設定：
   - Source: GitHub Actions
4. mainブランチにプッシュすると自動的にデプロイが開始されます

デプロイされたアプリケーションは以下のURLで確認できます：<br>
[https://[username].github.io/visual-roadmap/](https://tomodakengo.github.io/visual-roadmap/)

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- DnD Kit
- html-to-image
