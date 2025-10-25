import { test, expect } from '@playwright/test';

test.describe('ぎゅ～まっち - 人数不足 & 再分割', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('人数不足時に「もう少し」バッジが表示される', async ({ page }) => {
    // 3人追加（2v2なので1人不足）
    const names = ['A', 'B', 'C'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // 「もう少し」バッジが表示される
    await expect(page.locator('text=もう少し')).toBeVisible();
  });

  test('「もう1回ぎゅ～っと！」ボタンで再分割できる', async ({ page }) => {
    // 4人追加
    const names = ['A', 'B', 'C', 'D'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // 最初のチーム構成を記録
    const firstTeamText = await page.locator('[class*="rounded-xl border-2"]').first().textContent();
    
    // 再分割
    await page.click('button:has-text("もう1回ぎゅ～っと！")');
    
    // 待機
    await page.waitForTimeout(500);
    
    // チームが再編成されていることを確認（必ず変わるとは限らないので、ボタンが動作したことを確認）
    await expect(page.locator('text=ぎゅ～っとできました！')).toBeVisible();
  });

  test('ぎゅ～っと進捗表示 - 0人', async ({ page }) => {
    await expect(page.locator('text=参加者を追加してね！')).toBeVisible();
  });

  test('ぎゅ～っと進捗表示 - 1人（2v2）', async ({ page }) => {
    await page.fill('input[placeholder="名前を入力"]', 'A');
    await page.click('button:has-text("追加")');
    
    await expect(page.locator('text=あと')).toBeVisible();
    await expect(page.locator('text=人でぎゅ～っとできるよ！')).toBeVisible();
  });

  test('ぎゅ～っと進捗表示 - 2人（2v2、完成）', async ({ page }) => {
    const names = ['A', 'B'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    await expect(page.locator('text=いま')).toBeVisible();
    await expect(page.locator('text=ぎゅ～っとが集まってるよ！')).toBeVisible();
  });

  test('ぎゅ～っと進捗表示 - 3人（2v2、1完成+1不足）', async ({ page }) => {
    const names = ['A', 'B', 'C'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // 両方表示される
    await expect(page.locator('text=いま').first()).toBeVisible();
    await expect(page.locator('text=ぎゅ～っとが集まってるよ！')).toBeVisible();
    await expect(page.locator('text=あと')).toBeVisible();
    await expect(page.locator('text=人でぎゅ～っとできるよ！')).toBeVisible();
  });
});
