import { TeamDivisionResult, TEAM_COLORS } from '@/types';

interface TeamResultProps {
  result: TeamDivisionResult;
  format: number;
  rematchEnabled: boolean;
  recentRounds: number;
  onRedivide: () => void;
}

export default function TeamResult({
  result,
  format,
  rematchEnabled,
  recentRounds,
  onRedivide,
}: TeamResultProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* 情報カード */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">フォーマット:</span>
            <span className="font-semibold text-slate-800 px-3 py-1 bg-slate-100 rounded-lg">
              {format}v{format}
            </span>
          </div>
          {rematchEnabled && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">リマッチ回避:</span>
              <span className="font-semibold text-slate-800">直近{recentRounds}</span>
              {result.rematchConflicts > 0 && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                  衝突{result.rematchConflicts}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 再分割ボタン */}
      <button
        type="button"
        onClick={onRedivide}
        className="w-full py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-semibold text-lg shadow-lg shadow-slate-200 hover:shadow-xl hover:shadow-slate-300 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        再分割
      </button>

      {/* 警告メッセージ */}
      {result.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">注意事項</h3>
              <ul className="space-y-1 text-sm text-amber-800">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* チーム一覧 */}
      {result.teams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-slate-500">観戦のみです。分割対象を1名以上にしてください。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {result.teams.map((team) => {
            const color = TEAM_COLORS[team.color];
            const isShort = team.members.length < team.capacity;

            return (
              <div
                key={team.id}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  isShort
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-slate-200 hover:shadow-md'
                }`}
                style={
                  !isShort
                    ? {
                        borderColor: color.hex,
                        backgroundColor: `${color.hex}08`,
                      }
                    : undefined
                }
              >
                <div
                  className="px-5 py-3"
                  style={
                    !isShort
                      ? { backgroundColor: `${color.hex}15` }
                      : { backgroundColor: '#f8fafc' }
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <h3 className="font-bold text-lg text-slate-800">
                        チーム{color.name.toUpperCase()}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">
                        {team.members.length}/{team.capacity}
                      </span>
                      {isShort && (
                        <span className="px-2.5 py-1 bg-slate-600 text-white text-xs rounded-lg font-medium flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          不足{team.capacity - team.members.length}名
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 bg-white">
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((member) => (
                      <span
                        key={member.id}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 観戦者一覧 */}
      {result.spectators.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              観戦 ({result.spectators.length})
            </h3>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {result.spectators.map((spectator) => (
                <span
                  key={spectator.id}
                  className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600"
                >
                  {spectator.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
