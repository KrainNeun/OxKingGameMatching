# ぎゅ～まっち 🍓 E2Eテストガイド

## 📦 セットアップ

### 1. Playwrightをインストール

```bash
npm install
npx playwright install
```

これで、Chromium、Firefox、Webkitの3つのブラウザがインストールされます。

---

## 🧪 テストの実行

### すべてのテストを実行（ヘッドレスモード）

```bash
npm run test:e2e
```

### UIモードで実行（おすすめ！視覚的に確認できる）

```bash
npm run test:e2e:ui
```

### ブラウザを表示して実行

```bash
npm run test:e2e:headed
```

### 特定のテストファイルだけ実行

```bash
npx playwright test tests/e2e/01-participant-management.spec.ts
```

### 特定のブラウザだけでテスト

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## 📋 テストファイル一覧

| ファイル | テスト内容 |
|---------|----------|
| `01-participant-management.spec.ts` | 参加者の追加・削除 |
| `02-ouen-feature.spec.ts` | おうえん機能 |
| `03-pair-constraints.spec.ts` | ぎゅっと/ばらっと制約 |
| `04-team-division.spec.ts` | チーム分け基本機能 |
| `05-shortage-and-redivide.spec.ts` | 人数不足 & 再分割 |
| `06-rematch-and-history.spec.ts` | リマッチ回避 & 履歴削除 |

---

## 📊 テストレポート

テスト実行後、HTMLレポートが自動生成されます：

```bash
npx playwright show-report
```

ブラウザで詳細なテスト結果を確認できます。

---

## 🐛 デバッグ

### デバッグモードでテスト実行

```bash
npx playwright test --debug
```

### 特定のテストをデバッグ

```bash
npx playwright test tests/e2e/01-participant-management.spec.ts --debug
```

### スクリーンショットを確認

テスト失敗時、自動でスクリーンショットが保存されます：
`test-results/` フォルダ内

---

## ✅ テスト内容詳細

### 01. 参加者管理
- ✅ 参加者を追加できる
- ✅ 複数の参加者を追加できる
- ✅ 参加者を削除できる
- ✅ 空の名前は追加できない

### 02. おうえん機能
- ✅ おうえんトグルが動作する
- ✅ おうえんの人は参加者数から除外される
- ✅ 全員おうえんだと警告が出る
- ✅ 結果画面でおうえんセクションに表示される

### 03. ペア制約
- ✅ ぎゅっと制約を設定できる
- ✅ ばらっと制約を設定できる
- ✅ ペアを削除できる
- ✅ 同じ人はペア設定できない
- ✅ ぎゅっと制約が適用される
- ✅ ばらっと制約が適用される

### 04. チーム分け基本
- ✅ 参加者がいない時はボタンが無効
- ✅ 2v2で4人のチーム分けができる
- ✅ 3v3で6人のチーム分けができる
- ✅ フルーツチームが表示される
- ✅ モーダルを閉じることができる

### 05. 人数不足 & 再分割
- ✅ 人数不足時に「もう少し」バッジが表示される
- ✅ 「もう1回ぎゅ～っと！」ボタンで再分割できる
- ✅ ぎゅ～っと進捗表示（0人/1人/2人/3人）

### 06. リマッチ回避 & 履歴削除
- ✅ リマッチ回避をON/OFFできる
- ✅ 直近ラウンド数を変更できる
- ✅ 履歴削除ダイアログが表示される
- ✅ 履歴削除をキャンセルできる
- ✅ 履歴削除を実行できる
- ✅ リマッチ回避が有効な時に情報が表示される

---

## 🎨 CI/CDでの実行

GitHub Actionsなどで実行する場合：

```yaml
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps
  
- name: Run tests
  run: npm run test:e2e
```

---

## 💡 Tips

### テストが失敗した時
1. `test-results/` フォルダのスクリーンショットを確認
2. `npx playwright show-report` でHTMLレポートを見る
3. `--debug` オプションで1ステップずつ実行

### テストを書く時
- `test.only()` で特定のテストだけ実行
- `test.skip()` でテストをスキップ
- `page.pause()` でブレークポイント設定

---

## 🚀 次のステップ

- [ ] より多くのエッジケースをテスト
- [ ] ビジュアルリグレッションテストの追加
- [ ] パフォーマンステストの追加

Happy Testing! 🎉
