// All visitor-facing copy and contact details live here.
// Source: Chillchai Creations master website content supplied by the client.
export const content = {
  intro: {
    firstLine: 'when life gives you lemons...',
    secondLine: 'make lemon tea.',
  },
  brand: {
    name: 'Chillchai',
    descriptor: 'CREATIONS',
    tagline: 'when life gives you lemons, make lemon tea',
    logo: '/assets/logo.webp',
  },
  nav: [
    ['Home', 'home'],
    ['About', 'about'],
    ['What We Do', 'services'],
    ['Our Work', 'work'],
    ['Contact', 'contact'],
  ],
  ui: {
    talk: 'Let’s Talk', menu: 'Menu', close: 'Close', skip: 'Skip to content',
    project: 'Explore the project', back: 'Back to all work', context: 'The context',
    role: 'Our role', approach: 'The approach', outcomes: 'The receipts',
    source: 'Figures from our 2026 brand one-pager; a snapshot, not a live count.',
    top: 'Back to top', copyright: 'Chillchai Creations', viewProfile: 'Visit creator profile',
    enquirySubject: 'Chillchai Creations — project enquiry',
  },
  hero: {
    eyebrow: 'SOCIAL MEDIA MARKETING · PERSONAL BRANDING',
    line1: 'Built by creators.', line2: 'For brands that want', line3: 'to be remembered.',
    description: 'We build, manage and grow social media — for people and for brands. Two wings: Social Media Marketing for brands, and Personal Branding for the founders and creators behind them.',
    primary: 'Let’s brew something together', secondary: 'Explore our work',
    note: 'Brewing stories.', foot: 'CONTENT · CREATORS · COMMUNITY', footRight: 'Brewing stories.',
  },
  proof: {
    label: 'THE STORY SO FAR, IN NUMBERS.',
    items: [
      { value: '89.9K', label: 'YouTube subscribers' },
      { value: '41.5K', label: 'Instagram followers' },
      { value: '60+', label: 'Brand collaborations' },
      { value: '5', label: 'Products launched' },
      { value: '5,000+', label: 'Units sold' },
      { value: '90–100', label: 'Creators in our network' },
    ],
  },
  services: {
    label: '01 / WHAT WE DO', title: 'Good stories deserve', italic: 'a proper plan.',
    description: 'From the first idea to the next chapter. We work across two wings — one for brands, one for the people behind them.',
    wings: [
      {
        number: 'WING 1', audience: 'FOR BRANDS', name: 'Social Media Marketing',
        headline: 'Your brand’s story, built into a system that runs.',
        services: [
          { name: 'Content Strategy & Storytelling', description: 'Audience research, positioning, content pillars, calendars and original ideas.' },
          { name: 'Social Media Management', description: 'Calendars, publishing, content execution, community engagement and performance reviews.' },
          { name: 'Creator & Influencer Marketing', description: 'Creator discovery, fitment, outreach, negotiation and campaign coordination — run through our 90–100 creator network.' },
          { name: 'Content IP & Community', description: 'Recurring series and recognisable formats that give an audience a reason to come back.' },
        ],
      },
      {
        number: 'WING 2', audience: 'FOR FOUNDERS & CREATORS', name: 'Personal Branding',
        headline: 'Your personal brand becomes your strongest marketing channel — your name doing the work of a sales team.',
        services: [
          { name: 'Founder Personal Branding', description: 'Positioning, thought leadership, scripts, content production and audience building for the person behind the brand.' },
          { name: 'Content Strategy for Creators', description: 'Finding the one story only you can tell, and the pillars and formats to tell it consistently.' },
        ],
      },
    ],
  },
  founder: {
    label: '02 / MEET THE FOUNDER', title: 'Meet the', italic: 'founder.',
    name: 'Avishi Mishra', role: 'Founder, Chillchai Creations',
    image: '/assets/avishi.webp', imageAlt: 'Avishi Mishra, founder of Chillchai Creations',
    body: 'I built the audience before I advised one — 89.9K on YouTube, 41.5K on Instagram, 60+ brand collabs, and 5 products of my own taken from idea to sold. Now I lead a team that builds the same for brands and founders. A management student at IIM Jammu, I ran the whole playbook on myself first.',
    closing: 'She’s been there. She’s built that. Now she builds it with you.',
  },
  team: {
    label: '03 / THE TEAM', title: 'The team behind', italic: 'the brew.',
    description: 'Two perspectives, one belief: good content starts with understanding people.',
    people: [
      { name: 'Avishi Mishra', image: '/assets/avishi.webp', imageAlt: 'Avishi Mishra', role: 'Founder, Chillchai Creations', school: 'IIM Jammu', bio: 'Founder. Built the audience, launched the products, and leads the team.', handle: '@avishimishh', href: 'https://www.instagram.com/avishimishh/' },
      { name: 'Kritarth Shuckla', image: '/assets/kritarth.webp', imageAlt: 'Kritarth Shuckla', role: 'Business Lead, Chillchai Creations', school: 'IIT Bombay', bio: 'Creator and the operator behind Protein Mummy (213K+). Brings audience-building experience to the business of content.', handle: '@kriitarth', href: 'https://www.instagram.com/kriitarth/' },
    ],
  },
  work: {
    label: '04 / OUR WORK', title: 'Less pitch.', italic: 'More proof.',
    description: 'Our own creator journeys, and the brands we’ve helped shape.',
    projects: [
      {
        id: 'protein-mummy', name: 'Protein Mummy', category: 'CREATOR WORK / AUDIENCE BUILDING', theme: 'protein',
        image: '/assets/protein-mummy.webp' as string | null, imageAlt: 'Protein Mummy', display: ['A recipe for', 'coming back.'], stamp: 'SERIES, NOT JUST POSTS',
        summary: 'Turning recipe content into a recognisable creator identity, 213K+ strong.',
        context: 'Protein Mummy is a recipe-focused creator account built around a recognisable identity and repeatable formats.',
        role: 'Audience building, series-led content strategy, storytelling and recipe formats.',
        approach: ['Build a clear creator identity around recipe content.', 'Develop repeatable formats that viewers recognise.', 'Use series-led storytelling to give the audience a reason to return.'],
        outcomes: [['213K+', 'Audience built']], note: 'A creator identity designed for recognition and return.', links: [],
      },
      {
        id: 'client-launch', name: 'D2C brand launch', category: 'CLIENT WORK / SOCIAL & CREATOR MARKETING', theme: 'client',
        image: null as string | null, imageAlt: '', display: ['From a blank page', 'to launch day.'], stamp: 'STORY → SYSTEM → LAUNCH',
        summary: 'A social content system and creator-collaboration engine for a D2C brand, built from the ground up.',
        context: 'An unnamed D2C brand needed to move from zero social presence to an always-on launch engine.',
        role: 'Social content strategy, content systems and creator-collaboration planning.',
        approach: ['Build the brand story from the ground up.', 'Turn the story into a repeatable social content system.', 'Create a creator-collaboration engine for launch and beyond.'],
        outcomes: [], note: 'From zero presence to an always-on launch engine.', links: [],
      },
      {
        id: 'avishi', name: 'Avishi’s creator ecosystem', category: 'OWNED CREATOR BRAND / CONTENT & PRODUCTS', theme: 'avishi',
        image: '/assets/avishi.webp' as string | null, imageAlt: 'Avishi Mishra', display: ['An audience.', 'A world of possibility.'], stamp: 'CREATE. CONNECT. BUILD.',
        summary: 'Firsthand experience turning content into an audience, collaborations and products.',
        context: 'Avishi’s own creator ecosystem is part of the operating experience behind Chillchai Creations.', role: 'Creator, product builder and founder of Chillchai Creations.',
        approach: ['Create across YouTube and Instagram.', 'Build long-term audience trust.', 'Extend the creator journey into collaborations and products.'],
        outcomes: [['89.9K', 'YouTube subscribers'], ['41.5K', 'Instagram followers'], ['5', 'Products launched']], note: '60+ brand collaborations and 5,000+ units sold.',
        links: [{ label: '@avishimishh on Instagram', href: 'https://www.instagram.com/avishimishh/' }],
      },
    ],
  },
  process: {
    label: '05 / HOW WE WORK', title: 'A good brew', italic: 'takes intention.',
    items: [
      ['Understand', 'Your brand, your audience, and what you’re working towards.'],
      ['Find the story', 'The positioning, creative direction and ideas worth making.'],
      ['Make it real', 'Content, collaborations and campaigns. Thoughtfully executed.'],
      ['Learn and improve', 'Look at what’s working. Listen to the audience. Make the next round better.'],
    ],
  },
  contact: {
    label: 'CONTACT / START A PROJECT', title: 'Let’s', italic: 'talk.',
    body: 'If you’re a brand launching soon, or a founder who wants to build a personal brand — we should talk. Tell us what you’re building.',
    cta: 'Start a conversation', email: 'avishimishra134@gmail.com', phone: '+91 96676 71258',
    whatsapp: 'https://wa.me/919667671258', whatsappLabel: 'Say hello on WhatsApp',
    note: 'Scoped to your project. Built around your story.',
  },
};

export type Project = typeof content.work.projects[number];
