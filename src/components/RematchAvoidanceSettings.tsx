import { RematchAvoidanceConfig } from '@/types';

interface RematchAvoidanceSettingsProps {
  config: RematchAvoidanceConfig;
  onChange: (config: RematchAvoidanceConfig) => void;
}

export default function RematchAvoidanceSettings({
  config,
  onChange,
}: RematchAvoidanceSettingsProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* リマッチ回避トグル */}
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
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-rose-400 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
          </div>
          <span className="text-sm font-semibold text-slate-700">
            リマッチ回避
          </span>
        </label>

        {/* 直近N回 */}
        {config.enabled && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 whitespace-nowrap">
              直近
            </label>
            <select
              value={config.recentRounds}
              onChange={(e) =>
                onChange({ ...config, recentRounds: Number(e.target.value) })
              }
              className="px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-sm min-w-[70px]"
            >
              <option value={1}>1回</option>
              <option value={2}>2回</option>
              <option value={3}>3回</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
