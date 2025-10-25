import { test, expect } from '@playwright/test';

test.describe('ぎゅ～まっち - ペア制約（ぎゅっと/ばらっと）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    // 4人追加
    const names = ['A', 'B', 'C', 'D'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
  });

  test('ぎゅっと制約を設定できる', async ({ page }) => {
    // プルダウンから選択
    await page.locator('select').first().selectOption({ label: 'A' });
    await page.locator('select').last().selectOption({ label: 'B' });
    
    // ぎゅっとを選択（デフォルト）
    await page.click('button:has-text("ぎゅっと")');
    
    // 「これで決まり！」ボタンをクリック
    await page.click('button:has-text("これで決まり！")');
    
    // ペアが表示される
    await expect(page.locator('text=A').nth(1)).toBeVisible(); // リスト内のA
    await expect(page.locator('text=B').nth(1)).toBeVisible(); // リスト内のB
    await expect(page.locator('text=ぎゅっと')).toBeVisible();
  });

  test('ばらっと制約を設定できる', async ({ page }) => {
    // プルダウンから選択
    await page.locator('select').first().selectOption({ label: 'C' });
    await page.locator('select').last().selectOption({ label: 'D' });
    
    // ばらっとを選択
    await page.click('button:has-text("ばらっと")');
    
    // 「これで決まり！」ボタンをクリック
    await page.click('button:has-text("これで決まり！")');
    
    // ペアが表示される
    await expect(page.locator('text=ばらっと')).toBeVisible();
  });

  test('ペアを削除できる', async ({ page }) => {
    // ペア設定
    await page.locator('select').first().selectOption({ label: 'A' });
    await page.locator('select').last().selectOption({ label: 'B' });
    await page.click('button:has-text("これで決まり！")');
    
    // 削除ボタンをクリック
    await page.locator('button[aria-label="削除"]').nth(4).click(); // 参加者4人分スキップ
    
    // 削除されたことを確認
    await expect(page.locator('text=制約なし')).toBeVisible();
  });

  test('同じ人はペア設定できない', async ({ page }) => {
    // 同じ人を選択
    await page.locator('select').first().selectOption({ label: 'A' });
    await page.locator('select').last().selectOption({ label: 'A' });
    
    // ボタンが無効
    await expect(page.locator('button:has-text("これで決まり！")')).toBeDisabled();
  });

  test('ぎゅっと制約が適用される', async ({ page }) => {
    // A-B ぎゅっと設定
    await page.locator('select').first().selectOption({ label: 'A' });
    await page.locator('select').last().selectOption({ label: 'B' });
    await page.click('button:has-text("これで決まり！")');
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // AとBが同じチームにいることを確認
    await expect(page.locator('text=ぎゅ～っとできました！')).toBeVisible();
    
    // チームカードを取得
    const teamCards = page.locator('[class*="rounded-xl border-2"]');
    const teamCount = await teamCards.count();
    
    let foundTogether = false;
    for (let i = 0; i < teamCount; i++) {
      const teamText = await teamCards.nth(i).textContent();
      if (teamText?.includes('A') && teamText?.includes('B')) {
        foundTogether = true;
        break;
      }
    }
    
    expect(foundTogether).toBeTruthy();
  });

  test('ばらっと制約が適用される', async ({ page }) => {
    // A-B ばらっと設定
    await page.locator('select').first().selectOption({ label: 'A' });
    await page.locator('select').last().selectOption({ label: 'B' });
    await page.click('button:has-text("ばらっと")');
    await page.click('button:has-text("これで決まり！")');
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // AとBが別チームにいることを確認
    const teamCards = page.locator('[class*="rounded-xl border-2"]');
    const teamCount = await teamCards.count();
    
    let foundSeparate = true;
    for (let i = 0; i < teamCount; i++) {
      const teamText = await teamCards.nth(i).textContent();
      if (teamText?.includes('A') && teamText?.includes('B')) {
        foundSeparate = false;
        break;
      }
    }
    
    expect(foundSeparate).toBeTruthy();
  });
});
