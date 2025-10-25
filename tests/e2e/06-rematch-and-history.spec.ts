import { test, expect } from '@playwright/test';

test.describe('ぎゅ～まっち - リマッチ回避 & 履歴削除', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('リマッチ回避をON/OFFできる', async ({ page }) => {
    // デフォルトはOFF
    const toggle = page.locator('input[type="checkbox"]').first();
    await expect(toggle).not.toBeChecked();
    
    // ONにする
    await page.locator('text=リマッチ回避設定').click();
    await expect(toggle).toBeChecked();
    
    // OFFにする
    await page.locator('text=リマッチ回避設定').click();
    await expect(toggle).not.toBeChecked();
  });

  test('直近ラウンド数を変更できる', async ({ page }) => {
    // リマッチ回避をON
    await page.locator('text=リマッチ回避設定').click();
    
    // スライダーを動かす（5に設定）
    const slider = page.locator('input[type="range"]');
    await slider.fill('5');
    
    // 値が変わることを確認
    await expect(page.locator('text=直近5ラウンドと')).toBeVisible();
  });

  test('履歴削除ダイアログが表示される', async ({ page }) => {
    // 履歴削除ボタンをクリック
    await page.click('button:has-text("ぎゅ～っとした記録を消す")');
    
    // カスタムダイアログが表示される
    await expect(page.locator('text=記録を消しますか？')).toBeVisible();
    await expect(page.locator('text=これまでのぎゅ～っとした記録が全て消えます')).toBeVisible();
  });

  test('履歴削除をキャンセルできる', async ({ page }) => {
    // ダイアログを開く
    await page.click('button:has-text("ぎゅ～っとした記録を消す")');
    
    // やめるボタンをクリック
    await page.click('button:has-text("やめる")');
    
    // ダイアログが閉じる
    await expect(page.locator('text=記録を消しますか？')).not.toBeVisible();
  });

  test('履歴削除を実行できる', async ({ page }) => {
    // まずチーム分けを実行して履歴を作る
    const names = ['A', 'B', 'C', 'D'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    await page.click('button:has-text("ぎゅ～まっちする！")');
    await page.click('button[aria-label="閉じる"]');
    
    // 履歴削除
    await page.click('button:has-text("ぎゅ～っとした記録を消す")');
    await page.click('button:has-text("消す")');
    
    // ダイアログが閉じる
    await expect(page.locator('text=記録を消しますか？')).not.toBeVisible();
  });

  test('リマッチ回避が有効な時に情報が表示される', async ({ page }) => {
    // リマッチ回避をON
    await page.locator('text=リマッチ回避設定').click();
    
    // 4人追加
    const names = ['A', 'B', 'C', 'D'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // リマッチ回避情報が表示される
    await expect(page.locator('text=リマッチ回避:')).toBeVisible();
    await expect(page.locator('text=直近')).toBeVisible();
  });
});
