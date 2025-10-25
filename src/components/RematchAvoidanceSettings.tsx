import { RematchAvoidanceConfig } from '@/types';
import { useState } from 'react';

interface RematchAvoidanceSettingsProps {
  config: RematchAvoidanceConfig;
  onChange: (config: RematchAvoidanceConfig) => void;
}

export default function RematchAvoidanceSettings({
  config,
  onChange,
}: RematchAvoidanceSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) =>
                onChange({ ...config, enabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-slate-800 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
          <span className="text-sm font-semibold text-slate-700">
            リマッチ回避
          </span>
        </label>
        {config.enabled && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium"
          >
            {isExpanded ? '閉じる' : '詳細設定'}
          </button>
        )}
      </div>

      {config.enabled && isExpanded && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            直近ラウンド数
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={config.recentRounds}
            onChange={(e) =>
              onChange({ ...config, recentRounds: Number(e.target.value) })
            }
            className="w-24 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
          />
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            直近のN回の対戦で同じチーム分けや対戦カードを避けます
          </p>
        </div>
      )}
    </div>
  );
}
