import { Participant, PairConstraint, PairConstraintType } from '@/types';
import { useState } from 'react';

interface ConstraintListProps {
  participants: Participant[];
  constraints: PairConstraint[];
  onAdd: (participant1Id: string, participant2Id: string, type: PairConstraintType) => void;
  onRemove: (id: string) => void;
}

export default function ConstraintList({
  participants,
  constraints,
  onAdd,
  onRemove,
}: ConstraintListProps) {
  const [participant1Id, setParticipant1Id] = useState('');
  const [participant2Id, setParticipant2Id] = useState('');
  const [constraintType, setConstraintType] = useState<PairConstraintType>('same');

  const activeParticipants = participants.filter((p) => !p.isSpectator);

  // ペア設定に使用されている参加者IDを取得
  const usedParticipantIds = new Set<string>();
  constraints.forEach((constraint) => {
    usedParticipantIds.add(constraint.participant1Id);
    usedParticipantIds.add(constraint.participant2Id);
  });

  // 選択可能な参加者（ペア未設定の人のみ）
  const availableParticipants = activeParticipants.filter(
    (p) => !usedParticipantIds.has(p.id)
  );

  const handleAdd = () => {
    if (participant1Id && participant2Id && participant1Id !== participant2Id) {
      onAdd(participant1Id, participant2Id, constraintType);
      setParticipant1Id('');
      setParticipant2Id('');
    }
  };

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || '不明';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-slate-700">
          禁則・優先（ペア）
        </label>
        <button
          type="button"
          className="text-slate-400 hover:text-pink-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="ぎゅっと＝必ず一緒、ばらっと＝必ず別"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {activeParticipants.length >= 2 ? (
        <div className="space-y-3 mb-4">
          <div className="flex flex-col gap-2">
            <select
              value={participant1Id}
              onChange={(e) => setParticipant1Id(e.target.value)}
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-sm"
            >
              <option value="">選択してください</option>
              {availableParticipants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <select
              value={participant2Id}
              onChange={(e) => setParticipant2Id(e.target.value)}
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-sm"
            >
              <option value="">選択してください</option>
              {availableParticipants
                .filter((p) => p.id !== participant1Id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          {/* タブ切り替え風の制約タイプ選択 */}
          <div className="flex gap-1 p-1 bg-pink-50 rounded-lg">
            <button
              type="button"
              onClick={() => setConstraintType('same')}
              className={`flex-1 px-4 py-3 rounded-md text-sm font-bold transition-all ${
                constraintType === 'same'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              ぎゅっと
            </button>
            <button
              type="button"
              onClick={() => setConstraintType('different')}
              className={`flex-1 px-4 py-3 rounded-md text-sm font-bold transition-all ${
                constraintType === 'different'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              ばらっと
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!participant1Id || !participant2Id || participant1Id === participant2Id}
            className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-lg hover:from-pink-500 hover:to-rose-500 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed font-bold text-sm shadow-sm"
          >
            これで決まり！
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 mb-4 py-8 text-center bg-pink-50 rounded-lg border border-pink-200">
          参加者が2名以上必要です
        </p>
      )}

      <div className="space-y-2">
        {constraints.length === 0 ? (
          <p className="text-center text-slate-400 py-8 text-sm bg-pink-50/50 rounded-lg border-2 border-dashed border-pink-200">
            制約なし
          </p>
        ) : (
          constraints.map((constraint) => (
            <div
              key={constraint.id}
              className="flex items-center justify-between p-4 bg-pink-50/50 border border-pink-200 rounded-lg hover:border-pink-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-700 flex flex-wrap items-center gap-2">
                  <span className="font-medium">{getParticipantName(constraint.participant1Id)}</span>
                  <svg className="w-4 h-4 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span className="font-medium">{getParticipantName(constraint.participant2Id)}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      constraint.type === 'same'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {constraint.type === 'same' ? 'ぎゅっと' : 'ばらっと'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(constraint.id)}
                className="text-red-500 hover:text-red-600 text-sm font-medium ml-4 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                aria-label="削除"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
