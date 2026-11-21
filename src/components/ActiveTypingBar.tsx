import React from 'react';
import { FlyingItem, ThemeMode } from '../game/types';
import { Keyboard, Flame, AlertTriangle } from 'lucide-react';

interface ActiveTypingBarProps {
  activeTarget: FlyingItem | null;
  typedBuffer: string;
  theme: ThemeMode;
}

export const ActiveTypingBar: React.FC<ActiveTypingBarProps> = ({
  activeTarget,
  typedBuffer,
  theme
}) => {
  const isNight = theme === 'night';

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none max-w-lg w-[92%]">
      <div
        className={`px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-lg flex items-center justify-between gap-3 transition-all ${
          isNight
            ? 'bg-[#1E1E1E]/90 border-[#333333] text-white shadow-black/60'
            : 'bg-[#004D40]/90 border-[#00332C] text-[#FFD700] shadow-[#004D40]/30'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isNight ? 'bg-[#FF0055] text-white' : 'bg-[#FFC72C] text-[#004D40]'
            }`}
          >
            <Keyboard className="w-4 h-4" />
          </div>

          <div className="truncate text-left">
            {activeTarget ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Target:
                </span>
                <span className="font-mono font-black text-base sm:text-lg tracking-wider">
                  <span
                    className={
                      activeTarget.isBomb
                        ? 'text-red-500 font-extrabold'
                        : isNight
                        ? 'text-[#FF0055]'
                        : 'text-[#FFE57F]'
                    }
                  >
                    {activeTarget.word.slice(0, activeTarget.typedLength)}
                  </span>
                  <span className="text-white opacity-95">
                    {activeTarget.word.slice(activeTarget.typedLength)}
                  </span>
                </span>
                {activeTarget.isBomb && (
                  <span className="flex items-center gap-1 text-[11px] font-black text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/50 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    DO NOT TYPE!
                  </span>
                )}
                {activeTarget.isGoldenButter && (
                  <span className="flex items-center gap-1 text-[11px] font-black text-yellow-300 bg-yellow-900/40 px-1.5 py-0.5 rounded border border-yellow-500/40">
                    <Flame className="w-3 h-3" />
                    3X BUTTER BONUS
                  </span>
                )}
              </div>
            ) : typedBuffer ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Typing:
                </span>
                <span className="font-mono font-black text-base tracking-wider text-white">
                  {typedBuffer}
                  <span className="animate-pulse">_</span>
                </span>
              </div>
            ) : (
              <p className="text-xs font-semibold text-white/90">
                Type floating word to slice <span className="opacity-60 hidden sm:inline">· Or swipe blade</span>
              </p>
            )}
          </div>
        </div>

        {/* Quick controls hint */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono opacity-70 shrink-0">
          <span>[Esc] Pause</span>
        </div>
      </div>
    </div>
  );
};
