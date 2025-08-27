export const DESCRIPTIONS = [
  'Student',
  'Software engineer',
  'Data analyst',
  'Designer',
  'Product manager',
  'NYSC Corp',
  'Project manager',
  'Backend engineer',
  'Admin',
  'Operations'
] as const;

export type Description = (typeof DESCRIPTIONS)[number];

export const STEPS = [
  {
    id: 'personal-details',
    label: 'Personal details',
    title: 'We want to know you better.',
    hide: false
  },
  {
    id: 'tech-interest',
    label: 'Tech interest',
    title: "We'd like to know your interest level in tech.",
    hide: false
  },
  {
    id: 'startup-business',
    label: 'Startup/Business',
    title: 'Last question phase, we promise.',
    hide: false
  },
  {
    id: 'complete',
    label: 'Complete',
    title: 'Get your ticket, Enjoy what comes next.',
    hide: true
  }
] as const;

export type Step = (typeof STEPS)[number];

export const TECH_INTEREST_OPTIONS = [
  'Beginner',
  'Expert',
  'Interested in learning',
  'Not interested'
] as const;

export type TechInterestOption = (typeof TECH_INTEREST_OPTIONS)[number];

export const TECH_AREAS = [
  'Product management',
  'Cybersecurity',
  'Blockchain',
  'Product design',
  'Artificial intelligence',
  'Mobile application development',
  'Web development',
  'Data analysis'
] as const;

export type TechArea = (typeof TECH_AREAS)[number];

export const STARTUP_BUSINESS_OPTIONS = [
  {
    value: 'yes',
    label: 'Yes, I do'
  },
  {
    value: 'no',
    label: "No, I don't"
  }
] as const;

export type StartupBusinessOption = (typeof STARTUP_BUSINESS_OPTIONS)[number];

export const REFERRAL_SOURCE_OPTIONS = [
  'Instagram',
  'X (Twitter)',
  'TikTok',
  'LinkedIn',
  'Through a friend',
  'Website',
  "I've been to the previous edition of ODS",
  'Others'
] as const;

export type ReferralSourceOption = (typeof REFERRAL_SOURCE_OPTIONS)[number];

export const TICKET_TIERS = [
  {
    id: 'basic',
    name: 'Basic ticket',
    price: 'FREE',
    currency: '',
    features: ['Free access to the main event only'],
    cta: 'Get ticket for free',
    popular: false
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '10,000.00',
    currency: '₦',
    features: ['Free access to the main event only', 'Get access to master class of your choice'],
    cta: 'Buy this ticket',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '55,000.00',
    currency: '₦',
    features: [
      'Free access to the main event only',
      'Get access to master class of your choice',
      'Get ODS merchandise items',
      'Get a VIP seat, network with speakers and invited guests',
      'Get an invite to ODS Banquet and Hangout the next day'
    ],
    cta: 'Buy this ticket',
    popular: true
  }
] as const;

export type TicketTier = (typeof TICKET_TIERS)[number];
