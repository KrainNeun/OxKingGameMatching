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
  onBulkAdd,
}: ParticipantListProps) {
  const [name, setName] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  const handleBulkAdd = () => {
    if (bulkText.trim()) {
      onBulkAdd(bulkText);
      setBulkText('');
      setIsBulkMode(false);
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
        <button
          type="button"
          onClick={() => setIsBulkMode(!isBulkMode)}
          className="text-sm text-slate-500 hover:text-slate-700 font-medium"
        >
          {isBulkMode ? '通常入力' : '一括貼り付け'}
        </button>
      </div>

      {!isBulkMode ? (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="名前を入力"
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium shadow-sm"
          >
            追加
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="名前を改行区切りで入力&#10;例:&#10;Aさん&#10;Bさん&#10;Cさん"
            rows={5}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white placeholder:text-slate-400 resize-none"
          />
          <button
            type="button"
            onClick={handleBulkAdd}
            className="mt-2 w-full px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium shadow-sm"
          >
            一括追加
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {participants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-sm">参加者がいません</p>
          </div>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                participant.isSpectator
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <span className={participant.isSpectator ? 'text-slate-400' : 'text-slate-700 font-medium'}>
                {participant.name}
                {participant.isSpectator && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full">
                    観戦
                  </span>
                )}
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={participant.isSpectator}
                    onChange={() => onToggleSpectator(participant.id)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800"
                  />
                  観戦
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(participant.id)}
                  className="text-slate-400 hover:text-red-500 text-sm font-medium"
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
