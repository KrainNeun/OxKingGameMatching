# OxKing Game Matching - チーム分けツール

ネット対戦ゲーム用の自動チーム分けWebアプリケーション（MVP版）

## 機能

- **柔軟なフォーマット**: 2v2, 3v3, 4v4, 5v5, 6v6 に対応
- **観戦者管理**: 観戦希望者をチーム分けから除外可能
- **制約設定**: 特定のペアを「同チーム」または「別チーム」に指定
- **リマッチ回避**: 直近の対戦履歴を考慮して同じチーム分けを回避
- **高速処理**: 3秒以内でチーム生成
- **視覚的表示**: 色分けされたチームカード

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **LocalStorage** (履歴保存)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 3. ビルド

```bash
npm run build
npm start
```

## 使い方

### 1. ルーム設定

1. フォーマット（2v2〜6v6）を選択
2. リマッチ回避を有効化（オプション）
3. 参加者を追加
   - 1人ずつ追加
   - 一括貼り付け（改行区切り）
4. 観戦者は「観戦」チェックボックスをON

### 2. 制約設定（オプション）

- 特定のペアを「同チーム」または「別チーム」に設定可能
- ドロップダウンから2名を選択して種別を指定

### 3. 実行

「チーム分けを実行」ボタンをクリック

### 4. 結果確認

- 色分けされたチーム一覧が表示
- 人数不足のチームには警告表示
- 「再分割」ボタンで別のチーム分けを試せます

## ディレクトリ構造

```
src/
├── app/                # Next.js App Router
│   ├── layout.tsx     # ルートレイアウト
│   ├── page.tsx       # メインページ
│   └── globals.css    # グローバルスタイル
├── components/         # UIコンポーネント
│   ├── FormatSelector.tsx
│   ├── RematchAvoidanceSettings.tsx
│   ├── ParticipantList.tsx
│   ├── ConstraintList.tsx
│   ├── ProcessingScreen.tsx
│   └── TeamResult.tsx
├── hooks/              # カスタムフック
│   └── useTeamDivision.ts
├── lib/                # ロジック
│   ├── teamDivision.ts  # チーム分割アルゴリズム
│   └── storage.ts       # LocalStorage管理
└── types/              # TypeScript型定義
    └── index.ts
```

## 今後の拡張予定

- [ ] PWA対応
- [ ] 画像/テキスト共有機能
- [ ] スキルスコア導入
- [ ] Discord連携
- [ ] チーム履歴の保存・再利用

## ライセンス

MIT
