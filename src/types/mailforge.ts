export type CampaignType =
  | 'cold_outreach'
  | 'warm_outreach'
  | 'partnership'
  | 'promotion'
  | 'sales_pitch'
  | 'product_launch'
  | 'follow_up'
  | 'customer_retention'
  | 'custom';

export type ContentType = 'text' | 'voice' | 'both';

export type Language = 'english' | 'urdu' | 'roman_urdu';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  website?: string;
  linkedin?: string;
  notes?: string;
  status: 'valid' | 'invalid' | 'risky';
  validationMessage?: string;
  tags: string[];
  personalizedSubject?: string;
  personalizedOpening?: string;
  personalizedBody?: string;
  personalizedCTA?: string;
  personalizedVoiceScript?: string;
  voiceAudioUrl?: string;
  voiceDurationSec?: number;
  deliveryStatus?: 'pending' | 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'converted';
  sentAt?: string;
  openedAt?: string;
}

export interface BusinessInfo {
  websiteUrl: string;
  storeUrl?: string;
  productUrl?: string;
  serviceUrl?: string;
  portfolioUrl?: string;
  companyName: string;
  companyDescription: string;
  businessCategory: string;
  targetAudience: string;
  industry: string;
  valueProposition?: string;
}

export type OfferType =
  | 'free_consultation'
  | 'discount'
  | 'free_delivery'
  | 'bonus_service'
  | 'custom';

export interface Offer {
  enabled: boolean;
  type: OfferType;
  title: string;
  details: string;
  discountPercentage?: number;
  promoCode?: string;
  expirationDays?: number;
}

export interface AttachmentItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'catalog' | 'brochure' | 'document' | 'link';
  sizeFormatted: string;
  url: string;
  description?: string;
}

export interface VoiceConfig {
  id: string;
  gender: 'male' | 'female';
  style: 'executive' | 'sales' | 'consultant';
  language: 'english' | 'urdu';
  voiceName: string;
  sampleText: string;
  speechRate: number; // 0.8 to 1.2
  pitch: number;
  badge?: string;
  description?: string;
}

export interface EmailVariant {
  id: string;
  label: string; // 'A' | 'B' | 'C'
  subject: string;
  opening: string;
  body: string;
  ctaText: string;
  spamScore: number;
  predictedOpenRate: string;
}

export interface FollowUpStep {
  id: string;
  stepNumber: number;
  dayDelay: number;
  trigger: 'no_reply' | 'opened_not_clicked' | 'always';
  subject: string;
  body: string;
  enabled: boolean;
}

export interface SendingConfig {
  provider: 'gmail' | 'outlook' | 'smtp' | 'ses' | 'sendgrid';
  senderName: string;
  senderEmail: string;
  replyToEmail?: string;
  dailyLimit: number;
  sendIntervalSec: number; // e.g. 45s to 90s for deliverability
  scheduleMode: 'immediate' | 'scheduled' | 'recurring';
  scheduledTime?: string;
  recurringDays?: string[];
  trackOpens: boolean;
  trackClicks: boolean;
  sendWindowStart: string; // "09:00"
  sendWindowEnd: string; // "18:00"
  timeZone: string;
}

export interface DeliverabilityHealth {
  spf: {
    status: 'pass' | 'warn' | 'fail';
    record: string;
    details: string;
  };
  dkim: {
    status: 'pass' | 'warn' | 'fail';
    selector: string;
    details: string;
  };
  dmarc: {
    status: 'pass' | 'warn' | 'fail';
    policy: 'reject' | 'quarantine' | 'none';
    details: string;
  };
  domainHealthScore: number; // 0-100
  senderReputation: number; // 0-100
  spamScore: number; // 0-10 (lower is better, e.g. 0.8 / 10)
  flaggedKeywords: string[];
  warmupDaysRecommended: number;
  dailyWarmupVolume: number;
  contentAudit: {
    readingGrade: string;
    wordCount: number;
    linkCount: number;
    imageToTextRatio: string;
    allCapsRatio: string;
  };
  recommendations: {
    category: 'Authentication' | 'Content' | 'Sending Rhythm' | 'Reputation';
    title: string;
    impact: 'High' | 'Medium' | 'Low';
    action: string;
  }[];
}

export interface CampaignStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replies: number;
  bounces: number;
  conversions: number;
}

export interface Campaign {
  id: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  contacts: Contact[];
  businessInfo: BusinessInfo;
  offer: Offer;
  attachments: AttachmentItem[];
  campaignType: CampaignType;
  contentType: ContentType;
  language: Language;
  voiceConfig: VoiceConfig;
  emailWriteMode: 'user' | 'ai';
  voiceScriptMode: 'user' | 'ai';
  variants: EmailVariant[];
  abTestingEnabled: boolean;
  trafficSplit: [number, number, number]; // [34, 33, 33]
  followUps: FollowUpStep[];
  sendingConfig: SendingConfig;
  deliverability: DeliverabilityHealth;
  stats: CampaignStats;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Campaign Manager' | 'Copywriter' | 'Analyst';
  avatar: string;
  status: 'active' | 'invited';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}
