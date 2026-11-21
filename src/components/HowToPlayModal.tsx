import React from 'react';
import { ThemeMode } from '../game/types';
import { X, Keyboard, AlertTriangle, Sparkles, Flame, Eye } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  theme,
  onClose
}) => {
  if (!isOpen) return null;
  const isNight = theme === 'night';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-7 rounded-2xl border shadow-2xl relative transition-colors ${
          isNight
            ? 'bg-[#1E1E1E] border-[#333333] text-white shadow-[0_0_40px_rgba(255,0,85,0.2)]'
            : 'bg-[#FFFDFB] border-[#004D40]/30 text-[#004D40] shadow-xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 font-black shadow-sm ${
              isNight ? 'bg-[#FF0055] text-white' : 'bg-[#FFC72C] text-[#004D40]'
            }`}
          >
            🧈
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Chef Cutter Rules
            </h2>
            <p className="text-xs opacity-70">
              The Golden Butter Edition Mechanics Guide
            </p>
          </div>
        </div>

        {/* Rules Sections */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Rule 1: Typing Slasher */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isNight ? 'bg-[#252525] border-[#333]' : 'bg-[#FFC72C]/15 border-[#004D40]/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isNight ? 'bg-[#FF0055]/20 text-[#FF0055]' : 'bg-[#004D40] text-[#FFD700]'
              }`}
            >
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">1. Type Floating Food Words</h3>
              <p className="opacity-80 leading-relaxed text-xs">
                Food items (Apples, Tomatoes, Watermelons, Avocados) fling upwards in parabolic gravity arcs. Type their floating lowercase word to trigger a molten butter slice trail and split them in half!
              </p>
            </div>
          </div>

          {/* Rule 2: Bakery Bombs Danger */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isNight
                ? 'bg-red-950/30 border-red-500/40'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1 text-red-500">
                2. Avoid Glowing Oven Bombs (Level 3+)
              </h3>
              <p className="opacity-80 leading-relaxed text-xs">
                Starting at Level 3, heavy glowing Oven Bombs launch into the mix. <strong className="font-black">DO NOT TYPE BOMB WORDS!</strong> Slicing a bomb causes a white screen flash, deducts <span className="font-black">500 points</span>, and destroys your combo streak!
              </p>
            </div>
          </div>

          {/* Rule 3: Golden Butter Bars */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isNight ? 'bg-[#252525] border-[#333]' : 'bg-[#FFC72C]/20 border-[#004D40]/15'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isNight ? 'bg-amber-400/20 text-amber-400' : 'bg-[#FFC72C] text-[#004D40]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">3. Churned Golden Butter Bars</h3>
              <p className="opacity-80 leading-relaxed text-xs">
                Rare blocks of shimmering golden butter appear during rushes. Slicing them triggers a massive blast of molten golden butter particles and awards <span className="font-bold">300+ bonus points</span>!
              </p>
            </div>
          </div>

          {/* Rule 4: Combo Streaks */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isNight ? 'bg-[#252525] border-[#333]' : 'bg-[#FFC72C]/15 border-[#004D40]/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isNight ? 'bg-[#FF0055]/20 text-[#FF0055]' : 'bg-[#004D40] text-[#FFD700]'
              }`}
            >
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">4. Multiplier Chaining (Up to 10x)</h3>
              <p className="opacity-80 leading-relaxed text-xs">
                Slice items in quick succession before the combo meter bar expires to build up multipliers: 2x, 3x, 5x, 8x, and 10x!
              </p>
            </div>
          </div>

          {/* Rule 5: Dual Controls */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isNight ? 'bg-[#252525] border-[#333]' : 'bg-[#FFC72C]/15 border-[#004D40]/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isNight ? 'bg-emerald-400/20 text-emerald-400' : 'bg-[#004D40] text-[#FFD700]'
              }`}
            >
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">5. Dual Typing + Blade Swiping</h3>
              <p className="opacity-80 leading-relaxed text-xs">
                You can slice using your physical keyboard or by clicking & dragging your mouse / touch swipe across airborne items!
              </p>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className={`w-full mt-6 py-3 px-4 rounded-xl font-black text-sm transition-transform active:scale-95 shadow-md ${
            isNight
              ? 'bg-[#FF0055] hover:bg-[#FF1493] text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]'
              : 'bg-[#004D40] hover:bg-[#00332C] text-[#FFD700]'
          }`}
        >
          Got It, Chef!
        </button>
      </div>
    </div>
  );
};
