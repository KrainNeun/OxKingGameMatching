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

  // Step 1: ランダム初期分割
  let shuffled = random.shuffle(activeParticipants);
  let teams = initializeTeams(shuffled, format, teamCount);

  // Step 2: 制約チェック & スワップ
  const constraintResult = applyConstraints(teams, constraints);
  teams = constraintResult.teams;
  const constraintConflicts = constraintResult.conflicts;

  if (constraintConflicts > 0) {
    warnings.push(
      `制約が完全には満たせませんでした（衝突: ${constraintConflicts}件）`
    );
  }

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
 * 初期チーム分割
 */
function initializeTeams(
  participants: Participant[],
  format: number,
  teamCount: number
): Omit<Team, 'color'>[] {
  const teams: Omit<Team, 'color'>[] = [];

  for (let i = 0; i < teamCount; i++) {
    teams.push({
      id: `team-${i}`,
      members: [],
      capacity: format,
    });
  }

  participants.forEach((participant, index) => {
    const teamIndex = index % teamCount;
    teams[teamIndex].members.push(participant);
  });

  return teams;
}

/**
 * 制約を適用（簡易版：完全解を保証しない）
 */
function applyConstraints(
  teams: Omit<Team, 'color'>[],
  constraints: PairConstraint[]
): { teams: Omit<Team, 'color'>[]; conflicts: number } {
  let conflicts = 0;
  const maxAttempts = 100;

  for (const constraint of constraints) {
    let satisfied = false;
    let attempts = 0;

    while (!satisfied && attempts < maxAttempts) {
      const team1Index = teams.findIndex((t) =>
        t.members.some((m) => m.id === constraint.participant1Id)
      );
      const team2Index = teams.findIndex((t) =>
        t.members.some((m) => m.id === constraint.participant2Id)
      );

      if (team1Index === -1 || team2Index === -1) break;

      const isSameTeam = team1Index === team2Index;
      const shouldBeSame = constraint.type === 'same';

      if (isSameTeam === shouldBeSame) {
        satisfied = true;
      } else {
        // スワップを試みる
        const member1 = teams[team1Index].members.find(
          (m) => m.id === constraint.participant1Id
        );
        const member2 = teams[team2Index].members.find(
          (m) => m.id === constraint.participant2Id
        );

        if (member1 && member2) {
          // メンバーを交換
          teams[team1Index].members = teams[team1Index].members.filter(
            (m) => m.id !== constraint.participant1Id
          );
          teams[team2Index].members = teams[team2Index].members.filter(
            (m) => m.id !== constraint.participant2Id
          );

          teams[team1Index].members.push(member2);
          teams[team2Index].members.push(member1);
        }
      }

      attempts++;
    }

    if (!satisfied) {
      conflicts++;
    }
  }

  return { teams, conflicts };
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

  // TODO: 衝突がある場合の再スワップロジック（将来の拡張）

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
