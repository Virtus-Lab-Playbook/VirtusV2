/**
 * Virtus Lab homepage content.
 * Business-facing copy belongs here so components stay presentation-only.
 */

export const site = {
  name: "Virtus Lab",
  tagline: "Where brand, technology, and content move together.",

  // Existing placeholder from the repository. Replace only when the real inbox is confirmed.
  contactEmail: "hello@virtuslab.studio",

  // Existing placeholders from the repository. Replace only when real legal pages are published.
  legal: {
    privacy: "#privacy",
    terms: "#terms",
  },

  availability: "Accepting new projects",

  nav: {
    links: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "Products", href: "#products" },
      { label: "How we work", href: "#process" },
      { label: "About", href: "#why-us" },
    ],
    action: { label: "Build your brief", href: "#brief" },
  },

  hero: {
    eyebrow: "Independent digital studio · Manila → Worldwide",
    headline: "Where brand, technology, and content move together.",
    body:
      "Brand, web, content and automation under one coordinated team — from first idea to finished launch, without managing five different specialists.",
    primary: { label: "Build your brief", href: "#brief" },
    secondary: { label: "View selected work", href: "#work" },
    disciplines: [
      "Brand & Creative",
      "Web & Digital",
      "Content & Video",
      "AI & Automation",
    ],
  },

  trust: {
    items: [
      {
        title: "One coordinated team",
        desc:
          "Brand, web, content and automation stay inside one project workflow.",
      },
      {
        title: "Built-in QA",
        desc: "Every deliverable is reviewed before it reaches you.",
      },
      {
        title: "Remote-first",
        desc:
          "Structured to collaborate across US, UK, AU and CA time zones.",
      },
    ],
  },

  work: {
    title: "Selected work",
    intro:
      "Selected concepts across brand, web, content and automation — built to show how we think, design and execute.",
    note:
      "Lab Projects are concept work. Real client case studies replace them as work ships.",
    projects: [
      {
        id: "tidewater",
        name: "Tidewater Coffee",
        kind: "Lab Project",
        pillar: "Brand & Creative",
        statement:
          "A coastal coffee identity built to feel recognizable from shelf to social.",
        capabilities: [
          "Brand Strategy",
          "Visual Identity",
          "Packaging",
          "Social System",
        ],
        image:
          "https://images.pexels.com/photos/29795384/pexels-photo-29795384.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual used to represent the Tidewater Coffee lab project.",
        visualCredit: "Concept visual · Pexels",
      },
      {
        id: "meridian",
        name: "Meridian Clinic",
        kind: "Lab Project",
        pillar: "Web & Digital",
        statement:
          "A calmer digital experience for finding care, understanding services and booking quickly.",
        capabilities: [
          "UX Strategy",
          "Information Architecture",
          "UI Design",
          "Responsive Web",
        ],
        image:
          "https://images.pexels.com/photos/8015460/pexels-photo-8015460.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of minimalist white product containers used to represent the Meridian Clinic lab project.",
        visualCredit: "Concept visual · Pexels",
      },
      {
        id: "harbor",
        name: "Harbor Freight Co-op",
        kind: "Lab Project",
        pillar: "AI & Automation",
        statement:
          "A quoting workflow designed to turn messy requests into structured estimates faster.",
        capabilities: [
          "Workflow Design",
          "AI Assistance",
          "Structured Data",
          "Internal Tool UX",
        ],
        image:
          "https://images.pexels.com/photos/24244230/pexels-photo-24244230.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of a logistics container terminal used to represent the Harbor Freight Co-op lab project.",
        visualCredit: "Concept visual · Pexels",
      },
      {
        id: "northstar",
        name: "Northstar Studio",
        kind: "Lab Project",
        pillar: "Content & Video",
        statement:
          "One launch story turned into a repeatable system for short-form, editorial and campaign content.",
        capabilities: [
          "Creative Direction",
          "Content System",
          "Video Editing",
          "Social Adaptation",
        ],
        image:
          "https://images.pexels.com/photos/3753759/pexels-photo-3753759.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of a modern creative editing workspace used to represent the Northstar Studio lab project.",
        visualCredit: "Concept visual · Pexels",
      },
      {
        id: "aster",
        name: "Aster Commerce",
        kind: "Lab Project",
        pillar: "Web & Digital",
        statement:
          "A launch-focused commerce experience built to keep product storytelling and conversion aligned.",
        capabilities: [
          "Campaign Strategy",
          "Web Design",
          "Commerce UX",
          "Creative Direction",
        ],
        image:
          "https://images.pexels.com/photos/6483614/pexels-photo-6483614.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Placeholder stock visual of a clean laptop workspace used to represent the Aster Commerce lab project.",
        visualCredit: "Concept visual · Pexels",
      },
    ],
  },

  services: {
    title: "What we do",
    intro:
      "Four disciplines, one coordinated studio. Start with one, or bring them together when the project needs more.",
    closing:
      "Need more than one discipline? We build the team around the project, not the other way around.",
    pillars: [
      {
        id: "brand",
        name: "Brand & Creative",
        outcome:
          "Build a brand people can recognize, remember and use consistently.",
        capabilities: [
          "Brand strategy",
          "Visual identity",
          "Logo systems",
          "Brand guidelines",
          "Campaign creative",
          "Social design",
          "Pitch decks",
          "Marketing assets",
        ],
        relatedWork: "Tidewater Coffee",
      },
      {
        id: "web",
        name: "Web & Digital",
        outcome:
          "Turn attention into a digital experience that is clear, fast and built to convert.",
        capabilities: [
          "Landing pages",
          "Business websites",
          "Website redesign",
          "UX/UI",
          "Design systems",
          "Frontend development",
          "CMS integration",
          "E-commerce",
        ],
        relatedWork: "Meridian Clinic · Aster Commerce",
      },
      {
        id: "content",
        name: "Content & Video",
        outcome:
          "Turn ideas, launches and campaigns into content systems that keep producing.",
        capabilities: [
          "Creative direction",
          "Short-form video",
          "Video editing",
          "Ad creative",
          "Social content",
          "Campaign assets",
          "Content systems",
          "Repurposing",
        ],
        relatedWork: "Northstar Studio",
      },
      {
        id: "ai",
        name: "AI & Automation",
        outcome:
          "Remove repetitive work with AI-assisted systems designed around how your business actually operates.",
        capabilities: [
          "Workflow automation",
          "Internal tools",
          "AI assistants",
          "Lead workflows",
          "Content pipelines",
          "Data processing",
          "Knowledge systems",
          "System integrations",
        ],
        relatedWork: "Harbor Freight Co-op",
      },
    ],
  },

  products: {
    eyebrow: "Digital products",
    title: "Tools built to keep working after we leave.",
    intro:
      "Ready-made systems, templates and digital resources for teams that want to move faster without starting from zero.",
    note:
      "Products stand on their own. You do not need a service engagement to use them.",
    families: [
      {
        id: "workflow-tools",
        name: "Workflow Tools",
        desc:
          "Practical tools for repeatable operations, planning and execution.",
        includes: ["Operations", "Planning", "Handoffs", "Repeatable workflows"],
      },
      {
        id: "ai-systems",
        name: "AI Systems",
        desc:
          "Reusable AI-assisted systems built around focused business jobs.",
        includes: ["Assistants", "Content systems", "Knowledge flows", "Automation"],
      },
      {
        id: "templates",
        name: "Templates",
        desc:
          "Structured starting points for teams that need consistency without a blank page.",
        includes: ["Creative", "Project systems", "Planning", "Documentation"],
      },
      {
        id: "digital-resources",
        name: "Digital Resources",
        desc:
          "Focused references and practical assets designed to be used, not just read.",
        includes: ["Guides", "Libraries", "Frameworks", "Reference kits"],
      },
    ],
  },

  why: {
    title: "Why Virtus",
    intro:
      "The flexibility of a small studio, without making you manage the pieces.",
    points: [
      {
        name: "One coordinated team",
        desc:
          "Strategy, design, development, content and automation can move inside one workflow.",
      },
      {
        name: "Quality before handoff",
        desc:
          "Every deliverable is checked before it becomes your problem to find.",
      },
      {
        name: "AI accelerated. Human owned.",
        desc:
          "We use AI where it improves speed and capability. A person remains accountable for what ships.",
      },
      {
        name: "Built for async collaboration",
        desc:
          "Clear owners, written updates and agreed response times keep projects moving across time zones.",
      },
    ],
  },

  process: {
    title: "How we work",
    intro:
      "Five stages. One clear owner at every step. You always know what is happening, what comes next and who is responsible.",
    steps: [
      {
        name: "Discover",
        desc:
          "Goals, audience, constraints, scope and success criteria are aligned before production begins.",
      },
      {
        name: "Design",
        desc:
          "Direction comes first, then the chosen route is developed with focused feedback.",
      },
      {
        name: "Build",
        desc:
          "Production stays visible through working previews and clear progress updates.",
      },
      {
        name: "Deliver",
        desc:
          "Final QA, handoff, walkthrough and agreed source files close the production phase.",
      },
      {
        name: "Support",
        desc:
          "A defined care period follows launch, with ongoing support available when the project needs it.",
      },
    ],
  },

  engagements: {
    title: "Ways to work with us",
    intro:
      "Choose the shape that matches the problem. Scope and pricing are confirmed after we understand the work.",
    models: [
      {
        name: "Focused",
        summary: "One clear problem. One defined outcome.",
        goodFor: [
          "Landing pages",
          "Brand refreshes",
          "Campaign assets",
          "Single automations",
        ],
      },
      {
        name: "Growth",
        summary: "A broader system with several connected pieces.",
        goodFor: [
          "Full websites",
          "Brand systems",
          "Launch campaigns",
          "Content systems",
        ],
      },
      {
        name: "Integrated",
        summary: "Multiple Virtus disciplines working as one project team.",
        goodFor: [
          "Brand + website",
          "Web + automation",
          "Launch + content",
          "Multi-system projects",
        ],
      },
    ],
    note:
      "Every engagement is quoted to scope. Payment schedule and supported business payment channels are confirmed in the project quote.",
  },

  brief: {
    title: "Start with a brief.",
    intro:
      "A few choices give us enough context to understand the project before we talk. No long form and no perfect brief required.",
    productEscape: {
      label: "Looking for something ready-made?",
      action: "View digital products",
      href: "#products",
    },
    steps: [
      {
        id: "need",
        label: "Needs",
        prompt: "What do you need?",
        hint: "Pick as many as apply.",
        multi: true,
        options: [
          "Brand & Creative",
          "Web & Digital",
          "Content & Video",
          "AI & Automation",
        ],
      },
      {
        id: "state",
        label: "Stage",
        prompt: "Where is it now?",
        hint: "Pick one.",
        multi: false,
        options: [
          "Starting fresh",
          "Improving what exists",
          "Fixing something that is not working",
        ],
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
        options: ["In a few weeks", "One to two months", "Flexible"],
      },
      {
        id: "budget",
        label: "Budget",
        prompt: "Budget to work within",
        hint: "In USD. A range is fine.",
        multi: false,
        options: [
          "Under $1k",
          "$1k – $3k",
          "$3k – $7k",
          "$7k+",
          "Not sure yet",
        ],
      },
    ],
    summary: {
      title: "Your brief",
      empty: "Make a few choices and your brief builds itself here.",
      send: "Send this brief",
      copy: "Copy brief",
      copied: "Copied",
      reset: "Start over",
      note:
        "Sending opens your email app with the brief written out. Review or change anything before you send it.",
    },
  },

  faq: {
    title: "Common questions",
    items: [
      {
        q: "How do payments work?",
        a:
          "The payment schedule and supported business payment channels are confirmed in the project quote before kickoff.",
      },
      {
        q: "What is a typical timeline?",
        a:
          "Timeline depends on scope. We agree milestones before kickoff, keep progress visible and flag risks early.",
      },
      {
        q: "How do revisions work?",
        a:
          "Revision scope is agreed before the project starts so feedback stays focused and expectations stay clear.",
      },
      {
        q: "Who owns the files?",
        a:
          "Ownership, source-file handoff and any licensing terms are stated clearly in the project quote before work begins.",
      },
      {
        q: "How do time zones work?",
        a:
          "Virtus is structured for async collaboration across US, UK, AU and CA business days, with written updates and agreed response expectations.",
      },
      {
        q: "How do you use AI in client work?",
        a:
          "AI is used where it improves speed or capability, but a person remains responsible for reviewing and refining what ships.",
      },
      {
        q: 'What does "Lab Project" mean?',
        a:
          "It is concept work created to demonstrate a capability, not paid client work. Lab Projects are labelled clearly and are replaced by real case studies as client work ships.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Start a project",
    line: "Have something worth building?",
    subline: "Let's make it move.",
    action: { label: "Build your brief", href: "#brief" },
  },

  footer: {
    tagline: "Where brand, technology, and content move together.",
    built: "Manila → Worldwide",
    disclosure: "Lab Projects are clearly labelled.",
    groups: [
      {
        title: "Explore",
        links: [
          { label: "Work", href: "#work" },
          { label: "Services", href: "#services" },
          { label: "Products", href: "#products" },
        ],
      },
      {
        title: "Studio",
        links: [
          { label: "Why Virtus", href: "#why-us" },
          { label: "How we work", href: "#process" },
          { label: "Build your brief", href: "#brief" },
        ],
      },
    ],
  },
} as const;

export type Site = typeof site;
