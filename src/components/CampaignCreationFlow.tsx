import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Globe,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Paperclip,
  Mic,
  Mail,
  Send,
  Sliders,
  Play,
  Pause,
  Clock,
  ShieldCheck,
  Eye,
  RefreshCw,
  Copy,
  Check,
  Link as LinkIcon,
  HelpCircle,
  Settings,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Campaign,
  Contact,
  BusinessInfo,
  Offer,
  OfferType,
  AttachmentItem,
  CampaignType,
  ContentType,
  Language,
  VoiceConfig,
  EmailVariant,
  FollowUpStep,
  SendingConfig,
} from '../types/mailforge';
import {
  INITIAL_BUSINESS_INFO,
  INITIAL_OFFER,
  INITIAL_CONTACTS,
  VOICE_LIBRARY,
  INITIAL_VARIANTS,
  INITIAL_DELIVERABILITY,
} from '../data/mockData';
import { voiceEngine } from '../utils/audioPlayer';

interface CampaignCreationFlowProps {
  onCampaignCreated: (campaign: Campaign) => void;
  onCancel: () => void;
}

export const CampaignCreationFlow: React.FC<CampaignCreationFlowProps> = ({
  onCampaignCreated,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8; // Steps 1 to 7 + Step 8 (Review, AI Generate & Launch)

  // Step 1: Contacts state
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [manualInput, setManualInput] = useState<string>('');
  const [maxContactsPerCampaign, setMaxContactsPerCampaign] = useState<number>(500);
  const [importTab, setImportTab] = useState<'csv' | 'manual' | 'sheets'>('csv');

  // Step 2: Business Info state
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(INITIAL_BUSINESS_INFO);
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);

  // Step 3: Offer state
  const [offer, setOffer] = useState<Offer>(INITIAL_OFFER);

  // Step 4: Attachments state
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    {
      id: 'att-1',
      name: 'ApexFlow-Enterprise-Playbook.pdf',
      type: 'pdf',
      sizeFormatted: '2.4 MB',
      url: 'https://apexflow.tech/docs/playbook.pdf',
      description: 'Executive 14-page whitepaper.',
    },
  ]);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentType, setNewAttachmentType] = useState<AttachmentItem['type']>('pdf');

  // Step 5: Campaign Type
  const [campaignType, setCampaignType] = useState<CampaignType>('cold_outreach');

  // Step 6: Content Type
  const [contentType, setContentType] = useState<ContentType>('both');

  // Step 7: Language
  const [language, setLanguage] = useState<Language>('english');

  // Review & Engine Configurations (Step 8)
  const [emailWriteMode, setEmailWriteMode] = useState<'user' | 'ai'>('ai');
  const [voiceScriptMode, setVoiceScriptMode] = useState<'user' | 'ai'>('ai');
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfig>(VOICE_LIBRARY[0]);
  const [variants, setVariants] = useState<EmailVariant[]>(INITIAL_VARIANTS);
  const [activeVariantTab, setActiveVariantTab] = useState<'A' | 'B' | 'C'>('A');
  const [abTestingEnabled, setAbTestingEnabled] = useState(true);
  const [trafficSplit, setTrafficSplit] = useState<[number, number, number]>([34, 33, 33]);
  const [followUps, setFollowUps] = useState<FollowUpStep[]>([
    {
      id: 'fu-1',
      stepNumber: 1,
      dayDelay: 3,
      trigger: 'no_reply',
      subject: 'Re: Quick question regarding {{company}}’s infrastructure pipeline',
      body: 'Hi {{firstName}}, floating this back to the top of your inbox in case it got buried under weekly sprints.\n\nDid you have a chance to review the 3-point benchmark we prepared for {{company}}?',
      enabled: true,
    },
    {
      id: 'fu-2',
      stepNumber: 2,
      dayDelay: 6,
      trigger: 'opened_not_clicked',
      subject: 'Case study: How similar teams cut deploy delays by 41%',
      body: 'Hey {{firstName}}, noticed you checked out my previous note. Thought you might appreciate seeing the exact architectural teardown we implemented for a peer team.\n\nHappy to share the raw framework if helpful.',
      enabled: true,
    },
  ]);

  const [sendingConfig, setSendingConfig] = useState<SendingConfig>({
    provider: 'smtp',
    senderName: 'Arthur Vance | ApexFlow',
    senderEmail: 'arthur.vance@apexflow.tech',
    replyToEmail: 'inbound@apexflow.tech',
    dailyLimit: 250,
    sendIntervalSec: 65,
    scheduleMode: 'immediate',
    trackOpens: true,
    trackClicks: true,
    sendWindowStart: '08:30',
    sendWindowEnd: '17:30',
    timeZone: 'America/New_York (EST)',
  });

  // AI Generation Loading state
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [inspectingContactId, setInspectingContactId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Email validation helper
  const validateEmailSyntax = (email: string): { status: 'valid' | 'invalid' | 'risky'; msg?: string } => {
    const trimmed = email.trim();
    if (!trimmed.includes('@')) return { status: 'invalid', msg: 'Missing @ symbol' };
    const parts = trimmed.split('@');
    if (parts.length !== 2) return { status: 'invalid', msg: 'Multiple @ symbols' };
    if (!parts[1].includes('.')) return { status: 'invalid', msg: 'Missing domain extension' };
    if (parts[1].endsWith('.')) return { status: 'invalid', msg: 'Trailing dot in domain' };
    const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com'];
    if (disposableDomains.includes(parts[1].toLowerCase())) {
      return { status: 'risky', msg: 'Disposable temporary domain' };
    }
    return { status: 'valid' };
  };

  // Handle Manual List parsing
  const handleAddManualEmails = () => {
    if (!manualInput.trim()) return;
    const lines = manualInput.split('\n').filter((l) => l.trim().length > 0);
    const newContacts: Contact[] = lines.map((line, idx) => {
      // support "Sarah Jenkins, sarah@luminahealth.io, Lumina Health, VP"
      const cols = line.split(',').map((c) => c.trim());
      const name = cols[0] || `Lead ${contacts.length + idx + 1}`;
      const email = cols[1] || (cols[0].includes('@') ? cols[0] : `lead${contacts.length + idx + 1}@example.com`);
      const company = cols[2] || 'Enterprise Corp';
      const role = cols[3] || 'Decision Maker';

      const validation = validateEmailSyntax(email);
      return {
        id: `manual-${Date.now()}-${idx}`,
        name,
        email,
        company,
        role,
        status: validation.status,
        validationMessage: validation.msg,
        tags: ['Manual Input'],
        personalizedSubject: `Partnership proposal for ${company}`,
        personalizedOpening: `Hi ${name.split(' ')[0]}, saw your leadership at ${company}.`,
        personalizedBody: `At ${businessInfo.companyName}, we help leaders in your sector scale operations efficiently.`,
        personalizedCTA: `Would you be open to a 10-minute introductory call?`,
      };
    });

    setContacts((prev) => [...prev, ...newContacts]);
    setManualInput('');
  };

  // AI Auto-Extract URL simulation
  const handleAutoExtractUrl = async () => {
    if (!businessInfo.websiteUrl) return;
    setIsExtractingUrl(true);
    try {
      const res = await fetch('/api/ai/scrape-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: businessInfo.websiteUrl }),
      });
      const data = await res.json();
      if (data.data) {
        setBusinessInfo((prev) => ({
          ...prev,
          companyName: data.data.companyName || prev.companyName,
          companyDescription: data.data.companyDescription || prev.companyDescription,
          businessCategory: data.data.businessCategory || prev.businessCategory,
          targetAudience: data.data.targetAudience || prev.targetAudience,
          industry: data.data.industry || prev.industry,
          valueProposition: data.data.valueProposition || prev.valueProposition,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtractingUrl(false);
    }
  };

  // Run AI Campaign Generation (Generates Variants, FollowUps & Lead Personalizations)
  const handleRunAICampaignGeneration = async () => {
    setIsGeneratingWithAI(true);
    try {
      const res = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessInfo,
          offer,
          campaignType,
          contentType,
          language,
        }),
      });
      const result = await res.json();
      if (result.data) {
        if (result.data.variants) {
          setVariants(result.data.variants);
        }
        if (result.data.followUps) {
          setFollowUps(
            result.data.followUps.map((fu: any, i: number) => ({
              id: `fu-${i + 1}`,
              stepNumber: fu.stepNumber,
              dayDelay: fu.dayDelay,
              trigger: fu.trigger,
              subject: fu.subject,
              body: fu.body,
              enabled: true,
            }))
          );
        }
      }

      // Also generate personalized copy for top contacts
      const updatedContacts = contacts.map((c) => ({
        ...c,
        personalizedSubject: `Quick idea on ${c.company}'s 2026 ${businessInfo.industry || 'growth'} focus`,
        personalizedOpening: `Hi ${c.name.split(' ')[0]}, saw your impressive work at ${c.company}—congrats on the momentum!`,
        personalizedBody: `Given your role as ${c.role}, managing workflow bottlenecks while scaling can be demanding. We helped several organizations in your sector streamline communications with verified deliverability.\n\n${
          offer.enabled ? `We would love to extend our ${offer.title} to the ${c.company} team.` : ''
        }`,
        personalizedCTA: `Would you be open to a 10-minute sync this Wednesday?`,
        personalizedVoiceScript: `Hi ${c.name.split(' ')[0]}, greetings from ${businessInfo.companyName}. Saw your impressive leadership at ${c.company}. I left a personalized note in your inbox regarding our deliverability benchmark. Looking forward to speaking!`,
        voiceDurationSec: 24,
      }));
      setContacts(updatedContacts);
    } catch (err) {
      console.error('AI Campaign generation failed:', err);
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  // Trigger audio playback
  const handleToggleVoice = (script: string) => {
    if (playingVoiceId) {
      voiceEngine.stop();
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId('sample');
      voiceEngine.playVoice(
        script,
        selectedVoice.gender,
        selectedVoice.style,
        selectedVoice.language,
        () => setPlayingVoiceId(null)
      );
    }
  };

  // Launch Campaign
  const handleLaunchCampaign = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#FF8A8A', '#FFD6D1', '#FFC4C4'],
    });

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      title: `${businessInfo.companyName} • ${campaignType.replace('_', ' ').toUpperCase()} (${language.toUpperCase()})`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'running',
      contacts: contacts.filter((c) => c.status === 'valid'),
      businessInfo,
      offer,
      attachments,
      campaignType,
      contentType,
      language,
      voiceConfig: selectedVoice,
      emailWriteMode,
      voiceScriptMode,
      variants,
      abTestingEnabled,
      trafficSplit,
      followUps,
      sendingConfig,
      deliverability: INITIAL_DELIVERABILITY,
      stats: {
        totalSent: contacts.filter((c) => c.status === 'valid').length,
        delivered: contacts.filter((c) => c.status === 'valid').length,
        opened: 0,
        clicked: 0,
        replies: 0,
        bounces: 0,
        conversions: 0,
      },
    };

    onCampaignCreated(newCampaign);
  };

  const validCount = contacts.filter((c) => c.status === 'valid').length;
  const invalidCount = contacts.filter((c) => c.status === 'invalid').length;
  const riskyCount = contacts.filter((c) => c.status === 'risky').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header & Step Progress Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B] px-2.5 py-0.5 rounded-full bg-[#FFD6D1] dark:bg-[#522329]">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs text-slate-400">• MailForge Campaign Studio</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {currentStep === 1 && 'Step 1: Upload & Validate Contacts'}
              {currentStep === 2 && 'Step 2: Business & Product Information'}
              {currentStep === 3 && 'Step 3: High-Converting Offer Creator'}
              {currentStep === 4 && 'Step 4: Attachments & Collateral'}
              {currentStep === 5 && 'Step 5: Select Campaign Strategy'}
              {currentStep === 6 && 'Step 6: Choose Content Format'}
              {currentStep === 7 && 'Step 7: Language & Dialect'}
              {currentStep === 8 && 'Step 8: AI Content Engine & Launch'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-[#FFD6D1]/30 transition-colors"
            >
              Cancel
            </button>
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl border border-[#FFD6D1] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FFD6D1]/20 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold shadow-md shadow-[#FF6B6B]/20 flex items-center gap-1.5 cursor-pointer"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleLaunchCampaign}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white text-xs font-extrabold shadow-lg shadow-[#FF6B6B]/30 flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Campaign
              </button>
            )}
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="grid grid-cols-8 gap-1.5 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              onClick={() => setCurrentStep(s)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                s === currentStep
                  ? 'bg-[#FF6B6B] shadow-sm shadow-[#FF6B6B]'
                  : s < currentStep
                  ? 'bg-[#FF8A8A]'
                  : 'bg-[#FFD6D1]/60 dark:bg-[#3A1B1F]'
              }`}
              title={`Step ${s}`}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          STEP 1: UPLOAD CONTACTS
         ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Add Your Recipient Leads
                </h3>
                <p className="text-xs text-slate-500">
                  Accepts CSV, Excel (.xlsx), Google Sheets, or manual copy-paste. Email syntax and domain validity checked instantly.
                </p>
              </div>

              {/* Max Contacts Config */}
              <div className="flex items-center gap-2 bg-[#FFFDFB] dark:bg-[#1C1214] p-2 rounded-xl border border-[#FFD6D1] text-xs">
                <span className="text-slate-500 font-medium">Max Limit:</span>
                <input
                  type="number"
                  value={maxContactsPerCampaign}
                  onChange={(e) => setMaxContactsPerCampaign(parseInt(e.target.value) || 500)}
                  className="w-20 px-2 py-1 bg-transparent font-bold text-slate-900 dark:text-white border-b border-[#FF6B6B] text-center focus:outline-hidden"
                />
                <span className="text-slate-400">leads</span>
              </div>
            </div>

            {/* Import Method Tabs */}
            <div className="flex items-center gap-2 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60 pb-3 mb-6">
              {[
                { id: 'csv', label: 'CSV / Excel Upload', icon: Upload },
                { id: 'manual', label: 'Manual Email List', icon: FileText },
                { id: 'sheets', label: 'Google Sheets Import', icon: FileSpreadsheet },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = importTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setImportTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FF6B6B] text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-[#FFD6D1]/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CSV / Excel Tab */}
            {importTab === 'csv' && (
              <div className="border-2 border-dashed border-[#FFD6D1] dark:border-[#522329] rounded-2xl p-8 text-center bg-[#FFF8F6]/50 dark:bg-[#140C0E]/50">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD6D1] dark:bg-[#3A1B1F] text-[#FF6B6B] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Drop your CSV or Excel file here
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Auto-detects Name, Email, Company, Role, Website and Notes headers.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold cursor-pointer hover:bg-[#FF5252]">
                    Choose File
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          // simulated upload parsing
                          alert(`File ${e.target.files[0].name} uploaded! Parsing contacts.`);
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={() => {
                      // Append sample batch
                      const sampleBatch: Contact[] = [
                        {
                          id: `c-${Date.now()}-1`,
                          name: 'Oliver Vance',
                          email: 'oliver.v@stratusdata.com',
                          company: 'Stratus Data Cloud',
                          role: 'VP Engineering',
                          website: 'https://stratusdata.com',
                          status: 'valid',
                          tags: ['SaaS', 'Cloud'],
                          notes: 'Migrating legacy kubernetes workloads',
                        },
                        {
                          id: `c-${Date.now()}-2`,
                          name: 'Fatima Zahra',
                          email: 'fatima@indushub.pk',
                          company: 'Indus Logistics Hub',
                          role: 'Supply Chain Director',
                          website: 'https://indushub.pk',
                          status: 'valid',
                          tags: ['Logistics', 'Pakistan'],
                          notes: 'Urdu bilingual preference',
                        },
                      ];
                      setContacts((prev) => [...prev, ...sampleBatch]);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#FFD6D1] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#FFD6D1]/30 cursor-pointer"
                  >
                    Load Sample B2B Leads
                  </button>
                </div>
              </div>
            )}

            {/* Manual Email List Tab */}
            {importTab === 'manual' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Paste emails one per line or comma-separated format: <code>Name, Email, Company, Role</code>
                </p>
                <textarea
                  rows={4}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. John Doe, john@acmecorp.com, Acme Corp, CTO&#10;Aisha Khan, aisha@fintech.io, FinTech Global, Head of Ops"
                  className="w-full p-3.5 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B]"
                />
                <button
                  onClick={handleAddManualEmails}
                  className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold hover:bg-[#FF5252] cursor-pointer"
                >
                  Parse & Validate Leads
                </button>
              </div>
            )}

            {/* Google Sheets Tab */}
            {importTab === 'sheets' && (
              <div className="p-6 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1] space-y-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Connect Google Sheet Webhook</h4>
                    <p className="text-[11px] text-slate-500">Live sync new rows directly into your MailForge campaign.</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                  className="w-full p-2.5 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-white dark:bg-[#1C1214] text-xs"
                />
                <button
                  onClick={() => alert('Connected! Synced columns: Name, Email, Company, Role.')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  Sync Google Sheet
                </button>
              </div>
            )}
          </div>

          {/* Validation Summary Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-300 font-bold">Valid & Verified</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Ready for outreach</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{validCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs text-amber-900 dark:text-amber-300 font-bold">Risky / Generic</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">Catch-all / Free mail</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300">{riskyCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="text-xs text-rose-900 dark:text-rose-300 font-bold">Invalid Syntax</p>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400">Auto-quarantined</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-rose-700 dark:text-rose-300">{invalidCount}</span>
            </div>
          </div>

          {/* Contact Table Preview */}
          <div className="rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] overflow-hidden">
            <div className="p-4 bg-[#FFFDFB] dark:bg-[#1C1214] border-b border-[#FFD6D1]/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Loaded Contacts ({contacts.length})
              </span>
              <button
                onClick={() => setContacts([])}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF8F6] dark:bg-[#140C0E] text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Lead Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Company & Role</th>
                    <th className="p-3">Website</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFD6D1]/40 dark:divide-[#522329]/40">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FFD6D1]/15 transition-colors">
                      <td className="p-3">
                        {c.status === 'valid' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Valid
                          </span>
                        )}
                        {c.status === 'risky' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Risky
                          </span>
                        )}
                        {c.status === 'invalid' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            <XCircle className="w-3 h-3 text-rose-600" /> Bad Syntax
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{c.name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{c.email}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {c.company} <span className="text-slate-400">({c.role})</span>
                      </td>
                      <td className="p-3 text-[#FF6B6B] truncate max-w-[120px]">{c.website || '—'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setContacts(contacts.filter((item) => item.id !== c.id))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: BUSINESS INFORMATION
         ========================================================================= */}
      {currentStep === 2 && (
        <div className="p-8 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Connect Your Business Context
              </h3>
              <p className="text-xs text-slate-500">
                Our AI uses this context to automatically align outreach copy with your unique strengths and case studies.
              </p>
            </div>
            <button
              onClick={handleAutoExtractUrl}
              disabled={isExtractingUrl}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:brightness-105 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isExtractingUrl ? 'Crawling & Analyzing...' : 'AI Auto-Extract from URL'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={businessInfo.companyName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, companyName: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Website URL *
              </label>
              <input
                type="url"
                value={businessInfo.websiteUrl}
                onChange={(e) => setBusinessInfo({ ...businessInfo, websiteUrl: e.target.value })}
                placeholder="https://yourcompany.com"
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Store URL (Optional)
              </label>
              <input
                type="url"
                value={businessInfo.storeUrl || ''}
                onChange={(e) => setBusinessInfo({ ...businessInfo, storeUrl: e.target.value })}
                placeholder="https://store.yourcompany.com"
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Product URL (Optional)
              </label>
              <input
                type="url"
                value={businessInfo.productUrl || ''}
                onChange={(e) => setBusinessInfo({ ...businessInfo, productUrl: e.target.value })}
                placeholder="https://yourcompany.com/product"
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Service URL (Optional)
              </label>
              <input
                type="url"
                value={businessInfo.serviceUrl || ''}
                onChange={(e) => setBusinessInfo({ ...businessInfo, serviceUrl: e.target.value })}
                placeholder="https://yourcompany.com/services"
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Portfolio / Case Studies URL (Optional)
              </label>
              <input
                type="url"
                value={businessInfo.portfolioUrl || ''}
                onChange={(e) => setBusinessInfo({ ...businessInfo, portfolioUrl: e.target.value })}
                placeholder="https://yourcompany.com/case-studies"
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Category
              </label>
              <input
                type="text"
                value={businessInfo.businessCategory}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessCategory: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={businessInfo.targetAudience}
                onChange={(e) => setBusinessInfo({ ...businessInfo, targetAudience: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Company Description & Value Proposition *
            </label>
            <textarea
              rows={3}
              value={businessInfo.companyDescription}
              onChange={(e) => setBusinessInfo({ ...businessInfo, companyDescription: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: OFFER CREATOR
         ========================================================================= */}
      {currentStep === 3 && (
        <div className="p-8 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FFD6D1]/60">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Do you want to include an offer?
              </h3>
              <p className="text-xs text-slate-500">
                Offers drastically increase reply rates by giving prospects an immediate low-risk incentive to respond.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={offer.enabled}
                onChange={(e) => setOffer({ ...offer, enabled: e.target.checked })}
                className="w-4 h-4 text-[#FF6B6B] rounded border-gray-300"
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Include Offer in Pitch</span>
            </label>
          </div>

          {offer.enabled ? (
            <div className="space-y-6">
              {/* Offer Type Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'free_consultation', label: 'Free Consultation', icon: '🤝' },
                  { id: 'discount', label: 'Discount', icon: '🏷️' },
                  { id: 'free_delivery', label: 'Free Delivery', icon: '🚚' },
                  { id: 'bonus_service', label: 'Bonus Service', icon: '🎁' },
                  { id: 'custom', label: 'Custom Offer', icon: '✨' },
                ].map((item) => {
                  const isSelected = offer.type === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setOffer({ ...offer, type: item.id as OfferType })}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-md'
                          : 'glass-panel border-[#FFD6D1] dark:border-[#522329] text-slate-700 dark:text-slate-300 hover:bg-[#FFD6D1]/30'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{item.icon}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Offer Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Offer Headline / Title
                  </label>
                  <input
                    type="text"
                    value={offer.title}
                    onChange={(e) => setOffer({ ...offer, title: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expiration Window (Days)
                  </label>
                  <input
                    type="number"
                    value={offer.expirationDays || 7}
                    onChange={(e) => setOffer({ ...offer, expirationDays: parseInt(e.target.value) || 7 })}
                    className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Offer Specifics & Terms
                </label>
                <textarea
                  rows={3}
                  value={offer.details}
                  onChange={(e) => setOffer({ ...offer, details: e.target.value })}
                  placeholder="Describe what the prospect receives, e.g. Free 45-minute audit report with no commitment."
                  className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1] text-center">
              <p className="text-xs text-slate-500">
                You have selected to proceed without a formal promotional offer. Outbound copy will focus on consultative insights, industry benchmarks, and strategic partnership.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 4: ATTACHMENTS
         ========================================================================= */}
      {currentStep === 4 && (
        <div className="p-8 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Attachments & Media Collateral
            </h3>
            <p className="text-xs text-slate-500">
              Attach Images, Videos, PDFs, Catalogs, Brochures, Documents or Custom Links to your campaign.
            </p>
          </div>

          {/* Add Attachment Form */}
          <div className="p-5 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1] space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Attach New Asset or Link</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Asset Type</label>
                <select
                  value={newAttachmentType}
                  onChange={(e) => setNewAttachmentType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-white dark:bg-[#1C1214] text-xs font-semibold"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="catalog">Product Catalog</option>
                  <option value="brochure">Brochure</option>
                  <option value="image">Image Asset</option>
                  <option value="video">Video Teardown</option>
                  <option value="document">Executive Brief</option>
                  <option value="link">Custom Link</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">File Name or Title</label>
                <input
                  type="text"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  placeholder="e.g. ApexFlow-2026-Case-Studies.pdf"
                  className="w-full p-2.5 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-white dark:bg-[#1C1214] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Action</label>
                <button
                  onClick={() => {
                    if (!newAttachmentName.trim()) return;
                    setAttachments([
                      ...attachments,
                      {
                        id: `att-${Date.now()}`,
                        name: newAttachmentName,
                        type: newAttachmentType,
                        sizeFormatted: '1.2 MB',
                        url: newAttachmentUrl || 'https://apexflow.tech/collateral/file.pdf',
                        description: 'Custom campaign collateral',
                      },
                    ]);
                    setNewAttachmentName('');
                    setNewAttachmentUrl('');
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold hover:bg-[#FF5252] cursor-pointer"
                >
                  Add Attachment
                </button>
              </div>
            </div>
          </div>

          {/* Current Attachments List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Attached to this campaign ({attachments.length}):
            </span>
            {attachments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No attachments added. (Pure text emails achieve the highest deliverability).</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-2xl glass-panel border border-[#FFD6D1] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FFD6D1] text-[#FF6B6B] flex items-center justify-center shrink-0">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{att.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{att.type} • {att.sizeFormatted}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: CAMPAIGN TYPE
         ========================================================================= */}
      {currentStep === 5 && (
        <div className="p-8 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Choose Campaign Objective & Type
            </h3>
            <p className="text-xs text-slate-500">
              Defines the strategic intent, persuasion angle, and framing of your communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: 'cold_outreach',
                title: 'Cold Outreach',
                desc: 'Net-new client acquisition with zero prior relationship. Emphasizes problem-solving and immediate value.',
              },
              {
                id: 'warm_outreach',
                title: 'Warm Outreach',
                desc: 'Past clients, warm inbound leads, or previous event connections looking to re-engage.',
              },
              {
                id: 'partnership',
                title: 'Partnership',
                desc: 'Co-marketing, joint venture, distribution agreements, and B2B affiliate proposals.',
              },
              {
                id: 'promotion',
                title: 'Promotion',
                desc: 'Time-sensitive discounts, seasonal launches, and commercial product promotions.',
              },
              {
                id: 'sales_pitch',
                title: 'Sales Pitch',
                desc: 'Direct solution presentation tailored to high-ticket corporate decision makers.',
              },
              {
                id: 'product_launch',
                title: 'Product Launch',
                desc: 'Unveiling a new feature, platform version, or enterprise release.',
              },
              {
                id: 'follow_up',
                title: 'Follow Up',
                desc: 'Structured sequences designed to revive dormant conversations gracefully.',
              },
              {
                id: 'customer_retention',
                title: 'Customer Retention',
                desc: 'Account expansion, QBR invitations, feedback surveys, and upsell roadmaps.',
              },
              {
                id: 'custom',
                title: 'Custom Campaign',
                desc: 'Fully bespoke outbound strategy customized to specialized niche requirements.',
              },
            ].map((st) => {
              const isSelected = campaignType === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setCampaignType(st.id as CampaignType)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-tr from-[#FF6B6B] to-[#FF8A8A] text-white border-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/25 scale-[1.02]'
                      : 'glass-panel border-[#FFD6D1] dark:border-[#522329] text-slate-800 dark:text-slate-200 hover:bg-[#FFD6D1]/30'
                  }`}
                >
                  <h4 className="font-bold text-sm mb-1">{st.title}</h4>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {st.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 6: CONTENT TYPE
         ========================================================================= */}
      {currentStep === 6 && (
        <div className="p-8 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Choose Content Mode
            </h3>
            <p className="text-xs text-slate-500">
              Combine written email copy with AI-synthesized personalized voice notes for multi-sensory outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                id: 'text',
                title: 'Text Email Only',
                desc: 'Standard high-deliverability written email with dynamic personalization tags.',
                icon: Mail,
              },
              {
                id: 'voice',
                title: 'Voice Email Only',
                desc: 'Embedded personalized audio voice player sent directly to the recipient.',
                icon: Mic,
              },
              {
                id: 'both',
                title: 'Text + Voice Email',
                desc: 'Recommended: Written personalized email with an embedded playable executive voice note.',
                badge: 'Highest Reply Rate (3.4x)',
                icon: Sparkles,
              },
            ].map((ct) => {
              const Icon = ct.icon;
              const isSelected = contentType === ct.id;
              return (
                <button
                  key={ct.id}
                  onClick={() => setContentType(ct.id as ContentType)}
                  className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#FFFDFB] dark:bg-[#1C1214] border-2 border-[#FF6B6B] shadow-xl ring-2 ring-[#FF6B6B]/20'
                      : 'glass-panel border-[#FFD6D1] dark:border-[#522329] hover:bg-[#FFD6D1]/20'
                  }`}
                >
                  {ct.badge && (
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#FF6B6B] text-white text-[10px] font-extrabold uppercase tracking-wider">
                      {ct.badge}
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD6D1] text-[#FF6B6B] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                    {ct.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {ct.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 7: LANGUAGE SELECTION
         ========================================================================= */}
      {currentStep === 7 && (
        <div className="p-8 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Language Selection
            </h3>
            <p className="text-xs text-slate-500">
              Select the target language for your campaign copy and synthesized voice notes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                id: 'english',
                title: 'English',
                textSupport: 'Full English Text Generation',
                voiceSupport: '6 English Voice Personas (Male & Female)',
                sample: 'Good morning. I reviewed your recent enterprise expansion...',
              },
              {
                id: 'urdu',
                title: 'Urdu (اردو)',
                textSupport: 'Native Nastaliq / Urdu Script',
                voiceSupport: '6 Urdu Voice Personas (Male & Female)',
                sample: 'السلام علیکم، ہم نے آپ کے بزنس کی حالیہ ترقی دیکھی ہے۔۔۔',
              },
              {
                id: 'roman_urdu',
                title: 'Roman Urdu',
                textSupport: 'Phonetic Romanized Urdu (Popular in Pakistan/UAE)',
                voiceSupport: 'Phonetic Urdu Pronunciation',
                sample: 'Assalam-o-Alaikum, hum ne aap ke business ki jadeed growth dekhi hai...',
              },
            ].map((lang) => {
              const isSelected = language === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as Language)}
                  className={`p-6 rounded-3xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFDFB] dark:bg-[#1C1214] border-2 border-[#FF6B6B] shadow-xl ring-2 ring-[#FF6B6B]/20'
                      : 'glass-panel border-[#FFD6D1] dark:border-[#522329] hover:bg-[#FFD6D1]/20'
                  }`}
                >
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                    {lang.title}
                  </h4>
                  <div className="space-y-1 my-3 text-[11px] text-slate-500">
                    <p className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-[#FF6B6B]" /> {lang.textSupport}
                    </p>
                    <p className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <Mic className="w-3.5 h-3.5 text-purple-600" /> {lang.voiceSupport}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-[#FFF8F6] dark:bg-[#140C0E] p-2.5 rounded-xl border border-[#FFD6D1]/50">
                    "{lang.sample}"
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 8: AI CONTENT ENGINE & LAUNCH
         ========================================================================= */}
      {currentStep === 8 && (
        <div className="space-y-8">
          {/* AI Generation Control Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFFDFB] via-[#FFF8F6] to-[#FFD6D1]/50 dark:from-[#1C1214] dark:to-[#3A1B1F]/40 border border-[#FFD6D1] dark:border-[#522329] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-wider">
                  AI Multi-Agent Content Engine
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white mt-1">
                Generate Variants, Follow-Ups & Voice Outreach
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                Automatically drafts 3 high-converting email variants for A/B testing, builds automated follow-up sequences, and creates tailored voice scripts.
              </p>
            </div>

            <button
              onClick={handleRunAICampaignGeneration}
              disabled={isGeneratingWithAI}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white font-extrabold text-xs shadow-lg shadow-[#FF6B6B]/25 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isGeneratingWithAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingWithAI ? 'Generating Copy with AI...' : 'Re-Generate with AI'}</span>
            </button>
          </div>

          {/* Mode Toggles: User Writes vs AI Writes */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-[#FFD6D1]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Writing Mode:</span>
              <div className="flex rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] p-1 border border-[#FFD6D1]">
                <button
                  onClick={() => setEmailWriteMode('ai')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    emailWriteMode === 'ai' ? 'bg-[#FF6B6B] text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  AI Writes Email
                </button>
                <button
                  onClick={() => setEmailWriteMode('user')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    emailWriteMode === 'user' ? 'bg-[#FF6B6B] text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  User Writes Email
                </button>
              </div>
            </div>

            {(contentType === 'voice' || contentType === 'both') && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Voice Script Mode:</span>
                <div className="flex rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] p-1 border border-[#FFD6D1]">
                  <button
                    onClick={() => setVoiceScriptMode('ai')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      voiceScriptMode === 'ai' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    AI Generates Script
                  </button>
                  <button
                    onClick={() => setVoiceScriptMode('user')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      voiceScriptMode === 'user' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Provide My Script
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* A/B Testing & Email Variants (Variants A, B, C) */}
          <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#FFD6D1]/60">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-[#FF6B6B]" />
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    A/B Multi-Variate Testing (3 Variants)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Test Subject Lines and Value Angles. Traffic will be split automatically to measure highest reply rates.
                  </p>
                </div>
              </div>

              {/* Variant Tabs: A, B, C */}
              <div className="flex items-center gap-1.5">
                {(['A', 'B', 'C'] as const).map((label) => (
                  <button
                    key={label}
                    onClick={() => setActiveVariantTab(label)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeVariantTab === label
                        ? 'bg-[#FF6B6B] text-white shadow-md'
                        : 'bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Variant Editor */}
            {(() => {
              const currentVariant =
                variants.find((v) => v.label === activeVariantTab) || variants[0];
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Subject Line (Variant {currentVariant.label})
                      </label>
                      <input
                        type="text"
                        value={currentVariant.subject}
                        onChange={(e) => {
                          const updated = variants.map((v) =>
                            v.id === currentVariant.id ? { ...v, subject: e.target.value } : v
                          );
                          setVariants(updated);
                        }}
                        className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Predicted Open Rate
                      </label>
                      <div className="p-3 rounded-xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1] text-xs font-bold text-emerald-600 flex items-center justify-between">
                        <span>{currentVariant.predictedOpenRate}</span>
                        <span className="text-[10px] text-slate-400 font-normal">Spam: {currentVariant.spamScore}/10</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Body (Supports <code>{`{{firstName}}`}</code>, <code>{`{{company}}`}</code>, <code>{`{{role}}`}</code>)
                    </label>
                    <textarea
                      rows={6}
                      value={currentVariant.body}
                      onChange={(e) => {
                        const updated = variants.map((v) =>
                          v.id === currentVariant.id ? { ...v, body: e.target.value } : v
                        );
                        setVariants(updated);
                      }}
                      className="w-full p-4 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Call to Action (CTA)
                    </label>
                    <input
                      type="text"
                      value={currentVariant.ctaText}
                      onChange={(e) => {
                        const updated = variants.map((v) =>
                          v.id === currentVariant.id ? { ...v, ctaText: e.target.value } : v
                        );
                        setVariants(updated);
                      }}
                      className="w-full p-3 rounded-xl border border-[#FFD6D1] dark:border-[#522329] bg-[#FFFDFB] dark:bg-[#1C1214] text-xs font-bold text-[#FF6B6B]"
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Voice Campaign & Voice Library (if voice or both enabled) */}
          {(contentType === 'voice' || contentType === 'both') && (
            <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#FFD6D1]/60">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Select Voice Persona from Studio Library
                    </h4>
                    <p className="text-xs text-slate-500">
                      Male & Female voices across Executive, Sales, and Consultant styles in English & Urdu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice Personas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {VOICE_LIBRARY.filter(
                  (v) => v.language === (language === 'urdu' ? 'urdu' : 'english')
                ).map((voice) => {
                  const isSelected = selectedVoice.id === voice.id;
                  return (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFFDFB] dark:bg-[#1C1214] border-2 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                          : 'glass-panel border-[#FFD6D1] dark:border-[#522329]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {voice.voiceName}
                        </span>
                        {voice.badge ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-extrabold">
                            {voice.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 uppercase font-bold">
                            {voice.gender} • {voice.style}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 italic line-clamp-2 mb-2">
                        "{voice.sampleText}"
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVoice(voice.sampleText);
                        }}
                        className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" /> Play Preview
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Auto Follow-Up Sequence Engine */}
          <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#FFD6D1]/60">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF6B6B]" />
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Automated Follow-Up Sequences
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sends follow-ups only if the prospect hasn't replied. Halts immediately when a reply is detected.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const newStep: FollowUpStep = {
                    id: `fu-${followUps.length + 1}`,
                    stepNumber: followUps.length + 1,
                    dayDelay: (followUps.length + 1) * 3,
                    trigger: 'no_reply',
                    subject: 'Following up on our note',
                    body: 'Hi {{firstName}}, checking in to see if this is currently a priority for {{company}}.',
                    enabled: true,
                  };
                  setFollowUps([...followUps, newStep]);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#FFD6D1] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#FFD6D1]/30 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-3">
              {followUps.map((fu, idx) => (
                <div
                  key={fu.id}
                  className="p-4 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF6B6B]">
                      Follow-Up #{fu.stepNumber} • Send {fu.dayDelay} days later if {fu.trigger.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => setFollowUps(followUps.filter((f) => f.id !== fu.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={fu.subject}
                    onChange={(e) => {
                      const updated = followUps.map((f) =>
                        f.id === fu.id ? { ...f, subject: e.target.value } : f
                      );
                      setFollowUps(updated);
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={fu.body}
                    onChange={(e) => {
                      const updated = followUps.map((f) =>
                        f.id === fu.id ? { ...f, body: e.target.value } : f
                      );
                      setFollowUps(updated);
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sending System Configuration */}
          <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#FFD6D1]/60">
              <Send className="w-5 h-5 text-[#FF6B6B]" />
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Sending Provider & Throttling Guard
                </h4>
                <p className="text-xs text-slate-500">
                  Protects sender reputation with randomized 60-90s delays between outgoing emails.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Provider Relay
                </label>
                <select
                  value={sendingConfig.provider}
                  onChange={(e) => setSendingConfig({ ...sendingConfig, provider: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] text-xs font-semibold"
                >
                  <option value="smtp">Custom Business SMTP (Recommended)</option>
                  <option value="gmail">Google Workspace (Gmail)</option>
                  <option value="outlook">Microsoft Outlook 365</option>
                  <option value="ses">Amazon SES</option>
                  <option value="sendgrid">SendGrid Relay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sender Email Address
                </label>
                <input
                  type="email"
                  value={sendingConfig.senderEmail}
                  onChange={(e) => setSendingConfig({ ...sendingConfig, senderEmail: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pacing Interval (Seconds between sends)
                </label>
                <input
                  type="number"
                  value={sendingConfig.sendIntervalSec}
                  onChange={(e) => setSendingConfig({ ...sendingConfig, sendIntervalSec: parseInt(e.target.value) || 60 })}
                  className="w-full p-2.5 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Recipient Personalization Inspector */}
          <div className="p-6 rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#FFD6D1]/60">
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Preview Personalization for Every Recipient ({validCount} Valid Leads)
                </h4>
                <p className="text-xs text-slate-500">
                  Click on any contact to view their bespoke AI opening hook, subject line, and generated voice script.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {contacts.filter((c) => c.status === 'valid').map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-2xl bg-[#FFFDFB] dark:bg-[#1C1214] border border-[#FFD6D1] space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{contact.name}</p>
                      <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{contact.role} • {contact.company}</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2 line-clamp-1">
                      Subj: {contact.personalizedSubject || 'Custom subject generated'}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-2 mt-1">
                      "{contact.personalizedOpening || contact.personalizedBody}"
                    </p>
                  </div>

                  {(contentType === 'voice' || contentType === 'both') && (
                    <button
                      type="button"
                      onClick={() => handleToggleVoice(contact.personalizedVoiceScript || '')}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[11px] font-bold flex items-center justify-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Play Voice Note ({contact.voiceDurationSec || 24}s)</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
