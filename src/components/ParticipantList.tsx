import { Participant } from '@/types';
import { useState } from 'react';

interface ParticipantListProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onToggleSpectator: (id: string) => void;
  onBulkAdd: (text: string) => void;
}

export default function ParticipantList({
  participants,
  onAdd,
  onRemove,
  onToggleSpectator,
}: ParticipantListProps) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-slate-700">
          参加者リスト
          <span className="ml-2 text-xs font-normal text-slate-500">
            ({participants.filter((p) => !p.isSpectator).length}名)
          </span>
        </label>
      </div>

      <div className="flex gap-2 mb-3 w-full">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="名前を入力"
          className="flex-1 px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white placeholder:text-slate-400 text-base"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-5 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-lg hover:from-pink-500 hover:to-rose-500 font-bold shadow-sm text-sm whitespace-nowrap"
        >
          追加
        </button>
      </div>

      <div className="space-y-1.5">
        {participants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-pink-50/50 rounded-lg border-2 border-dashed border-pink-200">
            <svg className="w-12 h-12 mx-auto mb-3 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-sm">参加者がいません</p>
          </div>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                participant.isSpectator
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-pink-200 hover:border-pink-300 hover:shadow-sm'
              }`}
            >
              <span className={`text-sm ${participant.isSpectator ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                {participant.name}
              </span>
              <div className="flex items-center gap-2">
                {/* おうえんトグル */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-xs text-slate-500">おうえん</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={participant.isSpectator}
                      onChange={() => onToggleSpectator(participant.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-rose-400 transition-all"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 pointer-events-none shadow-sm"></div>
                  </div>
                </label>
                {/* 削除ボタン（赤色アイコン） */}
                <button
                  type="button"
                  onClick={() => onRemove(participant.id)}
                  className="text-red-500 hover:text-red-600 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                  aria-label="削除"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
