import React from 'react';
import { ThemeMode, GameMetrics, LevelConfig, GameState } from '../game/types';
import { Volume2, VolumeX, Sun, Moon, Pause, Play, HelpCircle, Flame, Sparkles } from 'lucide-react';

interface GameHUDProps {
  metrics: GameMetrics;
  currentLevelConfig: LevelConfig;
  theme: ThemeMode;
  gameState: GameState;
  isMuted: boolean;
  isMusicActive: boolean;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onTogglePause: () => void;
  onOpenHelp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  metrics,
  currentLevelConfig,
  theme,
  gameState,
  isMuted,
  isMusicActive,
  onToggleTheme,
  onToggleSound,
  onToggleMusic,
  onTogglePause,
  onOpenHelp
}) => {
  const isNight = theme === 'night';

  const progressPercent = Math.min(
    100,
    Math.round((metrics.levelSlicesProgress / currentLevelConfig.targetSlices) * 100)
  );

  return (
    <header
      className={`w-full px-4 sm:px-6 py-3 border-b select-none transition-colors duration-200 ${
        isNight
          ? 'bg-[#1E1E1E]/95 border-[#333333] text-white'
          : 'bg-[#FFC72C]/95 border-[#004D40]/20 text-[#004D40]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-transform hover:scale-105 shadow-sm ${
              isNight
                ? 'bg-[#FF0055] text-white shadow-[0_0_12px_rgba(255,0,85,0.5)]'
                : 'bg-[#004D40] text-[#FFC72C]'
            }`}
          >
            🧈
          </div>
          <div className="leading-tight">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight whitespace-nowrap">
              Kitchen Chaos<span className={isNight ? 'text-[#FF0055]' : 'text-[#004D40]'}>: Chef Cutter</span>
            </h1>
            <p className="text-[11px] font-semibold opacity-75 whitespace-nowrap">
              The Golden Butter Edition
            </p>
          </div>
        </div>

        {/* Center: Live Metrics HUD */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Level & Progress */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isNight ? 'bg-[#2A2A2A] text-[#FF0055]' : 'bg-[#004D40] text-white'
              }`}
            >
              LVL {metrics.level}
            </span>
            <div className="text-xs font-semibold whitespace-nowrap">
              <span>{currentLevelConfig.title}</span>
              <span className="opacity-50 mx-1.5">·</span>
              <span className="font-mono tabular-nums">
                {metrics.levelSlicesProgress}/{currentLevelConfig.targetSlices}
              </span>
            </div>
            {/* Progress mini bar */}
            <div className="w-16 h-2 rounded-full overflow-hidden bg-black/15">
              <div
                className={`h-full transition-all duration-300 ${
                  isNight ? 'bg-[#FF0055]' : 'bg-[#004D40]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Score & High Score */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Score</span>
              <span className="font-mono font-black text-xl tabular-nums leading-none">
                {metrics.score.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col opacity-75">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Best</span>
              <span className="font-mono font-bold text-sm tabular-nums leading-none">
                {metrics.highScore.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Multiplier / Combo */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-xs transition-all ${
                metrics.currentCombo > 1
                  ? isNight
                    ? 'bg-[#FF0055] text-white shadow-[0_0_12px_rgba(255,0,85,0.6)] animate-pulse'
                    : 'bg-[#004D40] text-[#FFD700] shadow-sm'
                  : 'opacity-40 bg-black/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{metrics.currentCombo}x MULTIPLIER</span>
            </div>

            {metrics.currentCombo > 1 && (
              <div className="w-12 h-1.5 rounded-full overflow-hidden bg-black/20">
                <div
                  className={`h-full transition-all duration-75 ${
                    isNight ? 'bg-[#FF0055]' : 'bg-[#004D40]'
                  }`}
                  style={{ width: `${metrics.comboTimer * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Functional Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Pause / Play */}
          {gameState === 'PLAYING' || gameState === 'PAUSED' ? (
            <button
              onClick={onTogglePause}
              aria-label={gameState === 'PAUSED' ? 'Resume Game' : 'Pause Game'}
              className={`p-2 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                isNight
                  ? 'bg-[#2A2A2A] hover:bg-[#333333] text-white border border-[#444444]'
                  : 'bg-[#004D40] hover:bg-[#00332C] text-[#FFC72C]'
              }`}
            >
              {gameState === 'PAUSED' ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
              <span className="hidden sm:inline">{gameState === 'PAUSED' ? 'Resume' : 'Pause'}</span>
            </button>
          ) : null}

          {/* Music Groove Toggle */}
          <button
            onClick={onToggleMusic}
            title={isMusicActive ? 'Mute Kitchen Music Groove' : 'Play Kitchen Music Groove'}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isMusicActive
                ? isNight
                  ? 'bg-[#FF0055]/20 text-[#FF0055] border border-[#FF0055]/50'
                  : 'bg-[#004D40]/20 text-[#004D40] border border-[#004D40]/40'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Flame className={`w-4 h-4 ${isMusicActive ? 'animate-bounce' : ''}`} />
            <span className="hidden xl:inline">Groove</span>
          </button>

          {/* SFX Mute Button */}
          <button
            onClick={onToggleSound}
            aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Day / Night Theme Switch */}
          <button
            onClick={onToggleTheme}
            aria-label={isNight ? 'Switch to Golden Butter Bliss (Day Mode)' : 'Switch to Neon Shadow Bakery (Night Mode)'}
            title={isNight ? 'Golden Butter Bliss (Day)' : 'Neon Shadow Bakery (Night)'}
            className={`p-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all ${
              isNight
                ? 'bg-[#2A2A2A] hover:bg-[#333333] text-yellow-400 border border-[#444444]'
                : 'bg-[#004D40] hover:bg-[#00332C] text-[#FFD700]'
            }`}
          >
            {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden md:inline font-bold">
              {isNight ? 'Day Mode' : 'Night Mode'}
            </span>
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            aria-label="How to play instructions"
            className="p-2 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Metrics Strip */}
      <div className="lg:hidden mt-2 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
              isNight ? 'bg-[#FF0055] text-white' : 'bg-[#004D40] text-white'
            }`}
          >
            LVL {metrics.level}
          </span>
          <span className="font-mono tabular-nums">
            {metrics.levelSlicesProgress}/{currentLevelConfig.targetSlices}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-70">SCORE</span>
          <span className="font-mono font-bold">{metrics.score.toLocaleString()}</span>
        </div>

        <div
          className={`px-2 py-0.5 rounded font-black text-[11px] ${
            metrics.currentCombo > 1
              ? isNight
                ? 'bg-[#FF0055] text-white'
                : 'bg-[#004D40] text-[#FFD700]'
              : 'opacity-40'
          }`}
        >
          {metrics.currentCombo}x
        </div>
      </div>
    </header>
  );
};
