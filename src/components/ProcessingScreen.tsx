export default function ProcessingScreen() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-slate-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
          チーム分け中...
        </h2>

        <div className="space-y-4">
          {[
            { step: 1, label: 'ランダム初期割当', delay: '0s' },
            { step: 2, label: '禁則チェック&スワップ', delay: '0.2s' },
            { step: 3, label: 'リマッチ回避', delay: '0.4s' },
            { step: 4, label: '最終整形（色付け/不足処理）', delay: '0.6s' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-2">{item.label}</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full animate-pulse"
                    style={{
                      width: `${100 - (item.step - 1) * 20}%`,
                      animationDelay: item.delay,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          目標: 3秒以内
        </p>
      </div>
    </div>
  );
}
