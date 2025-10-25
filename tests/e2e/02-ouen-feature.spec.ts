import { test, expect } from '@playwright/test';

test.describe('ぎゅ～まっち - おうえん機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('おうえんトグルが動作する', async ({ page }) => {
    // 参加者追加
    await page.fill('input[placeholder="名前を入力"]', '観戦者');
    await page.click('button:has-text("追加")');
    
    // おうえんトグルをクリック
    await page.locator('text=おうえん').first().click();
    
    // 背景がグレーになる（bg-slate-50クラスがつく）
    const participantCard = page.locator('text=観戦者').locator('..');
    await expect(participantCard).toHaveClass(/bg-slate-50/);
  });

  test('おうえんの人は参加者数から除外される', async ({ page }) => {
    // 2人追加
    await page.fill('input[placeholder="名前を入力"]', '参加者A');
    await page.click('button:has-text("追加")');
    
    await page.fill('input[placeholder="名前を入力"]', '観戦者B');
    await page.click('button:has-text("追加")');
    
    // 最初は2名
    await expect(page.locator('text=(2名)')).toBeVisible();
    
    // 1人をおうえんに
    await page.locator('text=おうえん').last().click();
    
    // 1名になる
    await expect(page.locator('text=(1名)')).toBeVisible();
  });

  test('全員おうえんだと警告が出る', async ({ page }) => {
    // 参加者追加
    await page.fill('input[placeholder="名前を入力"]', '観戦者A');
    await page.click('button:has-text("追加")');
    
    // おうえんに設定
    await page.locator('text=おうえん').click();
    
    // ボタンが無効化される
    const button = page.locator('button:has-text("ぎゅ～っとする人がいないよ")');
    await expect(button).toBeDisabled();
    
    // 警告メッセージ
    await expect(page.locator('text=全員が観戦になっています')).toBeVisible();
  });

  test('結果画面でおうえんセクションに表示される', async ({ page }) => {
    // 参加者4名追加（2名は観戦）
    const participants = ['A', 'B', 'C', 'D'];
    for (const name of participants) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // CとDをおうえんに
    const toggles = page.locator('text=おうえん');
    await toggles.nth(2).click();
    await toggles.nth(3).click();
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // 結果確認
    await expect(page.locator('text=おうえん (2)')).toBeVisible();
    await expect(page.locator('text=C').last()).toBeVisible();
    await expect(page.locator('text=D').last()).toBeVisible();
  });
});
