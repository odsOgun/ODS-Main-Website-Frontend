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
    id: 'payment',
    label: 'Choose Ticket',
    title: 'Get your ticket, enjoy what comes next.',
    hide: true
  },
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
    title: 'Registration Complete!',
    hide: true
  }
] as const;

export type Step = (typeof STEPS)[number];

export const TECH_INTEREST_OPTIONS = [
  'Beginner',
  'Intermediate',
  'Expert',
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

export interface TicketTier {
  id: string;
  name: string;
  price: string;
  currency: string;
  originalPrice?: string;
  cta: string;
  popular: boolean;
  features: string[];
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'basic',
    name: 'Standard Pass',
    price: 'FREE',
    currency: '',
    cta: 'Get ticket for free',
    popular: false,
    features: [
      'Free access to the main event only',
      'Get access to master class of your choice',
      'Get ODS merchandise items',
      'Get a VIP seat, network with speakers and invited guests',
      'Get a VIP seat, network with speakers and invited guests',
      'Get an invite to ODS Banquet and Hangout the next day'
    ]
  },
  {
    id: 'gold',
    name: 'Premium Pass',
    price: '10,000.00',
    currency: '₦',
    originalPrice: '₦20,000.00',
    cta: 'Coming soon',
    popular: true,
    features: [
      'Free access to the main event only',
      'Get access to master class of your choice',
      'Get ODS merchandise items',
      'Get a VIP seat, network with speakers and invited guests',
      'Get a VIP seat, network with speakers and invited guests',
      'Get an invite to ODS Banquet and Hangout the next day'
    ]
  },
  {
    id: 'vip',
    name: 'VIP Pass',
    price: '55,000.00',
    currency: '₦',
    originalPrice: '₦70,000.00',
    cta: 'Buy ticket',
    popular: false,
    features: [
      'Free access to the main event only',
      'Get access to master class of your choice',
      'Get ODS merchandise items',
      'Get a VIP seat, network with speakers and invited guests',
      'Get a VIP seat, network with speakers and invited guests',
      'Get an invite to ODS Banquet and Hangout the next day'
    ]
  }
];
