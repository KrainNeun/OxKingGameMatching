'use client';

import { useTeamDivision } from '@/hooks/useTeamDivision';
import FormatSelector from '@/components/FormatSelector';
import RematchAvoidanceSettings from '@/components/RematchAvoidanceSettings';
import ParticipantList from '@/components/ParticipantList';
import ConstraintList from '@/components/ConstraintList';
import ProcessingScreen from '@/components/ProcessingScreen';
import TeamResult from '@/components/TeamResult';

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
  } = useTeamDivision();

  const activeParticipantCount = participants.filter((p) => !p.isSpectator).length;
  const canExecute = activeParticipantCount > 0;

  if (isProcessing) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              チーム分け
            </h1>
            <p className="text-slate-500">Team Division Tool</p>
          </div>
          <ProcessingScreen />
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main className="min-h-screen px-4 py-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-slate-600 hover:text-slate-800 font-medium flex items-center gap-2 group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                設定に戻る
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              チーム分割結果
            </h1>
            <p className="text-slate-500">Division Result</p>
          </div>
          <TeamResult
            result={result}
            format={format}
            rematchEnabled={rematchAvoidance.enabled}
            recentRounds={rematchAvoidance.recentRounds}
            onRedivide={redivide}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="w-full max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            チーム分け
          </h1>
          <p className="text-slate-500">
            ネット対戦ゲーム用の自動チーム分けツール
          </p>
        </div>

        {/* メインカード */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
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
              disabled={!canExecute}
              className="w-full py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-lg shadow-lg shadow-slate-200 hover:shadow-xl hover:shadow-slate-300 transform hover:-translate-y-0.5 transition-all"
            >
              {canExecute
                ? 'チーム分けを実行'
                : '参加者を1名以上追加してください'}
            </button>

            {!canExecute && participants.length > 0 && (
              <p className="mt-3 text-center text-sm text-amber-600">
                全員が観戦になっています。観戦チェックを外してください。
              </p>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>OxKing Game Matching</p>
        </div>
      </div>
    </main>
  );
}
