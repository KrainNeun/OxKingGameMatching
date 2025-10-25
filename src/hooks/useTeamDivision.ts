import { useState, useCallback } from 'react';
import {
  AppState,
  GameFormat,
  Participant,
  PairConstraint,
  TeamDivisionResult,
  RematchAvoidanceConfig,
} from '@/types';
import { divideTeams } from '@/lib/teamDivision';
import { saveMatchHistory } from '@/lib/storage';

const initialRematchConfig: RematchAvoidanceConfig = {
  enabled: true,
  recentRounds: 3,
};

export function useTeamDivision() {
  const [format, setFormat] = useState<GameFormat>(2); // デフォルトを2v2に変更
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [constraints, setConstraints] = useState<PairConstraint[]>([]);
  const [rematchAvoidance, setRematchAvoidance] =
    useState<RematchAvoidanceConfig>(initialRematchConfig);
  const [result, setResult] = useState<TeamDivisionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 参加者追加
  const addParticipant = useCallback((name: string) => {
    const newParticipant: Participant = {
      id: `participant-${Date.now()}-${Math.random()}`,
      name,
      isSpectator: false,
    };
    setParticipants((prev) => [...prev, newParticipant]);
  }, []);

  // 参加者削除
  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    // 関連する制約も削除
    setConstraints((prev) =>
      prev.filter((c) => c.participant1Id !== id && c.participant2Id !== id)
    );
  }, []);

  // 観戦フラグ切り替え
  const toggleSpectator = useCallback((id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSpectator: !p.isSpectator } : p))
    );
    
    // 観戦になった場合、そのIDを含むペア制約を削除
    setConstraints((prev) =>
      prev.filter((c) => {
        const participant = prev.find((p) => p.id === id);
        if (!participant) return true;
        
        // この参加者が観戦になる場合、そのペアを削除
        return c.participant1Id !== id && c.participant2Id !== id;
      })
    );
  }, []);

  // 一括参加者追加（改行区切り）
  const bulkAddParticipants = useCallback((text: string) => {
    const names = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newParticipants: Participant[] = names.map((name, index) => ({
      id: `participant-${Date.now()}-${index}`,
      name,
      isSpectator: false,
    }));

    setParticipants((prev) => [...prev, ...newParticipants]);
  }, []);

  // 制約追加
  const addConstraint = useCallback(
    (participant1Id: string, participant2Id: string, type: 'same' | 'different') => {
      const newConstraint: PairConstraint = {
        id: `constraint-${Date.now()}`,
        participant1Id,
        participant2Id,
        type,
      };
      setConstraints((prev) => [...prev, newConstraint]);
    },
    []
  );

  // 制約削除
  const removeConstraint = useCallback((id: string) => {
    setConstraints((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // チーム分割実行
  const executeTeamDivision = useCallback(async () => {
    setIsProcessing(true);
    
    // UI上の処理中表示のため少し遅延
    await new Promise((resolve) => setTimeout(resolve, 500));

    const divisionResult = divideTeams({
      format,
      participants,
      constraints,
      rematchAvoidance,
    });

    setResult(divisionResult);

    // 履歴を保存
    if (divisionResult.teams.length > 0) {
      saveMatchHistory({
        timestamp: Date.now(),
        format,
        teams: divisionResult.teams.map((team) => ({
          color: team.color,
          memberIds: team.members.map((m) => m.id),
        })),
      });
    }

    setIsProcessing(false);
  }, [format, participants, constraints, rematchAvoidance]);

  // 再分割
  const redivide = useCallback(() => {
    executeTeamDivision();
  }, [executeTeamDivision]);

  // 結果をクリア（モーダルを閉じる）
  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    format,
    setFormat,
    participants,
    addParticipant,
    removeParticipant,
    toggleSpectator,
    bulkAddParticipants,
    constraints,
    addConstraint,
    removeConstraint,
    rematchAvoidance,
    setRematchAvoidance,
    result,
    isProcessing,
    executeTeamDivision,
    redivide,
    clearResult,
  };
}
