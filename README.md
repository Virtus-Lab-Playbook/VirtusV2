# Virtus Lab

Virtus Lab is an immersive digital-studio website built with Next.js, React, TypeScript, Tailwind CSS and Three.js.

The active development branch is:

```text
website-redesign
```

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Three.js

No React Three Fiber, Drei, GSAP, Babylon.js or additional animation framework is used.

## Local development

```bash
npm ci
npm run dev
```

Local URL:

```text
http://localhost:3000
```

Validation:

```bash
npm run build
npx eslint src
npx tsc --noEmit
```

## Main routes

```text
/
/work
/work/[project]

/services
/services/[service]

/products

/api/brief

/robots.txt
/sitemap.xml
/opengraph-image
```

The current Work detail pages are Lab Projects unless replaced with real approved client work.

## Source of truth

Business-facing website copy belongs in:

```text
src/content/site.ts
```

Do not invent pricing, testimonials, customer counts, client results, availability, contact information, legal information or business statistics.

## Homepage

Current homepage order:

```text
Hero
Trust / credibility
Discipline marquee
Selected Work
Services
Digital Products
Why Virtus
Process
Engagement models
Brief Builder
FAQ
Final CTA
Footer
```

## Immersive architecture

The website uses one global Three.js renderer.

Scene owner:

```text
src/experience/ImmersiveExperience.tsx
```

Signature object:

```text
src/experience/objects/VirtusCommandHub.ts
```

Central scroll/depth controller:

```text
src/experience/ExperienceContext.tsx
```

Depth configuration:

```text
src/experience/experience-config.ts
```

Environment configuration:

```text
src/experience/environment/environment-config.ts
```

Do not add another global canvas, WebGLRenderer, independent Three.js RAF loop or independent 3D scroll listener.

## Work experience

The homepage Work section uses the #34-inspired horizontal perspective postcard gallery.

Dedicated portfolio routes:

```text
/work
/work/[project]
```

Project content is sourced from `src/content/site.ts`.

Do not create fake live URLs, client results, metrics or testimonials.

## Services

Service routes:

```text
/services
/services/brand
/services/web
/services/content
/services/automation
```

Service content is sourced from `src/content/site.ts`.

## Products

The current product architecture is family-level only:

```text
/products
```

Current families:

- Workflow Tools
- AI Systems
- Templates
- Digital Resources

There are no individual `/products/[product]` routes until real product records exist.

## Brief submission

The Brief Builder posts to:

```text
POST /api/brief
```

The API validates all submitted option values against `site.brief.steps` and sends the validated brief through the Resend HTTP API.

Required server environment variables:

```text
RESEND_API_KEY
VIRTUS_BRIEF_FROM_EMAIL
VIRTUS_BRIEF_TO_EMAIL
```

Do not expose these values through `NEXT_PUBLIC_*`.

The form also keeps Copy Brief as a client-side fallback.

## SEO / launch environment

Canonical production origin:

```text
VIRTUS_SITE_URL
```

Example format only:

```text
VIRTUS_SITE_URL="https://example.com"
```

Use the actual production origin.

SEO files:

```text
src/lib/seo.ts
src/app/robots.ts
src/app/sitemap.ts
src/app/opengraph-image.tsx
src/components/StructuredData.tsx
src/app/icon.svg
```

Preview/development deployments are intentionally noindex.

## Public contact and legal links

`site.contactEmail`, `site.legal.privacy` and `site.legal.terms` remain null until the owner supplies confirmed public values.

The Packet 5 lead-delivery inbox must not automatically become the public contact email.

## Design system

Core palette:

```text
Cream       #E0E1DC
Dusty Blue  #798DA8
Steel Blue  #435A76
Deep Slate  #1C2639
Deep Sea    #0F1B2A
```

Fonts:

```text
Fraunces
IBM Plex Sans
IBM Plex Mono
```

Visual direction:

```text
deep ocean
naval blueprint
frosted steel
editorial cream
restrained motion
```

## Accessibility and motion

Preserve:

- semantic HTML
- keyboard navigation
- visible focus states
- reduced-motion behavior
- mobile/touch fallbacks
- native FAQ semantics
- accessible form labels and errors

Informational containers must not be added to the tab order only for animation.

## Before production launch

Confirm externally supplied launch data:

```text
VIRTUS_SITE_URL
RESEND_API_KEY
VIRTUS_BRIEF_FROM_EMAIL
VIRTUS_BRIEF_TO_EMAIL
official public contact email, if one should be displayed
official Privacy Policy URL/content
official Terms URL/content
official brand icon, if replacing the current temporary V favicon
```

Also confirm whether the current availability statement in `site.ts` is accurate before public launch.

## Final release gate

Run:

```bash
npm run build
npx eslint src
npx tsc --noEmit
```

Then complete the final manual responsive, accessibility, performance, SEO and form-delivery checks before merging `website-redesign`.
