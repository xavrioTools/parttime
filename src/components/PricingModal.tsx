import React from 'react';
import { X, CheckCircle2, Sparkles, Flame, ShieldCheck, Mic, Gift, Heart, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  setIsPremium: (val: boolean) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  setIsPremium,
}) => {
  if (!isOpen) return null;

  const handleClaimFreePro = () => {
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#FF8A8A', '#FFD6D1', '#FFC4C4', '#10B981'],
    });
    setIsPremium(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] dark:border-[#522329] rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Special Announcement Banner */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free Plan — All Pro & Enterprise Features Unlocked</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Every Feature is Free. Forever.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            No credit card, no hidden fees, and no paywalls. All Pro features, AI voice campaigns, and deliverability tools are 100% free for all users.
          </p>
        </div>

        {/* Highlighted Free Pro Plan Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDFB] via-[#FFF8F6] to-[#FFD6D1]/40 dark:from-[#1C1214] dark:to-[#3A1B1F]/40 border-2 border-[#FF6B6B] shadow-xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
                Lifetime Free Enterprise Access
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                  / 100% Free & Uncapped
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>All Pro Features Active</span>
            </div>
          </div>

          {/* Feature List Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">Unlimited Campaigns & Contacts</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">All 15 AI Voice Models (English & Urdu)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">3 New Urdu Voices (1 Man & 2 Women)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">Multi-Variate A/B Testing (Variants A/B/C)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">Automated Follow-Ups with Reply Logic</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">SPF, DKIM & DMARC Validation Center</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">Real-Time Spam Score & Content Quality Audit</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">Unlimited CSV, Excel & PDF Report Exports</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">Team Workspaces & Role Permissions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
              <span className="font-semibold">Relay Throttling (60-90s reputation guard)</span>
            </div>
          </div>

          <button
            onClick={handleClaimFreePro}
            className="mt-8 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white font-extrabold text-sm shadow-lg shadow-[#FF6B6B]/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enjoy Full Free Access (No Payment Needed)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
