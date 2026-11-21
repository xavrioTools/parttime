import React, { useState } from 'react';
import {
  Settings2,
  Users,
  Mail,
  Mic,
  Cpu,
  CreditCard,
  Sliders,
  Shield,
  CheckCircle2,
  Database,
  Sparkles,
  Server,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'subscriptions' | 'usage' | 'settings'>('system');

  const systemMetrics = {
    totalUsers: 1420,
    activeCampaigns: 384,
    totalEmailsSent: '1,842,910',
    voiceMinutesUsed: '8,420 mins',
    aiTokensUsed: '42.8M tokens',
    mrr: '$48,920',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFD6D1] text-[#FF6B6B]">
              <Settings2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
              Platform Administration
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            MailForge AI Enterprise Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor multi-tenant infrastructure, AI token consumption, voice synthesis pipeline, and subscriptions.
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FFFDFB] dark:bg-[#1C1214] p-1.5 rounded-2xl border border-[#FFD6D1]">
          {[
            { id: 'system', label: 'Platform Stats' },
            { id: 'usage', label: 'AI & Voice Usage' },
            { id: 'subscriptions', label: 'Billing & Plans' },
            { id: 'settings', label: 'Global Relays' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF6B6B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-[#FFD6D1]/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Platform Users</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{systemMetrics.totalUsers}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% this month</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Campaigns</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{systemMetrics.activeCampaigns}</p>
          <span className="text-[10px] text-[#FF6B6B] font-semibold">Running live</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Emails Dispatched</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{systemMetrics.totalEmailsSent}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">99.4% Delivered</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Voice Minutes</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{systemMetrics.voiceMinutesUsed}</p>
          <span className="text-[10px] text-slate-400 font-semibold">12 AI Models</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">AI Tokens Used</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{systemMetrics.aiTokensUsed}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Gemini 3.8 Flash</span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFD6D1]/40 to-[#FF8A8A]/30 border border-[#FF6B6B]/40">
          <span className="text-[10px] font-bold text-[#FF6B6B] uppercase">Monthly Revenue</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{systemMetrics.mrr}</p>
          <span className="text-[10px] text-emerald-700 font-bold">ARR: $587k</span>
        </div>
      </div>

      {/* Tab: Platform Stats */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Recent Global Inbound & Outbound Activity
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { time: '1 min ago', event: 'Campaign #384 completed dispatch (420 leads)', status: 'Success' },
                { time: '4 mins ago', event: 'DKIM 2048-bit key rotation on client domain', status: 'Aligned' },
                { time: '12 mins ago', event: 'Voice synthesis batch (Urdu Corporate Executive - 180 audio files)', status: 'Generated' },
                { time: '28 mins ago', event: 'Subscription upgraded: Enterprise Agency Pro ($79/mo)', status: 'Billed' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/60 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.event}</p>
                    <p className="text-[10px] text-slate-400">{item.time}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Deliverability Engine Infrastructure Status
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1214] border border-[#FFD6D1] flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Google Workspace Relay Pool</p>
                  <p className="text-[11px] text-slate-500">12 dedicated IP pools • SPF verified</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">99.98% Healthy</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1214] border border-[#FFD6D1] flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Microsoft 365 Relay Cluster</p>
                  <p className="text-[11px] text-slate-500">DKIM auto-signers active</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">100% Aligned</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1214] border border-[#FFD6D1] flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Amazon SES Dedicated Relays</p>
                  <p className="text-[11px] text-slate-500">0.02% bounce rate</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">Pristine</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Usage */}
      {activeTab === 'usage' && (
        <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] space-y-6">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            AI Engine & Voice Model Resource Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] space-y-3">
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" /> Generative AI Models (Gemini 3.8 Flash)
              </h4>
              <p className="text-xs text-slate-500">Used for lead personalization, 3-variant generation, follow-up sequencing, and spam scoring.</p>
              <div className="p-3 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/50 text-xs font-mono">
                <p>Total API Invocations: 82,410 calls</p>
                <p>Average Latency: 320ms</p>
                <p>Error Rate: 0.00%</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] space-y-3">
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-600" /> Voice Synthesis Engine
              </h4>
              <p className="text-xs text-slate-500">Supports English & Urdu voices in Executive, Sales, and Consultant styles.</p>
              <div className="p-3 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/50 text-xs font-mono">
                <p>Minutes Rendered: 8,420 mins</p>
                <p>Urdu Language Ratio: 38%</p>
                <p>English Language Ratio: 62%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Subscriptions & Billing */}
      {activeTab === 'subscriptions' && (
        <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Active Subscription Tiers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Free Starter Tier</p>
                <p className="text-xs text-slate-500">Up to 3 campaigns • 50 leads • Basic AI</p>
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">840 Users</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border-2 border-emerald-500 flex items-center justify-between shadow-md">
              <div>
                <p className="font-bold text-sm text-emerald-700 dark:text-emerald-300">Lifetime Enterprise Pro (100% Free)</p>
                <p className="text-xs text-slate-500">All features unlocked: Unlimited campaigns • 15 AI Voices (3 New Urdu) • Deliverability</p>
              </div>
              <span className="text-xl font-extrabold text-emerald-600">1,420 Active Users</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Global Deliverability & SMTP Throttle Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Default Sending Throttle Delay (Seconds)
              </label>
              <input
                type="number"
                defaultValue={65}
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] bg-white font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Automatic Bounce Quarantine Threshold (%)
              </label>
              <input
                type="number"
                defaultValue={2.0}
                step="0.1"
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] bg-white font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
