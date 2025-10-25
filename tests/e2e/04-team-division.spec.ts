import { test, expect } from '@playwright/test';

test.describe('ぎゅ～まっち - チーム分け基本機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('参加者がいない時はボタンが無効', async ({ page }) => {
    const button = page.locator('button:has-text("ぎゅ～っとする人がいないよ")');
    await expect(button).toBeDisabled();
  });

  test('2v2で4人のチーム分けができる', async ({ page }) => {
    // 4人追加
    const names = ['A', 'B', 'C', 'D'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // 対戦形式は2v2がデフォルト
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // モーダルが表示される
    await expect(page.locator('text=ぎゅ～っとできました！')).toBeVisible();
    
    // 対戦形式が表示される
    await expect(page.locator('text=対戦形式:')).toBeVisible();
    await expect(page.locator('text=2v2')).toBeVisible();
  });

  test('3v3で6人のチーム分けができる', async ({ page }) => {
    // 6人追加
    const names = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // 3v3を選択
    await page.click('button:has-text("3v3")');
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // 確認
    await expect(page.locator('text=3v3')).toBeVisible();
  });

  test('フルーツチームが表示される', async ({ page }) => {
    // 4人追加
    const names = ['A', 'B', 'C', 'D'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // フルーツ絵文字が表示される（いちご、ぶどう、レモン、メロン、もも、みかん、バナナ、キウイのいずれか）
    const fruitEmojis = ['🍓', '🍇', '🍋', '🍈', '🍑', '🍊', '🍌', '🥝'];
    let foundFruit = false;
    
    for (const emoji of fruitEmojis) {
      if (await page.locator(`text=${emoji}`).isVisible()) {
        foundFruit = true;
        break;
      }
    }
    
    expect(foundFruit).toBeTruthy();
  });

  test('モーダルを閉じることができる', async ({ page }) => {
    // 4人追加
    const names = ['A', 'B', 'C', 'D'];
    for (const name of names) {
      await page.fill('input[placeholder="名前を入力"]', name);
      await page.click('button:has-text("追加")');
    }
    
    // チーム分け実行
    await page.click('button:has-text("ぎゅ～まっちする！")');
    
    // 閉じるボタンをクリック
    await page.click('button[aria-label="閉じる"]');
    
    // モーダルが閉じる
    await expect(page.locator('text=ぎゅ～っとできました！')).not.toBeVisible();
  });
});
