// チームカラー定義（フルーツテーマ）
export const TEAM_COLORS = {
  STRAWBERRY: { hex: '#FF6B9D', name: 'いちご', emoji: '🍓' },
  GRAPE: { hex: '#9D4EDD', name: 'ぶどう', emoji: '🍇' },
  LEMON: { hex: '#FFD60A', name: 'レモン', emoji: '🍋' },
  MELON: { hex: '#95D5B2', name: 'メロン', emoji: '🍈' },
  PEACH: { hex: '#FFB3BA', name: 'もも', emoji: '🍑' },
  ORANGE: { hex: '#FF9F1C', name: 'みかん', emoji: '🍊' },
  BANANA: { hex: '#FFF176', name: 'バナナ', emoji: '🍌' },
  KIWI: { hex: '#8BC34A', name: 'キウイ', emoji: '🥝' },
} as const;

export type TeamColorKey = keyof typeof TEAM_COLORS;

// 参加者
export interface Participant {
  id: string;
  name: string;
  isSpectator: boolean; // 観戦フラグ
}

// ペア制約の種類
export type PairConstraintType = 'same' | 'different'; // 同チーム or 別チーム

// ペア制約
export interface PairConstraint {
  id: string;
  participant1Id: string;
  participant2Id: string;
  type: PairConstraintType;
}

// チーム
export interface Team {
  id: string;
  color: TeamColorKey;
  members: Participant[];
  capacity: number; // 定員
}

// ゲームフォーマット (2v2, 3v3, etc.)
export type GameFormat = 2 | 3 | 4 | 5 | 6;

// リマッチ回避設定
export interface RematchAvoidanceConfig {
  enabled: boolean;
  recentRounds: number; // 直近何ラウンド分を参照するか
}

// マッチ履歴（LocalStorageに保存）
export interface MatchHistory {
  timestamp: number;
  format: GameFormat;
  teams: {
    color: TeamColorKey;
    memberIds: string[];
  }[];
}

// チーム分割の設定
export interface TeamDivisionConfig {
  format: GameFormat;
  participants: Participant[];
  constraints: PairConstraint[];
  rematchAvoidance: RematchAvoidanceConfig;
  seed?: number; // 再現性のためのシード値
}

// チーム分割の結果
export interface TeamDivisionResult {
  teams: Team[];
  spectators: Participant[];
  conflicts: number; // 制約違反の数
  rematchConflicts: number; // リマッチ回避の衝突数
  warnings: string[];
}

// アプリケーション状態
export interface AppState {
  format: GameFormat;
  participants: Participant[];
  constraints: PairConstraint[];
  rematchAvoidance: RematchAvoidanceConfig;
  result: TeamDivisionResult | null;
  isProcessing: boolean;
}
