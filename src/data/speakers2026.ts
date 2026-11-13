export type SpeakerSessionId =
  | 'keynotes'
  | 'agritech'
  | 'creative-economy'
  | 'web3'
  | 'ai'
  | 'policy-governance'
  | 'startup-investment';

export interface Speaker {
  name: string;
  image?: string;
  role?: string;
  session: SpeakerSessionId;
  sessionRole: 'Keynote Speaker' | 'Speaker' | 'Panelist' | 'Moderator';
  sessionOrder: number;
  summary?: string;
  bio?: string;
}

export const speakersLineup = [
  {
    name: 'Fola Olatunji-David',
    role: 'Founding Partner, Kickoff Africa',
    session: 'keynotes',
    sessionRole: 'Keynote Speaker',
    sessionOrder: 1,
    image: '/speakers26/Fola Olatunji-David_Headshot.jpeg',
    summary:
      'An ecosystem leader with nearly two decades of experience at the intersection of technology and business.',
    bio: `Fola Olatunji-David is an ecosystem leader and strategist with almost two decades of experience at the intersection of technology and business.

Fola has built and advised companies across Africa through leadership roles at Google, Amazon, Stanbic IBTC, Ventures Platform, and more.

Having supported executives, investors, and startups in over ten countries, he brings a unique perspective on how individuals can translate technology into measurable business advantage.`
  },
  {
    name: 'Dr. Ademola Adenubi',
    role: 'Ag. Director ICT & Founder, EduTAMS',
    session: 'keynotes',
    sessionRole: 'Keynote Speaker',
    sessionOrder: 2,
    image: '/speakers26/Dr. Ademola ADENUBI.jpg',
    summary:
      'An ICT leader and EdTech innovator driving digital transformation, youth empowerment, and institutional excellence.',
    bio: `Dr. Ademola Adenubi is an accomplished ICT leader, digital transformation strategist, and EdTech innovator with over 20 years of experience driving technology-enabled growth and institutional excellence.

He currently serves as the Director of ICT at Tai Solarin University of Education and is the Founder/CEO of EduTAMS. Throughout his career, he has led impactful digital initiatives that strengthen institutional systems, improve operational efficiency, and advance technology adoption.

Passionate about youth empowerment and innovation, he established a technology hub in Ijebu-Ife to equip young people with essential digital skills and create opportunities for growth within Nigeria’s digital ecosystem.

Through his leadership and commitment to innovation, Dr. Adenubi continues to drive meaningful impact across education, technology, and community development.`
  },
  {
    name: 'Mr. Foluso Phillips',
    role: 'Founder & Chairman, Phillips Consulting Limited',
    session: 'keynotes',
    sessionRole: 'Keynote Speaker',
    sessionOrder: 3,
    image: '/speakers26/Foluso Phillips.png',
    summary:
      'An industrial economist and business strategist with decades of experience in advisory and corporate performance.',
    bio: `Mr. Foluso Phillips is a renowned industrial economist, business strategist, and management consultant with decades of experience in business advisory, organizational development, and corporate performance.

He is the Founder and Chairman of Phillips Consulting Limited, a leading business advisory firm with offices in Nigeria and South Africa. For over 25 years, he has guided the firm in delivering strategy development, human capital management, training, and recruitment services to organizations across various sectors.

He also serves as Chairman of the Nigeria/South Africa Chamber of Commerce and is a former Chairman of the Nigeria Economic Summit Group. A Fellow of the Institute of Chartered Accountants of Nigeria, Mr. Phillips brings extensive expertise in finance, governance, and business transformation, helping organizations strengthen performance and drive sustainable economic growth.`
  },
  {
    name: 'Samson Ogbole',
    role: 'Director, Soilless Farm Lab',
    session: 'agritech',
    sessionRole: 'Speaker',
    sessionOrder: 1,
    image: '/speakers26/samson ogbole.jpg',
    summary:
      'An agricultural innovator advancing sustainable food production through precision farming and AI-driven systems.',
    bio: `Samson Ogbole is a biochemist-turned-agricultural innovator and the founder of Soilless Farm Lab, where he is transforming food production through sustainable agriculture, precision farming, and AI-driven systems.

Since launching in 2020, he has helped scale operations to over 800 greenhouses across 36 hectares, alongside a 23,000-ton processing facility serving global markets with quality herbs, spices, and vegetables.

Passionate about tackling food insecurity and empowering communities, Samson has trained thousands of farmers through his Work and Learn programme, equipping them with modern agricultural skills to build sustainable and profitable agribusinesses.

Recognized by CNN, BBC, and TED, he continues to champion innovative farming solutions that promote food security, economic growth, and environmental sustainability.`
  },
  {
    name: 'Samuel Agunbiade',
    role: 'Agro Marketer',
    session: 'agritech',
    sessionRole: 'Moderator',
    sessionOrder: 2,
    image: '/speakers26/Samuel Agunbiade.jpg',
    summary:
      'He has driven over ₦1 billion in vegetable sales, connecting harvests with local and export markets.',
    bio: `Samuel Agunbiade has spent more than five years on the part of farming most people skip: turning harvests into revenue. He has driven over ₦1 billion in vegetable sales, from greenhouse bell pepper to open-field habanero, handling everything from finding buyers to collecting payment in local and export markets.`
  },
  {
    name: 'Seyi Ademeso',
    role: 'Content Creator & Strategist | Co-Founder, Udu Media',
    session: 'creative-economy',
    sessionRole: 'Panelist',
    sessionOrder: 1,
    image: '/speakers26/seyi ademeso.jpeg',
    summary:
      'A digital creator and entrepreneur working at the intersection of storytelling, media production, and business.',
    bio: `Meshkiey is a Lagos-based digital creator and influencer widely known for producing comedic, relatable, mockumentary-style content that blends everyday Nigerian life with storytelling and social experiment formats. He is often described as Nigeria’s number one mockumentarist, building a strong reputation for short-form videos that are both entertaining and brand-friendly.

He is also a co-founder of Udu Media, a media agency that has handled several commercial production projects across digital and brand campaigns.

Academically, he graduated from Covenant University in 2017 with a degree in International Relations. He also holds a diploma in French.

Beyond content creation, Meshkiey runs Classyflowery, a Lagos-based greenery business focused on plant sales, installations, and landscaping services.

Overall, he sits at the intersection of creative media production, digital storytelling, and entrepreneurship within Nigeria’s growing creator economy.`
  },
  {
    name: 'Joseph Onaolapo',
    role: 'Media Personality and Founder, Work Culture',
    session: 'creative-economy',
    sessionRole: 'Panelist',
    sessionOrder: 2,
    image: '/speakers26/Joseph Onaolapo.jpeg',
    summary:
      'A radio host and culture curator building conversations and communities around leadership and people development.',
    bio: `Joseph Onaolapo, Jay on-air, is a media personality, radio host, and culture curator known for shaping thoughtful conversations around work, leadership, and people development.

He is the founder of the Work Culture Festival, a platform that brings together executives, HR leaders, founders, and creatives to explore how healthy work environments are built and sustained.

Through radio, live events, and curated experiences, Jay bridges media and impact using storytelling to influence how individuals and organisations think about leadership, culture, and human potential. His work is rooted in one core belief: better conversations create better workplaces.

Jay On Air continues to build communities and platforms that challenge old narratives and inspire a more intentional, people-first future of work.`
  },
  {
    name: 'Sulaimon Adebayo',
    role: 'Founder, Pooja Media & Communications',
    session: 'creative-economy',
    sessionRole: 'Panelist',
    sessionOrder: 3,
    image: '/speakers26/Sulaimon Adebayo.png',
    summary:
      'The founder of Pooja, a digital media brand, and an accredited FIFA and CAF photojournalist.',
    bio: `Pooja runs a bespoke digital and media communications solution brand based in Lagos, Nigeria, offering cut-through services including content creation, digital marketing, photography, videography, drone services and influencer marketing.

As a digital services provider, Pooja has created content for multinational brands in varied sectors such as Multichoice, Bet9ja, Google, Carloha, Livescores, and Budweiser among others.

An accredited FIFA and CAF photojournalist, Pooja has covered international competitions of repute such as the FIFA World Cup, several AFCONs, Champions League games, AWCON, Premier League games and the highly acclaimed Commonwealth Games.

Pooja also runs an independent show on Top Radio FM called Sportz Numbers, features on several radio shows and international TV shows too.

Pooja has also built a strong brand personality with presence on social media platforms where he commands a huge following.`
  },
  {
    name: 'Dafe Richards',
    role: 'Content Creator',
    session: 'creative-economy',
    sessionRole: 'Moderator',
    sessionOrder: 4,
    image: '/speakers26/Dafe.JPEG',
    summary:
      'A content creator, speaker, and event host using storytelling, humour, and communication to connect with people.',
    bio: `Dafe Richards is a content creator, social media influencer, speaker, and professional event host who uses storytelling, humour, and communication to connect with people and create impact.`
  },
  {
    name: 'Idris Olubisi',
    role: 'Founder, Web3Afrika',
    session: 'web3',
    sessionRole: 'Panelist',
    sessionOrder: 1,
    image: '/speakers26/idris olubisi.jpg',
    summary:
      'A software and AI engineer scaling developer adoption across AI and Web3 infrastructure.',
    bio: `Idris is an accomplished senior software and AI engineer and technical writer with expertise in open source, AI, blockchain, software products, and serverless technologies.`
  },
  {
    name: 'Ayodeji Awosika',
    role: 'Founder, Web3 Bridge',
    session: 'web3',
    sessionRole: 'Panelist',
    sessionOrder: 2,
    image: '/speakers26/Awosika Israel Ayodeji.jpg',
    summary:
      'Founder of Web3Bridge, Africa’s blockchain engineering programme, and convener of Web3 Lagos Conference.',
    bio: `Ayodeji Israel Awosika, Founder of Web3Bridge, Africa's foremost blockchain engineering programme, which has trained more than 3,000 developers since 2019, with graduates now at Polygon, Interswitch, Nethermind, Nestcoin, and Nahmii. I convene the Web3 Lagos Conference, West Africa's largest Web3 gathering, and in 2025 was honoured as one of ten global torch bearers for Ethereum's 10th anniversary, a recognition of Web3Bridge's role in shaping Ethereum's community across Africa. A Kernel Fellow and postgraduate scholar at the University of Lagos, my work is anchored in a conviction that Africa's Web3 future will be defined by the calibre of its builders.`
  },
  {
    name: 'Adebayo Adewole',
    role: 'Founder, Ninelm Technologies (LRR) | CTO, CAPP Nigeria',
    session: 'web3',
    sessionRole: 'Moderator',
    sessionOrder: 4,
    image: '/speakers26/Adebayo Adewole.png',
    summary:
      'A technology and operations leader connecting business, government, and emerging talent through digital innovation.',
    bio: `Adewole Adebayo is a technology, operations, and digital transformation professional, entrepreneur, and technology leader with over 14 years of experience spanning technology, financial services, government, consulting, and entrepreneurship.

He currently serves as the Director of Programs & Partnerships, Ogun Digital Summit (ODS) 2026, where he is responsible for developing strategic partnerships, shaping impactful programmes and connecting businesses, government, technology leaders and emerging talent to opportunities that advance digital innovation and economic development.`
  },
  {
    name: 'Dára Sobaloju',
    role: 'Founder of Pewbeam',
    session: 'ai',
    sessionRole: 'Panelist',
    sessionOrder: 1,
    image: '/speakers26/Dára Sobaloju.jpg',
    summary:
      'An AI-native design engineer building Pewbeam, a real-time presentation agent for seamless church services.',
    bio: `Dára Sobaloju is the Founder of Pewbeam, a presentation agent for seamless church services. Pewbeam listens to pastors in real time and automatically projects Bible verses and other service content as they speak, helping churches deliver more seamless, distraction-free services. Featured by TechCabal and named one of Condia’s African Startups to Watch in 2026, Pewbeam is used every week by thousands of churches across 35 countries.

Dára is an AI-native Design Engineer and Product Designer whose work sits at the intersection of design, technology, and artificial intelligence. He explores how AI is changing the role of designers, shifting the advantage from simply executing faster to developing stronger taste, judgment, and problem-solving ability.`
  },
  {
    name: 'Ibiniyi Ibikoya',
    role: 'Technical Lead, Kora (ex-Paystack)',
    session: 'ai',
    sessionRole: 'Moderator',
    sessionOrder: 4,
    image: '/speakers26/Ibiniyi Ibikoya.PNG',
    summary:
      'A software engineer and technology leader focused on AI, mentorship, and building tools that solve real-world problems.',
    bio: `Ibiniyi Obikoya is a software engineer, technology leader, and content creator passionate about building technology that solves real-world problems. He currently serves as a Tech Lead at Kora Payments, where he contributes to building payment infrastructure and tools that support businesses across Africa.

Ibiniyi is passionate about artificial intelligence, particularly its applications, impact, potential misuse, and implications for the future of work. Through his content, he explores how individuals and organisations can navigate the evolving AI landscape and build sustainable careers in the age of AI. He is also passionate about mentoring aspiring engineers, building communities, and creating opportunities for Africans to thrive in technology.`
  },
  {
    name: 'Dr. Adebayo M. Ishola',
    role: 'Digital Innovation Specialist',
    session: 'policy-governance',
    sessionRole: 'Panelist',
    sessionOrder: 1,
    image: '/speakers26/Dr Ishola Adebayo 2.jpg',
    summary:
      'A digital skills trainer and mentor who has equipped over 10,000 young people across Africa.',
    bio: `Dr. Ishola Adebayo is an educational technologist, digital empowerment advocate, and Creative Director of Online Hub Educational Services (OnlineHubNG), Nigeria’s digital education content platform.

As a certified trainer, mentor, and coach on the Google Hustle Academy programme, he has equipped over 10,000 young people across Nigeria, Ghana, Kenya, and South Africa with essential digital skills. He also lectures in the Department of Educational Technology, bringing expertise in digital learning, entrepreneurship, and educational innovation.

Recognized for his contributions to technology and community development, he received the 2024 T.S.O. Impact Award for Ogun State Tech Community Leader. Dr. Ishola continues to champion digital literacy, mentorship, and innovation, empowering individuals and businesses to thrive in an increasingly digital world.`
  },
  {
    name: 'Goke Olateju',
    role: 'Managing Director, Centrum Finance',
    session: 'policy-governance',
    sessionRole: 'Panelist',
    sessionOrder: 2,
    image: '/speakers26/Goke Olateju Image.jpeg',
    summary:
      'A finance executive and strategic advisor with over 15 years of experience across financial services and fintech.',
    bio: `Goke Olateju is a seasoned finance executive, strategic advisor, and project management professional with over 15 years of experience across Nigeria’s financial services and fintech sectors.

He currently serves as the Managing Director and CEO of Centrum Finance Company Limited, where he leads strategic growth, alternative financing solutions, and corporate advisory services. Throughout his career, he has held key leadership positions, co-founded financial advisory and fintech ventures, and contributed to deals valued at over $20 million.

An alumnus of Nile University of Nigeria, Lagos Business School, and Regenesys Business School, Goke is passionate about financial innovation, entrepreneurship, youth empowerment, and financial literacy. He continues to drive conversations around sustainable business growth and innovative financing solutions.`
  },
  {
    name: 'Lateef Surakatu',
    role: 'Partner, Andersen',
    session: 'policy-governance',
    sessionRole: 'Panelist',
    sessionOrder: 3,
    image: '/speakers26/Lateef Surakatu.jpeg',
    summary:
      'A business advisory professional with 17+ years of experience in financial strategy and institutional transformation.',
    bio: `Lateef Surakatu is an experienced business advisory professional with over 17 years of expertise in financial strategy, institutional transformation, and organizational reforms.

He is a Partner and Head of Business Advisory Services at Andersen Nigeria and leads the Accounting Services practice across the Africa region. Throughout his career, he has supported organizations across various sectors, including financial services, telecommunications, oil and gas, manufacturing, and the public sector.

Lateef has led major financial transformation projects, helping organizations strengthen financial reporting, improve operational efficiency, and achieve sustainable growth. His expertise continues to drive institutional excellence and better business outcomes.`
  },
  {
    name: 'Rahaman Abiola',
    role: 'Editor-in-Chief, Legit.ng',
    session: 'policy-governance',
    sessionRole: 'Moderator',
    sessionOrder: 5,
    image: '/speakers26/Rahaman Abiola.jpg',
    summary:
      'A Reuters-trained journalist and editor with over a decade of experience in traditional and digital media.',
    bio: `Rahaman Abiola is an award-winning Reuters-trained journalist, editor, and media trainer with over a decade of experience spanning diverse roles in both traditional and digital media. As the Editor-in-Chief of LEGIT.ng, he leads content direction with a data-driven editorial practice, demonstrating a commitment to modern newsroom management and to mentoring teams of professionals through audience-centric innovation.

His work has been extensively published in notable national dailies such as The Nation, The Punch, Nigeria Tribune, and Business Day. Moreover, his work has appeared on leading digital media platforms, including Sahara Reporters, The Cable, The Capital, Business Post, YNAIJA, Lawyard, LEGIT.ng, Yen, Tuko, Briefly, and others.

His dedication to journalism has earned him several prestigious fellowships, including the MTN Media Innovation Programme (MIP), the Kwame Karikari Fact-Checking Fellowship, the Solutions Journalism Fellowship with the Nigeria Health Watch (NHW), the FactCheckAfrica AI Fellowship, and the 2025 Free Trade Fellowship.

In 2023, he became the youngest member of the Africa Advisory Council of the International News Media Association (INMA), a global community of market-leading news media companies.

He has trained hundreds of journalists and media professionals through direct mentorship, webinars, lectures, and professional newsroom onboarding.`
  },
  {
    name: 'Ifeoluwa Wealth',
    role: 'CEO, iMultiple Holdings',
    session: 'startup-investment',
    sessionRole: 'Panelist',
    sessionOrder: 2,
    image: '/speakers26/Ifeoluwa Wealth - PrHe.png',
    summary:
      'A business builder and enterprise strategist growing business groups across multiple sectors.',
    bio: `Ifeoluwa Wealth is a business builder and enterprise strategist. He is the Founder and CEO of iMultiple Holdings, a diversified investment group focused on building and growing business groups across multiple sectors.

With over a decade of experience in business operations and management, his entrepreneurial journey spans technology, digital, commerce, business development, and enterprise management. He takes a practical approach to entrepreneurship, identifying opportunities, solving problems, and turning ideas into sustainable businesses.`
  },
  {
    name: 'Abiodun Adetona',
    role: 'CEO, Decide AI',
    session: 'ai',
    sessionRole: 'Panelist',
    sessionOrder: 3,
    image: '/speakers26/Abiodun Adetona.jpg'
  },
  {
    name: 'Ayo Adewuyi',
    role: 'CEO, Pouchers',
    session: 'web3',
    sessionRole: 'Panelist',
    sessionOrder: 3,
    image: '/speakers26/Ayo Adewuyi.webp'
  },
  {
    name: 'Dayo Abiodun',
    role: 'SA to Governor, ICT',
    session: 'policy-governance',
    sessionRole: 'Panelist',
    sessionOrder: 4,
    image: '/speakers26/Dayo Abiodun.jpeg'
  },
  {
    name: 'Dr. Adebola Ismail Akindele',
    role: 'Group Managing Director, Courteville Business Solutions Plc.',
    session: 'keynotes',
    sessionRole: 'Keynote Speaker',
    sessionOrder: 4,
    image: '/speakers26/Dr. Adebola Ismail Akindele.png',
    summary:
      'A technology and business leader who has expanded Courteville’s operations across 20 Nigerian states.',
    bio: `Dr. Adebola Ismail Akindele is the Group Managing Director of Courteville Business Solutions Plc., a leading information technology consultancy and business process outsourcing company. Since becoming CEO in 2004, he has played a pivotal role in expanding the company’s operations across 20 Nigerian states and establishing over 200 franchises.

With a distinguished career spanning banking, finance, technology, and entrepreneurship, Dr. Akindele has held key positions at the Central Bank of Nigeria, Oceanic Bank, and Fountain Trust Bank. He also serves as chairman of several companies and sits on the board of Synergy Capital and Advisory Limited.

His contributions to technology and business development have earned him several recognitions, including the Technology Personality of the Year at the 2015 Nigeria Technology Awards and an Honorary Fellowship from Ravensbourne College, UK, for his impact on education in Africa.`
  },
  {
    name: 'Olúwatóyìn (Toyin) Emmanuel-Olubake',
    role: 'Chief Investment Officer, Catalyst Fund',
    session: 'startup-investment',
    sessionRole: 'Panelist',
    sessionOrder: 1,
    image: '/speakers26/Olúwatóyìn Emmanuel-Olubake.jpg'
  },
  {
    name: 'Temi Omotola',
    role: 'Director, Lifemark Health Group',
    session: 'ai',
    sessionRole: 'Panelist',
    sessionOrder: 2
  }
] satisfies Speaker[];
