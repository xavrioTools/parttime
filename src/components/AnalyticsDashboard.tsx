import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Mail,
  Send,
  Eye,
  MousePointerClick,
  MessageSquare,
  AlertOctagon,
  Award,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Campaign } from '../types/mailforge';
import { INITIAL_CAMPAIGNS } from '../data/mockData';

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  campaigns = INITIAL_CAMPAIGNS,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || 'camp-101'
  );
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const activeCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0] || INITIAL_CAMPAIGNS[0];

  const stats = activeCampaign.stats;

  // Derived rates
  const deliveryRate = stats.totalSent > 0 ? ((stats.delivered / stats.totalSent) * 100).toFixed(1) : '99.2';
  const openRate = stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(1) : '61.5';
  const clickRate = stats.opened > 0 ? ((stats.clicked / stats.opened) * 100).toFixed(1) : '46.1';
  const replyRate = stats.delivered > 0 ? ((stats.replies / stats.delivered) * 100).toFixed(1) : '12.9';
  const conversionRate = stats.replies > 0 ? ((stats.conversions / stats.replies) * 100).toFixed(1) : '29.6';
  const bounceRate = stats.totalSent > 0 ? ((stats.bounces / stats.totalSent) * 100).toFixed(1) : '1.1';

  // Export handlers
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Campaign,TotalSent,Delivered,Opened,Clicked,Replies,Bounces,Conversions\n' +
      `"${activeCampaign.title}",${stats.totalSent},${stats.delivered},${stats.opened},${stats.clicked},${stats.replies},${stats.bounces},${stats.conversions}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MailForge_Report_${activeCampaign.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFD6D1] text-[#FF6B6B]">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
              Performance & Conversion Analytics
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Outreach Intelligence & ROI Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time delivery verification, open rates, click-through engagement, and pipeline conversions.
          </p>
        </div>

        {/* Campaign Switcher & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="p-2 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-bold text-slate-900 dark:text-white"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] dark:bg-[#1C1214] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-[#FFD6D1]/20 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold shadow-md shadow-[#FF6B6B]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* Primary 7 Key Metric Cards (Required by Prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Sent */}
        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Total Sent</span>
            <Send className="w-3.5 h-3.5 text-[#FF6B6B]" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.totalSent.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 font-semibold">100% Dispatched</span>
        </div>

        {/* Delivered */}
        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Delivered</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.delivered.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">{deliveryRate}% Rate</span>
        </div>

        {/* Opened */}
        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Opened</span>
            <Eye className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.opened.toLocaleString()}
          </p>
          <span className="text-[10px] text-blue-600 font-bold">{openRate}% Open Rate</span>
        </div>

        {/* Clicked */}
        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Clicked</span>
            <MousePointerClick className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.clicked.toLocaleString()}
          </p>
          <span className="text-[10px] text-purple-600 font-bold">{clickRate}% CTR</span>
        </div>

        {/* Replies */}
        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Replies</span>
            <MessageSquare className="w-3.5 h-3.5 text-[#FF6B6B]" />
          </div>
          <p className="text-2xl font-extrabold text-[#FF6B6B] mt-1">
            {stats.replies.toLocaleString()}
          </p>
          <span className="text-[10px] text-[#FF6B6B] font-bold">{replyRate}% Reply Rate</span>
        </div>

        {/* Bounces */}
        <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Bounces</span>
            <AlertOctagon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-600 dark:text-slate-300 mt-1">
            {stats.bounces.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 font-bold">{bounceRate}% Clean</span>
        </div>

        {/* Conversions */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFD6D1]/50 to-[#FF8A8A]/30 dark:from-[#3A1B1F] dark:to-[#522329] border border-[#FF6B6B]/50">
          <div className="flex items-center justify-between text-[#FF6B6B]">
            <span className="text-[11px] font-extrabold uppercase">Won</span>
            <Award className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.conversions.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
            {conversionRate}% Deal Rate
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid: A/B Test Variant Performance & Send Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A/B Test Variant Performance */}
        <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FFD6D1]/60">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                A/B Multi-Variate Testing Results
              </h3>
              <p className="text-xs text-slate-500">Live performance comparison across variants A, B, and C.</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Variant B Leading (+12.4%)
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'Variant A',
                subject: 'Quick question regarding {{company}}’s infrastructure pipeline',
                opens: '58.4%',
                replies: '11.8%',
                share: '34% Traffic',
                color: 'bg-slate-400',
              },
              {
                label: 'Variant B (Winner)',
                subject: '3 high-yield infrastructure benchmarks for {{company}}',
                opens: '64.1%',
                replies: '16.2%',
                share: '33% Traffic',
                color: 'bg-[#FF6B6B]',
              },
              {
                label: 'Variant C',
                subject: '{{firstName}}, partnership proposal: cloud acceleration',
                opens: '52.7%',
                replies: '9.4%',
                share: '33% Traffic',
                color: 'bg-purple-500',
              },
            ].map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{v.label}</span>
                  <span className="text-slate-400 font-normal">{v.share}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic truncate">"{v.subject}"</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E]">
                    <span className="text-slate-400">Open Rate:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{v.opens}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E]">
                    <span className="text-slate-400">Reply Rate:</span>
                    <span className="font-bold text-[#FF6B6B]">{v.replies}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-Up Sequence Funnel */}
        <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#FFD6D1]/60">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Automated Sequence Funnel
                </h3>
                <p className="text-xs text-slate-500">How prospects engage through sequential touchpoints.</p>
              </div>
              <span className="text-xs font-bold text-[#FF6B6B]">3 Steps Active</span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { step: 'Initial Touch (Day 0)', sent: '1,420 sent', opened: '61% open', replies: '48 replies' },
                { step: 'Follow-Up 1 (Day 3)', sent: '890 sent (no-reply trigger)', opened: '49% open', replies: '74 replies' },
                { step: 'Follow-Up 2 (Day 6)', sent: '420 sent (opened-not-clicked)', opened: '55% open', replies: '42 replies' },
                { step: 'Break-Up Note (Day 10)', sent: '190 sent (permission to close)', opened: '68% open', replies: '18 replies' },
              ].map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/60 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{f.step}</p>
                    <p className="text-[11px] text-slate-400">{f.sent}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{f.opened}</p>
                    <p className="text-[11px] font-bold text-[#FF6B6B]">{f.replies}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 font-medium mt-4">
            💡 <strong>Sequencing insight:</strong> 64% of total campaign replies arrived on Follow-Up 1 and 2, proving the critical value of multi-touch automated outreach.
          </div>
        </div>
      </div>
    </div>
  );
};
