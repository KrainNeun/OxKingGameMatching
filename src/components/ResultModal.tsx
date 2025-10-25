import { TeamDivisionResult } from '@/types';
import TeamResult from './TeamResult';
import { useEffect } from 'react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TeamDivisionResult;
  format: number;
  rematchEnabled: boolean;
  recentRounds: number;
  onRedivide: () => void;
  isProcessing: boolean;
}

export default function ResultModal({
  isOpen,
  onClose,
  result,
  format,
  rematchEnabled,
  recentRounds,
  onRedivide,
  isProcessing,
}: ResultModalProps) {
  // ESCキーでモーダルを閉じる & スクロール制御
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 背景のスクロールを完全に防ぐ
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // スクロール位置を復元
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen, onClose, isProcessing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={isProcessing ? undefined : onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-pink-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-pink-500">
              ぎゅ～っとできました！
            </h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 hover:bg-pink-100 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="閉じる"
            >
              <svg
                className="w-6 h-6 text-slate-400 group-hover:text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <TeamResult
            result={result}
            format={format}
            rematchEnabled={rematchEnabled}
            recentRounds={recentRounds}
            onRedivide={onRedivide}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
