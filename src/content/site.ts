/**
 * All Home page copy. Mirrors the Website Copy Deck (D14).
 * Edit copy here, never in components.
 */

export const site = {
  name: "Virtus Lab",
  tagline: "Excellence, engineered.",
  // TODO(Web Dev Pod): point at the real inbox once the domain is secured (§5.2).
  contactEmail: "hello@virtuslab.studio",
  // TODO(Copy + QA Pods): publish these, then the footer links go live (D16).
  legal: {
    privacy: "#privacy",
    terms: "#terms",
  },

  availability: "Accepting new projects",
  announcement: "Accepting new projects",

  nav: {
    links: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "How we work", href: "#process" },
      { label: "Packages", href: "#packages" },
    ],
    action: { label: "Build your brief", href: "#brief" },
  },

  hero: {
    headline: "A full team behind every project.",
    body: "Virtus Lab designs brands, builds websites, and ships content and automation for growing businesses abroad. One coordinated team, quality-checked work, and honest timelines — at a size that still moves fast.",
    primary: { label: "Build your brief", href: "#brief" },
    secondary: { label: "See the work", href: "#work" },
    // mono readout shown over the scene
    coords: "14.5995 N · 120.9842 E — Manila",
  },

  trust: {
    items: [
      "Working across US, AU, UK & CA time zones",
      "QA on every deliverable before you see it",
      "Paid by PayPal, Wise, or Payoneer",
    ],
  },

  services: {
    title: "What we make",
    intro: "Four practices, one team. Take one or bundle them — the handoffs stay inside the studio.",
    pillars: [
      {
        id: "brand",
        name: "Brand & Design",
        desc: "Logos, brand kits, social graphics, and pitch decks that hold up next to any agency.",
      },
      {
        id: "web",
        name: "Web",
        desc: "Landing pages, business sites, and redesigns — fast, accessible, and easy for you to run.",
      },
      {
        id: "content",
        name: "Content & Video",
        desc: "Short-form edits, ad creative, and content calendars, produced on a repeatable schedule.",
      },
      {
        id: "ai",
        name: "AI & Automation",
        desc: "Chatbots, workflow automation, and content systems that take the busywork off your desk.",
      },
    ],
  },

  process: {
    title: "How we work",
    intro: "Five stages, each with one named owner. You always know who to ask and what happens next.",
    steps: [
      { name: "Discover", desc: "We learn your goals, audience, and constraints, then agree on what success looks like." },
      { name: "Design", desc: "Directions, then a chosen route taken to high fidelity. Two focused revision rounds." },
      { name: "Build", desc: "Production in the open, with preview links so you see progress, not just milestones." },
      { name: "Deliver", desc: "QA against the brief, a walkthrough, and every source file handed to you." },
      { name: "Support", desc: "A care window after launch for fixes, plus optional ongoing maintenance." },
    ],
  },

  work: {
    title: "Selected work",
    intro: "Concept work while the studio is new — labelled honestly. Real case studies replace these as projects ship.",
    projects: [
      {
        id: "tidewater",
        name: "Tidewater Coffee",
        kind: "Lab Project",
        pillar: "Brand & Design",
        depth: "0420 m",
        desc: "Identity and packaging for a coastal roaster — a wordmark built from a single continuous stroke.",
        image:
          "https://images.pexels.com/photos/29795384/pexels-photo-29795384.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual used to represent the Tidewater Coffee lab project.",
        visualCredit: "Mock visual · Pexels",
      },
      {
        id: "meridian",
        name: "Meridian Clinic",
        kind: "Lab Project",
        pillar: "Web",
        depth: "0980 m",
        desc: "A calm, bookable site for a multi-location practice, with plain-language patient information.",
        image:
          "https://images.pexels.com/photos/8015460/pexels-photo-8015460.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of minimalist white product containers used to represent the Meridian Clinic lab project.",
        visualCredit: "Mock visual · Pexels",
      },
      {
        id: "harbor",
        name: "Harbor Freight Co-op",
        kind: "Lab Project",
        pillar: "AI & Automation",
        depth: "1600 m",
        desc: "A quoting assistant that turns a rough parts list into a costed estimate in under a minute.",
        image:
          "https://images.pexels.com/photos/24244230/pexels-photo-24244230.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of a logistics container terminal used to represent the Harbor Freight Co-op lab project.",
        visualCredit: "Mock visual · Pexels",
      },
      {
        id: "northstar",
        name: "Northstar Studio",
        kind: "Lab Project",
        pillar: "Content & Video",
        depth: "1980 m",
        desc: "A modular campaign system for turning one launch story into repeatable social, editorial, and short-form content.",
        image:
          "https://images.pexels.com/photos/3753759/pexels-photo-3753759.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of a modern creative editing workspace used to represent the Northstar Studio lab project.",
        visualCredit: "Mock visual · Pexels",
      },
      {
        id: "aster",
        name: "Aster Commerce",
        kind: "Lab Project",
        pillar: "Web",
        depth: "2280 m",
        desc: "A conversion-focused product launch site with a restrained editorial system built for campaigns that change quickly.",
        image:
          "https://images.pexels.com/photos/6483614/pexels-photo-6483614.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of a clean laptop workspace used to represent the Aster Commerce lab project.",
        visualCredit: "Mock visual · Pexels",
      },
    ],
  },

  why: {
    title: "Why Virtus Lab",
    points: [
      { name: "A team, not a solo act", desc: "Every project has a lead, a maker, and a reviewer. Nobody works without a backup." },
      { name: "QA before handoff", desc: "A checklist runs on every deliverable — spelling, links, contrast, responsiveness — before it reaches you." },
      { name: "AI-augmented, member-owned", desc: "We use modern tools to move faster, but a person owns and refines everything that ships." },
      { name: "Clear across time zones", desc: "Agreed response times and async updates, so distance never means silence." },
    ],
  },

  brief: {
    title: "Tell us what you're after",
    intro: "No forms, no typing — just tap. It takes about thirty seconds and gives us enough to reply with something useful.",
    steps: [
      {
        id: "need",
        label: "Needs",
        prompt: "What do you need?",
        hint: "Pick as many as apply.",
        multi: true,
        options: ["Brand & design", "A website", "Content & video", "AI & automation"],
      },
      {
        id: "state",
        label: "Stage",
        prompt: "Where is it now?",
        hint: "Pick one.",
        multi: false,
        options: ["Starting fresh", "Reworking what we have", "Fixing something that broke"],
      },
      {
        id: "feel",
        label: "Feel",
        prompt: "How should it feel?",
        hint: "Pick the ones that fit.",
        multi: true,
        options: [
          "Calm & precise",
          "Warm & human",
          "Bold & confident",
          "Technical & sharp",
          "Editorial & classic",
          "Minimal & quiet",
        ],
      },
      {
        id: "when",
        label: "Timeline",
        prompt: "When do you need it?",
        hint: "Pick one.",
        multi: false,
        options: ["In a few weeks", "One to two months", "No fixed date"],
      },
      {
        id: "budget",
        label: "Budget",
        prompt: "Budget to work within",
        hint: "In USD. Pick one — a range is fine.",
        multi: false,
        options: ["Under $1k", "$1k – $3k", "$3k – $7k", "$7k+", "Not sure yet"],
      },
    ],
    summary: {
      title: "Your brief",
      empty: "Make a few choices above and your brief builds itself here.",
      send: "Send this brief",
      copy: "Copy brief",
      copied: "Copied",
      reset: "Start over",
      note: "Sending opens your email app with the brief written out. Change anything before you hit send.",
    },
  },

  packages: {
    title: "Packages",
    intro: "Starting points, not ceilings. Every engagement is quoted to the work — this is where the conversation begins.",
    // TODO(Agency Sub-Leader): replace placeholder prices with real "starting at" figures in USD (§5.4).
    tiers: [
      {
        name: "Starter",
        price: "from $900",
        for: "One clear thing, done well.",
        includes: ["A landing page or a logo suite", "One round of directions", "Two revision rounds", "Source files + a handoff call"],
        featured: false,
      },
      {
        name: "Growth",
        price: "from $2,400",
        for: "A brand or a site with room to grow.",
        includes: ["Multi-page site or full brand kit", "Design system + components", "Content support", "30-day post-launch care"],
        featured: true,
      },
      {
        name: "Premium",
        price: "from $6,000",
        for: "Brand, web, and automation together.",
        includes: ["Everything in Growth", "Automation & AI workflows", "Ongoing content production", "Priority support window"],
        featured: false,
      },
    ],
  },

  faq: {
    title: "Common questions",
    items: [
      {
        q: "How do payments work?",
        a: "A deposit before kickoff, the balance on delivery. Invoices are in USD and go to the studio's designated account — never a personal one.",
      },
      {
        q: "What's a typical timeline?",
        a: "A landing page runs one to two weeks. A full site or brand runs three to six. We agree the schedule before we start and flag slips early.",
      },
      {
        q: "How many revisions are included?",
        a: "Two focused rounds at each design stage. Feedback is consolidated into one list so nothing gets lost between rounds.",
      },
      {
        q: "Who owns the files?",
        a: "You do, once the final payment clears. You get every source file — no lock-in, no license to renew.",
      },
      {
        q: "How do time zones work?",
        a: "We keep hours that overlap US, AU, UK, and CA business days, with agreed response times and written updates in between.",
      },
      {
        q: 'What does "Lab Project" mean?',
        a: "Concept work we made to show our range, not paid client work. It's always labelled as such. Real case studies replace it as projects ship.",
      },
    ],
  },

  finalCta: {
    line: "Let's build something excellent.",
    action: { label: "Build your brief", href: "#brief" },
  },

  footer: {
    tagline: "Excellence, engineered.",
    built: "Built in the deep — Manila, for the world.",
  },
} as const;

export type Site = typeof site;
