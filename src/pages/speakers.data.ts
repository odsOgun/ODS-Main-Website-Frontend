export type TopicKey = 'emerging' | 'policy' | 'startups' | 'creative' | 'agritech' | 'work';
export type FilterKey = 'all' | 'keynote' | TopicKey;
export type SpeakerType = 'Keynote' | 'Fireside chat' | 'Panellist' | 'Moderator';

export interface Speaker {
  id: string;
  name: string;
  role: string;
  topic: TopicKey;
  type: SpeakerType;
  time: string;
  session: string;
  /** Fallback portrait background when there is no photo. */
  color: string;
  bio: string;
}

export interface PastSpeaker {
  name: string;
  role: string;
  image: ResponsiveImage;
}

/**
 * One image in several widths. Each source file is stored as `<name>-<width>.webp`
 * (e.g. `fola-300.webp`, `fola-600.webp`) so the browser can download only the size it needs.
 */
export interface ResponsiveImage {
  /** Fallback src: the variant closest to 600px wide. */
  src: string;
  /** Smallest variant, for tiny thumbnails. */
  thumb: string;
  srcSet: string;
}

/** Groups `<name>-<width>.webp` modules from import.meta.glob into one ResponsiveImage per name. */
function toResponsiveImages(modules: Record<string, string>): Record<string, ResponsiveImage> {
  const byName: Record<string, { width: number; url: string }[]> = {};
  for (const [file, url] of Object.entries(modules)) {
    const match = /([^/]+)-(\d+)\.webp$/.exec(file);
    if (!match) continue;
    (byName[match[1]] ??= []).push({ width: Number(match[2]), url });
  }
  return Object.fromEntries(
    Object.entries(byName).map(([name, variants]) => {
      variants.sort((a, b) => a.width - b.width);
      const fallback = variants.find((v) => v.width >= 600) ?? variants[variants.length - 1];
      return [
        name,
        {
          src: fallback.url,
          thumb: variants[0].url,
          srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(', ')
        }
      ];
    })
  );
}

export interface SpeakerGroup {
  key: 'keynotes' | 'agritech' | 'creative' | 'web3' | 'ai' | 'policy' | 'startups';
  title: string;
  label: string;
  matches: (speaker: Speaker) => boolean;
}

/**
 * Headshots keyed by speaker id. Speakers without a photo fall back to initials.
 * To add one, save it as `photos/<id>-<width>.webp` (ideally 300, 600, 900 and 1400 wide).
 */
export const PHOTOS = toResponsiveImages(
  import.meta.glob<string>('@/assets/speakers/photos/*.webp', { eager: true, import: 'default' })
);

const PAST_PHOTOS = toResponsiveImages(
  import.meta.glob<string>('@/assets/speakers/past/*.webp', { eager: true, import: 'default' })
);

export const HERO_IMAGE = toResponsiveImages(
  import.meta.glob<string>('@/assets/speakers/hero/*.webp', { eager: true, import: 'default' })
).hero;

export const TOPICS: [FilterKey, string][] = [
  ['all', 'All'],
  ['keynote', 'Keynotes'],
  ['emerging', 'Emerging Tech'],
  ['policy', 'Policy'],
  ['startups', 'Startups & Investment'],
  ['creative', 'Creative Economy'],
  ['agritech', 'Agritech'],
  ['work', 'Education & Work']
];

