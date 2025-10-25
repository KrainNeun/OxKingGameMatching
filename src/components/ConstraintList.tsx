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
          className="text-slate-400 hover:text-slate-600 transition-colors"
          title="同チーム＝必ず一緒、別チーム＝必ず別"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {activeParticipants.length >= 2 ? (
        <div className="space-y-3 mb-4">
          <div className="flex gap-2 items-center">
            <select
              value={participant1Id}
              onChange={(e) => setParticipant1Id(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white text-sm"
            >
              <option value="">選択してください</option>
              {activeParticipants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <select
              value={participant2Id}
              onChange={(e) => setParticipant2Id(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white text-sm"
            >
              <option value="">選択してください</option>
              {activeParticipants
                .filter((p) => p.id !== participant1Id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-4 px-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="same"
                checked={constraintType === 'same'}
                onChange={(e) => setConstraintType(e.target.value as PairConstraintType)}
                className="w-4 h-4 border-slate-300 text-slate-800 focus:ring-slate-800"
              />
              <span className="text-sm text-slate-700">同チーム</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="different"
                checked={constraintType === 'different'}
                onChange={(e) => setConstraintType(e.target.value as PairConstraintType)}
                className="w-4 h-4 border-slate-300 text-slate-800 focus:ring-slate-800"
              />
              <span className="text-sm text-slate-700">別チーム</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!participant1Id || !participant2Id || participant1Id === participant2Id}
            className="w-full px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
          >
            ペア追加
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 mb-4 py-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          参加者が2名以上必要です
        </p>
      )}

      <div className="space-y-2">
        {constraints.length === 0 ? (
          <p className="text-center text-slate-400 py-8 text-sm bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            制約なし
          </p>
        ) : (
          constraints.map((constraint) => (
            <div
              key={constraint.id}
              className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <span className="text-sm text-slate-700">
                <span className="font-medium">{getParticipantName(constraint.participant1Id)}</span>
                <svg className="inline-block w-4 h-4 mx-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="font-medium">{getParticipantName(constraint.participant2Id)}</span>
                <span
                  className={`ml-3 px-2.5 py-1 rounded-full text-xs font-medium ${
                    constraint.type === 'same'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {constraint.type === 'same' ? '同チーム' : '別チーム'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(constraint.id)}
                className="text-slate-400 hover:text-red-500 text-sm font-medium ml-4"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
