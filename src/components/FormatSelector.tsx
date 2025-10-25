import { GameFormat } from '@/types';

interface FormatSelectorProps {
  value: GameFormat;
  onChange: (format: GameFormat) => void;
}

const formats: { value: GameFormat; label: string }[] = [
  { value: 2, label: '2v2' },
  { value: 3, label: '3v3' },
  { value: 4, label: '4v4' },
  { value: 5, label: '5v5' },
  { value: 6, label: '6v6' },
];

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        フォーマット
      </label>
      <div className="grid grid-cols-5 gap-2">
        {formats.map((format) => (
          <button
            key={format.value}
            type="button"
            onClick={() => onChange(format.value)}
            className={`py-3 rounded-lg font-semibold text-sm border-2 transition-all ${
              value === format.value
                ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {format.label}
          </button>
        ))}
      </div>
    </div>
  );
}
