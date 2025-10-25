import { MatchHistory, GameFormat, Participant, PairConstraint, RematchAvoidanceConfig } from '@/types';

const STORAGE_KEY = 'oxking-match-history';
const SETTINGS_KEY = 'gyumatch-settings';

// 履歴の型定義
interface StoredHistory {
  matches: MatchHistory[];
}

// 設定の型定義
export interface AppSettings {
  format: GameFormat;
  participants: Participant[];
  constraints: PairConstraint[];
  rematchAvoidance: RematchAvoidanceConfig;
}

/**
 * 履歴を取得
 */
export function getMatchHistory(): MatchHistory[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const data: StoredHistory = JSON.parse(stored);
    return data.matches || [];
  } catch (error) {
    console.error('Failed to load match history:', error);
    return [];
  }
}

/**
 * 履歴を保存
 */
export function saveMatchHistory(match: MatchHistory): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getMatchHistory();
    history.unshift(match); // 新しいものを先頭に
    
    // 最大100件まで保持
    const trimmed = history.slice(0, 100);
    
    const data: StoredHistory = {
      matches: trimmed,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save match history:', error);
  }
}

/**
 * 直近N件の履歴を取得
 */
export function getRecentMatches(count: number): MatchHistory[] {
  const history = getMatchHistory();
  return history.slice(0, count);
}

/**
 * 履歴を全削除
 */
export function clearMatchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear match history:', error);
  }
}

/**
 * 設定を保存
 */
export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * 設定を読み込み
 */
export function loadSettings(): AppSettings | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as AppSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}
