import { test, expect } from '@playwright/test';

test.describe('ぎゅ～まっち - 参加者管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // LocalStorageをクリア
    await page.evaluate(() => localStorage.clear());
  });

  test('参加者を追加できる', async ({ page }) => {
    // 名前を入力
    await page.fill('input[placeholder="名前を入力"]', 'テスト太郎');
    await page.click('button:has-text("追加")');
    
    // 追加されたことを確認
    await expect(page.locator('text=テスト太郎')).toBeVisible();
    
    // 参加者数が表示される
    await expect(page.locator('text=(1名)')).toBeVisible();
  });

  test('複数の参加者を追加できる', async ({ page }) => {
    const names = ['太郎', '花子', '次郎', '三郎'];
    
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // 全員表示されることを確認
    for (const name of names) {
      await expect(page.locator(`text=${name}`)).toBeVisible();
    }
    
    // 参加者数確認
    await expect(page.locator('text=(4名)')).toBeVisible();
  });

  test('参加者を削除できる', async ({ page }) => {
    // 追加
    await page.fill('input[placeholder="名前を入力"]', '削除される人');
    await page.click('button:has-text("追加")');
    
    // 削除ボタンをクリック
    await page.locator('button[aria-label="削除"]').first().click();
    
    // 削除されたことを確認
    await expect(page.locator('text=削除される人')).not.toBeVisible();
    await expect(page.locator('text=参加者がいません')).toBeVisible();
  });

  test('空の名前は追加できない', async ({ page }) => {
    await page.click('button:has-text("追加")');
    
    // 何も追加されない
    await expect(page.locator('text=参加者がいません')).toBeVisible();
  });
});
