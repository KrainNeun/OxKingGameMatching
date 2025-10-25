import { GameFormat } from '@/types';

interface FormatSelectorProps {
  value: GameFormat;
  onChange: (format: GameFormat) => void;
}

const formats: GameFormat[] = [2, 3, 4, 5, 6];

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        フォーマット
      </label>
      <div className="grid grid-cols-5 gap-2">
        {formats.map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => onChange(format)}
            className={`py-3 px-4 rounded-lg font-semibold text-sm border-2 transition-all ${
              value === format
                ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {format}v{format}
          </button>
        ))}
      </div>
    </div>
  );
}
