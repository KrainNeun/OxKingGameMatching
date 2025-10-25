import {
  TeamDivisionConfig,
  TeamDivisionResult,
  Team,
  Participant,
  PairConstraint,
  TeamColorKey,
  TEAM_COLORS,
  MatchHistory,
} from '@/types';
import { getRecentMatches } from './storage';

/**
 * シード付き乱数生成器（再現性のため）
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * ペアを正規化（A,CとC,Aを同一として扱う）
 */
function normalizePair(id1: string, id2: string): string {
  return [id1, id2].sort().join(',');
}

/**
 * チーム分割を実行
 */
export function divideTeams(config: TeamDivisionConfig): TeamDivisionResult {
  const {
    format,
    participants,
    constraints,
    rematchAvoidance,
    seed = Date.now(),
  } = config;

  // 観戦者を除外
  const activeParticipants = participants.filter((p) => !p.isSpectator);
  const spectators = participants.filter((p) => p.isSpectator);

  // 分割対象が0の場合
  if (activeParticipants.length === 0) {
    return {
      teams: [],
      spectators,
      conflicts: 0,
      rematchConflicts: 0,
      warnings: ['分割対象の参加者が0人です。'],
    };
  }

  const random = new SeededRandom(seed);
  const teamCount = Math.ceil(activeParticipants.length / format);
  const warnings: string[] = [];

  // 制約の正規化と重複チェック
  const normalizedConstraints = new Map<string, PairConstraint>();
  const duplicates: string[] = [];
  
  constraints.forEach((c) => {
    const key = normalizePair(c.participant1Id, c.participant2Id);
    if (normalizedConstraints.has(key)) {
      const p1 = participants.find(p => p.id === c.participant1Id)?.name || '不明';
      const p2 = participants.find(p => p.id === c.participant2Id)?.name || '不明';
      duplicates.push(`${p1}と${p2}`);
    } else {
      normalizedConstraints.set(key, c);
    }
  });

  if (duplicates.length > 0) {
    warnings.push(`重複するペア設定: ${duplicates.join(', ')}`);
  }

  // 正規化された制約リストを使用
  const validConstraints = Array.from(normalizedConstraints.values());

  // Step 1: ペア制約を最優先で適用
  const { constrainedTeams, remainingParticipants, constraintConflicts } = 
    applyConstraintsFirst(activeParticipants, validConstraints, format, teamCount);

  if (constraintConflicts > 0) {
    warnings.push(
      `制約が完全には満たせませんでした（衝突: ${constraintConflicts}件）`
    );
  }

  // Step 2: 残りの参加者をランダムに配置
  let teams = distributeRemainingParticipants(
    constrainedTeams,
    remainingParticipants,
    format,
    random
  );

  // Step 3: リマッチ回避
  let rematchConflicts = 0;
  if (rematchAvoidance.enabled && teamCount === 2) {
    const rematchResult = applyRematchAvoidance(
      teams,
      activeParticipants,
      rematchAvoidance.recentRounds,
      format
    );
    teams = rematchResult.teams;
    rematchConflicts = rematchResult.conflicts;

    if (rematchConflicts > 0) {
      warnings.push(
        `リマッチ回避が完全には適用できませんでした（衝突: ${rematchConflicts}件）`
      );
    }
  }

  // Step 4: 色付け
  const coloredTeams = assignColors(teams);

  // 人数不足の警告
  coloredTeams.forEach((team) => {
    if (team.members.length < team.capacity) {
      warnings.push(
        `チーム${TEAM_COLORS[team.color].name}が${
          team.capacity - team.members.length
        }名不足しています`
      );
    }
  });

  return {
    teams: coloredTeams,
    spectators,
    conflicts: constraintConflicts,
    rematchConflicts,
    warnings,
  };
}

/**
 * ペア制約を最優先で適用
 */
