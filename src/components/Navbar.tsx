import React, { useState } from 'react';
import {
  Flame,
  Mail,
  ShieldCheck,
  Mic,
  BarChart3,
  Users,
  Building2,
  Settings2,
  Plus,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  onOpenPricingModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isPremium: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCreateModal,
  onOpenPricingModal,
  darkMode,
  setDarkMode,
  isPremium,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Layers },
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
    { id: 'deliverability', label: 'Deliverability', icon: ShieldCheck, badge: '98%' },
    { id: 'voice', label: 'Voice Studio', icon: Mic },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'team', label: 'Team', icon: Building2 },
    { id: 'admin', label: 'Admin', icon: Settings2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FFD6D1]/60 bg-[#FFF8F6]/85 backdrop-blur-xl dark:border-[#522329]/60 dark:bg-[#120A0B]/85 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B6B] to-[#FF8A8A] flex items-center justify-center text-white shadow-md shadow-[#FF6B6B]/25 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    MailForge<span className="text-[#FF6B6B]">.ai</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFD6D1] text-[#FF6B6B] dark:bg-[#522329] dark:text-[#FF8A8A]">
                    v3.2
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  AI Outreach & Voice Campaigns
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#FFFDFB]/80 dark:bg-[#1C1214]/80 p-1.5 rounded-2xl border border-[#FFD6D1]/70 dark:border-[#522329]/70 shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white shadow-sm shadow-[#FF6B6B]/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#FFD6D1]/30 dark:hover:bg-[#3A1B1F]/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-[#FFD6D1] text-[#FF6B6B] dark:bg-[#522329] dark:text-[#FF8A8A]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Pricing, Dark Mode, New Campaign */}
          <div className="flex items-center gap-2.5">
            {/* Plan Badge / Free Pro Unlocked */}
            <button
              onClick={onOpenPricingModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free Pro Unlocked</span>
              <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded-md font-extrabold ml-0.5">
                100% FREE
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-slate-600 dark:text-slate-300 hover:bg-[#FFD6D1]/30 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Start Campaign CTA */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] hover:brightness-105 active:scale-95 text-white text-xs font-bold shadow-md shadow-[#FF6B6B]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Start Campaign</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] px-4 pt-3 pb-5 space-y-1.5 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-[#FFD6D1]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#FFD6D1]/50 dark:border-[#522329]/50 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenPricingModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#FF6B6B] dark:text-[#FF8A8A]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPremium ? 'Active Plan: Enterprise' : 'View Pricing Plans'}</span>
            </button>
            <button
              onClick={() => {
                onOpenCreateModal();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#FF6B6B] text-white text-xs font-bold"
            >
              Start Campaign
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
