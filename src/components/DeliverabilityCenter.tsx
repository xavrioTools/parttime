import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Flame,
  Search,
  RefreshCw,
  Sparkles,
  Link2,
  FileText,
  Sliders,
  ChevronRight,
  TrendingUp,
  Lock,
  Server,
  Zap,
} from 'lucide-react';
import { INITIAL_DELIVERABILITY } from '../data/mockData';
import { DeliverabilityHealth } from '../types/mailforge';

export const DeliverabilityCenter: React.FC = () => {
  const [metrics, setMetrics] = useState<DeliverabilityHealth>(INITIAL_DELIVERABILITY);
  const [domainToTest, setDomainToTest] = useState('apexflow.tech');
  const [isAuditing, setIsAuditing] = useState(false);

  // Live Spam Score Tester state
  const [testSubject, setTestSubject] = useState(
    'Quick thought on scaling your cloud operations'
  );
  const [testBody, setTestBody] = useState(
    `Hi {{firstName}},\n\nI reviewed your recent enterprise announcement. Our benchmark shows a 38% efficiency upside for your infrastructure team.\n\nWould you be open to a 10-minute introductory call this Thursday?`
  );
  const [analyzingContent, setAnalyzingContent] = useState(false);
  const [spamAuditResult, setSpamAuditResult] = useState<any>(null);

  // Run Domain Audit
  const handleRunDomainAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setMetrics((prev) => ({
        ...prev,
        domainHealthScore: 99,
        senderReputation: 98,
        spf: {
          ...prev.spf,
          status: 'pass',
          details: `SPF verified on ${domainToTest}. 3 DNS lookups detected. Zero syntax flags.`,
        },
      }));
    }, 1200);
  };

  // Run Content Spam Score Analysis
  const handleAnalyzeContent = async () => {
    setAnalyzingContent(true);
    try {
      const res = await fetch('/api/ai/analyze-deliverability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: testSubject, body: testBody }),
      });
      const data = await res.json();
      setSpamAuditResult(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingContent(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFD6D1] text-[#FF6B6B]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
              Deliverability & Compliance Center
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Domain Health, Authentication & Spam Scoring
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Maximize inbox placement through SPF, DKIM, DMARC verification, content quality audits, and sender reputation monitoring.
          </p>
        </div>

        {/* Domain Health Pill & Recheck Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FFFDFB] dark:bg-[#1C1214] p-2 rounded-2xl border border-[#FFD6D1]">
            <input
              type="text"
              value={domainToTest}
              onChange={(e) => setDomainToTest(e.target.value)}
              className="px-2 py-1 text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden"
              placeholder="yourdomain.com"
            />
            <button
              onClick={handleRunDomainAudit}
              disabled={isAuditing}
              className="px-3 py-1.5 rounded-xl bg-[#FF6B6B] hover:bg-[#FF5252] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing...' : 'Check Domain'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Score Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Domain Health Score */}
        <div className="p-5 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Domain Health</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Optimal
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {metrics.domainHealthScore}<span className="text-base text-slate-400 font-normal">/100</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.domainHealthScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">0 blacklists detected across 58 providers</p>
        </div>

        {/* Sender Reputation */}
        <div className="p-5 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Sender Reputation</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Tier 1 High
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {metrics.senderReputation}<span className="text-base text-slate-400 font-normal">/100</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#FF6B6B] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.senderReputation}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Bounce rate maintained strictly &lt; 1.2%</p>
        </div>

        {/* Spam Score */}
        <div className="p-5 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Spam Trigger Risk</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Ultra Low
            </span>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {metrics.spamScore}<span className="text-base text-slate-400 font-normal">/10</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(metrics.spamScore / 10) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">No aggressive promotional buzzwords found</p>
        </div>

        {/* Warmup Status */}
        <div className="p-5 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Warmup Schedule</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Active Ramp
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Day 8<span className="text-base text-slate-400 font-normal">/14</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `57%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Current safe volume: 45 sends/day</p>
        </div>
      </div>

      {/* Triad Authentication: SPF, DKIM, DMARC */}
      <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Cryptographic Authentication Checks (SPF • DKIM • DMARC)
          </h3>
          <p className="text-xs text-slate-500">
            Mandatory standards enforced by Google, Yahoo, Microsoft and corporate security firewalls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SPF Card */}
          <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] dark:border-[#522329] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">SPF (Sender Policy Framework)</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
              </span>
            </div>
            <p className="text-xs text-slate-500">{metrics.spf.details}</p>
            <div className="p-2.5 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/60 font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all">
              {metrics.spf.record}
            </div>
          </div>

          {/* DKIM Card */}
          <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] dark:border-[#522329] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">DKIM (DomainKeys Identified Mail)</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
              </span>
            </div>
            <p className="text-xs text-slate-500">{metrics.dkim.details}</p>
            <div className="p-2.5 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/60 font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all">
              Selector: {metrics.dkim.selector}
            </div>
          </div>

          {/* DMARC Card */}
          <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] dark:border-[#522329] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">DMARC (Reporting & Conformance)</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
              </span>
            </div>
            <p className="text-xs text-slate-500">{metrics.dmarc.details}</p>
            <div className="p-2.5 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/60 font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all">
              Policy: p={metrics.dmarc.policy} (Aggregate XML alerts enabled)
            </div>
          </div>
        </div>
      </div>

      {/* Live Content Spam Score & Quality Auditor */}
      <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Real-Time Content & Subject Line Spam Auditor
            </h3>
            <p className="text-xs text-slate-500">
              Type or paste your outbound copy below. Our auditor inspects trigger words, reading grade, and link counts.
            </p>
          </div>

          <button
            onClick={handleAnalyzeContent}
            disabled={analyzingContent}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzingContent ? 'Auditing Content...' : 'Audit Content Quality'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject Line to Audit
              </label>
              <input
                type="text"
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Body Copy
              </label>
              <textarea
                rows={6}
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Audit Results */}
          <div className="p-5 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#FFD6D1]/60">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Auditor Telemetry</span>
                <span className="text-xs font-extrabold text-[#FF6B6B]">
                  Spam Rating:{' '}
                  {spamAuditResult ? spamAuditResult.spamRating : 'Pristine (0.4/10)'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#1C1214] border border-[#FFD6D1]/50">
                  <p className="text-slate-400 font-medium">Word Count</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {testBody.split(/\s+/).filter(Boolean).length} words (Sweet spot: 75-125)
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1C1214] border border-[#FFD6D1]/50">
                  <p className="text-slate-400 font-medium">Reading Grade</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {spamAuditResult ? spamAuditResult.readingGrade : '8th Grade'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Actionable Deliverability Recommendations:
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Clean syntax with zero spam triggers detected (e.g. "free", "urgent", "make $$$").</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Single clear question CTA ensures high conversation momentum.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Plain text structure delivers 99.4% inbox placement over heavy HTML layouts.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#FFD6D1]/60 text-[11px] text-slate-500 flex items-center justify-between">
              <span>RFC 5322 & CAN-SPAM compliant</span>
              <span className="font-bold text-emerald-600">Passed Pre-Flight</span>
            </div>
          </div>
        </div>
      </div>

      {/* 14-Day Warmup Recommendations Schedule */}
      <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            14-Day Email Warmup Ramp Schedule
          </h3>
          <p className="text-xs text-slate-500">
            Graduated volume ramp-up to safely establish sender authority with Gmail, Microsoft, and Yahoo algorithms.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-xs">
          {[
            { day: 'Day 1-2', vol: '15 / day', status: 'completed' },
            { day: 'Day 3-4', vol: '25 / day', status: 'completed' },
            { day: 'Day 5-6', vol: '35 / day', status: 'completed' },
            { day: 'Day 7-8', vol: '50 / day', status: 'current' },
            { day: 'Day 9-10', vol: '75 / day', status: 'upcoming' },
            { day: 'Day 11-12', vol: '120 / day', status: 'upcoming' },
            { day: 'Day 13-14', vol: '200+ / day', status: 'upcoming' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all ${
                item.status === 'completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
                  : item.status === 'current'
                  ? 'bg-[#FFD6D1] dark:bg-[#522329] border-[#FF6B6B] shadow-sm'
                  : 'bg-[#FFFDFB] dark:bg-[#1C1214] border-[#FFD6D1] opacity-75'
              }`}
            >
              <p className="font-bold text-slate-700 dark:text-slate-300">{item.day}</p>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{item.vol}</p>
              <span className="text-[10px] font-bold uppercase mt-1 block">
                {item.status === 'completed' ? '✓ Passed' : item.status === 'current' ? '● In Progress' : 'Planned'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
