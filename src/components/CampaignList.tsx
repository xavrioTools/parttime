import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Play,
  Pause,
  Trash2,
  BarChart3,
  Users,
  Mic,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Campaign } from '../types/mailforge';
import { INITIAL_CAMPAIGNS } from '../data/mockData';

interface CampaignListProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  onOpenCreateWizard: () => void;
  onViewAnalytics: (campaignId: string) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  setCampaigns,
  onOpenCreateWizard,
  onViewAnalytics,
}) => {
  const [filter, setFilter] = useState<'all' | 'running' | 'completed' | 'draft'>('all');

  const filtered = campaigns.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const handleToggleStatus = (id: string) => {
    setCampaigns(
      campaigns.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'running' ? 'paused' : 'running';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFD6D1] text-[#FF6B6B]">
              <Mail className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
              Outreach Campaigns
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Active Email & Voice Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time open rates, personalized voice notes, and automated follow-up sequences.
          </p>
        </div>

        <button
          onClick={onOpenCreateWizard}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-extrabold shadow-md shadow-[#FF6B6B]/25 hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign (7 Steps)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'running', 'completed', 'draft'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filter === tab
                ? 'bg-[#FF6B6B] text-white shadow-xs'
                : 'bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] text-slate-600 dark:text-slate-300 hover:bg-[#FFD6D1]/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel border border-[#FFD6D1] text-center space-y-3">
            <Mail className="w-12 h-12 text-[#FF6B6B] mx-auto opacity-70" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              No campaigns found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start your first AI email or voice outreach campaign using our 7-step guided wizard.
            </p>
            <button
              onClick={onOpenCreateWizard}
              className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Campaign
            </button>
          </div>
        ) : (
          filtered.map((campaign) => {
            const openPercent =
              campaign.stats.delivered > 0
                ? ((campaign.stats.opened / campaign.stats.delivered) * 100).toFixed(1)
                : '0.0';
            const replyPercent =
              campaign.stats.delivered > 0
                ? ((campaign.stats.replies / campaign.stats.delivered) * 100).toFixed(1)
                : '0.0';

            return (
              <div
                key={campaign.id}
                className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] hover:border-[#FF6B6B] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          campaign.status === 'running'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : campaign.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        ● {campaign.status}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD6D1] text-[#FF6B6B] uppercase">
                        {campaign.campaignType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase">
                        {campaign.contentType} • {campaign.language}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Created on {campaign.createdAt} • Sender: {campaign.sendingConfig.senderEmail}
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(campaign.id)}
                      className="p-2 rounded-xl border border-[#FFD6D1] hover:bg-[#FFD6D1]/30 text-slate-700 dark:text-slate-300"
                      title={campaign.status === 'running' ? 'Pause Campaign' : 'Resume Campaign'}
                    >
                      {campaign.status === 'running' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>
                    <button
                      onClick={() => onViewAnalytics(campaign.id)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Analytics</span>
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Performance Numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-3 border-t border-[#FFD6D1]/50 dark:border-[#522329]/50 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Leads</span>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {campaign.contacts.length} contacts
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Delivered</span>
                    <p className="font-extrabold text-sm text-emerald-600 mt-0.5">
                      {campaign.stats.delivered} sent
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Open Rate</span>
                    <p className="font-extrabold text-sm text-blue-600 mt-0.5">{openPercent}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Reply Rate</span>
                    <p className="font-extrabold text-sm text-[#FF6B6B] mt-0.5">{replyPercent}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Conversions</span>
                    <p className="font-extrabold text-sm text-purple-600 mt-0.5">
                      {campaign.stats.conversions} won
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Deliverability</span>
                    <p className="font-extrabold text-sm text-emerald-600 mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> SPF/DKIM Pass
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
