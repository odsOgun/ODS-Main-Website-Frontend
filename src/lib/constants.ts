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

// export const TECH_INTEREST_OPTIONS = ['Expert', 'Interested', 'NotInterested'] as const;
export const TECH_INTEREST_OPTIONS = [
  { value: 'Expert', label: 'Expert' },
  { value: 'Interested', label: 'Interested' },
  { value: 'NotInterested', label: 'NotInterested' }
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
  'X',
  'Tiktok',
  'Grazac',
  'Billboard',
  'Radio station',
  'Friends',
  'Other'
] as const;

export type ReferralSourceOption = (typeof REFERRAL_SOURCE_OPTIONS)[number];

export interface TicketTier {
  id: string;
  name: string;
  price: number | string;
  currency: string;
  originalPrice?: number | string;
  open: boolean;
  cta: string;
  popular: boolean;
  features: string[];
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'basic',
    name: 'General Attendee',
    price: 0,
    currency: '₦',
    open: true,
    cta: 'Get ticket for free',
    popular: false,
    features: ['Access to main conference', 'Access to Exhibition Booth']
  },
  {
    id: 'gold',
    name: 'Masterclass',
    price: 10000,
    currency: '₦',
    originalPrice: 20000,
    open: true,
    cta: 'Get ticket',
    popular: true,
    features: [
      'Access to main conference',
      'Reserved front row seat',
      'Access to private masterclass sessions',
      'Access to Keynote & Panel sessions',
      'Access to Exhibition Area',
      'Refreshment',
      'Access to Fireside Convo'
    ]
  },
  {
    id: 'vip',
    name: 'Prime Ticket',
    price: 55000,
    currency: '₦',
    originalPrice: 70000,
    open: true,
    cta: 'Get ticket',
    popular: false,
    features: [
      'Access to main conference',
      'VIP Reserved seats',
      'ODS Merch, Lunch Pack',
      'Access to Masterclass session',
      'Access to The Builders Banquet',
      'Access to Hangout at Olumo Rock',
      'Access to exhibition Area'
    ]
  }
];
