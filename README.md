# Virtus Lab — Home

Deliverable **D13** (full website, Home page) from the Virtus Lab Platform Blueprint §5.4.
Next.js 16 · TypeScript · Tailwind v4 · three.js + Babylon.js.

```bash
npm run dev     # http://localhost:3000
npm run build
npx eslint src
```

## Where things live

| Path | What |
|---|---|
| `src/content/site.ts` | **All page copy.** Mirrors the Website Copy Deck (D14). Edit copy here, never in components. |
| `src/app/globals.css` | Design tokens (`@theme`), base layer, the contour + rail load sequence. |
| `src/app/layout.tsx` | Fonts (`next/font`), metadata, committed-dark `color-scheme`. |
| `src/components/` | One file per section, plus `primitives.tsx` (Container, SectionHeader, GoldRule, Button). |
| `src/components/DeepScene.tsx` | The hero's three.js volume — marine snow, caustics, cursor-tracking bioluminescence. Client, lazy-imports `three`. |
| `src/components/BabScene.tsx` | The final CTA's Babylon.js "abyssal glow" — converging god-rays, gated caustics, a pointer-following ember. Client, lazy-imports `@babylonjs/core`. |
| `src/components/DepthRail.tsx` | Fixed left gutter: scroll-linked depth readout, 0 m → 3,800 m. Client. |
| `src/components/Contour.tsx` | Bathymetric divider — the page's structural device. |
| `src/components/BriefBuilder.tsx` | The tap-through brief (see below). Client. |

## Color system

Deep-sea revision of Blueprint §3.5, approved in place of the original navy.
**Committed dark — "the deep."** No light mode; there is no daylight down here.

Colors are **role tokens**, not literal names. Never hard-code a hex in a component —
use the Tailwind utilities (`bg-abyss`, `bg-deep`, `text-tide`, `text-biolume`, …).

| Token | Hex | Role |
|---|---|---|
| `abyss` | `#04171E` | page ground |
| `deep` | `#0B2E3A` | surface |
| `shelf` | `#22505F` | borders, contour lines |
| `tide` | `#A9BFC4` | muted text |
| `seaglass` | `#F0F4F3` | primary text |
| `biolume` | `#31E0BE` | cold glow accent — life; focus rings |
| `brass` | `#C8A24A` | warm accent — instruments, the Gold Rule |

Every pairing clears WCAG AA. `biolume` and `brass` are used as fills or lines, never as
body text on `abyss` (they pass as large text / UI only).

### Adding CSS

Any global rule must go inside `@layer base`. Unlayered CSS beats Tailwind's
layered utilities in the cascade — an unlayered `* { border-color }` silently
cancels every `border-*` utility on the page. (The layered one in `globals.css` is fine.)

## Typography

Blueprint §3.6's "engineered + classical" pairing, with Plex in place of Sora/Inter.

| Role | Face | Where |
|---|---|---|
| Display | **Fraunces** | h1, section headings, the final CTA, the footer tagline |
| Body + UI | **IBM Plex Sans** | everything else |
| Readouts | **IBM Plex Mono** (`.readout`) | depth scale, coordinates, chart annotations — data only, never as an eyebrow label |

## The tap-through brief (replaces "Book a call")

`BriefBuilder.tsx` is the page's one primary CTA. No form fields, no typing — the visitor
taps chips across five short questions (need / stage / feel / timeline / budget). The summary
panel builds live; **Send this brief** opens the visitor's mail client with the brief written
out (`mailto:` to `site.contactEmail`), and **Copy brief** puts it on the clipboard.

Nothing is stored server-side yet — see the launch list.

## Design decisions worth keeping

- **The descent** is the page's one signature: the fixed depth rail + bathymetric `Contour`
  dividers. Spend boldness there and in the hero volume — everything else stays hairline-quiet.
- **Three card treatments, deliberately different**: services are a hairline grid with no cards;
  work cards are the only ones with a border + surface lift; packages are outlines marked by the
  Gold Rule (brass top border; biolume on the featured tier).
- **Numbers appear only in "How we work"**, because that is the only real sequence.
- **Motion**: two WebGL moments — the hero's three.js volume and the final CTA's Babylon.js
  glow. Both lazy-import their engine, pause offscreen, honour `prefers-reduced-motion`, and
  fall back to a CSS gradient. Plus the scroll-linked depth rail, the hero's load stagger,
  and micro-interactions (hover lifts, glowing chips). Nothing else animates.
- **No testimonials section.** §5.9 forbids fake quotes; it ships when real permitted ones exist.

## Before launch (Oct 26)

Search the codebase for `TODO` — each names its owning pod.

- [ ] **Agency Sub-Leader:** real "starting at" prices in `site.ts` (currently placeholders)
- [ ] **Web Design Pod:** replace the three placeholder Lab Projects with actual pod work
- [ ] **Web Dev Pod:** wire the brief builder to a real inbox / form store (§5.10) and confirm
      `site.contactEmail` once the domain is secured (§5.2)
- [ ] **Copy + QA Pods:** publish Privacy Policy and Terms, then link them in the footer (D16)
- [ ] **Brand Pod:** swap the interim wordmark for the locked mark at L8, and add the favicon + OG image (both cut dark)

## Compliance notes

- Concept work is labeled **Lab Project**; only permitted client work may be labeled **Case Study** (§1.9.4, §5.9).
- No analytics, tracking pixels, or reporting tools are installed, per the blueprint's scope exclusion (§5.1).
