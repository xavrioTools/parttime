import React from 'react';
import { GameMode, ThemeMode } from '../game/types';
import { Play, Flame, Sparkles, Shield, Trophy, HelpCircle, Sun, Moon, Volume2, VolumeX } from 'lucide-react';

interface TitleMenuProps {
  theme: ThemeMode;
  highScore: number;
  selectedMode: GameMode;
  isMuted: boolean;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenHelp: () => void;
  onToggleTheme: () => void;
  onToggleSound: () => void;
}

export const TitleMenu: React.FC<TitleMenuProps> = ({
  theme,
  highScore,
  selectedMode,
  isMuted,
  onSelectMode,
  onStartGame,
  onOpenHelp,
  onToggleTheme,
  onToggleSound
}) => {
  const isNight = theme === 'night';

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Decor Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div
          className={`w-[500px] h-[500px] rounded-full blur-3xl ${
            isNight ? 'bg-[#FF0055]' : 'bg-[#FFD700]'
          }`}
        />
      </div>

      {/* Main Container Card */}
      <div
        className={`w-full max-w-xl p-6 sm:p-10 rounded-3xl border shadow-2xl relative z-10 text-center transition-all duration-300 ${
          isNight
            ? 'bg-[#1E1E1E]/95 border-[#333333] text-white shadow-[0_0_60px_rgba(255,0,85,0.25)]'
            : 'bg-[#FFFDFB]/95 border-[#004D40]/25 text-[#004D40] shadow-2xl'
        }`}
      >
        {/* Top Controls Row */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label={isNight ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isNight
                  ? 'bg-[#2A2A2A] hover:bg-[#333] text-yellow-400 border border-[#444]'
                  : 'bg-[#FFC72C] hover:bg-[#FFB300] text-[#004D40]'
              }`}
            >
              {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isNight ? 'Day Mode' : 'Night Mode'}</span>
            </button>

            <button
              onClick={onToggleSound}
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-xl border border-black/10 dark:border-white/10 opacity-70 hover:opacity-100 transition-opacity"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold opacity-80">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-mono tabular-nums">{highScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Hero Branding */}
        <div
          className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-xl transition-transform hover:scale-105 ${
            isNight
              ? 'bg-[#FF0055] text-white shadow-[0_0_30px_rgba(255,0,85,0.7)]'
              : 'bg-[#004D40] text-[#FFC72C] shadow-md'
          }`}
        >
          🧈
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2">
          Kitchen Chaos
        </h1>
        <p
          className={`text-sm sm:text-base font-extrabold uppercase tracking-widest mb-6 ${
            isNight ? 'text-[#FF0055]' : 'text-[#004D40]'
          }`}
        >
          Chef Cutter · The Golden Butter Edition
        </p>

        {/* Game Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-8 text-left">
          <button
            onClick={() => onSelectMode('CAREER')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedMode === 'CAREER'
                ? isNight
                  ? 'bg-[#FF0055]/20 border-[#FF0055] text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]'
                  : 'bg-[#FFC72C] border-[#004D40] text-[#004D40] font-bold shadow-md'
                : isNight
                ? 'bg-[#252525] border-[#333] hover:border-[#444] text-white/70'
                : 'bg-white border-[#004D40]/15 hover:border-[#004D40]/30 text-[#004D40]/80'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 font-black text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>Career</span>
            </div>
            <p className="text-[11px] opacity-75 leading-tight">
              Levels 1 to 15 with oven bombs & speed escalations.
            </p>
          </button>

          <button
            onClick={() => onSelectMode('ENDLESS')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedMode === 'ENDLESS'
                ? isNight
                  ? 'bg-[#FF0055]/20 border-[#FF0055] text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]'
                  : 'bg-[#FFC72C] border-[#004D40] text-[#004D40] font-bold shadow-md'
                : isNight
                ? 'bg-[#252525] border-[#333] hover:border-[#444] text-white/70'
                : 'bg-white border-[#004D40]/15 hover:border-[#004D40]/30 text-[#004D40]/80'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 font-black text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Endless</span>
            </div>
            <p className="text-[11px] opacity-75 leading-tight">
              Survive cascading volleys and rack up multipliers.
            </p>
          </button>

          <button
            onClick={() => onSelectMode('ZEN')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedMode === 'ZEN'
                ? isNight
                  ? 'bg-[#FF0055]/20 border-[#FF0055] text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]'
                  : 'bg-[#FFC72C] border-[#004D40] text-[#004D40] font-bold shadow-md'
                : isNight
                ? 'bg-[#252525] border-[#333] hover:border-[#444] text-white/70'
                : 'bg-white border-[#004D40]/15 hover:border-[#004D40]/30 text-[#004D40]/80'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 font-black text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Zen Slicer</span>
            </div>
            <p className="text-[11px] opacity-75 leading-tight">
              Pure relaxing butter slice flow with zero bombs.
            </p>
          </button>
        </div>

        {/* Big Start Button */}
        <button
          onClick={onStartGame}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${
            isNight
              ? 'bg-[#FF0055] hover:bg-[#FF1493] text-white shadow-[0_0_25px_rgba(255,0,85,0.6)]'
              : 'bg-[#004D40] hover:bg-[#00332C] text-[#FFD700]'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Chopping</span>
        </button>

        {/* Help Link */}
        <button
          onClick={onOpenHelp}
          className="mt-4 text-xs font-bold opacity-75 hover:opacity-100 flex items-center justify-center gap-1.5 mx-auto transition-opacity"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How to Play & Avoid Bakery Bombs</span>
        </button>
      </div>
    </div>
  );
};
