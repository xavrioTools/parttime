import React from 'react';
import { GameMetrics, ThemeMode } from '../game/types';
import { RotateCcw, Trophy, Award, Zap, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface GameOverModalProps {
  metrics: GameMetrics;
  theme: ThemeMode;
  onRestart: () => void;
  onExitMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  metrics,
  theme,
  onRestart,
  onExitMenu
}) => {
  const isNight = theme === 'night';

  const totalTypedAttempts = metrics.wordsTypedAccurately + metrics.mistakes;
  const accuracyPercent = totalTypedAttempts > 0
    ? Math.round((metrics.wordsTypedAccurately / totalTypedAttempts) * 100)
    : 100;

  const isNewHighScore = metrics.score >= metrics.highScore && metrics.score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-2xl border shadow-2xl text-center relative transition-colors ${
          isNight
            ? 'bg-[#1E1E1E] border-[#333333] text-white shadow-[0_0_40px_rgba(255,0,85,0.2)]'
            : 'bg-[#FFFDFB] border-[#004D40]/30 text-[#004D40] shadow-xl'
        }`}
      >
        {/* Header Icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md ${
            isNight
              ? 'bg-[#2A2A2A] border border-[#FF0055]/50 text-[#FF0055]'
              : 'bg-[#FFC72C] text-[#004D40]'
          }`}
        >
          {isNewHighScore ? <Trophy className="w-8 h-8" /> : '🍳'}
        </div>

        {isNewHighScore && (
          <div className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-black tracking-wide uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
            ★ New High Score! ★
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
          Kitchen Shift Ended
        </h2>
        <p className="text-xs sm:text-sm opacity-70 mb-6">
          The chef's station is wiped down. Check your cut performance:
        </p>

        {/* Big Score Display */}
        <div
          className={`py-4 px-6 rounded-xl border mb-6 ${
            isNight
              ? 'bg-[#252525] border-[#3A3A3A]'
              : 'bg-[#FFC72C]/20 border-[#004D40]/15'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-65 block mb-1">
            Final Culinary Score
          </span>
          <span className="font-mono font-black text-4xl sm:text-5xl tabular-nums tracking-tight">
            {metrics.score.toLocaleString()}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div
            className={`p-3 rounded-lg border ${
              isNight ? 'bg-[#242424] border-[#333]' : 'bg-white border-[#004D40]/10'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs opacity-65 font-bold mb-0.5">
              <Award className="w-3.5 h-3.5" />
              <span>Level Reached</span>
            </div>
            <span className="font-mono font-black text-lg">
              {metrics.level} <span className="text-xs font-semibold opacity-60">/ 15</span>
            </span>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              isNight ? 'bg-[#242424] border-[#333]' : 'bg-white border-[#004D40]/10'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs opacity-65 font-bold mb-0.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Max Multiplier</span>
            </div>
            <span className="font-mono font-black text-lg">{metrics.maxCombo}x Combo</span>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              isNight ? 'bg-[#242424] border-[#333]' : 'bg-white border-[#004D40]/10'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs opacity-65 font-bold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Total Slices</span>
            </div>
            <span className="font-mono font-black text-lg">{metrics.slices}</span>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              isNight ? 'bg-[#242424] border-[#333]' : 'bg-white border-[#004D40]/10'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs opacity-65 font-bold mb-0.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Accuracy</span>
            </div>
            <span className="font-mono font-black text-lg">{accuracyPercent}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md ${
              isNight
                ? 'bg-[#FF0055] hover:bg-[#FF1493] text-white shadow-[0_0_20px_rgba(255,0,85,0.5)]'
                : 'bg-[#004D40] hover:bg-[#00332C] text-[#FFD700]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onExitMenu}
            className={`py-3 px-4 rounded-xl font-bold text-sm border transition-colors ${
              isNight
                ? 'border-[#444] hover:bg-[#2A2A2A] text-white/80'
                : 'border-[#004D40]/20 hover:bg-[#004D40]/10 text-[#004D40]'
            }`}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