export const SPEAKERS: Speaker[] = [
  {
    id: 'fola',
    name: 'Fola Olatunji-David',
    role: 'Founding Partner, Kickoff Africa',
    topic: 'emerging',
    type: 'Keynote',
    time: '10:25 AM',
    session: 'How Emerging Technologies Are Changing the Real World',
    color: '#394a42',
    bio: 'Fola Olatunji-David is an ecosystem leader and strategist with almost two decades of experience at the intersection of technology and business. He has built and advised companies across Africa through leadership roles at Google, Amazon, Stanbic IBTC and Ventures Platform. Having supported executives, investors and startups in more than ten countries, he brings a distinctive perspective on translating technology into measurable business advantage.'
  },
  {
    id: 'ademola',
    name: 'Dr. Ademola Adenubi',
    role: 'Director ICT & Founder, EduTAMS',
    topic: 'work',
    type: 'Keynote',
    time: '11:45 AM',
    session: 'Rethinking Education: Preparing for the Future of Learning',
    color: '#604d3d',
    bio: 'Dr. Ademola Adenubi is an accomplished ICT leader, digital transformation strategist and EdTech innovator with over 20 years of experience. He serves as Director of ICT at Tai Solarin University of Education and is the Founder and CEO of EduTAMS. Passionate about youth empowerment, he established a technology hub in Ijebu-Ife to equip young people with essential digital skills and create opportunities within Nigeria’s digital ecosystem.'
  },
  {
    id: 'foluso',
    name: 'Foluso Phillips',
    role: 'Founder & Chairman, Phillips Consulting',
    topic: 'startups',
    type: 'Keynote',
    time: '2:35 PM',
    session: 'Being an Entrepreneur in Nigeria Today: What Must Be Done Differently?',
    color: '#3f4854',
    bio: 'Foluso Phillips is a renowned industrial economist, business strategist and management consultant with decades of experience in business advisory and corporate performance. He is the Founder and Chairman of Phillips Consulting Limited and has guided the firm in delivering strategy, human capital management and training across sectors. He is also a former Chairman of the Nigeria Economic Summit Group and a Fellow of the Institute of Chartered Accountants of Nigeria.'
  },
  {
    id: 'adebola',
    name: 'Dr. Adebola Ismail Akindele',
    role: 'Chairman/Group CEO, Courteville Business Solutions',
    topic: 'work',
    type: 'Keynote',
    time: '3:40 PM',
    session: 'The Future of Work: Skills, Opportunities and the New Economy',
    color: '#51403b',
    bio: 'Dr. Adebola Ismail Akindele is the Group Managing Director of Courteville Business Solutions Plc, a leading information technology consultancy and business process outsourcing company. Since becoming CEO in 2004, he has helped expand its operations across 20 Nigerian states and establish more than 200 franchises. His career spans banking, finance, technology and entrepreneurship, with previous roles at the Central Bank of Nigeria, Oceanic Bank and Fountain Trust Bank.'
  },
  {
    id: 'samson',
    name: 'Samson Ogbole',
    role: 'Director, Soilless Farm Lab',
    topic: 'agritech',
    type: 'Fireside chat',
    time: '11:15 AM',
    session: 'Should Nigerians Go Back to Farming? What It Takes to Start Without Capital',
    color: '#34483d',
    bio: 'Samson Ogbole is a biochemist-turned-agricultural innovator and the founder of Soilless Farm Lab, where he is transforming food production through sustainable agriculture, precision farming and AI-driven systems. He has helped scale operations to over 800 greenhouses and trained thousands of farmers through the Work and Learn programme. Recognised by CNN, BBC and TED, he champions innovative farming solutions that promote food security and economic growth.'
  },
  {
    id: 'idris',
    name: 'Idris Olubisi',
    role: 'Founder, Web3Afrika',
    topic: 'emerging',
    type: 'Panellist',
    time: '10:45 AM',
    session: 'Beyond the Hype: The Real Opportunities in Web3, Blockchain and Stablecoins',
    color: '#514c3d',
    bio: 'Idris Olubisi is a developer relations engineer, senior software and AI engineer, technical writer and the founder of Web3 Afrika. His work spans open source, artificial intelligence, blockchain and serverless technologies. Through technical education, writing and community building, he helps developers understand emerging infrastructure and has contributed to leading engineering publications and developer platforms.'
  },
  {
    id: 'ayodeji',
    name: 'Ayodeji Awosika',
    role: 'Founder, Web3 Bridge',
    topic: 'emerging',
    type: 'Panellist',
    time: '10:45 AM',
    session: 'Beyond the Hype: The Real Opportunities in Web3, Blockchain and Stablecoins',
    color: '#3c4850',
    bio: 'Ayodeji Israel Awosika is the founder of Web3Bridge, one of Africa’s foremost blockchain engineering programmes. Since 2019, the programme has trained more than 3,000 developers, with graduates joining companies across the global Web3 ecosystem. He also convenes the Web3 Lagos Conference and was recognised as one of ten global torch bearers for Ethereum’s tenth anniversary.'
  },
  {
    id: 'ayo',
    name: 'Ayo Adewuyi',
    role: 'CEO, Pouchers',
    topic: 'emerging',
    type: 'Panellist',
    time: '10:45 AM',
    session: 'Beyond the Hype: The Real Opportunities in Web3, Blockchain and Stablecoins',
    color: '#54403e',
    bio: 'Ayo Adewuyi is the CEO of Pouchers and a participant in Africa’s emerging technology ecosystem. At ODS 2026, he joins founders and builders to examine the practical opportunities that Web3, blockchain and stablecoins are creating across industries beyond the hype.'
  },
  {
    id: 'dara',
    name: 'Dára Sobaloju',
    role: 'Founder, Pewbeam',
    topic: 'emerging',
    type: 'Panellist',
    time: '2:00 PM',
    session: 'Building AI That Actually Works for Africa',
    color: '#3d4a43',
    bio: 'Dára Sobaloju is the founder of Pewbeam, an AI presentation agent used by churches across 35 countries to automatically project Bible verses and service content in real time. He is an AI-native design engineer and product designer exploring how artificial intelligence is changing the role of designers. He has built tools used by more than 80,000 designers and developers globally and actively mentors emerging product talent.'
  },
  {
    id: 'temi',
    name: 'Temi Omotola',
    role: 'Director, Lifemark Health Group',
    topic: 'emerging',
    type: 'Panellist',
    time: '2:00 PM',
    session: 'Building AI That Actually Works for Africa',
    color: '#4d3e4c',
    bio: 'Temi Omotola is a Director at Lifemark Health Group working at the intersection of healthcare, business and technology. At ODS 2026, she joins the AI panel to examine what it takes to build practical, locally relevant products in an African ecosystem still navigating adoption, security and trust.'
  },
  {
    id: 'oluwajoba',
    name: 'Oluwajoba Oloba',
    role: 'Co-Founder, Nest Innovation Hub',
    topic: 'emerging',
    type: 'Panellist',
    time: '2:00 PM',
    session: 'Building AI That Actually Works for Africa',
    color: '#3e4652',
    bio: 'Oluwajoba Oloba is the co-founder of Nest Innovation Hub. His work supports technology entrepreneurship and the development of new products and ventures. At ODS 2026, he brings an ecosystem-builder’s perspective to the conversation on creating AI products that solve real African problems.'
  },
  {
    id: 'adebayo-i',
    name: 'Dr. Adebayo M. Ishola',
    role: 'Digital Innovation Specialist',
    topic: 'policy',
    type: 'Panellist',
    time: '12:05 PM',
    session: 'Government, Policy and Regulations: Impact on the Growth of Our Digital Economy',
    color: '#54483f',
    bio: 'Dr. Adebayo M. Ishola is an educational technologist, digital empowerment advocate and Creative Director of Online Hub Educational Services. As a certified trainer, mentor and coach on the Google Hustle Academy programme, he has equipped more than 10,000 young people across Africa with essential digital skills. He continues to champion digital literacy, entrepreneurship and educational innovation.'
  },
  {
    id: 'goke',
    name: 'Goke Olateju',
    role: 'Managing Director, Centrum Finance',
    topic: 'policy',
    type: 'Panellist',
    time: '12:05 PM',
    session: 'Government, Policy and Regulations: Impact on the Growth of Our Digital Economy',
    color: '#3b4b48',
    bio: 'Goke Olateju is a finance executive, strategic advisor and project management professional with over 15 years of experience across financial services and fintech. As Managing Director and CEO of Centrum Finance, he leads strategic growth, alternative financing and corporate advisory. He is passionate about financial innovation, entrepreneurship, youth empowerment and financial literacy.'
  },
  {
    id: 'lateef',
    name: 'Lateef Surakatu',
    role: 'Partner, Andersen',
    topic: 'policy',
    type: 'Panellist',
    time: '12:05 PM',
    session: 'Government, Policy and Regulations: Impact on the Growth of Our Digital Economy',
    color: '#4f433b',
    bio: 'Lateef Surakatu is an experienced business advisory professional with over 17 years of expertise in financial strategy, institutional transformation and organisational reform. He is a Partner and Head of Business Advisory Services at Andersen Nigeria and leads its Accounting Services practice across Africa. He has led major transformation projects across financial services, telecommunications, energy, manufacturing and the public sector.'
  },
  {
    id: 'dayo',
    name: 'Dayo Abiodun',
    role: 'SA to Governor, ICT',
    topic: 'policy',
    type: 'Panellist',
    time: '12:05 PM',
    session: 'Government, Policy and Regulations: Impact on the Growth of Our Digital Economy',
    color: '#414754',
    bio: 'Dayo Abiodun serves as Special Assistant to the Ogun State Governor on ICT. He brings a public-sector perspective to the ODS 2026 policy conversation, exploring how government, regulation and digital infrastructure can create a stronger enabling environment for Nigeria’s technology ecosystem.'
  },
  {
    id: 'toyin',
    name: 'Olúwátóyìn Emmanuel-Olúbákē',
    role: 'Chief Investment Officer, Catalyst Fund',
    topic: 'startups',
    type: 'Panellist',
    time: '3:05 PM',
    session: 'Beyond Funding: What Investors Really Look for in African Founders',
    color: '#514151',
    bio: 'Olúwátóyìn Emmanuel-Olúbákē is Chief Investment Officer at Catalyst Fund. She works at the intersection of capital, innovation and venture growth, helping founders build companies with the potential for meaningful scale and impact. At ODS 2026, she joins a practical conversation about what investors truly look for in African founders beyond the pitch deck.'
  },
  {
    id: 'ifeoluwa',
    name: 'Ifeoluwa Wealth',
    role: 'CEO, iMultiple Holdings',
    topic: 'startups',
    type: 'Panellist',
    time: '3:05 PM',
    session: 'Beyond Funding: What Investors Really Look for in African Founders',
    color: '#384b43',
    bio: 'Ifeoluwa Wealth is the CEO of iMultiple Holdings and an operator in Africa’s business and investment landscape. At ODS 2026, he brings a founder-focused perspective to the conversation on the qualities, evidence and long-term thinking investors seek when evaluating African ventures.'
  },
  {
    id: 'joba',
    name: 'Joba Adejumo',
    role: 'Partner, Greylight',
    topic: 'startups',
    type: 'Panellist',
    time: '3:05 PM',
    session: 'Beyond Funding: What Investors Really Look for in African Founders',
    color: '#4b453a',
    bio: 'Joba Adejumo is a Partner at Greylight, working with founders and ventures on growth, strategy and investment readiness. At ODS 2026, he joins investors and ecosystem leaders to unpack what makes a company compelling beyond funding headlines and short-term traction.'
  },
  {
    id: 'seyi',
    name: 'Seyi Ademeso (Meshkiey)',
    role: 'Content Creator & Strategist · Co-Founder, Udu Media',
    topic: 'creative',
    type: 'Panellist',
    time: '4:00 PM',
    session: 'Monetising Creativity: Turning Passion into Sustainable Income',
    color: '#4c3f40',
    bio: 'Seyi Ademeso, widely known as Meshkiey, is a Lagos-based digital creator and influencer known for comedic, relatable and mockumentary-style storytelling. He is a co-founder of Udu Media, a media agency delivering commercial productions across digital and brand campaigns. His work sits at the intersection of creative media production, digital storytelling and entrepreneurship in Nigeria’s growing creator economy.'
  },
  {
    id: 'joseph',
    name: 'Joseph Onaolapo (JayOnAir)',
    role: 'Media Personality · Founder, Work Culture',
    topic: 'creative',
    type: 'Panellist',
    time: '4:00 PM',
    session: 'Monetising Creativity: Turning Passion into Sustainable Income',
    color: '#3b4b4d',
    bio: 'Joseph Onaolapo, known as Jay On Air, is a media personality, radio host and culture curator shaping thoughtful conversations around work, leadership and people development. He founded the Work Culture Festival, a platform that brings together executives, HR leaders, founders and creatives to explore how healthy work environments are built. Through radio, live events and curated experiences, he uses storytelling to influence how organisations think about culture and human potential.'
  },
  {
    id: 'sulaimon',
    name: 'Sulaimon Adebayo (Pooja)',
    role: 'Founder, Pooja Media and Communications',
    topic: 'creative',
    type: 'Panellist',
    time: '4:00 PM',
    session: 'Monetising Creativity: Turning Passion into Sustainable Income',
    color: '#4e463b',
    bio: 'Sulaimon Adebayo, popularly known as Pooja, leads a digital and media communications brand offering content creation, digital marketing, photography, videography and influencer marketing. An accredited FIFA and CAF photojournalist, he has covered the FIFA World Cup, AFCON, Champions League and Commonwealth Games. He has also created content for multinational brands and built a widely recognised media presence across social platforms.'
  },
  {
    id: 'dafe',
    name: 'Dafe Richards',
    role: 'Content Creator',
    topic: 'creative',
    type: 'Moderator',
    time: '4:00 PM',
    session: 'Monetising Creativity: Turning Passion into Sustainable Income',
    color: '#443e4e',
    bio: 'Dafe Richards is a content creator and creative-economy commentator. At ODS 2026, he moderates a candid conversation on the creator journey, knowledge entrepreneurship and the realities of turning creative work into a sustainable source of income.'
  },
  {
    id: 'samuel',
    name: 'Samuel Agunbiade',
    role: 'Agro Marketer',
    topic: 'agritech',
    type: 'Moderator',
    time: '11:15 AM',
    session: 'Should Nigerians Go Back to Farming? What It Takes to Start Without Capital',
    color: '#3f4d3d',
    bio: 'Samuel Agunbiade is an agro marketer focused on making modern agriculture more understandable, accessible and commercially viable. At ODS 2026, he moderates an honest conversation about practical pathways into farming, including the opportunities created by soilless systems for people without land or significant startup capital.'
  },
  {
    id: 'adebayo-a',
    name: 'Adebayo Adewole',
    role: 'Founder, Ninelm Technologies · CTO, CAPP Nigeria',
    topic: 'emerging',
    type: 'Moderator',
    time: '10:45 AM',
    session: 'Beyond the Hype: The Real Opportunities in Web3, Blockchain and Stablecoins',
    color: '#4b403b',
    bio: 'Adebayo Adewole is a technology, operations and digital transformation professional with over 14 years of experience across financial services, government, consulting and entrepreneurship. He is the Founder of Ninelm Technologies and CTO at CAPP Nigeria. As Director of Programs and Partnerships for ODS 2026, he also helps shape programmes and partnerships that connect businesses, government, technology leaders and emerging talent.'
  },
  {
    id: 'ibiniyi',
    name: 'Ibiniyi Ibikoya',
    role: 'Technical Lead, Kora (ex-Paystack)',
    topic: 'emerging',
    type: 'Moderator',
    time: '2:00 PM',
    session: 'Building AI That Actually Works for Africa',
    color: '#3e444e',
    bio: 'Ibiniyi Ibikoya is a software engineer, technology leader and content creator passionate about building technology that solves real-world problems. As a Technical Lead at Kora, he contributes to payment infrastructure and tools that support businesses across Africa. He also explores the applications, risks and future-of-work implications of artificial intelligence while mentoring aspiring engineers.'
  },
  {
    id: 'rahaman',
    name: 'Rahaman Abiola',
    role: 'Editor-in-Chief, Legit.ng',
    topic: 'policy',
    type: 'Moderator',
    time: '12:05 PM',
    session: 'Government, Policy and Regulations: Impact on the Growth of Our Digital Economy',
    color: '#4f473d',
    bio: 'Rahaman Abiola is an award-winning, Reuters-trained journalist, editor and media trainer with more than a decade of experience across traditional and digital media. As Editor-in-Chief of LEGIT.ng, he leads content direction through data-driven, audience-centred editorial practice. His work has appeared across leading Nigerian publications, and he is committed to newsroom innovation and the mentorship of media professionals.'
  },
  {
    id: 'arinola',
    name: 'Arinola Moses',
    role: 'Deputy Editor, Technext',
    topic: 'startups',
    type: 'Moderator',
    time: '3:05 PM',
    session: 'Beyond Funding: What Investors Really Look for in African Founders',
    color: '#3e4d49',
    bio: 'Arinola Moses is the Deputy Editor at Technext, where she helps shape editorial direction and journalism at the intersection of technology, business and Africa’s digital economy. Her expertise spans digital journalism, editorial strategy and news reporting, with a focus on making complex issues accessible and relevant. She believes journalism should provide context, challenge narratives and deepen public understanding.'
  }
];

