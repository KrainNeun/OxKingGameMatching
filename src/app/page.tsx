'use client';

import { useTeamDivision } from '@/hooks/useTeamDivision';
import FormatSelector from '@/components/FormatSelector';
import RematchAvoidanceSettings from '@/components/RematchAvoidanceSettings';
import ParticipantList from '@/components/ParticipantList';
import ConstraintList from '@/components/ConstraintList';
import ResultModal from '@/components/ResultModal';

export default function Home() {
  const {
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
  } = useTeamDivision();

  const activeParticipantCount = participants.filter((p) => !p.isSpectator).length;
  const canExecute = activeParticipantCount > 0;

  return (
    <>
      <main className="min-h-screen px-4 py-6 md:py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              チーム分け
            </h1>
            <p className="text-sm md:text-base text-slate-500">
              ネット対戦ゲーム用の自動チーム分けツール
            </p>
          </div>

          {/* メインカード */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-8 space-y-6 md:space-y-8">
            {/* フォーマット選択 */}
            <FormatSelector value={format} onChange={setFormat} />

            {/* 区切り線 */}
            <div className="border-t border-slate-100"></div>

            {/* リマッチ回避設定 */}
            <RematchAvoidanceSettings
              config={rematchAvoidance}
              onChange={setRematchAvoidance}
            />

            {/* 区切り線 */}
            <div className="border-t border-slate-100"></div>

            {/* 参加者リスト */}
            <ParticipantList
              participants={participants}
              onAdd={addParticipant}
              onRemove={removeParticipant}
              onToggleSpectator={toggleSpectator}
              onBulkAdd={bulkAddParticipants}
            />

            {/* 区切り線 */}
            <div className="border-t border-slate-100"></div>

            {/* 制約リスト */}
            <ConstraintList
              participants={participants}
              constraints={constraints}
              onAdd={addConstraint}
              onRemove={removeConstraint}
            />

            {/* 区切り線 */}
            <div className="border-t border-slate-100"></div>

            {/* 実行ボタン */}
            <div className="pt-2">
              <button
                type="button"
                onClick={executeTeamDivision}
                disabled={!canExecute || isProcessing}
                className="w-full py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-lg shadow-lg shadow-slate-200 hover:shadow-xl hover:shadow-slate-300 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    処理中...
                  </>
                ) : canExecute ? (
                  'チーム分けを実行'
                ) : (
                  '参加者を1名以上追加してください'
                )}
              </button>

              {!canExecute && participants.length > 0 && !isProcessing && (
                <p className="mt-3 text-center text-sm text-amber-600">
                  全員が観戦になっています。観戦チェックを外してください。
                </p>
              )}
            </div>
          </div>

          {/* フッター */}
          <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-slate-400">
            <p>OxKing Game Matching</p>
          </div>
        </div>
      </main>

      {/* 結果モーダル */}
      {result && (
        <ResultModal
          isOpen={!!result}
          onClose={clearResult}
          result={result}
          format={format}
          rematchEnabled={rematchAvoidance.enabled}
          recentRounds={rematchAvoidance.recentRounds}
          onRedivide={redivide}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
}
