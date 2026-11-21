import React, { useState } from 'react';
import {
  Flame,
  Mail,
  ShieldCheck,
  Mic,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Zap,
  Globe2,
  Lock,
  Send,
  Sliders,
  ChevronRight,
  HelpCircle,
  FileCheck,
  Server,
  Star,
  Layers,
} from 'lucide-react';
import { VOICE_LIBRARY, INITIAL_CONTACTS } from '../data/mockData';
import { voiceEngine } from '../utils/audioPlayer';

interface LandingPageProps {
  onStartCampaign: () => void;
  onTryDemo: () => void;
  onOpenPricing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCampaign,
  onTryDemo,
  onOpenPricing,
}) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [selectedDemoLeadIndex, setSelectedDemoLeadIndex] = useState(0);

  const handleToggleVoice = (voice: typeof VOICE_LIBRARY[0]) => {
    if (playingVoiceId === voice.id) {
      voiceEngine.stop();
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voice.id);
      voiceEngine.playVoice(
        voice.sampleText,
        voice.gender,
        voice.style,
        voice.language,
        () => setPlayingVoiceId(null)
      );
    }
  };

  const faqs = [
    {
      q: 'Does MailForge AI bypass spam filters or hack inbox providers?',
      a: 'Absolutely not. MailForge AI is strictly engineered for legitimate business communication, agency client acquisition, and verified e-commerce partnerships. We maximize deliverability using industry-standard SPF, DKIM, DMARC cryptographic alignment, content quality audits, sender warmup pacing, and high-context personalization that inbox algorithms reward with primary inbox placement.',
    },
    {
      q: 'How does the AI Voice Campaign feature work?',
      a: 'You can either provide your own script or let our AI generate a personalized, human-sounding outreach script. You can select from 12 distinct voices across Male and Female personas in English and Urdu. The recipient receives a customized audio voice note embedded alongside your high-converting email, producing 3.4x higher reply rates.',
    },
    {
      q: 'Can I import contacts from CSV, Excel, or Google Sheets?',
      a: 'Yes! Step 1 of our campaign workflow allows 1-click upload of CSVs, Excel spreadsheets, manual pastes, or Google Sheet webhook imports. Our system automatically validates email syntax, detects disposable domains, and verifies MX records before you spend sending credits.',
    },
    {
      q: 'What languages does MailForge AI support?',
      a: 'Text campaigns support English, Urdu, and Roman Urdu. Voice campaigns support English and Urdu with native regional accents, professional cadence, and executive intonation.',
    },
    {
      q: 'Which sending providers can I connect?',
      a: 'You can connect Google Workspace (Gmail), Microsoft Outlook/Office 365, Amazon SES, SendGrid, Mailgun, or any custom business SMTP relay with customized throttling intervals (e.g. 1 email per 60 seconds).',
    },
  ];

  const currentLead = INITIAL_CONTACTS[selectedDemoLeadIndex] || INITIAL_CONTACTS[0];

  return (
    <div className="mailforge-mesh-bg min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#FFD6D1]/40 via-[#FFC4C4]/30 to-[#FF8A8A]/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#FFD6D1] dark:border-[#522329] mb-8 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#FF6B6B] animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Next-Gen Cold Outreach & Deliverability Engine
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-[#FF6B6B]">SPF • DKIM • DMARC Compliant</span>
          </div>

          {/* Exact Required Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.12]">
            Create Personalized Email Campaigns{' '}
            <span className="brand-gradient-text">With AI</span>
          </h1>

          {/* Exact Required Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Upload leads, connect your business, generate personalized emails or voice campaigns and send at scale.
          </p>

          {/* Exact Required Buttons: Start Campaign & Try Demo */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onStartCampaign}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B6B] via-[#FF8A8A] to-[#FF5252] text-white font-bold text-base shadow-xl shadow-[#FF6B6B]/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="w-5 h-5 fill-white/20" />
              <span>Start Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329] text-slate-800 dark:text-slate-100 font-bold text-base hover:bg-[#FFD6D1]/30 dark:hover:bg-[#3A1B1F]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
              <span>Try Demo</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]/70 dark:border-[#522329]/70">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Domain Deliverability</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">99.4%</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Primary Inbox Placement</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]/70 dark:border-[#522329]/70">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Personalization</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">100%</p>
              <p className="text-[11px] text-[#FF6B6B] font-semibold mt-0.5">Unique hooks per lead</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]/70 dark:border-[#522329]/70">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Voice Outreach Lift</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">3.4x</p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">Higher reply engagement</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1]/70 dark:border-[#522329]/70">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Security & Compliance</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">SPF/DMARC</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">Automated validation</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive AI Personalization Showcase */}
      <section className="py-20 border-y border-[#FFD6D1]/60 dark:border-[#522329]/60 bg-[#FFFDFB]/60 dark:bg-[#1C1214]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B] px-3 py-1 rounded-full bg-[#FFD6D1]/50 dark:bg-[#522329]/50">
              AI Personalization Engine
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Every Recipient Gets a Truly Unique Email & Voice Note
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
              No robotic templates. Our engine analyzes the lead's company, recent milestones, and role to craft contextual, authentic human copy.
            </p>
          </div>

          {/* Interactive Lead Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {INITIAL_CONTACTS.slice(0, 4).map((lead, idx) => (
              <button
                key={lead.id}
                onClick={() => setSelectedDemoLeadIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDemoLeadIndex === idx
                    ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white shadow-md shadow-[#FF6B6B]/25 scale-105'
                    : 'glass-panel border border-[#FFD6D1] dark:border-[#522329] text-slate-700 dark:text-slate-300 hover:bg-[#FFD6D1]/30'
                }`}
              >
                {lead.name} • {lead.company.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Interactive Comparison Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">
            {/* Lead Dossier */}
            <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#FFD6D1]/50 dark:border-[#522329]/50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prospect Dossier</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    Verified Lead
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Name & Role</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{currentLead.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{currentLead.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Company</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentLead.company}</p>
                    <p className="text-xs text-[#FF6B6B] underline">{currentLead.website}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Context Hook</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-[#FFD6D1]/20 dark:bg-[#522329]/20 p-2.5 rounded-xl border border-[#FFD6D1]/40">
                      "{currentLead.notes}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-[#FFD6D1]/50 dark:border-[#522329]/50">
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MX Records & SPF Authenticated</span>
                </div>
              </div>
            </div>

            {/* Generated Output */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] dark:border-[#522329] shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                {/* Subject Line Bar */}
                <div className="p-3.5 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1]/80 dark:border-[#522329]/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="text-[#FF6B6B]">Subject:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {currentLead.personalizedSubject}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 hidden sm:inline">
                    Spam Score: 0.3 / 10
                  </span>
                </div>

                {/* Email Body */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#180E10] border border-[#FFD6D1]/50 dark:border-[#522329]/50 text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-3">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {currentLead.personalizedOpening}
                  </p>
                  <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                    {currentLead.personalizedBody}
                  </p>
                  <p className="font-bold text-[#FF6B6B]">
                    {currentLead.personalizedCTA}
                  </p>
                </div>

                {/* Voice Campaign Attachment Preview */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFD6D1]/30 to-[#FFC4C4]/20 dark:from-[#3A1B1F]/40 dark:to-[#522329]/30 border border-[#FFD6D1] dark:border-[#522329] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleToggleVoice({
                          id: `lead-voice-${currentLead.id}`,
                          gender: 'male',
                          style: 'executive',
                          language: currentLead.email.includes('.pk') ? 'urdu' : 'english',
                          voiceName: 'Arthur Vance',
                          sampleText: currentLead.personalizedVoiceScript || '',
                          speechRate: 1.0,
                          pitch: 1.0,
                        })
                      }
                      className="w-10 h-10 rounded-xl bg-[#FF6B6B] hover:bg-[#FF5252] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF6B6B]/25 transition-transform active:scale-95 cursor-pointer"
                    >
                      {playingVoiceId === `lead-voice-${currentLead.id}` ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      )}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#FF6B6B]" />
                        <span>Attached Personalized Voice Note ({currentLead.voiceDurationSec || 28}s)</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        "{currentLead.personalizedVoiceScript}"
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#FF6B6B] shrink-0">
                    {playingVoiceId === `lead-voice-${currentLead.id}` ? 'Playing...' : 'Click to Listen'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-[#FFD6D1]/40 dark:border-[#522329]/40">
                <span>Unique Subject • Unique Hook • Unique CTA • Voice Script</span>
                <button
                  onClick={onStartCampaign}
                  className="font-bold text-[#FF6B6B] hover:underline flex items-center gap-1"
                >
                  Generate for your leads <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 7-Step Workflow (How It Works) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B] px-3 py-1 rounded-full bg-[#FFD6D1]/50 dark:bg-[#522329]/50">
              How It Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              The 7-Step High-Yield Outreach Architecture
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
              From raw contact list to deliverability-guaranteed outreach in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Upload Contacts',
                desc: 'Upload CSV, Excel, Google Sheets, or paste manually. Pre-flight verification catches bad syntax, duplicates & disposable domains.',
              },
              {
                step: '02',
                title: 'Business Information',
                desc: 'Provide your website, store, portfolio URL, and audience. AI analyzes your value prop to inform every outbound pitch.',
              },
              {
                step: '03',
                title: 'Offer Creator',
                desc: 'Configure Free Consultation, Discount, Free Delivery, or a custom bonus offer to maximize your positive reply rate.',
              },
              {
                step: '04',
                title: 'Attachments & Assets',
                desc: 'Attach PDF brochures, case studies, videos, catalogs, or executive teardown links to build instant credibility.',
              },
              {
                step: '05',
                title: 'Campaign Type',
                desc: 'Select Cold Outreach, Warm Partnership, Promotion, Sales Pitch, Product Launch, or Customer Retention.',
              },
              {
                step: '06',
                title: 'Content & Voice Mode',
                desc: 'Choose Text Email, Voice Email, or Text + Voice Email with 12 executive voice personas.',
              },
              {
                step: '07',
                title: 'Language Selection',
                desc: 'Support for English, Urdu, and Roman Urdu with culturally nuanced business phrasing and professional intonation.',
              },
              {
                step: '08',
                title: 'Deliverability & Send',
                desc: 'Verify SPF/DKIM/DMARC status, run spam score check, set throttling intervals (60-90s) and send at scale.',
              },
            ].map((st, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] hover:border-[#FF6B6B] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#FF6B6B] opacity-80 group-hover:opacity-100 font-mono">
                    {st.step}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-[#FFD6D1]/40 dark:bg-[#522329]/40 flex items-center justify-center text-[#FF6B6B]">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Voice Campaigns Showcase (Interactive Audio Players) */}
      <section className="py-20 border-t border-[#FFD6D1]/60 dark:border-[#522329]/60 bg-[#FFFDFB]/70 dark:bg-[#1C1214]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950">
              Voice Campaigns Studio • 100% Free
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              15 Studio-Grade Voices in English & Urdu
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
              Deliver personalized audio messages straight to decision makers. Featuring <strong className="text-purple-600 dark:text-purple-400">3 New Urdu Voices (1 Man & 2 Women)</strong>: Shehryar Alvi, Hania Bukhari, and Mahnoor Kazmi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {/* Show the 3 new Urdu voices + top English voices */}
            {VOICE_LIBRARY.filter((v) => v.badge || v.id === 'voice-m-corp-en' || v.id === 'voice-f-corp-en' || v.id === 'voice-m-sales-en').map((voice) => {
              const isPlaying = playingVoiceId === voice.id;
              return (
                <div
                  key={voice.id}
                  className={`p-5 rounded-3xl glass-panel border transition-all ${
                    isPlaying
                      ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-lg'
                      : voice.badge
                      ? 'border-purple-300 dark:border-purple-900 shadow-sm'
                      : 'border-[#FFD6D1] dark:border-[#522329]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-[#FF6B6B] flex items-center justify-center text-white">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{voice.voiceName}</p>
                        <p className="text-[11px] text-slate-500 capitalize">
                          {voice.gender} • {voice.style}
                        </p>
                      </div>
                    </div>
                    {voice.badge ? (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {voice.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD6D1] text-[#FF6B6B] uppercase">
                        {voice.language}
                      </span>
                    )}
                  </div>

                  {voice.description && (
                    <p className="text-[11px] font-medium text-purple-700 dark:text-purple-300 mb-2">
                      {voice.description}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-4 line-clamp-3 bg-[#FFF8F6] dark:bg-[#140C0E] p-3 rounded-xl border border-[#FFD6D1]/40">
                    "{voice.sampleText}"
                  </p>

                  <button
                    onClick={() => handleToggleVoice(voice)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-[#FFD6D1]/50 text-slate-800 dark:text-slate-200 hover:bg-[#FFD6D1]'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause Voice Sample' : `Audition ${voice.voiceName}`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Deliverability Center & Ethics Statement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FFFDFB] via-[#FFF8F6] to-[#FFD6D1]/40 dark:from-[#1C1214] dark:to-[#3A1B1F]/30 border border-[#FFD6D1] dark:border-[#522329] shadow-xl">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B] px-3 py-1 rounded-full bg-[#FFD6D1]/60 dark:bg-[#522329]/60">
                Our Core Philosophy
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                High Deliverability Through Standards, Not Hacks
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Spam filters exist to protect users. MailForge AI does NOT try to evade security filters or game algorithms. Instead, we achieve industry-leading inbox placement by enforcing:
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#140C0E]/80 border border-[#FFD6D1]/80 dark:border-[#522329]/80">
                <ShieldCheck className="w-6 h-6 text-[#FF6B6B] mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Strict Authentication</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Automated DNS checks for SPF records, DKIM 2048-bit key alignment, and DMARC quarantine policies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#140C0E]/80 border border-[#FFD6D1]/80 dark:border-[#522329]/80">
                <Sliders className="w-6 h-6 text-[#FF6B6B] mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Reputation Warmup & Pacing</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  60-90 second randomized jitter intervals and graduated 14-day warmup ramp schedules.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#140C0E]/80 border border-[#FFD6D1]/80 dark:border-[#522329]/80">
                <Sparkles className="w-6 h-6 text-[#FF6B6B] mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Anti-Spam Content Quality</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Real-time detection of spam buzzwords, excessive capitalization, and risky link densities before sending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section (100% Free Lifetime Unlocked) */}
      <section className="py-20 border-t border-[#FFD6D1]/60 dark:border-[#522329]/60 bg-[#FFFDFB]/70 dark:bg-[#1C1214]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950">
            100% Free • All Pro Features Unlocked
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            Every Single Feature Is Free Forever
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Unlimited campaigns, 15 AI voice models (with 3 new Urdu voices), A/B testing, deliverability tools, and unlimited exports with no credit card required.
          </p>

          <div className="mt-12 max-w-2xl mx-auto text-left">
            {/* Free Lifetime Pro Plan */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDFB] dark:bg-[#1C1214] border-2 border-[#FF6B6B] shadow-2xl relative">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-[#FF6B6B] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                All Pro Features Free
              </div>

              <div>
                <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-wider">Lifetime Enterprise Access</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-wider">/ 100% Free Forever</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Complete unlocked power for agencies, direct marketing, and B2B growth teams.
                </p>

                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span className="font-semibold">Unlimited Campaigns & Contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span>All 15 AI Voice Models in English & Urdu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span className="font-semibold">3 New Urdu Voices (1 Man, 2 Women)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span>Multi-Variate A/B Testing (Variants A/B/C)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span>Auto Follow-Up Sequences with Reply Logic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span>Deliverability Center (SPF, DKIM, DMARC)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span>Real-Time Spam Score & Content Quality Audit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                    <span>CSV, Excel & PDF Executive Reporting</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onStartCampaign}
                className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white font-extrabold text-sm shadow-lg shadow-[#FF6B6B]/25 hover:brightness-105 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Free Campaign with All Pro Features</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B] px-3 py-1 rounded-full bg-[#FFD6D1]/50 dark:bg-[#522329]/50">
              Questions & Answers
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-[#FF6B6B] shrink-0 transition-transform ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-[#FFD6D1]/40 dark:border-[#522329]/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="py-16 border-t border-[#FFD6D1]/60 dark:border-[#522329]/60 bg-gradient-to-r from-[#FFD6D1]/40 via-[#FFC4C4]/30 to-[#FF8A8A]/30 dark:from-[#3A1B1F]/40 dark:to-[#522329]/40">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to Scale Your Outreach With Precision?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Upload your contact list, generate personalized copy, audit your domain deliverability, and send today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartCampaign}
              className="px-8 py-3.5 rounded-2xl bg-[#FF6B6B] text-white font-bold text-sm shadow-xl shadow-[#FF6B6B]/30 hover:bg-[#FF5252] transition-all cursor-pointer"
            >
              Start Free Campaign Now
            </button>
            <button
              onClick={onTryDemo}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#1C1214] border border-[#FFD6D1] text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-[#FFD6D1]/20 transition-all cursor-pointer"
            >
              Explore Sample Campaign
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
