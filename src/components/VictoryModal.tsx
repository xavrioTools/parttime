import React, { useEffect } from 'react';
import { GameMetrics, ThemeMode } from '../game/types';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, RotateCcw } from 'lucide-react';

interface VictoryModalProps {
  metrics: GameMetrics;
  theme: ThemeMode;
  onRestart: () => void;
  onExitMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  metrics,
  theme,
  onRestart,
  onExitMenu
}) => {
  const isNight = theme === 'night';

  useEffect(() => {
    // Golden confetti blast!
    const colors = isNight
      ? ['#FF0055', '#FF1493', '#FFFFFF', '#FFA3C2']
      : ['#FFD700', '#FFC72C', '#004D40', '#FFFFFF'];

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [isNight]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border text-center relative transition-colors ${
          isNight
            ? 'bg-[#1E1E1E] border-[#FF0055]/50 text-white shadow-[0_0_50px_rgba(255,0,85,0.4)]'
            : 'bg-[#FFFDFB] border-[#FFC72C] text-[#004D40] shadow-2xl'
        }`}
      >
        <div
          className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-xl animate-bounce ${
            isNight
              ? 'bg-[#FF0055] text-white shadow-[0_0_30px_rgba(255,0,85,0.8)]'
              : 'bg-[#FFC72C] text-[#004D40]'
          }`}
        >
          <Crown className="w-12 h-12" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-500 border border-amber-400/40">
          <Sparkles className="w-3.5 h-3.5" />
          Level 15 Cleared · Legendary Chef
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          THE GOLDEN BUTTER MASTER!
        </h2>
        <p className="text-xs sm:text-sm opacity-75 mb-6 max-w-sm mx-auto">
          You conquered all 15 progressive kitchen waves, avoided bakery oven bombs, and attained supreme butter blade alchemy.
        </p>

        {/* Master Score Display */}
        <div
          className={`py-5 px-6 rounded-2xl border mb-6 ${
            isNight
              ? 'bg-[#252525] border-[#FF0055]/40'
              : 'bg-[#FFC72C]/25 border-[#004D40]/20'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1">
            Master Chef Final Score
          </span>
          <span className="font-mono font-black text-5xl sm:text-6xl tabular-nums">
            {metrics.score.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className={`flex-1 py-3.5 px-5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg ${
              isNight
                ? 'bg-[#FF0055] hover:bg-[#FF1493] text-white shadow-[0_0_25px_rgba(255,0,85,0.6)]'
                : 'bg-[#004D40] hover:bg-[#00332C] text-[#FFD700]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onExitMenu}
            className={`py-3.5 px-5 rounded-xl font-bold text-sm border transition-colors ${
              isNight
                ? 'border-[#444] hover:bg-[#2A2A2A] text-white/80'
                : 'border-[#004D40]/20 hover:bg-[#004D40]/10 text-[#004D40]'
            }`}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