function applyConstraintsFirst(
  participants: Participant[],
  constraints: PairConstraint[],
  format: number,
  teamCount: number
): {
  constrainedTeams: Omit<Team, 'color'>[];
  remainingParticipants: Participant[];
  constraintConflicts: number;
} {
  // 初期チーム作成
  const teams: Omit<Team, 'color'>[] = [];
  for (let i = 0; i < teamCount; i++) {
    teams.push({
      id: `team-${i}`,
      members: [],
      capacity: format,
    });
  }

  const assignedIds = new Set<string>();
  let conflicts = 0;

  // 「同チーム」制約を最初に処理
  const sameTeamConstraints = constraints.filter((c) => c.type === 'same');
  for (const constraint of sameTeamConstraints) {
    const { participant1Id, participant2Id } = constraint;
    
    // すでに配置済みかチェック
    if (assignedIds.has(participant1Id) || assignedIds.has(participant2Id)) {
      conflicts++;
      continue;
    }

    // 空きのあるチームに配置
    const targetTeam = teams.find((t) => t.members.length <= format - 2);
    if (targetTeam) {
      const p1 = participants.find((p) => p.id === participant1Id);
      const p2 = participants.find((p) => p.id === participant2Id);
      if (p1 && p2) {
        targetTeam.members.push(p1, p2);
        assignedIds.add(participant1Id);
        assignedIds.add(participant2Id);
      }
    } else {
      conflicts++;
    }
  }

  // 「別チーム」制約を処理
  const differentTeamConstraints = constraints.filter((c) => c.type === 'different');
  for (const constraint of differentTeamConstraints) {
    const { participant1Id, participant2Id } = constraint;
    
    // すでに配置済みかチェック
    if (assignedIds.has(participant1Id) || assignedIds.has(participant2Id)) {
      conflicts++;
      continue;
    }

    // 別々のチームに配置
    const team1 = teams.find((t) => t.members.length < format);
    const team2 = teams.find((t) => t.id !== team1?.id && t.members.length < format);
    
    if (team1 && team2) {
      const p1 = participants.find((p) => p.id === participant1Id);
      const p2 = participants.find((p) => p.id === participant2Id);
      if (p1 && p2) {
        team1.members.push(p1);
        team2.members.push(p2);
        assignedIds.add(participant1Id);
        assignedIds.add(participant2Id);
      }
    } else {
      conflicts++;
    }
  }

  // 残りの参加者
  const remainingParticipants = participants.filter(
    (p) => !assignedIds.has(p.id)
  );

  return {
    constrainedTeams: teams,
    remainingParticipants,
    constraintConflicts: conflicts,
  };
}

/**
 * 残りの参加者を配置
 */
function distributeRemainingParticipants(
  teams: Omit<Team, 'color'>[],
  remainingParticipants: Participant[],
  format: number,
  random: SeededRandom
): Omit<Team, 'color'>[] {
  const shuffled = random.shuffle(remainingParticipants);
  
  for (const participant of shuffled) {
    // 空きのあるチームに順番に配置
    const targetTeam = teams.find((t) => t.members.length < format);
    if (targetTeam) {
      targetTeam.members.push(participant);
    }
  }

  return teams;
}

/**
 * リマッチ回避を適用（2チーム時のみ）
 */
function applyRematchAvoidance(
  teams: Omit<Team, 'color'>[],
  allParticipants: Participant[],
  recentRounds: number,
  format: number
): { teams: Omit<Team, 'color'>[]; conflicts: number } {
  const recentMatches = getRecentMatches(recentRounds);
  
  if (recentMatches.length === 0 || teams.length !== 2) {
    return { teams, conflicts: 0 };
  }

  // 直近の対戦でチーム分けが同じかチェック
  const currentTeamA = new Set(teams[0].members.map((m) => m.id));
  const currentTeamB = new Set(teams[1].members.map((m) => m.id));

  let conflicts = 0;

  for (const match of recentMatches) {
    if (match.format !== format || match.teams.length !== 2) continue;

    const historyTeamA = new Set(match.teams[0].memberIds);
    const historyTeamB = new Set(match.teams[1].memberIds);

    // チームAとhistoryTeamAの一致度
    const matchA = setIntersection(currentTeamA, historyTeamA).size;
    const matchB = setIntersection(currentTeamB, historyTeamB).size;

    // 逆パターンもチェック
    const matchARev = setIntersection(currentTeamA, historyTeamB).size;
    const matchBRev = setIntersection(currentTeamB, historyTeamA).size;

    // 同じチーム分けまたは対戦カードが重複している場合
    if (
      (matchA >= format / 2 && matchB >= format / 2) ||
      (matchARev >= format / 2 && matchBRev >= format / 2)
    ) {
      conflicts++;
    }
  }

  return { teams, conflicts };
}

/**
 * チームに色を割り当て
 */
function assignColors(teams: Omit<Team, 'color'>[]): Team[] {
  const colorKeys = Object.keys(TEAM_COLORS) as TeamColorKey[];
  
  return teams.map((team, index) => ({
    ...team,
    color: colorKeys[index % colorKeys.length],
  }));
}

/**
 * Set の積集合
 */
function setIntersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter((x) => setB.has(x)));
}
