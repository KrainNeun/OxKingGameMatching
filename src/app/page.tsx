'use client';

import { useTeamDivision } from '@/hooks/useTeamDivision';
import { clearMatchHistory } from '@/lib/storage';
import FormatSelector from '@/components/FormatSelector';
import RematchAvoidanceSettings from '@/components/RematchAvoidanceSettings';
import ParticipantList from '@/components/ParticipantList';
import ConstraintList from '@/components/ConstraintList';
import ResultModal from '@/components/ResultModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { useState } from 'react';

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

  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);

  const activeParticipantCount = participants.filter((p) => !p.isSpectator).length;
  const canExecute = activeParticipantCount > 0;
  
  // チーム数と不足人数の計算
  const completedTeamCount = activeParticipantCount > 0 
    ? Math.floor(activeParticipantCount / format) 
    : 0;
  
  // 不足人数：次のチームを作るのに必要な人数
  const shortage = activeParticipantCount > 0 && activeParticipantCount % format !== 0
    ? format - (activeParticipantCount % format)
    : 0;

  const handleClearHistory = () => {
    clearMatchHistory();
    setShowClearHistoryDialog(false);
  };

  return (
    <>
      <main className="min-h-screen px-4 py-6 md:py-12 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="w-full max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="mb-2 flex justify-center">
              <Image 
                src={logo}
                alt="ぎゅ～まっち" 
                width={200} 
                height={60}
                priority
                className="object-contain"
              />
            </div>
            <p className="text-sm md:text-base text-slate-600">
              チームマッチングツール
            </p>
          </div>

          {/* メインカード */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 p-5 md:p-8 space-y-6 md:space-y-8">
            {/* 参加者リスト */}
            <ParticipantList
              participants={participants}
              onAdd={addParticipant}
              onRemove={removeParticipant}
              onToggleSpectator={toggleSpectator}
              onBulkAdd={bulkAddParticipants}
            />

            {/* 区切り線 */}
            <div className="border-t border-pink-100"></div>

            {/* 制約リスト */}
            <ConstraintList
              participants={participants}
              constraints={constraints}
              onAdd={addConstraint}
              onRemove={removeConstraint}
            />

            {/* 区切り線 */}
            <div className="border-t border-pink-100"></div>

            {/* フォーマット選択 */}
            <FormatSelector value={format} onChange={setFormat} />

            {/* ぎゅ～っと表示 */}
            {activeParticipantCount >= 0 && (
              <div className="bg-pink-50/50 rounded-lg p-4 border border-pink-100">
                <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                  {/* 完成チームがある場合 */}
                  {completedTeamCount > 0 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">いま</span>
                        <span className="font-bold text-pink-500 text-lg">{completedTeamCount}</span>
                        <span className="text-slate-600">ぎゅ～っとが集まってるよ！</span>
                      </div>
                      {shortage > 0 && (
                        <>
                          <div className="w-px h-4 bg-pink-200"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">あと</span>
                            <span className="font-bold text-amber-600 text-lg">{shortage}</span>
                            <span className="text-slate-600">人でぎゅ～っとできるよ！</span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* 完成チームがない場合 */
                    <div className="flex items-center gap-2">
                      {activeParticipantCount === 0 ? (
                        <span className="text-slate-500">参加者を追加してね！</span>
                      ) : (
                        <>
                          <span className="text-slate-600">あと</span>
                          <span className="font-bold text-amber-600 text-lg">{format - activeParticipantCount}</span>
                          <span className="text-slate-600">人でぎゅ～っとできるよ！</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 区切り線 */}
            <div className="border-t border-pink-100"></div>

            {/* リマッチ回避設定 */}
            <RematchAvoidanceSettings
              config={rematchAvoidance}
              onChange={setRematchAvoidance}
            />

            {/* 区切り線 */}
            <div className="border-t border-pink-100"></div>

            {/* 実行ボタン */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={executeTeamDivision}
                disabled={!canExecute || isProcessing}
                className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl hover:from-pink-500 hover:to-rose-500 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    処理中...
                  </>
                ) : canExecute ? (
                  'ぎゅ～まっちする！'
                ) : (
                  'ぎゅ～っとする人がいないよ'
                )}
              </button>

              {!canExecute && participants.length > 0 && !isProcessing && (
                <p className="text-center text-sm text-amber-600">
                  全員が観戦になっています。観戦を外してください。
                </p>
              )}

              {/* 履歴削除ボタン */}
              <button
                type="button"
                onClick={() => setShowClearHistoryDialog(true)}
                className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ぎゅ～っとした記録を消す
              </button>
            </div>
          </div>

          {/* フッター */}
          <div className="mt-6 md:mt-8 text-center space-y-2">
            <p className="text-xs md:text-sm text-slate-400">ぎゅ～まっち</p>
            <p className="text-xs text-slate-400">
              Developed by{' '}
              <span className="font-medium text-pink-500">
                KrainNeun
              </span>
            </p>
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

      {/* 履歴削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={showClearHistoryDialog}
        title="記録を消しますか？"
        message="これまでのぎゅ～っとした記録が全て消えます。リマッチ回避に影響します。"
        confirmText="消す"
        cancelText="やめる"
        onConfirm={handleClearHistory}
        onCancel={() => setShowClearHistoryDialog(false)}
      />
    </>
  );
}