export const PAST_SPEAKERS: PastSpeaker[] = [
  {
    name: 'Odunayo Eweniyi',
    role: 'Co-founder, PiggyVest',
    image: PAST_PHOTOS['0e5d8']
  },
  {
    name: 'Salem King',
    role: 'Content Creator/Storyteller',
    image: PAST_PHOTOS['2552d']
  },
  {
    name: 'Kashifu Inuwa',
    role: 'DG, NITDA',
    image: PAST_PHOTOS['6cedb']
  },
  {
    name: 'Joshua Chibueze',
    role: 'Co-founder, PiggyVest',
    image: PAST_PHOTOS['joshua']
  }
];

export const GROUPS: SpeakerGroup[] = [
  {
    key: 'keynotes',
    title: 'Keynote speakers',
    label: 'Main stage',
    matches: (s) => s.type === 'Keynote'
  },
  {
    key: 'agritech',
    title: 'Agritech fireside',
    label: 'Farming & food systems',
    matches: (s) => s.session.startsWith('Should Nigerians')
  },
  {
    key: 'creative',
    title: 'Creator’s panel',
    label: 'Creative economy',
    matches: (s) => s.session.startsWith('Monetising Creativity')
  },
  {
    key: 'web3',
    title: 'Emerging tech · Web3 & blockchain',
    label: 'Panel session',
    matches: (s) => s.session.startsWith('Beyond the Hype')
  },
  {
    key: 'ai',
    title: 'Emerging tech · Artificial intelligence',
    label: 'Panel session',
    matches: (s) => s.session.startsWith('Building AI')
  },
  {
    key: 'policy',
    title: 'Policy & governance',
    label: 'Panel session',
    matches: (s) => s.session.startsWith('Government, Policy')
  },
  {
    key: 'startups',
    title: 'Startup & investment',
    label: 'Panel session',
    matches: (s) => s.session.startsWith('Beyond Funding')
  }
];

export const HERO_WORDS = ['AI', 'economy', 'creators', 'startups', 'future'];
