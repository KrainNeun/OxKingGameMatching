import { MatchHistory } from '@/types';

const STORAGE_KEY = 'oxking_match_history';
const MAX_HISTORY_SIZE = 100; // 最大保存件数

/**
 * マッチ履歴をLocalStorageから取得
 */
export function getMatchHistory(): MatchHistory[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored) as MatchHistory[];
    return history.sort((a, b) => b.timestamp - a.timestamp); // 新しい順
  } catch (error) {
    console.error('Failed to load match history:', error);
    return [];
  }
}

/**
 * マッチ履歴をLocalStorageに保存
 */
export function saveMatchHistory(newMatch: MatchHistory): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getMatchHistory();
    history.unshift(newMatch);
    
    // 最大件数を超えたら古いものを削除
    const trimmedHistory = history.slice(0, MAX_HISTORY_SIZE);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save match history:', error);
  }
}

/**
 * 直近N件のマッチ履歴を取得
 */
export function getRecentMatches(count: number): MatchHistory[] {
  const history = getMatchHistory();
  return history.slice(0, count);
}

/**
 * マッチ履歴をクリア
 */
export function clearMatchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear match history:', error);
  }
}
